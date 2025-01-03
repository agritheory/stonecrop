import { defineSetupVue3 } from '@histoire/plugin-vue'
import { install as AForm } from '@stonecrop/aform'
import { install as ATable } from '@stonecrop/atable'
import { createPinia } from 'pinia'

import DateInput from './components/DateInput.vue'

export const setupVue3 = defineSetupVue3(({ app }) => {
	const pinia = createPinia()
	app.use(pinia)
	app.use(AForm)
	app.use(ATable)
	app.component('DateInput', DateInput)
})
