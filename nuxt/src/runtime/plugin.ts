import { install as AForm } from '@stonecrop/aform'
import { install as ATable } from '@stonecrop/atable'
import { Stonecrop } from '@stonecrop/stonecrop'
import { createPinia } from 'pinia'
import { defineNuxtPlugin, useRouter } from 'nuxt/app'

export default defineNuxtPlugin(nuxt => {
	const pinia = createPinia()
	const router = useRouter()

	const app = nuxt.vueApp
	app.use(pinia)
	app.use(AForm)
	app.use(ATable)
	app.use(Stonecrop, { router })
})
