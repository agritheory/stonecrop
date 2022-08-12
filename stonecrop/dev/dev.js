import { createApp } from 'vue'
import Dev from './Dev.vue'
import atable from '@sedum/atable'
import aform from '@sedum/aform'
import stonecrop from './../src/'

let app = createApp(Dev)

app.use(atable)
app.use(aform)
app.use(stonecrop)

app.mount('#app')
