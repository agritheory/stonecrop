import ATable from './components/ATable.vue'
import ATableHeader from './components/ATableHeader.vue'
import ATableModal from './components/ATableModal.vue'

function install(app, options) {
	app.component('ATable', ATable)
	app.component('ATableHeader', ATableHeader)
	app.component('ATableModal', ATableModal)
}

export default {
	install
}