import { install as AForm } from '@stonecrop/aform'
import { install as NodeEditor } from '@stonecrop/node-editor'
import StonecropPlugin from '@stonecrop/stonecrop'
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
	},
})
