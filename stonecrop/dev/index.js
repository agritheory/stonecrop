import { createApp } from 'vue'
import Dev from './Dev.vue'
import Stonecrop from '../src/index.js'
// import server
import createServer from './server.js'

const app = createApp(Dev)

app.use(Stonecrop, {})
app.mount('#app')

// run server
createServer()
