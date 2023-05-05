import { App } from 'vue'

import ActionSet from '@/components/ActionSet.vue'
import CommandPalette from '@/components/CommandPalette.vue'
import Doctype from '@/components/Doctype.vue'
import Records from '@/components/Records.vue'
import SheetNav from '@/components/SheetNav.vue'

export default {
	install: (app: App) => {
		app.component('ActionSet', ActionSet)
		app.component('CommandPalette', CommandPalette)
		app.component('Doctype', Doctype)
		app.component('Records', Records)
		app.component('SheetNav', SheetNav)
	},
}
