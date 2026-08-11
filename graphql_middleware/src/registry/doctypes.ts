import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { parseDoctype, validateDoctype } from '@stonecrop/schema'
import type { DoctypeMeta, ValidationError } from '@stonecrop/schema'

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
 * Validate cross-doctype references (link targets, `inherits`) against what is loaded.
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

		// Check link field targets — `doctype` is both the link marker and its target.
		for (const field of doctype.fields) {
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
			for (const [key, link] of Object.entries(doctype.links)) {
				if (getMeta(link.target) === undefined) {
					errors.push({
						path: [doctype.name, 'links', key, 'target'],
						message: `Link references unknown doctype: ${link.target}`,
					})
				}
			}
		}
	}

	return errors
}
