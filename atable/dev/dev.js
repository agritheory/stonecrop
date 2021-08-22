import { createApp } from 'vue'
import Dev from './Dev.vue'
import atable from '../src/'
import ADate from './ADate.vue'
import TestComponent from './TestModalComponent.vue'

let app = createApp(Dev)
app.use(atable, {})
app.component('ADate', ADate)
app.component('TestComponent', TestComponent)

app.mount('#app')
