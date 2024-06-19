import { Component } from 'vue'

import type { ImmutableDoctype } from './types/index'

export default class DoctypeMeta {
	readonly doctype: string
	readonly schema: ImmutableDoctype['schema']
	readonly workflow: ImmutableDoctype['workflow']
	readonly actions: ImmutableDoctype['actions']
	// TODO: allow different components for different views; probably
	// should be defined in the schema instead?
	readonly component?: Component

	constructor(
		doctype: string,
		schema: ImmutableDoctype['schema'],
		workflow: ImmutableDoctype['workflow'],
		actions: ImmutableDoctype['actions'],
		component?: Component
	) {
		this.doctype = doctype
		this.schema = schema
		this.workflow = workflow
		this.actions = actions
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
