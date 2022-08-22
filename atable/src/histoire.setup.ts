import { defineSetupVue3 } from '@histoire/plugin-vue'

import ACell from '@/components/ACell.vue'
import ADate from '@/components/ADate.vue'
import ARow from '@/components/ARow.vue'
import ATable from '@/components/ATable.vue'
import ATableHeader from '@/components/ATableHeader.vue'
import ATableModal from '@/components/ATableModal.vue'

export const setupVue3 = defineSetupVue3(({ app }) => {
	app.component('ACell', ACell)
	app.component('ADate', ADate)
	app.component('ARow', ARow)
	app.component('ATable', ATable)
	app.component('ATableHeader', ATableHeader)
	app.component('ATableModal', ATableModal)
})
