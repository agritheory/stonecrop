import { defineSetupVue3 } from '@histoire/plugin-vue'
import { install as AForm, Login } from '@stonecrop/aform'
import { install as ATable } from '@stonecrop/atable'

export const setupVue3 = defineSetupVue3(({ app }) => {
	app.use(AForm)
	app.use(ATable)
	app.component('Login', Login)
})
