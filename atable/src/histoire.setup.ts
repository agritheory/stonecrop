import { defineSetupVue3 } from '@histoire/plugin-vue'

import ACell from '@/components/ACell.vue'
import AExpansionRow from '@/components/AExpansionRow.vue'
import ARow from '@/components/ARow.vue'
import ATable from '@/components/ATable.vue'
import ATableHeader from '@/components/ATableHeader.vue'
import ATableModal from '@/components/ATableModal.vue'

import { ADate, AForm, ANumericInput, ATextInput } from '@stonecrop/aform'

export const setupVue3 = defineSetupVue3(({ app }) => {
	app.component('ACell', ACell)
	app.component('ADate', ADate)
	app.component('AExpansionRow', AExpansionRow)
	app.component('AForm', AForm)
	app.component('ANumericInput', ANumericInput)
	app.component('ARow', ARow)
	app.component('ATable', ATable)
	app.component('ATableHeader', ATableHeader)
	app.component('ATableModal', ATableModal)
	app.component('ATextInput', ATextInput)
})
