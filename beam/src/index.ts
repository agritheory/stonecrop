import { App } from 'vue'

import ActionFooter from '@/components/ActionFooter.vue'
import BeamModal from '@/components/BeamModal.vue'
import BeamModalOutlet from '@/components/BeamModalOutlet.vue'
import Confirm from '@/components/Confirm.vue'
import ItemCheck from '@/components/ItemCheck.vue'
import ItemCount from '@/components/ItemCount.vue'
import ListAnchor from '@/components/ListAnchor.vue'
import ListItem from '@/components/ListItem.vue'
import ListView from '@/components/ListView.vue'
import Navbar from '@/components/Navbar.vue'
import ScanInput from '@/components/ScanInput.vue'

function install(app: App /* options */) {
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
}

export {
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
	install,
}
