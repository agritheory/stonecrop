import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'

const routes = [
	{ path: '/', component: Home },
	{ path: '/:doctype', component: loadDoctypeSchema },
	// 404 component
]

const router = createRouter({
	history: createWebHashHistory(),
	routes, // short for `routes: routes`
})

export default router

const loadDoctypeSchema = () => {
	Promise.resolve({
		// fetch and add doctype schema to registry
	})
}
