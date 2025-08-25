import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

import Home from './components/Home.vue'
import View from './components/View.vue'

// Global references that will be set during app initialization
let globalRegistry: any = null
let globalStonecrop: any = null
let router: any = null

// Cache for registered doctypes to avoid repeated hierarchy fetches
const registeredDoctypes = new Set<string>()

// Export function to set global references
export function setGlobalReferences(registry: any, stonecrop: any) {
	globalRegistry = registry
	globalStonecrop = stonecrop
}

/**
 * Setup doctype metadata and load all records for the doctype
 */
async function setupDoctypeData(doctype: string, actualDoctype?: string): Promise<void> {
	if (!globalRegistry || !globalStonecrop) {
		console.warn('Global Stonecrop references not available during route setup')
		return
	}

	try {
		const targetDoctype = actualDoctype || doctype

		// Get doctype metadata if not already loaded
		if (!globalRegistry.registry[targetDoctype]) {
			const doctypeMeta = await globalRegistry.getMeta?.(doctype) // Use original doctype for API call
			if (doctypeMeta) {
				// Register with the actual doctype name
				const adjustedMeta = {
					...doctypeMeta,
					name: targetDoctype,
				}
				globalRegistry.addDoctype(adjustedMeta)
			}
		}

		// Load all records for this doctype into HST
		const response = await fetch(`/api/${doctype}`) // Use original doctype for API call
		if (response.ok) {
			const records = await response.json()

			// Clear existing records and add new ones using actual doctype
			globalStonecrop.clearRecords(targetDoctype)

			if (Array.isArray(records)) {
				records.forEach((record: any) => {
					if (record.id) {
						globalStonecrop.addRecord(targetDoctype, record.id, record)
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
	if (!globalRegistry || !globalStonecrop) {
		console.warn('Global Stonecrop references not available during route setup')
		return
	}

	try {
		const targetDoctype = actualDoctype || doctype

		// Get form doctype metadata if not already loaded
		if (!globalRegistry.registry[targetDoctype]) {
			// Use a special endpoint for form metadata
			const response = await fetch(`/api/${doctype}/${recordId}/meta`)
			if (response.ok) {
				const metaData = await response.json()
				const config = {
					schema: metaData.schema,
					workflow: metaData.workflow,
					actions: metaData.actions || {},
				}

				const doctypeMeta = await globalRegistry.createDoctypeMeta?.(
					targetDoctype,
					config.schema,
					config.workflow,
					config.actions
				)
				if (doctypeMeta) {
					globalRegistry.addDoctype(doctypeMeta)
				}
			}
		}

		// Check if record already exists in HST
		const existingRecord = globalStonecrop.getRecordById(targetDoctype, recordId)

		if (!existingRecord && !recordId.startsWith('new-')) {
			// Fetch individual record if not in store and not a new record
			const response = await fetch(`/api/${doctype}/${recordId}`) // Use original doctype for API call
			if (response.ok) {
				const record = await response.json()
				globalStonecrop.addRecord(targetDoctype, recordId, record)
			}
		}

		// Set as current record (even for new records) using actual doctype
		globalStonecrop.setCurrentRecord(targetDoctype, recordId)
	} catch (error) {
		console.error(`Failed to setup record data for ${doctype}/${recordId}:`, error)
	}
}

/**
 * Fetch doctype hierarchy for a specific doctype
 */
async function fetchDoctypeHierarchy(doctype: string): Promise<any> {
	try {
		const response = await fetch(`/api/doctype-hierarchy/${doctype}`)
		if (response.ok) {
			return await response.json()
		}
	} catch (error) {
		console.error(`Failed to fetch doctype hierarchy for ${doctype}:`, error)
	}
	return null
}

/**
 * Resolve route path to doctype using server endpoint
 */
async function resolveRoute(path: string): Promise<any> {
	try {
		const response = await fetch(`/api/resolve-route?path=${encodeURIComponent(path)}`)
		if (response.ok) {
			const result = await response.json()
			if (result.error) {
				console.warn(`[Router] Route resolution failed: ${result.error}`)
				return null
			}
			return result
		}
	} catch (error) {
		console.error(`Failed to resolve route ${path}:`, error)
	}
	return null
}

/**
 * Register routes for a specific doctype on-demand
 */
async function registerDoctypeRoutes(doctype: string): Promise<boolean> {
	if (registeredDoctypes.has(doctype)) {
		return true // Already registered
	}

	console.log(`[Router] Registering routes for doctype: ${doctype}`)

	try {
		const hierarchy = await fetchDoctypeHierarchy(doctype)

		if (!hierarchy || !hierarchy.routePatterns) {
			console.warn(`[Router] No route patterns found for doctype: ${doctype}`)
			return false
		}

		// Register all route patterns for this doctype
		Object.keys(hierarchy.routePatterns).forEach(patternKey => {
			const pattern = hierarchy.routePatterns[patternKey]

			const route: RouteRecordRaw = {
				path: pattern.pattern,
				name: `${doctype}-${patternKey}`,
				component: View,
				meta: {
					...pattern.meta,
					doctype: doctype,
					actualDoctype: pattern.doctype,
				},
				beforeEnter: async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
					const routeDoctype = to.meta.doctype as string
					const actualDoctype = to.meta.actualDoctype as string

					console.log(`[Router] Setting up route: ${to.path}, doctype: ${routeDoctype}, actual: ${actualDoctype}`)

					if (pattern.meta.type === 'list') {
						await setupDoctypeData(routeDoctype, actualDoctype)
					} else if (pattern.meta.type === 'form') {
						const recordId = to.params.recordId as string
						await setupRecordData(routeDoctype, recordId, actualDoctype)
					}

					next()
				},
			}

			router.addRoute(route)
			console.log(`[Router] Added route: ${pattern.pattern} -> ${pattern.doctype}`)
		})

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
	// Catch-all route that handles on-demand route registration
	{
		path: '/:pathMatch(.*)*',
		name: 'catch-all',
		component: View,
		beforeEnter: async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
			const path = to.path
			console.log(`[Router] Handling unknown route: ${path}`)

			// Resolve the route using server endpoint
			const routeInfo = await resolveRoute(path)

			if (!routeInfo) {
				console.warn(`[Router] Could not resolve route: ${path}`)
				next() // Continue to show catch-all view
				return
			}

			// Try to register routes for this doctype
			const registered = await registerDoctypeRoutes(routeInfo.doctype)

			if (registered) {
				// Route should now be registered, try to navigate to it again
				console.log(`[Router] Routes registered for ${routeInfo.doctype}, redirecting to: ${path}`)
				next({ path, replace: true })
			} else {
				// Registration failed, continue to catch-all view
				console.warn(`[Router] Failed to register routes for doctype: ${routeInfo.doctype}`)
				next()
			}
		},
	},
]

router = createRouter({
	history: createWebHistory(),
	routes,
})

console.log(
	'[Router] Created router with base routes:',
	router.getRoutes().map(r => ({ name: r.name, path: r.path }))
)

export default router
