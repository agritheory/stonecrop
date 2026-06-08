import { List, Map } from 'immutable'
import { App } from 'vue'
import { vi } from 'vitest'

import type { DoctypeField } from '@stonecrop/schema'
import { Doctype, Registry, Stonecrop } from '@stonecrop/stonecrop'

export const makeStonecropPlugin = vi.defineHelper((registry: Registry, stonecrop: Stonecrop) => {
	// Provide only the injection tokens that useStonecrop() needs.
	// We deliberately skip app.use(StonecropPlugin) here: the real plugin would
	// call app.provide('$registry', ...) itself, and a second provide() on the same
	// key emits a [Vue warn] about the overwrite.  Tests don't need the rest of the
	// plugin (router wiring, global properties, Pinia store bootstrap) so we hand-
	// craft the minimum required surface instead.
	return {
		install(app: App) {
			app.provide('$registry', registry)
			app.provide('$stonecrop', stonecrop)
		},
	}
})

export const buildDoctype = vi.defineHelper(
	(name: string, initialState: string, states: Record<string, any>, extraFields?: DoctypeField[]) => {
		const baseFields = [
			{ kind: 'field' as const, fieldname: 'id', fieldtype: 'Data', label: 'ID', component: 'ATextInput' },
			{ kind: 'field' as const, fieldname: 'title', fieldtype: 'Data', label: 'Title', component: 'ATextInput' },
			{ kind: 'field' as const, fieldname: 'status', fieldtype: 'Data', label: 'Status', component: 'ATextInput' },
		]

		const schema = extraFields ? List([...baseFields, ...extraFields]) : List(baseFields)

		const workflow = {
			id: name,
			initial: initialState,
			states,
		}

		return new Doctype(name, schema, workflow, Map({}))
	}
)
