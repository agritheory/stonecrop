import { defineSetupVue3 } from '@histoire/plugin-vue'

import ACheckbox from '@/components/form/ACheckbox.vue'
import AFieldset from '@/components/form/AFieldset.vue'
import AForm from '@/components/AForm.vue'
import ANumericInput from '@/components/form/ANumericInput.vue'
import ATextInput from '@/components/form/ATextInput.vue'
import AFileAttach from '@/components/form/AFileAttach.vue'


import { ATable, ATableHeader, ATableModal } from '@stonecrop/atable'
import '@stonecrop/atable/styles'

export const setupVue3 = defineSetupVue3(({ app }) => {
	// TODO: (typing) add typing for ATable components
	app.component('ACheckbox', ACheckbox)
	app.component('AFieldset', AFieldset)
	app.component('AForm', AForm)
	app.component('ANumericInput', ANumericInput)
	app.component('ATable', ATable)
	app.component('ATableHeader', ATableHeader)
	app.component('ATableModal', ATableModal)
	app.component('ATextInput', ATextInput)
	app.component('AFileAttach', AFileAttach)
})
