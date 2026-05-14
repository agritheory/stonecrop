import { App } from 'vue'

import ACell from './components/ACell.vue'
import AExpansionRow from './components/AExpansionRow.vue'
import AGanttCell from './components/AGanttCell.vue'
import ARow from './components/ARow.vue'
import ARowActions from './components/ARowActions.vue'
import ATable from './components/ATable.vue'
import ATableHeader from './components/ATableHeader.vue'
import ATableLoading from './components/ATableLoading.vue'
import ATableLoadingBar from './components/ATableLoadingBar.vue'
import ATableModal from './components/ATableModal.vue'
export { createTableStore } from './stores/table'
export type { FilterState, FilterStateRecord } from './stores/table'
export type * from './types'
export { schemaToColumns } from './schemaToColumns'

// Icon exports
export { AddIcon, DeleteIcon, DuplicateIcon, InsertAboveIcon, InsertBelowIcon, MoveIcon, actionIcons } from './icons'

/**
 * Install all ATable components
 * @param app - Vue app instance
 * @public
 */
function install(app: App /* options */) {
	app.component('ACell', ACell)
	app.component('AExpansionRow', AExpansionRow)
	app.component('AGanttCell', AGanttCell)
	app.component('ARow', ARow)
	app.component('ARowActions', ARowActions)
	app.component('ATable', ATable)
	app.component('ATableHeader', ATableHeader)
	app.component('ATableLoading', ATableLoading)
	app.component('ATableLoadingBar', ATableLoadingBar)
	app.component('ATableModal', ATableModal)
}

export {
	ACell,
	AExpansionRow,
	AGanttCell,
	ARow,
	ARowActions,
	ATable,
	ATableHeader,
	ATableLoading,
	ATableLoadingBar,
	ATableModal,
	install,
}
