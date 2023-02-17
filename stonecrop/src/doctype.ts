import { Component } from 'vue'

import { ImmutableDoctype } from 'types/index'

export default class Doctype {
	doctype: string
	schema: ImmutableDoctype['schema']
	events: ImmutableDoctype['events']
	hooks: ImmutableDoctype['hooks']
	// TODO: allow different components for different views; probably
	// should be defined in the schema instead?
	component?: Component

	constructor(
		doctype: string,
		schema: ImmutableDoctype['schema'],
		events: ImmutableDoctype['events'],
		hooks: ImmutableDoctype['hooks'],
		component?: Component
	) {
		this.doctype = doctype
		this.schema = schema
		this.events = events
		this.hooks = hooks
		this.component = component
	}

	get slug() {
		// kebab case
		return this.doctype
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.replace(/[\s_]+/g, '-')
			.toLowerCase()
	}

	get __typename() {
		return this.doctype
	}
}
