import { Router } from 'vue-router'

import DoctypeMeta from './doctype'

/**
 * Stonecrop Registry class
 * @public
 */
export default class Registry {
	/**
	 * The root Registry instance
	 */
	static _root: Registry

	/**
	 * The name of the Registry instance
	 *
	 * @defaultValue 'Registry'
	 */
	name: string

	/**
	 * The Vue router instance
	 * @see {@link https://router.vuejs.org/}
	 */
	router: Router

	/**
	 * The registry property contains a collection of doctypes
	 * @see {@link DoctypeMeta}
	 */
	registry: Record<string, DoctypeMeta>

	/**
	 * The getMeta function fetches doctype metadata from an API
	 * @see {@link DoctypeMeta}
	 */
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

	/**
	 * Get doctype metadata
	 * @param doctype - The doctype to fetch metadata for
	 * @returns The doctype metadata
	 * @see {@link DoctypeMeta}
	 */
	addDoctype(doctype: DoctypeMeta) {
		if (!(doctype.doctype in Object.keys(this.registry))) {
			this.registry[doctype.slug] = doctype
		}
		if (!this.router.hasRoute(doctype.doctype) && doctype.component) {
			this.router.addRoute({
				path: `/${doctype.slug}`,
				name: doctype.slug,
				component: doctype.component,
			})
		}
	}
}
