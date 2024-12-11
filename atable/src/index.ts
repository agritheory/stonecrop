import { createPinia } from 'pinia'
import { App } from 'vue'

import ACell from '@/components/ACell.vue'
import AExpansionRow from '@/components/AExpansionRow.vue'
import ARow from '@/components/ARow.vue'
import ATable from '@/components/ATable.vue'
import ATableHeader from '@/components/ATableHeader.vue'
import ATableModal from '@/components/ATableModal.vue'
export { createTableStore } from '@/stores/table'
export type { CellContext, TableColumn, TableConfig, TableDisplay, TableRow, TableModal } from '@/types'

/**
 * Install all ATable components
 * @param app - Vue app instance
 * @public
 */
function install(app: App /* options */) {
	const pinia = createPinia()
	app.use(pinia)

	app.component('ACell', ACell)
	app.component('AExpansionRow', AExpansionRow)
	app.component('ARow', ARow)
	app.component('ATable', ATable)
	app.component('ATableHeader', ATableHeader)
	app.component('ATableModal', ATableModal)
}

export { install, ACell, AExpansionRow, ARow, ATable, ATableHeader, ATableModal }
