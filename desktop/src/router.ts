import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(),
	routes: [],
})

export default router

declare module 'vue-router' {
	interface RouteMeta {
		transition?: string
	}
}
