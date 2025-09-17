import {
	createRouter,
	createWebHistory,
	type NavigationGuardNext,
	type RouteLocationNormalized,
	type RouteRecordRaw,
} from 'vue-router'

import Home from './components/Home.vue'
import View from './components/View.vue'

// Cache for doctype hierarchy to avoid repeated fetches
let doctypeHierarchy: Record<string, any> | null = null

/**
 * Fetch and cache the doctype hierarchy from the server
 */
async function fetchDoctypeHierarchy(): Promise<Record<string, any>> {
	if (doctypeHierarchy) {
		return doctypeHierarchy as Record<string, any>
	}

	try {
		const response = await fetch('/api/doctype-hierarchy')
		if (response.ok) {
			const result = await response.json()
			if (result.success && result.data) {
				doctypeHierarchy = result.data
				return doctypeHierarchy as Record<string, any>
			}
		}
	} catch (error) {
		console.error('Failed to fetch doctype hierarchy:', error)
	}

	// Fallback to empty hierarchy if fetch fails
	doctypeHierarchy = {}
	return doctypeHierarchy as Record<string, any>
}

/**
 * Resolve a path to doctype information using the hierarchy
 */
function resolvePathFromHierarchy(path: string, hierarchy: Record<string, any>): any {
	// Find matching route pattern in hierarchy
	for (const [doctypeKey, config] of Object.entries(hierarchy)) {
		const doctypeConfig = config as any

		if (!doctypeConfig.routePatterns) {
			continue
		}

		// Check each route pattern for this doctype
		for (const [patternKey, pattern] of Object.entries(doctypeConfig.routePatterns)) {
			const routePattern = (pattern as any).pattern

			// Convert Vue route pattern to regex for matching
			// e.g., '/todo/:recordId' becomes /^\/todo\/([^\/]+)$/
			const regexPattern = routePattern
				.replace(/:[^/]+/g, '([^/]+)') // Replace :param with capture group
				.replace(/\//g, '\\/') // Escape slashes

			const regex = new RegExp(`^${regexPattern}$`)

			if (regex.test(path)) {
				const result = {
					doctype: doctypeKey,
					actualDoctype: (pattern as any).doctype,
					routeType: (pattern as any).meta.type,
					routeName: `${doctypeKey}-${patternKey}`,
					matchedPattern: routePattern,
					descendantDoctypes: doctypeConfig.descendantDoctypes || [],
					...((pattern as any).meta || {}),
				}

				// Extract route parameters if this is a form route
				if ((pattern as any).meta.type === 'form') {
					const matches = path.match(regex)
					if (matches && matches[1]) {
						result.recordId = matches[1]
					}
				}

				return result
			}
		}
	}

	return null
}

/**
 * Initialize the router by preloading the doctype hierarchy
 * Call this during app initialization for better performance
 */
export async function initializeRouter(): Promise<void> {
	try {
		await fetchDoctypeHierarchy()
	} catch (error) {
		console.error('Failed to initialize router hierarchy:', error)
	}
}

/**
 * Get the cached doctype hierarchy
 */
export function getDoctypeHierarchy(): Record<string, any> | null {
	return doctypeHierarchy
}

// Route definitions using hierarchy-based resolution
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
				// Fetch doctype hierarchy if not already cached
				const hierarchy = await fetchDoctypeHierarchy()

				// Resolve the route using the hierarchy
				const routeInfo = resolvePathFromHierarchy(path, hierarchy)

				if (routeInfo && routeInfo.routeType !== 'not-found') {
					// Set route metadata that the plugin will use
					to.meta = {
						...to.meta,
						doctype: routeInfo.doctype,
						actualDoctype: routeInfo.actualDoctype,
						type: routeInfo.routeType,
						recordId: routeInfo.recordId,
						descendantDoctypes: routeInfo.descendantDoctypes,
						title: routeInfo.title,
					}

					next()
				} else {
					// Route not found in hierarchy, fallback to server resolution
					console.warn(`Route not found in hierarchy: ${path}, falling back to server resolution`)

					const response = await fetch(`/api/resolve-route?path=${encodeURIComponent(path)}`)
					if (response.ok) {
						const serverRouteInfo = await response.json()

						if (!serverRouteInfo.error && serverRouteInfo.routeType !== 'not-found') {
							to.meta = {
								...to.meta,
								doctype: serverRouteInfo.doctype,
								actualDoctype: serverRouteInfo.actualDoctype,
								type: serverRouteInfo.routeType,
								recordId: serverRouteInfo.recordId,
							}
							next()
						} else {
							next({ name: 'not-found' })
						}
					} else {
						next({ name: 'not-found' })
					}
				}
			} catch (error) {
				console.error('Failed to resolve route:', error)
				next({ name: 'not-found' })
			}
		},
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
