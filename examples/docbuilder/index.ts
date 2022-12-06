import { createApp } from 'vue'

import { AFieldset, AForm, ANumericInput, ATextInput } from '@agritheory/aform'
import { ACell, ARow, ATableHeader, ATableModal, ATable } from '@agritheory/atable'
import App from './App.vue'
import router from './router'

let app = createApp(App)
app.use(router)
app.component('ACell', ACell)
app.component('AFieldset', AFieldset)
app.component('AForm', AForm)
app.component('ANumericInput', ANumericInput)
app.component('ARow', ARow)
app.component('ATable', ATable)
app.component('ATableHeader', ATableHeader)
app.component('ATableModal', ATableModal)
app.component('ATextInput', ATextInput)
app.mount('#app')
