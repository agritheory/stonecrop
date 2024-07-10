import { methods } from '@stonecrop/graphql-client'
import { Stonecrop } from '@stonecrop/stonecrop'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import { makeServer } from './server'
import App from './App.vue'

const app = createApp(App)

// setup router
createRouter({
	history: createWebHistory(),
	routes: [{ path: '/', component: App, meta: { transition: 'slide-up' } }],
})

// setup mirage server and load with data
const server = makeServer()
const workflow = server.create('DoctypeWorkflow', {
	name: 'save',
	machine: null,
})

const schema = server.create('DoctypeField', {
	label: 'Subject',
})

const action = server.create('DoctypeAction', {
	eventName: 'save',
})

server.create('Doctype', {
	id: 'Issue',
	name: 'Issue',
	workflow: JSON.stringify(workflow),
	schema: JSON.stringify([schema]),
	actions: JSON.stringify([action]),
})

app.use(Stonecrop, { getMeta: methods.getMeta })
app.mount('#app')
