import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createError, defineEventHandler, readBody, useRuntimeConfig } from '#imports'

export default defineEventHandler(async event => {
	const body = await readBody(event)

	if (!body.doctype || typeof body.doctype !== 'string') {
		throw createError({
			status: 400,
			message: 'Missing or invalid doctype name',
		})
	}

	if (!body.schema || !Array.isArray(body.schema)) {
		throw createError({
			status: 400,
			message: 'Missing or invalid schema array',
		})
	}

	const config = useRuntimeConfig()
	const doctypesDir = config.stonecrop?.doctypesDir || resolve(process.cwd(), 'doctypes')

	// Sanitize filename
	const filename = body.doctype.toLowerCase().replace(/\s+/g, '-')
	const filePath = resolve(doctypesDir, `${filename}.json`)

	// Security check
	if (!filePath.startsWith(doctypesDir)) {
		throw createError({
			status: 400,
			message: 'Invalid doctype name',
		})
	}

	const doctypeData = {
		schema: body.schema,
	}

	try {
		await writeFile(filePath, JSON.stringify(doctypeData, null, '\t'), 'utf-8')
		return { success: true, path: `doctypes/${filename}.json` }
	} catch (error: any) {
		throw createError({
			status: 500,
			message: `Failed to save file: ${error.message}`,
		})
	}
})
