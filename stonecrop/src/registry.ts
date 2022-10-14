import { Router } from 'vue-router'

import Doctype from '@/doctype'
import { Schema } from 'types/index'

export default class Registry {
	static _root: any
	name: string
	router: Router
	registry: Record<string, Doctype>
	schemaLoader: (doctype: string) => Schema | Promise<Schema>

	constructor(router: Router, schemaLoader: (doctype: string) => Schema | Promise<Schema> = undefined) {
		if (Registry._root) {
			return Registry._root
		}
		Registry._root = this
		this.name = 'Registry'
		this.router = router
		this.registry = {}
		this.schemaLoader = schemaLoader
	}

	loadDoctypeSchema(doctype: Doctype) {
		if (doctype.schemaLoader) {
			return doctype.schemaLoader()
		}
		return this.schemaLoader(doctype.doctype)
	}

	addDoctype(doctype: Doctype) {
		if (!(doctype.doctype in Object.keys(this.registry))) {
			this.registry[doctype.slug] = doctype
		}
		if (!this.router.hasRoute(doctype.doctype)) {
			this.router.addRoute({
				path: `/${doctype.slug}`,
				name: doctype.slug,
				component: doctype.schema.component,
			})
		}
	}
}
