import { ComponentOptions } from 'vue'

import { Meta } from 'types/index'

export default class Doctype {
	doctype: string
	schema: Meta['schema']
	events: Meta['events']
	hooks: Meta['hooks']

	constructor(
		doctype: string,
		events: Meta['events'],
		hooks: Meta['hooks'],
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
