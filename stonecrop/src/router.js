import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'

const loadDoctypeSchema = () => {
	Promise.resolve({
		// fetch and add doctype schema to registry
		// return 404 component if not found
	})
}

const routes = [
	{ path: '/', component: Home },
	{ path: '/:doctype', component: loadDoctypeSchema },
]

const router = createRouter({
	history: createWebHashHistory(),
	routes, // short for `routes: routes`
})

export default router
