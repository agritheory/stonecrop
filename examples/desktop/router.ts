import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: () => import('./components/Home.vue'), meta: { transition: 'slide-up' } },
		{
			path: '/:records',
			component: () => import('@stonecrop/desktop').then(({ Records }) => Records),
			meta: { transition: 'slide-up' },
		},
		{
			path: '/:records/:record',
			component: () => import('@stonecrop/desktop').then(({ Doctype }) => Doctype),
			meta: { transition: 'slide-up' },
		},
	],
})

export default router

declare module 'vue-router' {
	interface RouteMeta {
		transition?: string
	}
}
