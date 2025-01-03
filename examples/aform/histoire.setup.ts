import { defineSetupVue3 } from '@histoire/plugin-vue'
import { install as AForm, Login } from '@stonecrop/aform'
import { install as ATable } from '@stonecrop/atable'
import { createPinia } from 'pinia'

export const setupVue3 = defineSetupVue3(({ app }) => {
	const pinia = createPinia()
	app.use(pinia)
	app.use(AForm)
	app.use(ATable)
	app.component('Login', Login)
})
