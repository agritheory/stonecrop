import type { ResolvedField, ResolvedLink, ResolvedScalar, ResolvedTable, ResolvedFieldset } from '@stonecrop/aform'
import { resolvedFieldsToColumns } from '@stonecrop/aform'
import type { DoctypeField, LinkDeclaration, TableViewConfig, ValueField } from '@stonecrop/schema'
import { componentCategory, componentLinkExpansion, resolveLinkRenderMode } from '@stonecrop/schema'
import { Router } from 'vue-router'

import Doctype from './doctype'
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
		return this
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

		// Field triggers are registered imperatively, by the app, via the FieldTriggerEngine's own
		// `registerDoctypeActions`. A doctype used to be able to declare them too, but that path
		// could not survive the wire — neither the Zod gate nor the SDL carries such a map — so it
		// only ever worked for a host bypassing both, and it left two public `runAction` methods
		// meaning opposite things. Registering here would also overwrite an app's imperative
		// registration, since `registerDoctypeActions` sets the maps even when handed nothing.

		if (doctype.component && this.router && !this.router.hasRoute(doctype.doctype)) {
			this.router.addRoute({
				path: `/${doctype.slug}`,
				name: doctype.slug,
				component: doctype.component,
			})
		}
	}

	/**
	 * Resolve a Doctype's authoring schema into a rendered schema array suitable for AForm.
	 *
	 * Transforms `DoctypeField[]` (authoring space) → `ResolvedField[]` (rendering space):
	 * - `kind: 'field'` (not Link) → `ResolvedScalar`
	 * - `kind: 'field'` (Link, no declaration) → `ResolvedScalar` with `component: 'AFormLink'`
	 * - `kind: 'field'` (Link, `noneOrMany`/`atLeastOne`) → `ResolvedTable`
	 * - `kind: 'field'` (Link, `one`/`atMostOne`) → `ResolvedLink`
	 * - `kind: 'fieldset'` → `ResolvedFieldset` (children resolved recursively)
	 * - `kind: 'table'` → `ResolvedTable` (columns as `ColumnSchema[]`)
	 *
	 * Circular references are protected against via the `visited` set.
	 *
	 * @param doctype - The doctype to resolve
	 * @param visited - Internal — set of already-visited doctype slugs for cycle detection
	 * @returns A resolved schema array ready for AForm
	 *
	 * @public
	 */
	resolveSchema(doctype: Doctype, visited?: Set<string>): ResolvedField[] {
		const seen = visited ?? new Set<string>()
		const slug = doctype.slug

		// Prevent circular resolution — return all ValueField entries as scalars (link not expanded)
		if (seen.has(slug)) {
			const fallback: DoctypeField[] = doctype.schema ? doctype.schema.toArray() : []
			return fallback
				.filter((f): f is ValueField => f.kind === 'field')
				.map(({ cardinality: _c, ...rest }): ResolvedScalar => rest)
		}
		seen.add(slug)

		const schemaArray: DoctypeField[] = doctype.schema ? doctype.schema.toArray() : []

		// Map link declarations by fieldname (link.fieldname ?? key)
		const linksByFieldname = new Map<string, LinkDeclaration>()
		if (doctype.links) {
			for (const [key, link] of Object.entries(doctype.links)) {
				linksByFieldname.set(link.fieldname ?? key, link)
			}
		}

		const result = this.resolveFields(schemaArray, linksByFieldname, seen)
		seen.delete(slug)
		return result
	}

	/**
	 * Recursively resolve a `DoctypeField[]` using the provided link context.
	 * Called by `resolveSchema` and recursively for fieldset children.
	 * @internal
	 */
	private resolveFields(
		fields: DoctypeField[],
		links: Map<string, LinkDeclaration>,
		visited: Set<string>
	): ResolvedField[] {
		const resolved: ResolvedField[] = []

		for (const field of fields) {
			// A field is a link when it carries `doctype` (the marker) or has a LinkDeclaration.
			const linkDecl = field.kind === 'field' ? links.get(field.fieldname) : undefined
			if (field.kind === 'field' && (linkDecl || field.doctype)) {
				const link = linkDecl
				// The declaration's target wins over the field's own `doctype`.
				const linkTarget = link?.target ?? field.doctype

				// An undeclared link, or a declared one whose component renders an inline picker,
				// stays a scalar: the target is not expanded, it only needs the slug for async
				// display-text resolution and navigation.
				if (!link || resolveLinkRenderMode(link, field.component) === 'inline') {
					const { cardinality: _c, ...rest } = field
					resolved.push({
						...rest,
						component: rest.component || 'AFormLink',
						...(linkTarget !== undefined ? { doctype: linkTarget } : {}),
					})
					continue
				}

				const targetDoctype = this.registry[link.target]
				if (!targetDoctype) {
					// Target not registered — copy as scalar
					const { cardinality: _c, ...rest } = field
					resolved.push({ ...rest })
					continue
				}

				const childSchema = this.resolveSchema(targetDoctype, new Set(visited))
				const { options: _opt, cardinality: _card, kind: _kind, ...fieldRest } = field

				if (resolveLinkRenderMode(link, field.component) === 'table') {
					resolved.push(this.buildTableConfig(field, childSchema, link.component))
				} else {
					const linkEntry: ResolvedLink = {
						...fieldRest,
						kind: 'link',
						label: fieldRest.label || field.fieldname,
						component: link.component || fieldRest.component || 'AForm',
						schema: childSchema,
					}
					resolved.push(linkEntry)
				}
			} else if (field.kind === 'fieldset') {
				const resolvedChildren = this.resolveFields(field.schema, links, visited)
				const { schema: _s, ...fieldRest } = field
				const fieldsetEntry: ResolvedFieldset = {
					...fieldRest,
					schema: resolvedChildren,
				}
				resolved.push(fieldsetEntry)
			} else if (field.kind === 'table') {
				// Inline table — columns become ColumnSchema[], add default config
				const { columns, config, ...fieldRest } = field
				const tableEntry: ResolvedTable = {
					...fieldRest,
					kind: 'table',
					component: fieldRest.component || 'ATable',
					schema: columns,
					config: config ?? { view: 'list' },
				}
				resolved.push(tableEntry)
			} else {
				// Scalar field (kind: 'field', not a link) — strip cardinality.
				// A link-rendering component with nothing to point at renders an empty picker (or an
				// empty embedded form), which is indistinguishable from "the record has no value".
				// Link-ness comes from `doctype`/`links`, so this is a field that named a link
				// component and forgot the target.
				if (field.kind === 'field' && componentLinkExpansion(field.component)) {
					console.warn(
						`[Stonecrop] Field "${field.fieldname}" renders with "${field.component}", which is a link component, ` +
							`but the field is not a link: it has no \`doctype\` and no \`links\` declaration. It will render ` +
							`as a plain field. Add \`"doctype": "<doctype-slug>"\` to the field definition.`
					)
				}
				const { cardinality: _c, ...rest } = field
				resolved.push({ ...rest })
			}
		}

		return resolved
	}

	/**
	 * Build a `ResolvedTable` from a resolved Link field with many cardinality.
	 * Columns come from {@link @stonecrop/aform#resolvedFieldsToColumns}, the shared definition of
	 * which resolved fields a cell can render.
	 * @internal
	 */
	private buildTableConfig(field: ValueField, childSchema: ResolvedField[], component?: string): ResolvedTable {
		const columns = resolvedFieldsToColumns(childSchema)

		const config: TableViewConfig = (field as ValueField & { config?: TableViewConfig }).config ?? { view: 'list' }
		const { options: _opt, cardinality: _card, ...fieldRest } = field

		return {
			...fieldRest,
			kind: 'table',
			label: fieldRest.label || field.fieldname,
			component: component || fieldRest.component || 'ATable',
			schema: columns,
			config,
		}
	}

	/**
	 * Initialize a new record with default values based on a resolved schema.
	 * Narrows by `kind` discriminator for precise branch selection.
	 *
	 * - `kind: 'table'` or `kind: 'link'` → `[]` or `{}`
	 * - `kind: 'fieldset'` → recursively initializes children as `{}`
	 * - `kind: 'field'` → derives the default from the component's category; falls back to `null`
	 *
	 * @param schema - The resolved schema array to derive defaults from
	 * @returns A plain object with default values for each field
	 * @public
	 */
	initializeRecord(schema: ResolvedField[]): Record<string, any> {
		const record: Record<string, any> = {}

		for (const field of schema) {
			if (field.kind === 'table') {
				record[field.fieldname] = []
			} else if (field.kind === 'link') {
				record[field.fieldname] = this.initializeRecord(field.schema)
			} else if (field.kind === 'fieldset') {
				record[field.fieldname] = this.initializeRecord(field.schema)
			} else {
				// kind: 'field' — the empty default comes from the component's category.
				const fieldDefault = field.default
				if (fieldDefault !== undefined) {
					record[field.fieldname] = fieldDefault
				} else {
					const category = componentCategory(field.component)
					if (category === 'text') {
						record[field.fieldname] = ''
					} else if (category === 'number') {
						record[field.fieldname] = 0
					} else if (category === 'boolean') {
						record[field.fieldname] = false
					} else if (category === 'code' && field.language) {
						// A JSON editor starts from an empty object; any other language from empty source.
						record[field.fieldname] = field.language === 'json' ? {} : ''
					} else {
						// date / datetime / select / link / attach — plus two cases with no better answer
						// than "no value": an unknown (custom) component, and a code field whose missing
						// `language` doesn't say which kind of empty it wants.
						record[field.fieldname] = null
					}
				}
			}
		}

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

		return Object.entries(doctype.links).map(([fieldname, link]) =>
			Object.assign({}, link, {
				fieldname,
			})
		)
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
