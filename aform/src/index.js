import AForm from './components/AForm.vue'
import AFieldset from './components/form/AFieldset.vue'
import ANumericInput from './components/form/ANumericInput.vue'
import ATextInput from './components/form/ATextInput.vue'
// import { ACombobox } from './components/form/ACombobox.vue'
// import { ADate } from './components/form/ADate.vue'
// import { ACurrency } from './components/form/ACurrency.vue'
// import { AQuantity } from './components/form/AQuantity.vue'

function install(app, options) {
	app.component('AForm', AForm)
	app.component('AFieldset', AFieldset)
	app.component('ANumericInput', ANumericInput)
	app.component('ATextInput', ATextInput)
	// app.component('ACombobox', ACombobox)
	// app.component('ADate', ADate)
	// app.component('ACurrency', ACurrency)
	// app.component('AQuantity', AQuantity)
}

export default {
	install,
}
