export class Doctype {
	constructor(doctype, schema, events, hooks, component = undefined, recordsComponent = undefined) {
		this.doctype = doctype // string
		this.schema = schema
		this.events = events // new Machine()
		this.hooks = hooks
		this.registry = null // gets assigned when added to registry, not when constructed
	}
	get slug() {
		return this.doctype
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.replace(/[\s_]+/g, '-')
			.toLowerCase() // kebab case
	}
	// getRecords
	// getRecord
	//
}
