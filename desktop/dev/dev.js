import { createApp } from 'vue'
import Dev from './Dev.vue'
import desktop from './../src/'

let app = createApp(Dev)

app.use(desktop)
app.mount('#app')
