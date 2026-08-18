import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { parseDoctype, validateDoctype } from '@stonecrop/schema'
import type { DoctypeMeta, ValidationError } from '@stonecrop/schema'

import { columnBackedFields, flattenFields } from '../fields'

const doctypeRegistry: Map<string, DoctypeMeta> = new Map()

/**
 * Error thrown when a doctype definition fails validation
 * @public
 */
export class DoctypeValidationError extends Error {
	constructor(
		/** File path or name where the validation error occurred */
		public readonly file: string,
		/** List of validation errors found */
		public readonly errors: ValidationError[]
	) {
		const errorMessages = errors.map(e => `  ${e.path.join('.')}: ${e.message}`).join('\n')
		super(`Invalid doctype definition in ${file}:\n${errorMessages}`)
		this.name = 'DoctypeValidationError'
	}
}

/**
 * Options for loading doctype definitions
 * @public
 */
export interface LoadDoctypesOptions {
	/** Continue loading other files if one fails validation */
	continueOnError?: boolean
	/** Callback for validation errors when continueOnError is true */
	onError?: (file: string, errors: ValidationError[]) => void
}

/**
 * Load doctype definitions from a directory of JSON files
 * @param dir - Directory path containing doctype JSON files
 * @param options - Options for loading doctypes (continueOnError, onError callback)
 * @public
 */
export function loadDoctypes(dir: string, options: LoadDoctypesOptions = {}): void {
	const entries = readdirSync(dir)

	for (const entry of entries) {
		const fullPath = join(dir, entry)
		const stat = statSync(fullPath)

		if (stat.isDirectory()) {
			loadDoctypes(fullPath, options)
		} else if (entry.endsWith('.json')) {
			loadDoctypeFile(fullPath, options)
		}
	}
}

/**
 * Load and validate a single doctype file
 */
function loadDoctypeFile(filePath: string, options: LoadDoctypesOptions): void {
	const content = readFileSync(filePath, 'utf-8')
	let data: unknown

	try {
		data = JSON.parse(content)
	} catch (err) {
		const parseError: ValidationError = {
			path: [],
			message: `Invalid JSON: ${err instanceof Error ? err.message : String(err)}`,
		}

		if (options.continueOnError) {
			options.onError?.(filePath, [parseError])
			return
		}
		throw new DoctypeValidationError(filePath, [parseError])
	}

	const result = validateDoctype(data)

	if (!result.success) {
		if (options.continueOnError) {
			options.onError?.(filePath, result.errors)
			return
		}
		throw new DoctypeValidationError(filePath, result.errors)
	}

	const doctype = parseDoctype(data)
	doctypeRegistry.set(doctype.name, doctype)
}

/**
 * Load doctypes from an object (for programmatic use)
 * @param doctypes - Object mapping doctype names to doctype definitions
 * @param options - Options for loading doctypes (continueOnError, onError callback)
 * @public
 */
export function loadDoctypesFromObject(doctypes: Record<string, unknown>, options: LoadDoctypesOptions = {}): void {
	for (const [name, data] of Object.entries(doctypes)) {
		const withName = { ...(typeof data === 'object' && data !== null ? data : {}), name }
		const result = validateDoctype(withName)

		if (!result.success) {
			if (options.continueOnError) {
				options.onError?.(name, result.errors)
				continue
			}
			throw new DoctypeValidationError(name, result.errors)
		}

		const doctype = parseDoctype(withName)
		doctypeRegistry.set(doctype.name, doctype)
	}
}

/**
 * Get a doctype by name
 * @param name - Name of the doctype to retrieve
 * @public
 */
export function getMeta(name: string): DoctypeMeta | undefined {
	const direct = doctypeRegistry.get(name)
	if (direct) return direct
	// Fallback: find by slug (links reference doctypes by slug, not name)
	for (const doctype of doctypeRegistry.values()) {
		if (doctype.slug === name) return doctype
	}
	return undefined
}

/**
 * Get all loaded doctypes
 * @public
 */
export function getAllMeta(): DoctypeMeta[] {
	return Array.from(doctypeRegistry.values())
}

/**
 * Check if a doctype is registered
 * @param name - Name of the doctype to check
 * @public
 */
export function hasMeta(name: string): boolean {
	return doctypeRegistry.has(name)
}

/**
 * Clear all registered doctypes
 * @public
 */
export function clearRegistry(): void {
	doctypeRegistry.clear()
}

/**
 * Validate doctype references — link targets, `inherits`, and each link's binding — against what
 * is loaded.
 *
 * Resolution goes through `getMeta`, never through the registry Map directly. The Map is keyed by
 * doctype **name** while a link target is a **slug** (`DoctypeMeta.links[].target` is documented as
 * one, and every doctype in this repo writes one), so a raw `.has()` reports a broken reference for
 * every correct link — measured at 12 of 12 across the two in-repo hosts before this was fixed.
 * `getMeta` is also what the plugin resolves a link with at fetch time, so this asks the same
 * question the runtime asks.
 *
 * `inherits` is checked the same way even though nothing resolves it at runtime (both resolvers
 * only echo it onto the wire) — one rule is cheaper than two, and it cannot be wrong in the
 * permissive direction.
 *
 * The **binding** checks are the same defect class as an unresolvable target, one step further in:
 * a link whose target resolves can still name no way to reach the rows, and the reader's answer for
 * that is `continue` or a `null` — indistinguishable on the wire from a relation that is genuinely
 * empty. Both halves of a declaration are `.optional()` in the schema because which one is required
 * depends on cardinality, which Zod cannot express here; this is where that dependency is enforced.
 *
 * Only what the runtime actually consults is required. A `backlink` naming a column the target
 * table does not have already fails loudly — Postgres rejects the SELECT — so it is left alone;
 * the check exists for the silent cases, not to restate the database's own errors.
 *
 * Returns rather than throws so the caller decides; `assertReferencesResolve` in the plugin is that
 * caller. Kept out of the package's public exports: it reads a module-level registry, so it is only
 * meaningful after this module's own loaders have run.
 *
 * @internal
 */
export function validateReferences(): ValidationError[] {
	const errors: ValidationError[] = []

	for (const doctype of doctypeRegistry.values()) {
		// Check inherits reference
		if (doctype.inherits && getMeta(doctype.inherits) === undefined) {
			errors.push({
				path: [doctype.name, 'inherits'],
				message: `References unknown doctype: ${doctype.inherits}`,
			})
		}

		const fields = flattenFields(doctype.fields)

		// Check link field targets — `doctype` is both the link marker and its target.
		for (const field of fields) {
			if (field.kind !== 'field') continue
			const target = field.doctype
			if (target !== undefined && getMeta(target) === undefined) {
				errors.push({
					path: [doctype.name, 'fields', field.fieldname, 'doctype'],
					message: `Link references unknown doctype: ${target}`,
				})
			}
		}

		// Check link-declaration targets (component-primary links live in the `links` map)
		if (doctype.links) {
			const declared = new Set(fields.map(f => f.fieldname))
			// A foreign key is read from a column, so a link can only bind to a field that has one.
			// The rule itself lives in one place — see `columnBackedFields` — because the read path,
			// the write path and this check all have to answer it the same way.
			const columnBacked = new Set(columnBackedFields(doctype.fields).map(f => f.fieldname))

			for (const [key, link] of Object.entries(doctype.links)) {
				if (getMeta(link.target) === undefined) {
					errors.push({
						path: [doctype.name, 'links', key, 'target'],
						message: `Link references unknown doctype: ${link.target}`,
					})
				}

				// A custom fetch strategy hands the whole read to its handler, which is given the
				// row and the declaration and finds the target however it likes. The runtime returns
				// before consulting either binding below, so requiring one would refuse a link that
				// works.
				if (link.fetch?.method === 'custom') continue

				// The two cardinalities bind through different halves of the declaration, so the
				// check has to split the same way the reader does.
				if (link.cardinality === 'noneOrMany' || link.cardinality === 'atLeastOne') {
					// Many-side: the target rows are found by a column on the *target* table, so
					// this doctype needs no field of its own — and the in-repo hosts disagree on
					// whether one exists, which is why only `backlink` can be required here.
					if (!link.backlink) {
						errors.push({
							path: [doctype.name, 'links', key, 'backlink'],
							message:
								`Link "${key}" is ${link.cardinality} but names no \`backlink\`, so the runtime cannot ` +
								`find the target rows and drops the link with no error. Name the field on "${link.target}" ` +
								`that points back to this doctype.`,
						})
					}
					continue
				}

				// One-side: the foreign key is a column on *this* table, read as
				// `link.fieldname ?? key`. A name matching no declared field is not selected, so the
				// link resolves to null forever and reads as "this record has no such relation".
				const fieldname = link.fieldname ?? key
				if (!columnBacked.has(fieldname)) {
					errors.push({
						// Point at whichever half actually carries the binding: the `fieldname`
						// property when it is set, otherwise the key itself. Naming `target` here
						// would send the reader to the one part that resolved correctly.
						path: link.fieldname ? [doctype.name, 'links', key, 'fieldname'] : [doctype.name, 'links', key],
						// Two different repairs, so two different diagnoses: a name nothing declares
						// is a typo, while a name that resolves to a column-less field is a binding
						// pointed at the wrong one of several real fields.
						message: declared.has(fieldname)
							? `Link "${key}" binds to field "${fieldname}", which has no database column of its own — ` +
								`it is computed, or a container rather than a value — so there is no foreign key to read ` +
								`and the record read fails on the missing column. Bind the link to the field holding the ` +
								`foreign key.`
							: `Link "${key}" binds to field "${fieldname}", which this doctype does not declare, so it ` +
								`resolves to null with no error. Declare that field, or set \`fieldname\` to the field ` +
								`holding the foreign key. (A link's key is its fieldname unless \`fieldname\` overrides it.)`,
					})
				}
			}
		}
	}

	return errors
}
