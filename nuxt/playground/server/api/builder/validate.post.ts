import { validateField } from '@stonecrop/schema'
import type { ValidationResult, ValidationError } from '@stonecrop/schema'

export default defineEventHandler(async event => {
	const body = await readBody(event)

	if (!body.fields || !Array.isArray(body.fields)) {
		throw createError({
			statusCode: 400,
			message: 'Missing or invalid fields array',
		})
	}

	const errors: ValidationError[] = []

	// Validate each field in the schema
	for (let i = 0; i < body.fields.length; i++) {
		const field = body.fields[i]
		const result = validateField(field)

		if (!result.success) {
			// Prefix each error path with the field index
			for (const error of result.errors) {
				errors.push({
					path: [`fields[${i}]`, field.fieldname || `field_${i}`, ...error.path],
					message: error.message,
				})
			}
		}
	}

	const result: ValidationResult = {
		success: errors.length === 0,
		errors,
	}

	return result
})
