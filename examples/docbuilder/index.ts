import { createApp } from 'vue'

import { install as AFormPlugin } from '@stonecrop/aform'
import { install as ATablePlugin } from '@stonecrop/atable'
import { ActionSet, SheetNav } from '@stonecrop/desktop'
import { NodeEditor, StateEditor } from '@stonecrop/node-editor'
import '@stonecrop/aform/styles'
import '@stonecrop/atable/styles'
import '@stonecrop/desktop/styles'
import '@stonecrop/node-editor/styles'

import App from './App.vue'
import router from './router'

let app = createApp(App)
app.use(router)
app.use(AFormPlugin)
app.use(ATablePlugin)
app.component('NodeEditor', NodeEditor)
app.component('StateEditor', StateEditor)
app.component('ActionSet', ActionSet)
app.component('SheetNav', SheetNav)
app.mount('#app')
