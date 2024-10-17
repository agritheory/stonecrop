import { App } from 'vue'

import ActionFooter from '@/components/ActionFooter.vue'
import BeamMetadata from './components/BeamMetadata.vue'
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
import SplitColumn from './components/SplitColumn.vue'
import BeamHeading from './components/BeamHeading.vue'
import BeamMetadataHeading from './components/BeamMetadataHeading.vue'
import 'themes/beam.css'

/**
 * Install all Beam components
 * @param app - Vue app instance
 * @public
 */
function install(app: App /* options */) {
	app.component('ActionFooter', ActionFooter)
	app.component('BeamMetadata', BeamMetadata)
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
	app.component('SplitColumn', SplitColumn)
	app.component('BeamHeading', BeamHeading)
	app.component('BeamMetadataHeading', BeamMetadataHeading)
}

export {
	ActionFooter,
	BeamMetadata,
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
