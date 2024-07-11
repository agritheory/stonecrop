import { defineSetupVue3 } from '@histoire/plugin-vue'

import {
	ACheckbox,
	ADate,
	ADatePicker,
	ADropdown,
	AFieldset,
	AForm,
	ANumericInput,
	ATextInput,
	Login,
} from '@stonecrop/aform'
import { ATable, ATableHeader, ATableModal } from '@stonecrop/atable'

export const setupVue3 = defineSetupVue3(({ app }) => {
	app.component('ACheckbox', ACheckbox)
	app.component('ADate', ADate)
	app.component('ADatePicker', ADatePicker)
	app.component('ADropdown', ADropdown)
	app.component('AFieldset', AFieldset)
	app.component('AForm', AForm)
	app.component('ANumericInput', ANumericInput)
	app.component('ATable', ATable)
	app.component('ATableHeader', ATableHeader)
	app.component('ATableModal', ATableModal)
	app.component('ATextInput', ATextInput)
	app.component('Login', Login)
})
