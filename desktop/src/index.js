// export install() that is plugin compatible

import SheetNav from './components/SheetNav.vue'
import CommandPalette from './components/CommandPalette.vue'

function install(app, options) {
	app.component('SheetNav', SheetNav)
	app.component('CommandPalette', CommandPalette)
}

export default {
	install
}