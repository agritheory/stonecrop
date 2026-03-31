import type { SchemaTypes } from '@stonecrop/aform'
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
	readonly name: string

	/**
	 * The registry property contains a collection of doctypes
	 * @see {@link Doctype}
	 */
	readonly registry: Record<string, Doctype>

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
		this.name = 'Registry'
		this.registry = {}
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
	 * @remarks
	 * Walks the schema array and for each field with `fieldtype: 'Doctype'` and a string
	 * `options` value, looks up the referenced doctype in the registry and:
	 *
	 * - If `cardinality: 'many'`: auto-derives `columns` from the child doctype's schema,
	 *   sets `component: 'ATable'`, `config: { view: 'list' }`, and initializes `rows: []`.
	 * - Otherwise (default/`cardinality: 'one'`): embeds the child schema as the field's
	 *   `schema` property for 1:1 nested forms.
	 *
	 * Recurses for deeply nested doctypes. Circular references are protected against.
	 *
	 * Returns a new array — does not mutate the original schema.
	 *
	 * @param schema - The schema array to resolve
	 * @returns A new schema array with nested Doctype fields resolved
	 *
	 * @example
	 * ```ts
	 * registry.addDoctype(addressDoctype)
	 * registry.addDoctype(customerDoctype)
	 *
	 * // Before: customer schema has { fieldname: 'address', fieldtype: 'Doctype', options: 'address' }
	 * const resolved = registry.resolveSchema(customerSchema)
	 * // After: address field now has schema: [...address fields...]
	 * ```
	 *
	 * @public
	 */
	resolveSchema(schema: SchemaTypes[], visited?: Set<string>): SchemaTypes[] {
		const seen = visited || new Set<string>()

		return schema.map(field => {
			// Check for Doctype fieldtype with a string options (slug reference)
			if (
				'fieldtype' in field &&
				field.fieldtype === 'Doctype' &&
				'options' in field &&
				typeof field.options === 'string'
			) {
				const doctypeSlug = field.options

				// Circular reference protection
				if (seen.has(doctypeSlug)) {
					return { ...field }
				}

				const doctype = this.registry[doctypeSlug]
				if (doctype && doctype.schema) {
					// Convert Immutable.List to plain array if needed
					const childSchema: SchemaTypes[] = Array.isArray(doctype.schema) ? doctype.schema : Array.from(doctype.schema)

					// Check cardinality to determine handling
					const cardinality = 'cardinality' in field ? field.cardinality : undefined

					if (cardinality === 'many') {
						// 1:many child table - derive columns, set component, config, rows
						const resolved: Record<string, any> = { ...field }

						// Auto-derive columns from child schema fields if not already provided
						if (!('columns' in field) || !field.columns) {
							resolved.columns = childSchema.map(childField => ({
								name: childField.fieldname,
								fieldname: childField.fieldname,
								label: ('label' in childField && childField.label) || childField.fieldname,
								fieldtype: 'fieldtype' in childField ? childField.fieldtype : 'Data',
								align: ('align' in childField && childField.align) || 'left',
								edit: 'edit' in childField ? childField.edit : true,
								width: ('width' in childField && childField.width) || '20ch',
							}))
						}

						// Set default component if not already specified
						if (!resolved.component) {
							resolved.component = 'ATable'
						}

						// Set default config if not already specified
						if (!('config' in field) || !field.config) {
							resolved.config = { view: 'list' }
						}

						// Initialize rows to empty array so componentProps fallback
						// routes data from the form's dataModel[fieldname]
						if (!('rows' in field) || !field.rows) {
							resolved.rows = []
						}

						return resolved as SchemaTypes
					} else {
						// 1:1 nested form (default cardinality: 'one')
						// Recurse into child schema to resolve deeply nested doctypes
						seen.add(doctypeSlug)
						const resolvedChild = this.resolveSchema(childSchema, seen)
						seen.delete(doctypeSlug)

						return { ...field, schema: resolvedChild }
					}
				}
			}

			return { ...field }
		})
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
	 * - Doctype with `cardinality: 'many'` → `[]`
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
			const fieldtype = 'fieldtype' in field ? (field.fieldtype as string) : 'Data'

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
				case 'Doctype': {
					// Check cardinality to determine initial value
					const cardinality = 'cardinality' in field ? field.cardinality : undefined
					if (cardinality === 'many') {
						// 1:many child table - initialize as empty array
						record[field.fieldname] = []
					} else if ('schema' in field && Array.isArray(field.schema)) {
						// 1:1 nested form with resolved schema - recursively initialize
						record[field.fieldname] = this.initializeRecord(field.schema)
					} else {
						// 1:1 without resolved schema - empty object
						record[field.fieldname] = {}
					}
					break
				}
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
