import { defineSetupVue3 } from '@histoire/plugin-vue'

import { ADate, AFileAttach, AForm, ANumericInput, ATextInput } from '@stonecrop/aform'
import { ACell, AExpansionRow, ARow, ATable, ATableHeader, ATableModal } from '@stonecrop/atable'

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
	app.component('AFileAttach', AFileAttach)
})
