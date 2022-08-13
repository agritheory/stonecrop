import { Map, Record, OrderedSet } from 'immutable'
// import Machine from 'xstate'
// import store type from pinia

export class Stonecrop {
	constructor(schema, events, hooks, value){
		// singleton
		if(Stonecrop._root){
			return Stonecrop._root
		}
		Stonecrop._root = this
		this.name = 'Stonecrop'
		this.schema = schema
		this.events = events
		this.hooks = new OrderedSet(hooks)
		this.value = value
		this.registry = new Map()
		// 
		return new Proxy(this, {
			get: (object, key, proxy) => {
				if (['schema', 'events', 'hooks', 'value'].indexOf(key) == -1) {
					return this.registry[key]
				} else {
					return this[key]
				}
			}
		})
	}
	addDoctype(doctype){
		this.registry = this.registry.update(doctype.name, doctype)
	}
}
