import { Router } from 'vue-router'

import Records from '@/components/Records.vue'
import Doctype from '@/components/Doctype.vue'
import { default as DoctypeClass } from '@/doctype'
import { Schema } from 'types/index'

export default class Registry {
	static _root: any
	name: string
	router: Router
	schemaLoader: (doctype: string) => Schema
	registry: Record<string, unknown>

	constructor(router: Router, schemaLoader: () => Schema = undefined) {
		// type: Vue router, function or undefined
		// singleton
		if (Registry._root) {
			return Registry._root
		}
		Registry._root = this
		this.name = 'Registry'
		this.router = router
		this.schemaLoader = schemaLoader
		this.registry = {}
	}

	loadDoctypeSchema(doctype: DoctypeClass) {
		// type: Doctype class
		if (doctype.schemaLoader) {
			return doctype.schemaLoader()
		}
		return this.schemaLoader(doctype.doctype)
	}

	addDoctype(doctype: DoctypeClass) {
		// type: Doctype class
		if (!(doctype.doctype in Object.keys(this.registry))) {
			this.registry[doctype.slug] = doctype
		}
		if (!this.router.hasRoute(doctype.doctype)) {
			this.router.addRoute({
				path: `/${doctype.slug}`,
				name: doctype.slug,
				component: doctype.schema.recordsComponent || Records,
			})
			this.router.addRoute({
				path: `/${doctype.slug}/:id`,
				component: doctype.schema.component || Doctype,
			})
		}
	}
}
