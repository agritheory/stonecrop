import Stonecrop from '/src/index.js'
import { Map, Record, OrderedSet } from 'immutable'

import { defineSetupVue3 } from '@histoire/plugin-vue'

export const setupVue3 = defineSetupVue3(({ app, story, variant }) => {
	app.use(Stonecrop, {
		schema: Map({ node: 'A'}),
		events: { node: 'A' },
		hooks: OrderedSet([1, 2, 3]),
	})
})