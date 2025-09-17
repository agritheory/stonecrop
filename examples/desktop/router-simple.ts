import {
	createRouter,
	createWebHistory,
	type NavigationGuardNext,
	type RouteLocationNormalized,
	type RouteRecordRaw,
} from 'vue-router'

import Home from './components/Home.vue'
import View from './components/View.vue'

/**
 * Resolve route path to doctype using server endpoint
 */
async function resolveRoute(path: string): Promise<any> {
	try {
		const response = await fetch(`/api/resolve-route?path=${encodeURIComponent(path)}`)
		if (response.ok) {
			const result = await response.json()
			if (result.error) {
				return null
			}
			return result
		}
	} catch (error) {
		console.error(`Failed to resolve route ${path}:`, error)
	}
	return null
}

// Simple route definitions using dynamic server-side resolution
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
		beforeEnter: async (to, _from, next) => {
			const path = to.path

			try {
				// Call the mirage server to resolve the route and get doctype info
				const response = await fetch(`/api/resolve-route?path=${encodeURIComponent(path)}`)
				if (response.ok) {
					const routeInfo = (await response.json()) as {
						doctype: string
						actualDoctype: string
						type: 'list' | 'form' | 'not-found'
						recordId?: string
					}

					if (routeInfo.type !== 'not-found') {
						// Set route metadata that the plugin will use
						to.meta = {
							...to.meta,
							doctype: routeInfo.doctype,
							actualDoctype: routeInfo.actualDoctype,
							type: routeInfo.type,
							recordId: routeInfo.recordId,
						}

						next()
					} else {
						next({ name: 'not-found' })
					}
				} else {
					next({ name: 'not-found' })
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
