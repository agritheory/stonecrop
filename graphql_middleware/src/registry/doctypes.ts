import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { parseDoctype, validateDoctype } from '../types'
import type { DoctypeMeta, ValidationError } from '../types'

const doctypeRegistry: Map<string, DoctypeMeta> = new Map()

/**
 * Error thrown when a doctype definition fails validation
 * @public
 */
export class DoctypeValidationError extends Error {
	constructor(public readonly file: string, public readonly errors: ValidationError[]) {
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
 * @public
 */
export function loadDoctypesFromObject(doctypes: Record<string, unknown>, options: LoadDoctypesOptions = {}): void {
	for (const [name, data] of Object.entries(doctypes)) {
		const withName = { ...(data as object), name }
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
 * @public
 */
export function getMeta(name: string): DoctypeMeta | undefined {
	return doctypeRegistry.get(name)
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
 * Validate cross-doctype references (Link fields, inherits, etc.)
 * Call after all doctypes are loaded.
 * @public
 */
export function validateReferences(): ValidationError[] {
	const errors: ValidationError[] = []

	for (const doctype of doctypeRegistry.values()) {
		// Check inherits reference
		if (doctype.inherits && !doctypeRegistry.has(doctype.inherits)) {
			errors.push({
				path: [doctype.name, 'inherits'],
				message: `References unknown doctype: ${doctype.inherits}`,
			})
		}

		// Check listDoctype reference
		if (doctype.listDoctype && !doctypeRegistry.has(doctype.listDoctype)) {
			errors.push({
				path: [doctype.name, 'listDoctype'],
				message: `References unknown doctype: ${doctype.listDoctype}`,
			})
		}

		// Check parentDoctype reference
		if (doctype.parentDoctype && !doctypeRegistry.has(doctype.parentDoctype)) {
			errors.push({
				path: [doctype.name, 'parentDoctype'],
				message: `References unknown doctype: ${doctype.parentDoctype}`,
			})
		}

		// Check Link field targets
		for (const field of doctype.fields) {
			if (field.fieldtype === 'Link' && typeof field.options === 'string') {
				if (!doctypeRegistry.has(field.options)) {
					errors.push({
						path: [doctype.name, 'fields', field.fieldname, 'options'],
						message: `Link references unknown doctype: ${field.options}`,
					})
				}
			}
		}
	}

	return errors
}
