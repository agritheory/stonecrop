import { Router } from 'vue-router'

import Doctype from '@/doctype'

export default class Registry {
	static _root: any
	name: string
	router: Router
	registry: Record<string, Doctype>
	doctypeLoader: (doctype: string) => Doctype | Promise<Doctype>

	constructor(router: Router, doctypeLoader: (doctype: string) => Doctype | Promise<Doctype> = undefined) {
		if (Registry._root) {
			return Registry._root
		}
		Registry._root = this
		this.name = 'Registry'
		this.router = router
		this.registry = {}
		this.doctypeLoader = doctypeLoader
	}

	addDoctype(doctype: Doctype) {
		if (!(doctype.doctype in Object.keys(this.registry))) {
			this.registry[doctype.slug] = doctype
		}
		if (!this.router.hasRoute(doctype.doctype)) {
			this.router.addRoute({
				path: `/${doctype.slug}`,
				name: doctype.slug,
				component: doctype.component,
			})
		}
	}
}
