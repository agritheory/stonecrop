import { createApp } from 'vue'
import Dev from './Dev.vue'
import atable from '@agritheory/atable'
import aform from '@agritheory/aform'
import stonecrop from './../src/'

let app = createApp(Dev)

app.use(atable)
app.use(aform)
app.use(stonecrop)

app.mount('#app')
