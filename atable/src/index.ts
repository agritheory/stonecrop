import { App } from 'vue'

import ACell from './components/ACell.vue'
import AGanttCell from './components/AGanttCell.vue'
import ARow from './components/ARow.vue'
import ARowActions from './components/ARowActions.vue'
import ATable from './components/ATable.vue'
import ATableHeader from './components/ATableHeader.vue'
import ATableLoading from './components/ATableLoading.vue'
import ATableLoadingBar from './components/ATableLoadingBar.vue'
import ACellShell from './components/ACellShell.vue'
import ATableModal from './components/ATableModal.vue'
import ATablePaginationFooter from './components/ATablePaginationFooter.vue'
export { createTableStore } from './stores/table'
export { useTablePagination } from './composables/table-pagination'
export { cellOverlayContainer, computeCellOverlayStyle } from './composables/cellOverlayPosition'
export type { CellOverlayPositionInput } from './composables/cellOverlayPosition'
export {
	TABLE_TUPLE_QUANTITY_PICKER,
	TABLE_TUPLE_CURRENCY_PICKER,
	isTableTuplePickerModal,
	tableTuplePickerModalComponent,
} from './tuplePickerModal'
export type { FilteredTableRow, TablePagination, UseTablePaginationOptions } from './composables/table-pagination'
export type { FilterState, FilterStateRecord } from './stores/table'
export type * from './types'
export { schemaToColumns } from './schemaToColumns'

// Icon exports
export {
	AddIcon,
	DeleteIcon,
	DuplicateIcon,
	InsertAboveIcon,
	InsertBelowIcon,
	MoveIcon,
	OpenIcon,
	actionIcons,
} from './icons'

/**
 * Install all ATable components
 * @param app - Vue app instance
 * @public
 */
function install(app: App /* options */) {
	app.component('ACell', ACell)
	app.component('AGanttCell', AGanttCell)
	app.component('ARow', ARow)
	app.component('ARowActions', ARowActions)
	app.component('ATable', ATable)
	app.component('ATableHeader', ATableHeader)
	app.component('ATableLoading', ATableLoading)
	app.component('ATableLoadingBar', ATableLoadingBar)
	app.component('ACellShell', ACellShell)
	app.component('ATableModal', ATableModal)
	app.component('ATablePaginationFooter', ATablePaginationFooter)
}

export {
	ACell,
	AGanttCell,
	ARow,
	ARowActions,
	ATable,
	ATableHeader,
	ATableLoading,
	ATableLoadingBar,
	ACellShell,
	ATableModal,
	ATablePaginationFooter,
	install,
}
