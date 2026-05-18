import { install as AForm } from '@stonecrop/aform'
import { install as NodeEditor } from '@stonecrop/node-editor'
import StonecropPlugin, { type Registry, type Stonecrop } from '@stonecrop/stonecrop'
import { createPinia } from 'pinia'

import { defineNuxtPlugin, useRouter } from 'nuxt/app'

export default defineNuxtPlugin({
	name: 'stonecrop',
	setup(nuxt) {
		const router = useRouter()

		const app = nuxt.vueApp

		// Only create Pinia if not already installed (e.g., by pinia, nuxt)
		if (!app.config.globalProperties.$pinia) {
			const pinia = createPinia()
			app.use(pinia)
		}

		app.use(AForm)
		app.use(NodeEditor)
		app.use(StonecropPlugin, { router })

		// Extract from globalProperties (set by Stonecrop Vue plugin)
		const registry = app.config.globalProperties.$registry as Registry
		const stonecrop = app.config.globalProperties.$stonecrop as Stonecrop

		// Provide via Nuxt's mechanism so useStonecropSetup() works
		// This sets getters on BOTH nuxtApp.$registry AND nuxtApp.vueApp.config.globalProperties.$registry
		return {
			provide: {
				registry,
				stonecrop,
			},
		}
	},
})
