import { createApp } from 'vue'
import Dev from './Dev.vue'
import Stonecrop from './../src/index.js'

// const Stonecrop = {
// 	install: (app, options) => {
// 		app.use(router)
// 	}
// }

const app = createApp(Dev)

app.use(Stonecrop, {})
console.log(Stonecrop)
app.mount('#app')
