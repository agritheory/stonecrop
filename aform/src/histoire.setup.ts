import { defineSetupVue3 } from '@histoire/plugin-vue'

import AForm from '@/components/AForm.vue'
import AFieldset from '@/components/form/AFieldset.vue'
import ANumericInput from '@/components/form/ANumericInput.vue'
import ATextInput from '@/components/form/ATextInput.vue'

export const setupVue3 = defineSetupVue3(({ app }) => {
	app.component('AForm', AForm)
	app.component('AFieldset', AFieldset)
	app.component('ANumericInput', ANumericInput)
	app.component('ATextInput', ATextInput)
})
