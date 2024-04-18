import { Router } from 'vue-router'

import DoctypeMeta from '@/doctype'

export default class Registry {
	static _root: Registry
	name: string
	router: Router
	registry: Record<string, DoctypeMeta>
	getMeta?: (doctype: string) => DoctypeMeta | Promise<DoctypeMeta>

	constructor(router: Router, getMeta?: (doctype: string) => DoctypeMeta | Promise<DoctypeMeta>) {
		if (Registry._root) {
			return Registry._root
		}
		Registry._root = this
		this.name = 'Registry'
		this.router = router
		this.registry = {}
		this.getMeta = getMeta
	}

	addDoctype(doctype: DoctypeMeta) {
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
