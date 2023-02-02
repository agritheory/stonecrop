import { defineSetupVue3 } from '@histoire/plugin-vue'
import { List, Map } from 'immutable'
import { RouteRecordRaw } from 'vue-router'
import { createMachine } from 'xstate'

import { ADate, ATextInput } from '@agritheory/aform'
import { Doctype, Stonecrop } from '@agritheory/stonecrop'
import { ImmutableDoctype, MutableDoctype } from '@agritheory/stonecrop/types'

import ActionSet from '@/components/ActionSet.vue'
import { default as DoctypeComponent } from '@/components/Doctype.vue'
import CommandPalette from '@/components/CommandPalette.vue'
import Home from '../stories/components/Home.vue'
import Records from '@/components/Records.vue'
import SheetNav from '@/components/SheetNav.vue'
import router from '@/router'
import makeServer from '../stories/server'

export const setupVue3 = defineSetupVue3(({ app }) => {
	// create mirage server
	makeServer()

	// setup router
	const routes: RouteRecordRaw[] = [
		{ path: '/', component: Home, meta: { transition: 'slide-up' } },
		{ path: '/:records', component: Records, meta: { transition: 'slide-up' } },
		{ path: '/:records/:record', component: DoctypeComponent, meta: { transition: 'slide-up' } },
	]

	for (const route of routes) {
		router.addRoute(route)
	}

	app.use(router)

	// setup Stonecrop
	app.use(Stonecrop, {
		router,
		components: {
			ATextInput,
			ADate,
		},
		// TODO: or if doctype is a function [doctype].apply()
		doctypeLoader: async (doctype: string) => {
			// TODO: normally this would be configured as a memoized/cached call to a server
			const response = await fetch(`/meta/${doctype}`)
			const data: MutableDoctype = await response.json()
			const config: ImmutableDoctype = {
				schema: List(data.schema),
				events: createMachine(data.events),
				hooks: Map(data.hooks),
			}

			return new Doctype(doctype, config.schema, config.events, config.hooks)
		},
	})

	app.component('ActionSet', ActionSet)
	app.component('CommandPalette', CommandPalette)
	app.component('Doctype', Doctype)
	app.component('Records', Records)
	app.component('SheetNav', SheetNav)
})
