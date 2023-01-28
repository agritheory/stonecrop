import { App } from 'vue'

import AComboBox from '@/components/form/AComboBox.vue'
import ADate from '@/components/form/ADate.vue'
import AForm from '@/components/AForm.vue'
import AFieldset from '@/components/form/AFieldset.vue'
import ANumericInput from '@/components/form/ANumericInput.vue'
import ATextInput from '@/components/form/ATextInput.vue'
import ACheckbox from '@/components/form/ACheckbox.vue'
// import { ACurrency } from '@/components/form/ACurrency.vue'
// import { AQuantity } from '@/components/form/AQuantity.vue'

function install(app: App /* options */) {
	app.component('ACombobox', AComboBox)
	app.component('ADate', ADate)
	app.component('AForm', AForm)
	app.component('AFieldset', AFieldset)
	app.component('ANumericInput', ANumericInput)
	app.component('ATextInput', ATextInput)
	app.component('ACheckbox', ACheckbox)
	// app.component('ACurrency', ACurrency)
	// app.component('AQuantity', AQuantity)
}

export { install, AComboBox, ADate, AForm, AFieldset, ANumericInput, ATextInput, ACheckbox }
