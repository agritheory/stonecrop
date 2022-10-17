import { ComponentOptions } from 'vue'

import { ImmutableRegistry } from 'types/index'

export default class Doctype {
	doctype: string
	schema: ImmutableRegistry['schema']
	events: ImmutableRegistry['events']
	hooks: ImmutableRegistry['hooks']

	constructor(
		doctype: string,
		schema: ImmutableRegistry['schema'],
		events: ImmutableRegistry['events'],
		hooks: ImmutableRegistry['hooks'],
		component: string | ComponentOptions = undefined,
		recordsComponent: string | ComponentOptions = undefined
	) {
		this.doctype = doctype
		this.schema = schema
		this.events = events
		this.hooks = hooks
	}

	get slug() {
		// kebab case
		return this.doctype
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.replace(/[\s_]+/g, '-')
			.toLowerCase()
	}
}
