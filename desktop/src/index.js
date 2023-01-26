// export install() that is plugin compatible

import SheetNav from './components/SheetNav.vue'
import CommandPalette from './components/CommandPalette.vue'
import ActionSet from './components/ActionSet.vue'

function install(app, options) {
	app.component('SheetNav', SheetNav)
	app.component('CommandPalette', CommandPalette)
	app.component('ActionSet', ActionSet)
}

export { install, SheetNav, CommandPalette, ActionSet }
