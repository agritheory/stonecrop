import { createApp } from 'vue'
import Dev from './Dev.vue'
import atable from '../src/'

let app = createApp(Dev)
app.use(atable)
app.mount('#app')
