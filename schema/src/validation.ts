import { FieldMeta } from './field'
import { DoctypeMeta } from './doctype'

/**
 * Validation error with path information
 * @public
 */
export interface ValidationError {
	/** Path to the invalid property */
	path: PropertyKey[]

	/** Error message */
	message: string
}

/**
 * Result of a validation operation
 * @public
 */
export interface ValidationResult {
	/** Whether validation passed */
	success: boolean

	/** List of validation errors (empty if success) */
	errors: ValidationError[]
}

/**
 * Validate a field definition
 * @param data - Data to validate
 * @returns Validation result
 * @public
 */
export function validateField(data: unknown): ValidationResult {
	const result = FieldMeta.safeParse(data)

	if (result.success) {
		return { success: true, errors: [] }
	}

	return {
		success: false,
		errors: result.error.issues.map(issue => ({
			path: issue.path as (string | number)[],
			message: issue.message,
		})),
	}
}

/**
 * Validate a doctype definition
 * @param data - Data to validate
 * @returns Validation result
 * @public
 */
export function validateDoctype(data: unknown): ValidationResult {
	const result = DoctypeMeta.safeParse(data)

	if (result.success) {
		return { success: true, errors: [] }
	}

	return {
		success: false,
		errors: result.error.issues.map(issue => ({
			path: issue.path as (string | number)[],
			message: issue.message,
		})),
	}
}

/**
 * Parse and validate a field, throwing on failure
 * @param data - Data to parse
 * @returns Validated FieldMeta
 * @throws ZodError if validation fails
 * @public
 */
export function parseField(data: unknown): FieldMeta {
	return FieldMeta.parse(data)
}

/**
 * Parse and validate a doctype, throwing on failure
 * @param data - Data to parse
 * @returns Validated DoctypeMeta
 * @throws ZodError if validation fails
 * @public
 */
export function parseDoctype(data: unknown): DoctypeMeta {
	return DoctypeMeta.parse(data)
}

// Re-export types for convenience
export type { FieldMeta } from './field'
export type { DoctypeMeta } from './doctype'
