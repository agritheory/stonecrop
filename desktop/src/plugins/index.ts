import { App, type Plugin } from 'vue'

import CommandPalette from '../components/CommandPalette.vue'
import Desktop from '../components/Desktop.vue'
import SheetNav from '../components/SheetNav.vue'

/**
 * This is the main plugin that will be used to register all the desktop components.
 * @public
 */
const plugin: Plugin = {
	install: (app: App) => {
		app.component('CommandPalette', CommandPalette)
		app.component('Desktop', Desktop)
		app.component('SheetNav', SheetNav)
	},
}

export default plugin
