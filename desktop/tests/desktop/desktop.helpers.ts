import { List, Map } from 'immutable'
import { App } from 'vue'

import type { SchemaTypes } from '@stonecrop/aform'
import { Doctype, Registry, Stonecrop } from '@stonecrop/stonecrop'

export function makeStonecropPlugin(registry: Registry, stonecrop: Stonecrop) {
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
}

export function buildDoctype(
	name: string,
	initialState: string,
	states: Record<string, any>,
	extraFields?: SchemaTypes[]
) {
	const baseFields = [
		{ fieldname: 'id', fieldtype: 'Data', label: 'ID', component: 'ATextInput' },
		{ fieldname: 'title', fieldtype: 'Data', label: 'Title', component: 'ATextInput' },
		{ fieldname: 'status', fieldtype: 'Data', label: 'Status', component: 'ATextInput' },
	] as SchemaTypes[]

	const schema = extraFields ? List([...baseFields, ...extraFields]) : List(baseFields)

	const workflow = {
		id: name,
		initial: initialState,
		states,
	}

	return new Doctype(name, schema, workflow, Map({}))
}
