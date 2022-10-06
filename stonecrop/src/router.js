import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'

const Records = () => import('./components/Records.vue')
const Doctype = () => import('./components/Doctype.vue')

const routes = [
	{ path: '/', component: Home, meta: { transition: 'slide-up' } },
	{ path: '/:records', component: Records, meta: { transition: 'slide-up' } },
	{ path: '/:records/:record', component: Doctype, meta: { transition: 'slide-up' } },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach(async (to, from, next) => {
	const params = to.params
	const doctypeSlug = to.params.records?.toString()

	if (doctypeSlug) {
		if (params.record) {
			const response = await fetch(`/${doctypeSlug}/${params.record}`)
			const data = await response.json()
			to.params.recordData = data
		} else {
			const response = await fetch(`/${doctypeSlug}`)
			const data = await response.json()
			to.params.recordsData = data
		}
	}

	next()
})

export default router
