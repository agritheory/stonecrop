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

export default router
