import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'listview',
			component: () => import('./components/Listview.vue'),
		},
		{
			path: '/:id',
			name: 'builder',
			component: () => import('./components/Builder.vue'),
		},
	],
})

export default router
