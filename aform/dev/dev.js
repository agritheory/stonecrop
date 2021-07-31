import { createApp } from 'vue'
import Dev from './Dev.vue'
import atable from '@sedum/atable'
import aform from './../src/'

let app = createApp(Dev)

app.use(atable)
app.use(aform)

app.mount('#app')
