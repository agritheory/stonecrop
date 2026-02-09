import { Router } from 'vue-router'

import DoctypeMeta from './doctype'
import { getGlobalTriggerEngine } from './field-triggers'
import { RouteContext } from './types/registry'

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

	/**
	 * Creates a new Registry instance (singleton pattern)
	 * @param router - Optional Vue router instance for route management
	 * @param getMeta - Optional function to fetch doctype metadata from an API
	 */
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

	/**
	 * Recursively preload schemas for nested Doctype fields
	 * @param doctypeSlug - The doctype slug to preload nested schemas for
	 * @param visited - Set of already visited doctype slugs to prevent circular dependencies
	 * @returns Promise that resolves when all nested schemas are loaded
	 */
	async preloadNestedSchemas(doctypeSlug: string, visited: Set<string> = new Set()): Promise<void> {
		// Prevent circular dependencies
		if (visited.has(doctypeSlug)) {
			return
		}
		visited.add(doctypeSlug)

		// Get the doctype metadata
		const doctype = this.registry[doctypeSlug]
		if (!doctype) {
			console.warn(`Doctype '${doctypeSlug}' not found in registry`)
			return
		}

		// Find all Doctype fields in the schema
		const schemaArray = doctype.schema
			? Array.isArray(doctype.schema)
				? doctype.schema
				: Array.from(doctype.schema)
			: []
		const doctypeFields = schemaArray.filter(field => 'fieldtype' in field && field.fieldtype === 'Doctype')

		// Load schemas for nested doctypes
		for (const field of doctypeFields) {
			if ('options' in field && typeof field.options === 'string') {
				const nestedDoctypeSlug = field.options

				// If nested doctype not in registry and getMeta function exists, load it
				if (!this.registry[nestedDoctypeSlug] && this.getMeta) {
					try {
						const nestedMeta = await this.getMeta({
							doctype: nestedDoctypeSlug,
							path: '',
							segments: [],
						} as RouteContext)
						this.addDoctype(nestedMeta)
					} catch (error) {
						console.error(`Failed to load nested doctype '${nestedDoctypeSlug}':`, error)
						continue
					}
				}

				// Recursively preload schemas for this nested doctype
				await this.preloadNestedSchemas(nestedDoctypeSlug, visited)
			}
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
