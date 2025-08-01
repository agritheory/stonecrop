import { List, Map } from 'immutable'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import '@stonecrop/desktop/styles'
import '@stonecrop/node-editor/styles'
import { install as ATablePlugin } from '@stonecrop/aform'
import { install as AFormPlugin } from '@stonecrop/atable'
import { ActionSet, SheetNav } from '@stonecrop/desktop'
import { install as NodeEditorPlugin } from '@stonecrop/node-editor'
import Stonecrop, { DoctypeMeta } from '@stonecrop/stonecrop'

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
		const doctypeParam = searchParams.toString()

		const schemaResponse = await fetch(`/api/load_meta?${doctypeParam}`)
		const schemaData: Record<string, any>[] = await schemaResponse.json()

		const actionsResponse = await fetch(`/api/load_actions?${doctypeParam}`)
		const actionsData: Record<string, any>[] = await actionsResponse.json()

		const stateResponse = await fetch(`/api/load_state_machine?${doctypeParam}`)
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
