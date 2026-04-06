import type { SchemaTypes, TableSchema } from '@stonecrop/aform'
import type { LinkDeclaration } from '@stonecrop/schema'
import { Router } from 'vue-router'

import Doctype from './doctype'
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
	readonly name: string = 'Registry'

	/**
	 * The registry property contains a collection of doctypes
	 *
	 * @defaultValue `{}`
	 * @see {@link Doctype}
	 */
	readonly registry: Record<string, Doctype> = {}

	/**
	 * Reverse index: backlink fieldname → list of \{ doctype slug, link fieldname \}.
	 * Multiple doctypes can declare a link with the same backlink name, so each key
	 * maps to an array. Built at schema load time for O(1) ancestor lookups.
	 *
	 * @defaultValue `new Map()`
	 * @internal
	 */
	private _ancestorIndex: Map<string, Array<{ slug: string; fieldname: string }>> = new Map()

	/**
	 * Whether the ancestor index needs rebuilding
	 *
	 * @defaultValue `true`
	 * @internal
	 */
	private _ancestorIndexDirty: boolean = true

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
	constructor(router?: Router, getMeta?: (routeContext: RouteContext) => Doctype | Promise<Doctype>) {
		if (Registry._root) {
			return Registry._root
		}
		Registry._root = this
		this.router = router
		this.getMeta = getMeta
	}

	/**
	 * The getMeta function fetches doctype metadata from an API based on route context
	 * @see {@link Doctype}
	 */
	getMeta?: (routeContext: RouteContext) => Doctype | Promise<Doctype>

	/**
	 * Get doctype metadata
	 * @param doctype - The doctype to fetch metadata for
	 * @returns The doctype metadata
	 * @see {@link Doctype}
	 */
	addDoctype(doctype: Doctype) {
		if (!(doctype.slug in this.registry)) {
			this.registry[doctype.slug] = doctype
			this._ancestorIndexDirty = true
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
	 * Resolve nested Doctype fields in a schema by embedding child schemas inline.
	 *
	 * Accepts a Doctype and extracts `fields`, `links`, and `layout` internally.
	 * For each link:
	 *
	 * - `cardinality: 'noneOrMany'` or `'atLeastOne'`: auto-derives `columns` from the target's schema,
	 *   sets `component` to `link.component ?? 'ATable'`, `config: { view: 'list' }`, `rows: []`.
	 * - `cardinality: 'one'` or `'atMostOne'`: embeds the target schema as the entry's
	 *   `schema` property, sets `component` to `link.component ?? 'AForm'`.
	 *
	 * If `layout` is provided, reorders the resolved output to match.
	 * Recurses for deeply nested doctypes. Circular references are protected against.
	 * Returns a new array — does not mutate the original.
	 *
	 * @param doctype - The doctype to resolve
	 * @param visited - Internal — set of already-visited doctype slugs for cycle detection
	 * @returns A new schema array with nested links resolved
	 *
	 * @public
	 */
	resolveSchema(doctype: Doctype, visited?: Set<string>): SchemaTypes[] {
		const seen = visited ?? new Set<string>()
		const slug = doctype.slug

		// Prevent circular resolution
		if (seen.has(slug)) {
			return doctype.schema ? (Array.isArray(doctype.schema) ? doctype.schema : Array.from(doctype.schema)) : []
		}
		seen.add(slug)

		// Convert schema to array (scalar/renderable fields only — no link fields)
		const schemaArray: SchemaTypes[] = doctype.schema
			? Array.isArray(doctype.schema)
				? doctype.schema
				: Array.from(doctype.schema)
			: []

		// 1. Copy scalar fields as-is
		const resolvedFields = schemaArray.map(field => ({ ...field }))

		// 2. Process links — add resolved schema entries for each link
		const linkEntries: SchemaTypes[] = []
		if (doctype.links) {
			for (const [fieldname, link] of Object.entries(doctype.links)) {
				const targetDoctype = this.registry[link.target]
				if (!targetDoctype) continue

				const childSchema = this.resolveSchema(targetDoctype, seen)

				if (link.cardinality === 'noneOrMany' || link.cardinality === 'atLeastOne') {
					const entry = this.buildTableConfig({ fieldname, label: fieldname }, childSchema, link.component)
					linkEntries.push(entry)
				} else {
					linkEntries.push({
						fieldname,
						label: fieldname,
						component: link.component || 'AForm',
						schema: childSchema,
					})
				}
			}
		}

		// 3. Combine and apply layout ordering
		const allEntries = [...resolvedFields, ...linkEntries]

		seen.delete(slug)

		if (doctype.layout) {
			const byFieldname = new Map<string, SchemaTypes>()
			for (const entry of allEntries) {
				if ('fieldname' in entry) {
					byFieldname.set(entry.fieldname, entry)
				}
			}
			return doctype.layout
				.map(name => byFieldname.get(name))
				.filter((entry): entry is SchemaTypes => entry !== undefined)
		}

		return allEntries
	}

	/**
	 * Build an ATable configuration from a field and child schema
	 * @internal
	 */
	private buildTableConfig(field: Record<string, any>, childSchema: SchemaTypes[], component?: string): TableSchema {
		const resolved: TableSchema = {
			fieldname: field.fieldname,
			component: component || field.component || 'ATable',
			columns: field.columns,
			config: field.config,
			rows: field.rows,
		}

		if (!resolved.columns) {
			resolved.columns = childSchema
				.filter(childField => 'fieldtype' in childField)
				.map(childField => ({
					name: childField.fieldname,
					label: ('label' in childField && childField.label) || childField.fieldname,
					fieldtype: 'fieldtype' in childField ? childField.fieldtype : 'Data',
					align: 'align' in childField ? childField.align : 'left',
					edit: 'edit' in childField ? childField.edit : true,
					width: ('width' in childField && childField.width) || '20ch',
				}))
		}

		if (!resolved.config) {
			resolved.config = { view: 'list' }
		}

		if (!resolved.rows) {
			resolved.rows = []
		}

		return resolved
	}

	/**
	 * Initialize a new record with default values based on a schema.
	 *
	 * @remarks
	 * Creates a plain object with keys from the schema's fieldnames and default values
	 * derived from each field's `fieldtype`:
	 * - Data, Text → `''`
	 * - Check → `false`
	 * - Int, Float, Decimal, Currency, Quantity → `0`
	 * - JSON → `{}`
	 * - Doctype with `cardinality: 'noneOrMany'` or `'atLeastOne'` → `[]`
	 * - Doctype without `cardinality` or `cardinality: 'one'` → recursively initializes nested record
	 * - All others → `null`
	 *
	 * For Doctype fields with a resolved `schema` array (cardinality: 'one'), recursively
	 * initializes the nested record.
	 *
	 * @param schema - The schema array to derive defaults from
	 * @returns A plain object with default values for each field
	 *
	 * @example
	 * ```ts
	 * const defaults = registry.initializeRecord(addressSchema)
	 * // { street: '', city: '', state: '', zip_code: '' }
	 * ```
	 *
	 * @public
	 */
	initializeRecord(schema: SchemaTypes[]): Record<string, any> {
		const record: Record<string, any> = {}

		schema.forEach(field => {
			const fieldtype = 'fieldtype' in field ? field.fieldtype : 'Data'
			const cardinality = 'cardinality' in field ? field.cardinality : undefined

			// 1:many — cardinality signals an array
			if (cardinality === 'noneOrMany' || cardinality === 'atLeastOne') {
				record[field.fieldname] = []
				return
			}

			// Resolved 1:many table entry — has rows property
			if ('rows' in field) {
				record[field.fieldname] = []
				return
			}

			// Resolved 1:1 link entry — has schema property (e.g., FieldsetSchema with nested schema)
			if ('schema' in field && Array.isArray(field.schema)) {
				record[field.fieldname] = this.initializeRecord(field.schema)
				return
			}

			switch (fieldtype) {
				case 'Data':
				case 'Text':
				case 'Code':
					record[field.fieldname] = ''
					break
				case 'Check':
					record[field.fieldname] = false
					break
				case 'Int':
				case 'Float':
				case 'Decimal':
				case 'Currency':
				case 'Quantity':
					record[field.fieldname] = 0
					break
				case 'JSON':
					record[field.fieldname] = {}
					break
				default:
					record[field.fieldname] = null
			}
		})

		return record
	}

	/**
	 * Get a registered doctype by slug
	 * @param slug - The doctype slug to look up
	 * @returns The Doctype instance if found, or undefined
	 * @public
	 */
	getDoctype(slug: string): Doctype | undefined {
		return this.registry[slug]
	}

	/**
	 * Get all links declared on a doctype.
	 *
	 * @param doctypeSlug - The doctype slug to get links for
	 * @returns Array of link declarations with fieldname, or empty array if none
	 *
	 * @example
	 * ```ts
	 * const links = registry.getDescendantLinks('recipe')
	 * // [{ fieldname: 'tasks', target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' }]
	 * ```
	 *
	 * @public
	 */
	getDescendantLinks(doctypeSlug: string): Array<LinkDeclaration & { fieldname: string }> {
		const doctype = this.registry[doctypeSlug]
		if (!doctype?.links) return []

		return Object.entries(doctype.links).map(([fieldname, link]) => ({
			...link,
			fieldname,
		}))
	}

	/**
	 * Get links on other doctypes that target the given doctype.
	 *
	 * @param doctypeSlug - The doctype slug to find ancestor links for
	 * @returns Array of link declarations with fieldname and declaring doctype slug, or empty array
	 *
	 * @example
	 * ```ts
	 * const ancestors = registry.getAncestorLinks('recipe-task')
	 * // [{ fieldname: 'tasks', target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe', doctype: 'recipe' }]
	 * ```
	 *
	 * @public
	 */
	getAncestorLinks(doctypeSlug: string): Array<LinkDeclaration & { fieldname: string; doctype: string }> {
		this._ensureAncestorIndex()

		const results: Array<LinkDeclaration & { fieldname: string; doctype: string }> = []

		for (const [_backlink, entries] of this._ancestorIndex) {
			for (const { slug: declaringSlug, fieldname } of entries) {
				const declaringDoctype = this.registry[declaringSlug]
				if (!declaringDoctype?.links) continue

				const link = declaringDoctype.links[fieldname]
				if (link?.target === doctypeSlug) {
					results.push({
						...link,
						fieldname,
						doctype: declaringSlug,
					})
				}
			}
		}

		return results
	}

	/**
	 * Ensure the ancestor index is up to date
	 * @internal
	 */
	private _ensureAncestorIndex(): void {
		if (!this._ancestorIndexDirty) return
		this._ancestorIndexDirty = false
		this._ancestorIndex.clear()

		for (const [slug, doctype] of Object.entries(this.registry)) {
			if (!doctype.links) continue
			for (const [fieldname, link] of Object.entries(doctype.links)) {
				if (link.backlink) {
					const existing = this._ancestorIndex.get(link.backlink)
					if (existing) {
						existing.push({ slug, fieldname })
					} else {
						this._ancestorIndex.set(link.backlink, [{ slug, fieldname }])
					}
				}
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
