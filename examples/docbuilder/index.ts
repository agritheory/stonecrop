import { createApp } from 'vue'

import { AFieldset, AForm } from '@agritheory/aform'
import { ACell, ARow, ATableHeader, ATableModal, ATable } from '@agritheory/atable'
import App from './App.vue'

let app = createApp(App)
app.component('ACell', ACell)
app.component('AFieldset', AFieldset)
app.component('AForm', AForm)
app.component('ARow', ARow)
app.component('ATable', ATable)
app.component('ATableHeader', ATableHeader)
app.component('ATableModal', ATableModal)
app.mount('#app')
