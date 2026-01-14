import { defineSetupVue3 } from '@histoire/plugin-vue'
import { createPinia } from 'pinia'

// Import Stonecrop component plugins
import { install as AFormPlugin, Login } from '@stonecrop/aform'
import { install as ATablePlugin } from '@stonecrop/atable'
import { install as BeamPlugin } from '@stonecrop/beam'

// Import sandbox CSS reset to prevent style leakage
import './histoire-sandbox.css'

export const setupVue3 = defineSetupVue3(({ app }) => {
	const pinia = createPinia()
	app.use(pinia)

	// Register component plugins (they auto-register their components)
	app.use(AFormPlugin)
	app.use(ATablePlugin)
	app.use(BeamPlugin)

	// Additional component registrations
	app.component('Login', Login)
})
