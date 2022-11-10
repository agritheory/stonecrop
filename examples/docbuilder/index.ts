import { createApp } from 'vue'

import { ATable } from '@agritheory/atable'
import { AForm } from '@agritheory/aform'
import App from './App.vue'
import { makeServer } from './server'

makeServer()

let app = createApp(App)
app.component('ATable', ATable)
app.component('AForm', AForm)
app.mount('#app')
