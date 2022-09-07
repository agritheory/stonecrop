export default class Doctype {
	constructor(doctype, schema, events, hooks, component = undefined, recordsComponent = undefined) {
		this.doctype = doctype // string
		this.schema = schema
		this.events = events // new Machine()
		this.hooks = hooks
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
