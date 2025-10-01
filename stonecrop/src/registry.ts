import { Router } from 'vue-router'

import DoctypeMeta from './doctype'
import { getGlobalTriggerEngine } from './field-triggers'

/**
 * Route context passed to getMeta function
 * @public
 */
export interface RouteContext {
	/** The full route path (e.g., "/todo/1" or "/todo") */
	path: string
	/** Path segments split by "/" (e.g., ["todo", "1"] or ["todo"]) */
	segments: string[]
}

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
	readonly name: string

	/**
	 * The registry property contains a collection of doctypes
	 * @see {@link DoctypeMeta}
	 */
	readonly registry: Record<string, DoctypeMeta>

	/**
	 * The Vue router instance
	 * @see {@link https://router.vuejs.org/}
	 */
	readonly router?: Router

	constructor(router?: Router, getMeta?: (routeContext: RouteContext) => DoctypeMeta | Promise<DoctypeMeta>) {
		if (Registry._root) {
			return Registry._root
		}
		Registry._root = this
		this.name = 'Registry'
		this.registry = {}
		this.router = router
		this.getMeta = getMeta
	}

	/**
	 * The getMeta function fetches doctype metadata from an API based on route context
	 * @see {@link DoctypeMeta}
	 */
	getMeta?: (routeContext: RouteContext) => DoctypeMeta | Promise<DoctypeMeta>

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

		// Register actions (including field triggers) with the field trigger engine
		const triggerEngine = getGlobalTriggerEngine()
		// Register under both doctype name and slug to handle different lookup patterns
		triggerEngine.registerDoctypeActions(doctype.doctype, doctype.actions)
		if (doctype.slug !== doctype.doctype) {
			triggerEngine.registerDoctypeActions(doctype.slug, doctype.actions)
		}

		if (doctype.component && this.router && !this.router.hasRoute(doctype.doctype)) {
			this.router.addRoute({
				path: `/${doctype.slug}`,
				name: doctype.slug,
				component: doctype.component,
			})
		}
	}

	// TODO: should we allow clearing the registry at all?
	// clear() {
	// 	this.registry = {}
	// 	if (this.router) {
	// 		const routes = this.router.getRoutes()
	// 		for (const route of routes) {
	// 			if (route.name) {
	// 				this.router.removeRoute(route.name)
	// 			}
	// 		}
	// 	}
	// }
}
