import { App } from 'vue'

import ACell from './components/ACell.vue'
import AExpansionRow from './components/AExpansionRow.vue'
import ARow from './components/ARow.vue'
import ATable from './components/ATable.vue'
import ATableHeader from './components/ATableHeader.vue'
import ATableLoading from './components/ATableLoading.vue'
import ATableLoadingBar from './components/ATableLoadingBar.vue'
import ATableModal from './components/ATableModal.vue'
import AGanttHandler from './components/AGanttHandler.vue'
export { createTableStore } from './stores/table'
export type {
	CellContext,
	TableColumn,
	TableConfig,
	TableDisplay,
	TableModal,
	TableModalProps,
	TableRow,
} from './types'

/**
 * Install all ATable components
 * @param app - Vue app instance
 * @public
 */
function install(app: App /* options */) {
	app.component('ACell', ACell)
	app.component('AExpansionRow', AExpansionRow)
	app.component('ARow', ARow)
	app.component('ATable', ATable)
	app.component('ATableHeader', ATableHeader)
	app.component('ATableLoading', ATableLoading)
	app.component('ATableLoadingBar', ATableLoadingBar)
	app.component('ATableModal', ATableModal)
	app.component('AGanttHandler', AGanttHandler)
}

export {
	ACell,
	AExpansionRow,
	AGanttHandler,
	ARow,
	ATable,
	ATableHeader,
	ATableLoading,
	ATableLoadingBar,
	ATableModal,
	install,
}
