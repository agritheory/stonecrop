import { createApp } from 'vue'

import '@stonecrop/aform/styles'
import '@stonecrop/atable/styles'
import '@stonecrop/desktop/styles'
import '@stonecrop/node-editor/styles'
import { AFieldset, AForm, ANumericInput, ATextInput } from '@stonecrop/aform'
import { ACell, ARow, ATableHeader, ATableModal, ATable } from '@stonecrop/atable'
import { ActionSet, SheetNav } from '@stonecrop/desktop'
import { NodeEditor, StateEditor } from '@stonecrop/node-editor'

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
