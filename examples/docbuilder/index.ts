import { List, Map } from 'immutable'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import '@stonecrop/desktop/styles'
import '@stonecrop/node-editor/styles'
import { install as ATablePlugin } from '@stonecrop/aform'
import { install as AFormPlugin } from '@stonecrop/atable'
import { ActionSet, SheetNav } from '@stonecrop/desktop'
import { install as NodeEditorPlugin } from '@stonecrop/node-editor'
import { DoctypeMeta, Stonecrop } from '@stonecrop/stonecrop'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

app.use(Stonecrop, {
	router,
	getMeta: async (doctype: string) => {
		const searchParams = new URLSearchParams({ doctype })

		// Fetch schema data
		const schemaResponse = await fetch('/api/load_meta?' + searchParams.toString())
		const schemaData: Record<string, any>[] = await schemaResponse.json()

		// Fetch actions data
		const actionsResponse = await fetch('/api/load_actions?' + searchParams.toString())
		const actionsData: Record<string, any>[] = await actionsResponse.json()

		// Fetch state machine data
		const stateResponse = await fetch('/api/load_state_machine?' + searchParams.toString())
		const stateResponseData: Record<string, any> = await stateResponse.json()

		return new DoctypeMeta(
			doctype,
			List(schemaData as any),
			stateResponseData.machine,
			Map({
				default: actionsData?.map((action: any) => action.name || action) || [],
			})
		)
	},
})

app.use(AFormPlugin)
app.use(ATablePlugin)
app.use(NodeEditorPlugin)
app.component('ActionSet', ActionSet)
app.component('SheetNav', SheetNav)
app.mount('#app')
