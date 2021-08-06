// import vue, stonecrop, client, aform, atable, desktop
// miragejs for dev server
import { createApp } from 'vue'
import App from './App.vue'
import atable from '@sedum/atable'
import aform from '@sedum/aform'
import stonecrop from '@sedum/stonecrop'
import desktop from '@sedum/desktop'
import { makeServer } from "./server"


if (import.meta.env.DEV) {
	makeServer()
}

let app = createApp(App)

app.use(atable)
app.use(aform)
app.use(stonecrop)
app.use(desktop)

app.mount('#app')
