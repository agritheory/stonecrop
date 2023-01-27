// export install() that is plugin compatible

import SheetNav from './components/SheetNav.vue'
import CommandPalette from './components/CommandPalette.vue'
import ActionSet from './components/ActionSet.vue'
import Doctype from './components/Doctype.vue'
import Records from './components/Records.vue'

function install(app, options) {
	app.component('SheetNav', SheetNav)
	app.component('CommandPalette', CommandPalette)
	app.component('ActionSet', ActionSet)
	app.component('Doctype', Doctype)
	app.component('Records', Records)
}

export { install, SheetNav, CommandPalette, ActionSet }
