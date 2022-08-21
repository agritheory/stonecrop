import { Map, Record, OrderedSet } from 'immutable'
// import { createGlobalState, useStorage } from '@vueuse/core'

// export const useGlobalState = createGlobalState(
// 	() => useStorage(
// 		'vueuse-local-storage',
// 		{ // refactor this object into a class
// 			schema: Map({ node: 'A' }),
// 			events: {},
// 			hooks: OrderedSet([1, 2, 3]),
// 		}
// 	),
// )

import { createGlobalState, useStorageAsync } from '@vueuse/core'
export const useState = createGlobalState(() =>
	useStorageAsync('stonecrop', {
		name: 'Banana',
		color: 'Yellow',
		size: 'Medium',
	}),
)



`
app.schema <Record> // immutable
app.events <FSM> // immutable
app.hooks <OrderedSet> // immutable
app.value <Store> // mutable
app.user // "tyler@agritheory.com"
app.name // "MyFirstERP"
app.doctype.schema <Record> // app.doctype lazy loaded by router?
app.doctype.events <FSM>
app.doctype.hooks <OrderedSet>
app.doctype.hooks.value <Store>
app.doctype.schema.field.events <FSM>
app.doctype.schema.field.hooks <OrderedSet>
app.doctype.schema.field.value <Store>
app.doctype.schema.field.value.field.value <Store> // a "sub-form"
app.doctype.schema.field.value.field[0].value <Store> // also a "sub-form", likely representing a table or list
`