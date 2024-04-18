import { App } from 'vue'

import ACheckbox from '@/components/form/ACheckbox.vue'
import AComboBox from '@/components/form/AComboBox.vue'
import ADate from '@/components/form/ADate.vue'
import ADropdown from '@/components/form/ADropdown.vue'
import AFieldset from '@/components/form/AFieldset.vue'
import AForm from '@/components/AForm.vue'
import ANumericInput from '@/components/form/ANumericInput.vue'
import AQuantity from '@/components/form/AQuantity.vue'
import ATextInput from '@/components/form/ATextInput.vue'
// import { ACurrency } from '@/components/form/ACurrency.vue'
// import { AQuantity } from '@/components/form/AQuantity.vue'

function install(app: App /* options */) {
	app.component('ACheckbox', ACheckbox)
	app.component('ACombobox', AComboBox)
	app.component('ADate', ADate)
	app.component('ADropdown', ADropdown)
	app.component('AFieldset', AFieldset)
	app.component('AForm', AForm)
	app.component('ANumericInput', ANumericInput)
	app.component('AQuantity', AQuantity)
	app.component('ATextInput', ATextInput)
	// app.component('ACurrency', ACurrency)
	// app.component('AQuantity', AQuantity)
}

export { ACheckbox, AComboBox, ADate, ADropdown, AFieldset, AForm, ANumericInput, AQuantity, ATextInput, install }
