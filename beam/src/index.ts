import { App } from 'vue'

import ActionFooter from '@/components/ActionFooter.vue'
import BeamArrow from '@/components/BeamArrow.vue'
import BeamBtn from '@/components/BeamBtn.vue'
import BeamDayDivider from '@/components/BeamDayDivider.vue'
import BeamFilter from '@/components/BeamFilter.vue'
import BeamFilterOption from '@/components/BeamFilterOption.vue'
import BeamHeading from '@/components/BeamHeading.vue'
import BeamMetadata from '@/components/BeamMetadata.vue'
import BeamModal from '@/components/BeamModal.vue'
import BeamModalOutlet from '@/components/BeamModalOutlet.vue'
import BeamProgress from '@/components/BeamProgress.vue'
import Confirm from '@/components/Confirm.vue'
import FixedTop from '@/components/FixedTop.vue'
import ItemCheck from '@/components/ItemCheck.vue'
import ItemCount from '@/components/ItemCount.vue'
import ListAnchor from '@/components/ListAnchor.vue'
import ListItem from '@/components/ListItem.vue'
import ListView from '@/components/ListView.vue'
import Navbar from '@/components/Navbar.vue'
import ScanInput from '@/components/ScanInput.vue'
import SplitColumn from '@/components/SplitColumn.vue'
import ToggleArrow from '@/components/ToggleArrow.vue'
import { useMqttStream } from '@/composables/mqtt'
export type { IMqttStream, ListViewItem } from '@/types'
import 'themes/beam.css'

/**
 * Install all Beam components
 * @param app - Vue app instance
 * @public
 */
function install(app: App /* options */) {
	app.component('ActionFooter', ActionFooter)
	app.component('BeamArrow', BeamArrow)
	app.component('BeamBtn', BeamBtn)
	app.component('BeamDayDivider', BeamDayDivider)
	app.component('BeamFilter', BeamFilter)
	app.component('BeamFilterOption', BeamFilterOption)
	app.component('BeamHeading', BeamHeading)
	app.component('BeamMetadata', BeamMetadata)
	app.component('BeamModal', BeamModal)
	app.component('BeamModalOutlet', BeamModalOutlet)
	app.component('BeamProgress', BeamProgress)
	app.component('Confirm', Confirm)
	app.component('FixedTop', FixedTop)
	app.component('ItemCheck', ItemCheck)
	app.component('ItemCount', ItemCount)
	app.component('ListAnchor', ListAnchor)
	app.component('ListItem', ListItem)
	app.component('ListView', ListView)
	app.component('Navbar', Navbar)
	app.component('ScanInput', ScanInput)
	app.component('SplitColumn', SplitColumn)
	app.component('ToggleArrow', ToggleArrow)
}

export {
	ActionFooter,
	BeamArrow,
	BeamBtn,
	BeamDayDivider,
	BeamFilter,
	BeamFilterOption,
	BeamHeading,
	BeamMetadata,
	BeamModal,
	BeamModalOutlet,
	BeamProgress,
	Confirm,
	FixedTop,
	ItemCheck,
	ItemCount,
	ListAnchor,
	ListItem,
	ListView,
	Navbar,
	ScanInput,
	SplitColumn,
	ToggleArrow,
	install,
	useMqttStream,
}
