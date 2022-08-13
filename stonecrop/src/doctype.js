import { Map, Record, OrderedSet } from 'immutable'
// import Machine from 'xstate'
// import store type from pinia

export class Doctype {
	constructor(name, schema, events, hooks, value) {
		this.name = name
		this.schema = new Record(schema)
		this.events = events // new Machine()
		this.hooks = new OrderedSet(hooks)
		this.value = value
	}
}

