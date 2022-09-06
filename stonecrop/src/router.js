import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'

const loadDoctypeSchema = () => {
	return new Promise(
		resolve,
		() => {
			return `<div>Route?</div>`
		}
		// fetch and add doctype schema to registry
		// return 404 component if not found
	)
}

const routes = [
	{ path: '/', component: Home, meta: { transition: 'slide-up' } },
	{ path: '/:records', component: loadDoctypeSchema, meta: { transition: 'slide-up' } },
	{ path: '/:records/:record', component: loadDoctypeSchema, meta: { transition: 'slide-up' } },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
