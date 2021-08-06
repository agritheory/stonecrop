import Navbar from './Navbar.vue'
import ListView from './ListView.vue'
import ListItem from './ListItem.vue'
import ListAnchor from './ListAnchor.vue'
import ItemCount from './ItemCount.vue'
import ItemCheck from './ItemCheck.vue'
import ScanInput from './ScanInput.vue'
import ActionFooter from "./ActionFooter.vue"
import BeamModal from './BeamModal.vue'
import BeamModalOutlet from './BeamModalOutlet.vue'
import ConfirmDialog from './Confirm.vue'
import PortalVue from 'portal-vue'

const components = [
	Navbar,
	ListView,
	ListItem,
	ListAnchor,
	ItemCount,
	ItemCheck,
	ScanInput,
	ActionFooter,
	BeamModal,
	ConfirmDialog,
	BeamModalOutlet
]

const install = function (Vue, opts = {}) {
	Vue.use(PortalVue)
	components.forEach((component) => {
		Vue.component(component.name, component)
	})
}

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue)
}

export {
  Navbar,
  ListView,
  ListItem,
  ListAnchor,
  ItemCount,
  ItemCheck,
  ScanInput,
  ActionFooter,
	BeamModal,
	ConfirmDialog,
	BeamModalOutlet
};

export default {
  version: "0.1.0",
  install,
	Navbar,
  ListView,
  ListItem,
  ListAnchor,
  ItemCount,
  ItemCheck,
  ScanInput,
  ActionFooter,
	BeamModal,
	ConfirmDialog,
	BeamModalOutlet
}
