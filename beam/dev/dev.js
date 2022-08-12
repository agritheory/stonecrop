import { createApp } from 'vue'
import Dev from './Dev.vue'
import Beam from '../src/index.js'

let app = createApp(Dev)

app.use(Beam)

app.mount('#app')
