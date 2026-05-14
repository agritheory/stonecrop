import { Registry, Stonecrop } from '@stonecrop/stonecrop'
import { createRouter, createWebHistory, type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router'

import Home from './components/Home.vue'
import View from './components/View.vue'

// Cache for registered doctypes to avoid repeated setup
const registeredDoctypes = new Set<string>()

// Router instance holder
let router: any = null

// Scoped references that will be set during initialization
let scopedRegistry: any = null
let scopedStonecrop: any = null

/**
 * Setup router runtime context with Registry and Stonecrop instances
 * This provides the router functions with access to the core instances
 */
export async function setupRouterContext(registry: Registry, stonecrop: Stonecrop): Promise<void> {
	scopedRegistry = registry
	scopedStonecrop = stonecrop
}

/**
 * Setup doctype metadata and load all records for the doctype
 */
async function setupDoctypeData(doctype: string, actualDoctype?: string, routePath?: string): Promise<void> {
	if (!scopedRegistry || !scopedStonecrop) {
		// Scoped Stonecrop references not available during route setup
		return
	}

	try {
		const targetDoctype = actualDoctype || doctype

		// Get doctype metadata if not already loaded
		if (!scopedRegistry.registry[targetDoctype]) {
			// Create RouteContext for getMeta call
			const defaultPath = routePath || `/${doctype}`
			const routeContext = {
				path: defaultPath,
				segments: defaultPath.split('/').filter(s => s.length > 0),
			}

			const doctypeMeta = await scopedRegistry.getMeta?.(routeContext)
			if (doctypeMeta) {
				scopedRegistry.addDoctype(doctypeMeta)
			}
		}

		// Load all records for this doctype into HST
		const response = await fetch(`/api/${doctype}`)
		if (response.ok) {
			const records = await response.json()

			// Clear existing records and add new ones using actual doctype
			scopedStonecrop.clearRecords(targetDoctype)

			if (Array.isArray(records)) {
				records.forEach((record: any) => {
					if (record.id) {
						scopedStonecrop.addRecord(targetDoctype, record.id, record)
					}
				})
			}
		}
	} catch (error) {
		console.error(`Failed to setup doctype data for ${doctype}:`, error)
	}
}

/**
 * Setup specific record data and set as current
 */
async function setupRecordData(doctype: string, recordId: string, actualDoctype?: string): Promise<void> {
	if (!scopedRegistry || !scopedStonecrop) {
		// Scoped Stonecrop references not available during route setup
		return
	}

	try {
		const targetDoctype = actualDoctype || doctype

		// Get form doctype metadata if not already loaded
		if (!scopedRegistry.registry[targetDoctype]) {
			// Create RouteContext for getMeta call
			const route = `/${doctype}/${recordId}`
			const routeContext = {
				path: route,
				segments: route.split('/').filter(s => s.length > 0),
			}

			const doctypeMeta = await scopedRegistry.getMeta?.(routeContext)
			if (doctypeMeta) {
				scopedRegistry.addDoctype(doctypeMeta)
			}
		}

		// Check if record already exists in HST
		const existingRecord = scopedStonecrop.getRecordById(targetDoctype, recordId)

		if (!existingRecord && !recordId.startsWith('new-')) {
			// Fetch individual record if not in store and not a new record
			const response = await fetch(`/api/${doctype}/${recordId}`)
			if (response.ok) {
				const record = await response.json()
				scopedStonecrop.addRecord(targetDoctype, recordId, record)
			}
		}
	} catch (error) {
		console.error(`Failed to setup record data for ${doctype}/${recordId}:`, error)
	}
}

/**
 * Fetch meta and records for a linked (referenced) doctype so the resolver can find them.
 * Safe to call repeatedly — skips if the doctype is already registered.
 */
async function setupLinkedData(doctypeSlug: string): Promise<void> {
	if (!scopedRegistry || !scopedStonecrop) return

	// Resolve meta doctype name from the registry after fetch
	const routeContext = { path: `/${doctypeSlug}`, segments: [doctypeSlug] }

	try {
		let doctypeName = doctypeSlug
		if (!Object.values(scopedRegistry.registry).some((d: any) => d?.doctype === doctypeSlug)) {
			const meta = await scopedRegistry.getMeta?.(routeContext)
			if (meta) {
				scopedRegistry.addDoctype(meta)
				doctypeName = (meta as any).doctype ?? doctypeSlug
			}
		}

		const response = await fetch(`/api/${doctypeSlug}`)
		if (response.ok) {
			const records = await response.json()
			if (Array.isArray(records)) {
				records.forEach((record: any) => {
					if (record.id && !scopedStonecrop.getRecordById(doctypeName, record.id)) {
						scopedStonecrop.addRecord(doctypeName, record.id, record)
					}
				})
			}
		}
	} catch (error) {
		console.error(`Failed to setup linked data for ${doctypeSlug}:`, error)
	}
}

/**
 * Detect doctype from URL path pattern
 */
function detectDoctypeFromPath(path: string): string | null {
	// Handle common patterns: /doctype or /doctype/recordId
	const pathSegments = path.split('/').filter(segment => segment.length > 0)

	if (pathSegments.length === 0) {
		return null
	}

	const doctype = pathSegments[0]
	return doctype
}

/**
 * Register routes for a specific doctype on-demand
 */
async function registerDoctypeRoutes(doctype: string): Promise<boolean> {
	if (registeredDoctypes.has(doctype)) {
		return true // Already registered
	}

	try {
		// Register list route: /doctype
		const listRoute: RouteRecordRaw = {
			path: `/${doctype}`,
			name: `${doctype}-list`,
			component: View,
			meta: {
				title: `${doctype.charAt(0).toUpperCase() + doctype.slice(1)} List`,
				type: 'list',
				doctype: doctype,
				actualDoctype: `${doctype}-list`,
			},
			beforeEnter: async (to: RouteLocationNormalized) => {
				try {
					const routeDoctype = to.meta.doctype as string
					const actualDoctype = to.meta.actualDoctype as string
					await setupDoctypeData(routeDoctype, actualDoctype, to.path)
					if (routeDoctype === 'todo') {
						await setupLinkedData('category')
					}
				} catch (error) {
					console.error(`[Router] Failed to setup list data for ${doctype}:`, error)
					return false
				}
			},
		}

		// Register form route: /doctype/:recordId
		const formRoute: RouteRecordRaw = {
			path: `/${doctype}/:recordId`,
			name: `${doctype}-form`,
			component: View,
			meta: {
				title: `${doctype.charAt(0).toUpperCase() + doctype.slice(1)} Form`,
				type: 'form',
				doctype: doctype,
				actualDoctype: `${doctype}-form`,
			},
			beforeEnter: async (to: RouteLocationNormalized) => {
				try {
					const routeDoctype = to.meta.doctype as string
					const actualDoctype = to.meta.actualDoctype as string
					const recordId = to.params.recordId as string
					await setupRecordData(routeDoctype, recordId, actualDoctype)
					if (routeDoctype === 'todo') {
						await setupLinkedData('category')
					}
				} catch (error) {
					console.error(`[Router] Failed to setup form data for ${doctype}:`, error)
					return false
				}
			},
		}

		router.addRoute(listRoute)
		router.addRoute(formRoute)

		registeredDoctypes.add(doctype)
		return true
	} catch (error) {
		console.error(`[Router] Failed to register routes for doctype ${doctype}:`, error)
		return false
	}
}

// Create the router with base routes and catch-all for on-demand registration
const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'home',
		component: Home,
		meta: { title: 'Home' },
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'catch-all',
		component: View,
		beforeEnter: async (to: RouteLocationNormalized) => {
			const path = to.path

			try {
				const doctype = detectDoctypeFromPath(path)
				if (!doctype) return

				const registered = await registerDoctypeRoutes(doctype)
				if (registered) {
					return { path, replace: true }
				}
			} catch (error) {
				console.error(`[Router] Error in catch-all route handler for ${path}:`, error)
			}
		},
	},
]

router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
