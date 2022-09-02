import Records from '@/components/Records.vue'
import Doctype from '@/components/Doctype.vue'

export default class Registry {
	constructor(router, schemaLoader = undefined) {
		// type: Vue router, function or undefined
		// singleton
		if (Registry._root) {
			return Registry._root
		}
		Registry._root = this
		this.name = 'Registry'
		this.router = router
		this.schemaLoader = schemaLoader
	}
	loadDoctypeSchema(doctype) {
		// type: doctype class
		if (doctype.schemaLoader) {
			return doctype.schemaLoader()
		}
		return this.schemaLoader(doctype.doctype)
	}
	addDoctype(doctype) {
		// type: Doctype class
		if (!doctype.doctype in this) {
			doctype.registry = this
			this[doctype.doctype] = doctype
		}
		if (!this.router.hasRoute(doctype.slug)) {
			router.addRoute({
				path: `/${doctype.slug}`,
				name: doctype.slug,
				component: doctype.schema.recordsComponent || Records,
			})
			router.addRoute({ path: `/${doctype.slug}:id`, component: doctype.schema.component || Doctype })
		}
	}
}
