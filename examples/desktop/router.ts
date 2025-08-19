import { createRouter, createWebHistory } from 'vue-router'

import Home from './Home.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [{ path: '/:pathMatch(.*)*', component: Home }],
})

export default router
