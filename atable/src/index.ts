import { App } from 'vue'

import ACell from '@/components/ACell.vue'
import ARow from '@/components/ARow.vue'
import ATable from '@/components/ATable.vue'
import ATableHeader from '@/components/ATableHeader.vue'
import ATableModal from '@/components/ATableModal.vue'
import TableDataStore from './components'

function install(app: App /* options */) {
	app.component('ACell', ACell)
	app.component('ARow', ARow)
	app.component('ATable', ATable)
	app.component('ATableHeader', ATableHeader)
	app.component('ATableModal', ATableModal)
}

export { install, ACell, ARow, ATable, ATableHeader, ATableModal, TableDataStore }
