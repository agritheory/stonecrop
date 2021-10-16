import { createApp } from 'vue'
import Dev from './Dev.vue'
import atable from '../src/'
import ADate from './ADate.vue'
import TestModalComponent from './TestModalComponent.vue'

let app = createApp(Dev)
app.use(atable, {})
app.component('ADate', ADate)
app.component('TestModalComponent', TestModalComponent)

app.mount('#app')
