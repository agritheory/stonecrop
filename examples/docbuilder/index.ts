import { createApp } from 'vue'

import '@agritheory/aform/styles'
import '@agritheory/atable/styles'
import '@agritheory/desktop/styles'
import '@agritheory/node-editor/styles'
import { AFieldset, AForm, ANumericInput, ATextInput } from '@agritheory/aform'
import { ACell, ARow, ATableHeader, ATableModal, ATable } from '@agritheory/atable'
import { ActionSet, SheetNav } from '@agritheory/desktop'
import { NodeEditor, StateEditor } from '@agritheory/node-editor'

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
app.component('SheetNav', SheetNav)
app.mount('#app')
