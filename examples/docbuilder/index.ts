import { createApp } from 'vue'

import { AFieldset, AForm, ANumericInput, ATextInput } from '@agritheory/aform'
import '@agritheory/aform/styles'
import { ACell, ARow, ATableHeader, ATableModal, ATable } from '@agritheory/atable'
import '@agritheory/atable/styles'
import { NodeEditor, StateEditor } from '@agritheory/node_editor'
import '@agritheory/node_editor/styles'
import { ActionSet } from '@agritheory/desktop'
import '@agritheory/desktop/styles'
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
app.component('NodeEditor', NodeEditor)
app.component('StateEditor', StateEditor)
app.component('ActionSet', ActionSet)
app.mount('#app')
