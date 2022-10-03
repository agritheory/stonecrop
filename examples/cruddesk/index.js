// import vue, stonecrop, client, aform, atable, desktop
// miragejs for dev server
import { createApp } from 'vue'
import App from './App.vue'
import atable from '@agritheory/atable'
import aform from '@agritheory/aform'
import stonecrop from '@agritheory/stonecrop'
import desktop from '@agritheory/desktop'
import { makeServer } from './server'

if (import.meta.env.DEV) {
	makeServer()
}

let app = createApp(App)

app.use(atable)
app.use(aform)
app.use(stonecrop)
app.use(desktop)

app.mount('#app')
