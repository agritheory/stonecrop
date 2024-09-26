import { defineSetupVue3 } from '@histoire/plugin-vue'
import {
	ActionFooter,
	BeamModal,
	BeamModalOutlet,
	Confirm,
	ItemCheck,
	ItemCount,
	ListAnchor,
	ListItem,
	ListView,
	Navbar,
	ScanInput,
	BeamMetadata,
} from '@stonecrop/beam'
import PortalVue from 'portal-vue'

export const setupVue3 = defineSetupVue3(({ app }) => {
	app.use(PortalVue)

	app.component('ActionFooter', ActionFooter)
	app.component('BeamModal', BeamModal)
	app.component('BeamModalOutlet', BeamModalOutlet)
	app.component('Confirm', Confirm)
	app.component('ItemCheck', ItemCheck)
	app.component('ItemCount', ItemCount)
	app.component('ListAnchor', ListAnchor)
	app.component('ListItem', ListItem)
	app.component('ListView', ListView)
	app.component('Navbar', Navbar)
	app.component('ScanInput', ScanInput)
	app.component('BeamMetadata', BeamMetadata)
})
