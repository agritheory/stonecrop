import { createGlobalState, useStorage } from '@vueuse/core'
import { Map, OrderedSet } from 'immutable'

// export const useStonecrop = createGlobalState(
// 	() => { return { ... new Stonecrop(
// 		Map({ node: 'A', 'suit': 'B' }),
// 		Map({}),
// 		OrderedSet([1, 2, 3]),
// 	) } } // use for dev - no localstorage yet
// 	// () => useStorage(
// 	// 	'stonecrop',
// 	// 	{... new Stonecrop()}
// 	// ),
// )

export const useStonecrop = createGlobalState(
	() => {
		return { ...new Stonecrop() }
	} // use for dev or refactor to an env flag
	// https://github.com/unjs/unstorage
	// () => useStorage(
	// 	'stonecrop',
	// 	{... new Stonecrop()}
	// ),
)

export class Stonecrop {
	constructor(schema, events, hooks, value) {
		if (Stonecrop._root) {
			return Stonecrop._root
		}
		Stonecrop._root = this
		this.name = 'Stonecrop'
		this.schema = schema // new Registry(schema)
		this.events = events
		this.hooks = hooks
	}
}
