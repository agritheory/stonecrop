import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import { StonecropGraphQl } from '@agritheory/graphql-client'
import { Stonecrop } from '@agritheory/stonecrop'
import { StateEditor } from '@agritheory/node-editor'

import { makeServer } from './server'
import App from './App.vue'

const app = createApp(App)

// setup router
const router = createRouter({
	history: createWebHistory(),
	routes: [{ path: '/', component: App, alias: '/home', meta: { transition: 'slide-up' } }],
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

// initialize more components if needed
app.use(Stonecrop, { router })
app.use(StonecropGraphQl, { url: '/graphql' })
app.mount('#app')
