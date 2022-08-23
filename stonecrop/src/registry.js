export class Registry {
	constructor(schemaLoader){
		// singleton
		if(Registry._root){
			return Registry._root
		}
		Registry._root = this
		this.name = 'Registry'
		this.schemaLoader = schemaLoader
		
		// NOTE: I don't think this is needed
		// return new Proxy(this, {
		// 	get: (object, key, proxy) => {
		// 		if (['schema', 'events', 'hooks', 'value'].indexOf(key) == -1) {
		// 			return this.schema[key]
		// 		} else {
		// 			return this[key]
		// 		}
		// 	}
		// })
	}
	loadDoctypeSchema(doctype){ // doctype class
		if(doctype.schemaLoader){
			return doctype.schemaLoader()
		}
		return this.schemaLoader(doctype.doctype)
	}
	addDoctype(doctype){ // Doctype class
		if(!doctype.doctype in this){
			doctype.registry = this
			this[doctype.doctype] = doctype
		}
	}
}
