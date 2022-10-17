import { ComponentOptions } from 'vue'

import { SchemaTypes } from '@agritheory/aform/types'

export default class Doctype {
	doctype: string
	schema: SchemaTypes[]
	events: any // TODO: new Machine()
	hooks: any

	constructor(
		doctype: string,
		events: any,
		hooks: any,
		component: string | ComponentOptions = undefined,
		recordsComponent: string | ComponentOptions = undefined
	) {
		this.doctype = doctype
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
