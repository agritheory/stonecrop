import { DoctypeMeta, Registry, Stonecrop } from '@stonecrop/stonecrop'
import { List, Map } from 'immutable'
import {
	createRouter,
	createWebHistory,
	type NavigationGuardNext,
	type RouteLocationNormalized,
	type RouteRecordRaw,
} from 'vue-router'

import Home from './components/Home.vue'
import View from './components/View.vue'

// Cache for registered doctypes to avoid repeated hierarchy fetches
const registeredDoctypes = new Set<string>()

// Cache for fetched doctype hierarchies
const doctypeHierarchyCache = Map<string, any>()

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
	return await preloadDoctypeHierarchies()
}

/**
 * Preload doctype hierarchies by checking if they are already cached
 * This works with the desktop initialization that preloads hierarchies
 */
export async function preloadDoctypeHierarchies(): Promise<void> {
	try {
		// Check if hierarchies are already cached from desktop initialization
		if (doctypeHierarchyCache.size === 0) {
			await fetchAllDoctypeHierarchies()
		}
	} catch (error) {
		console.error('[Router] Error preloading doctype hierarchies:', error)
	}
}

/**
 * Setup doctype metadata and load all records for the doctype
 */
async function setupDoctypeData(doctype: string, actualDoctype?: string): Promise<void> {
	if (!scopedRegistry || !scopedStonecrop) {
		// Scoped Stonecrop references not available during route setup
		return
	}

	try {
		const targetDoctype = actualDoctype || doctype

		// Get doctype metadata if not already loaded
		if (!scopedRegistry.registry[targetDoctype]) {
			const doctypeMeta = await scopedRegistry.getMeta?.(doctype) // Use original doctype for API call
			if (doctypeMeta) {
				scopedRegistry.addDoctype(doctypeMeta)
			}
		}

		// Load all records for this doctype into HST
		const response = await fetch(`/api/${doctype}`) // Use original doctype for API call
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
			// Use a special endpoint for form metadata
			const response = await fetch(`/api/${doctype}/${recordId}/meta`)
			if (response.ok) {
				const metaData = await response.json()

				const config = {
					schema: metaData.schema,
					workflow: metaData.workflow,
					actions: metaData.actions || {},
				}

				const doctypeMeta = new DoctypeMeta(
					targetDoctype,
					List(config.schema),
					config.workflow,
					Map(config.actions as Record<string, string[]>)
				)

				if (doctypeMeta) {
					scopedRegistry.addDoctype(doctypeMeta)
				}
			}
		}

		// Check if record already exists in HST
		const existingRecord = scopedStonecrop.getRecordById(targetDoctype, recordId)

		if (!existingRecord && !recordId.startsWith('new-')) {
			// Fetch individual record if not in store and not a new record
			const response = await fetch(`/api/${doctype}/${recordId}`) // Use original doctype for API call
			if (response.ok) {
				const record = await response.json()
				scopedStonecrop.addRecord(targetDoctype, recordId, record)
			}
		}

		// Set as current record (even for new records) using actual doctype
		scopedStonecrop.setCurrentRecord(targetDoctype, recordId)
	} catch (error) {
		console.error(`Failed to setup record data for ${doctype}/${recordId}:`, error)
	}
}

/**
 * Fetch doctype hierarchy for a specific doctype
 */
async function fetchDoctypeHierarchy(doctype: string): Promise<any> {
	// Check cache first
	if (doctypeHierarchyCache.has(doctype)) {
		return doctypeHierarchyCache.get(doctype)
	}

	try {
		const response = await fetch(`/api/doctype-hierarchy/${doctype}`)
		if (response.ok) {
			const result = await response.json()

			if (result.success && result.data) {
				// Cache the successful result
				doctypeHierarchyCache.set(doctype, result.data)
				return result.data
			} else {
				return null
			}
		} else {
			console.error(`Failed to fetch doctype hierarchy for ${doctype}: HTTP ${response.status}`)
		}
	} catch (error) {
		console.error(`Failed to fetch doctype hierarchy for ${doctype}:`, error)
	}
	return null
}

/**
 * Fetch all doctype hierarchies from server
 */
async function fetchAllDoctypeHierarchies(): Promise<any> {
	try {
		const response = await fetch('/api/doctype-hierarchy')
		if (response.ok) {
			const result = await response.json()

			if (result.success && result.data) {
				// Cache all hierarchies
				Object.keys(result.data).forEach(doctype => {
					doctypeHierarchyCache.set(doctype, result.data[doctype])
				})
				return result.data
			} else {
				return null
			}
		} else {
			console.error(`Failed to fetch doctype hierarchies: HTTP ${response.status}`)
		}
	} catch (error) {
		console.error('Failed to fetch doctype hierarchies:', error)
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
				// route resolution failed
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

	try {
		const hierarchy = await fetchDoctypeHierarchy(doctype)

		if (!hierarchy) {
			return false
		}

		if (!hierarchy.routePatterns) {
			return false
		}

		// Register all route patterns for this doctype
		Object.keys(hierarchy.routePatterns).forEach(patternKey => {
			const pattern = hierarchy.routePatterns[patternKey]

			if (!pattern.pattern || !pattern.doctype) {
				return
			}

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
					try {
						const routeDoctype = to.meta.doctype as string
						const actualDoctype = to.meta.actualDoctype as string

						if (pattern.meta.type === 'list') {
							await setupDoctypeData(routeDoctype, actualDoctype)
						} else if (pattern.meta.type === 'form') {
							const recordId = to.params.recordId as string
							await setupRecordData(routeDoctype, recordId, actualDoctype)
						}

						next()
					} catch (error) {
						console.error(`[Router] Failed to setup route data for ${doctype}:`, error)
						next(error) // Pass error to Vue Router's error handling
					}
				},
			}

			router.addRoute(route)
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
	{
		path: '/:pathMatch(.*)*',
		name: 'catch-all',
		component: View,
		beforeEnter: async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
			const path = to.path

			try {
				// Resolve the route using server endpoint
				const routeInfo = await resolveRoute(path)

				if (!routeInfo) {
					// Continue to show catch-all view with error state
					next()
					return
				}

				if (routeInfo.error) {
					next()
					return
				}

				// Try to register routes for this doctype
				const registered = await registerDoctypeRoutes(routeInfo.doctype)

				if (registered) {
					// Route should now be registered, try to navigate to it again
					next({ path, replace: true })
				} else {
					// Registration failed, continue to catch-all view
					next()
				}
			} catch (error) {
				console.error(`[Router] Error in catch-all route handler for ${path}:`, error)
				// Continue to catch-all view on error
				next()
			}
		},
	},
]

router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
