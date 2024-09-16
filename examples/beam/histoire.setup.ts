import { defineSetupVue3 } from '@histoire/plugin-vue'
import { install as Beam } from '@stonecrop/beam'
import PortalVue from 'portal-vue'

export const setupVue3 = defineSetupVue3(({ app }) => {
	app.use(PortalVue)
	app.use(Beam)
})
