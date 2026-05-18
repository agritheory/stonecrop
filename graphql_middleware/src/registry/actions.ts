import type { FieldMeta } from '@stonecrop/schema'
import type { ActionHandler } from '../types'

const handlerRegistry: Map<string, ActionHandler> = new Map()

/**
 * Register an action handler
 * @param name - Unique name for the action handler
 * @param handler - Action handler function to register
 * @public
 */
export function registerHandler(name: string, handler: ActionHandler): void {
	handlerRegistry.set(name, handler)
}

/**
 * Get a registered handler by name
 * @param name - Name of the action handler to retrieve
 * @public
 */
export function getHandler(name: string): ActionHandler | undefined {
	return handlerRegistry.get(name)
}

/**
 * Check if a handler is registered
 * @param name - Name of the action handler to check
 * @public
 */
export function hasHandler(name: string): boolean {
	return handlerRegistry.has(name)
}

/**
 * Clear all registered handlers
 * @public
 */
export function clearHandlers(): void {
	handlerRegistry.clear()
}

// =============================================================================
// Built-in Handlers
// =============================================================================

/**
 * Validate that all required fields are present in a record
 */
const validateRequiredFields: ActionHandler = async (args, context) => {
	const [record] = args as [Record<string, unknown>]
	const { doctype } = context

	const missing: string[] = []
	for (const field of doctype.fields) {
		if (field.required && (record[field.fieldname] === undefined || record[field.fieldname] === null)) {
			missing.push(field.label ?? field.fieldname)
		}
	}

	if (missing.length > 0) {
		throw new Error(`Missing required fields: ${missing.join(', ')}`)
	}

	return { valid: true }
}

/**
 * Validate field types match expected types
 */
const validateFieldTypes: ActionHandler = async (args, context) => {
	const [record] = args as [Record<string, unknown>]
	const { doctype } = context

	const errors: string[] = []

	for (const field of doctype.fields) {
		const value = record[field.fieldname]
		if (value === undefined || value === null) continue

		const error = validateFieldValue(field, value)
		if (error) errors.push(error)
	}

	// Validate link fields
	if (doctype.links) {
		for (const [fieldname, link] of Object.entries(doctype.links)) {
			const value = record[fieldname]
			if (value === undefined || value === null) continue

			const isMany = link.cardinality === 'noneOrMany' || link.cardinality === 'atLeastOne'
			if (isMany) {
				if (!Array.isArray(value)) {
					errors.push(`${fieldname}: expected array, got ${typeof value}`)
				}
			} else {
				if (typeof value !== 'object' || Array.isArray(value)) {
					errors.push(`${fieldname}: expected object, got ${typeof value}`)
				}
			}
		}
	}

	if (errors.length > 0) {
		throw new Error(`Field type validation failed:\n${errors.join('\n')}`)
	}

	return { valid: true }
}

/**
 * Validate a single field value against its expected type
 */
function validateFieldValue(field: FieldMeta, value: unknown): string | null {
	const { fieldname, fieldtype } = field

	switch (fieldtype) {
		case 'Int':
			if (typeof value !== 'number' || !Number.isInteger(value)) {
				return `${fieldname}: expected integer, got ${typeof value}`
			}
			break

		case 'Float':
		case 'Decimal':
		case 'Currency':
		case 'Quantity':
			if (typeof value !== 'number' && typeof value !== 'string') {
				return `${fieldname}: expected number, got ${typeof value}`
			}
			break

		case 'Check':
			if (typeof value !== 'boolean') {
				return `${fieldname}: expected boolean, got ${typeof value}`
			}
			break

		case 'Data':
		case 'Text':
		case 'Code':
		case 'Link':
			if (typeof value !== 'string') {
				return `${fieldname}: expected string, got ${typeof value}`
			}
			break

		case 'Date':
		case 'Time':
		case 'Datetime':
			if (typeof value !== 'string' && !(value instanceof Date)) {
				return `${fieldname}: expected date string or Date, got ${typeof value}`
			}
			break

		case 'JSON':
			if (typeof value !== 'object') {
				return `${fieldname}: expected object, got ${typeof value}`
			}
			break
	}

	return null
}

/**
 * No-op handler for testing or placeholder actions
 */
const noop: ActionHandler = async () => {
	return { ok: true }
}

/**
 * Built-in handlers available for registration
 * @public
 */
export const builtinHandlers: Record<string, ActionHandler> = {
	validateRequiredFields,
	validateFieldTypes,
	noop,
}

/**
 * Register all built-in handlers
 * @public
 */
export function registerBuiltinHandlers(): void {
	for (const [name, handler] of Object.entries(builtinHandlers)) {
		registerHandler(name, handler)
	}
}
