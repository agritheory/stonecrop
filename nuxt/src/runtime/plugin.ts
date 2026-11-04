import { install as AForm } from '@stonecrop/aform'
import { install as CodeEditor } from '@stonecrop/code-editor'
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
		// Where the module serves Monaco, below the app's base URL.
		const { monacoPath } = nuxt.$config.public.stonecrop as { monacoPath: string }
		app.use(CodeEditor, { vsPath: `${nuxt.$config.app.baseURL.replace(/\/+$/, '')}${monacoPath}/vs` })
		// No `app.use(NodeEditor)`: module.ts registers its components to load on first use, since an
		// eager install puts Vue Flow and dagre in every app's entry chunk.
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
