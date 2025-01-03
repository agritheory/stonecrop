import { createPinia } from 'pinia'
import { createApp } from 'vue'

import '@stonecrop/desktop/styles'
import '@stonecrop/node-editor/styles'
import { install as ATablePlugin } from '@stonecrop/aform'
import { install as AFormPlugin } from '@stonecrop/atable'
import { ActionSet, SheetNav } from '@stonecrop/desktop'
import { install as NodeEditorPlugin } from '@stonecrop/node-editor'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(AFormPlugin)
app.use(ATablePlugin)
app.use(NodeEditorPlugin)
app.component('ActionSet', ActionSet)
app.component('SheetNav', SheetNav)
app.mount('#app')
