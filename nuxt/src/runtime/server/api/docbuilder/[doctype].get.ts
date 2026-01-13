import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createError, defineEventHandler, getRouterParam, useRuntimeConfig } from '#imports'

export default defineEventHandler(async event => {
	const doctype = getRouterParam(event, 'doctype')

	if (!doctype) {
		throw createError({
			statusCode: 400,
			message: 'Missing doctype parameter',
		})
	}

	const config = useRuntimeConfig()
	const doctypesDir = config.stonecrop?.doctypesDir || resolve(process.cwd(), 'doctypes')
	const filePath = resolve(doctypesDir, `${doctype}.json`)

	// Security check
	if (!filePath.startsWith(doctypesDir)) {
		throw createError({
			statusCode: 400,
			message: 'Invalid doctype name',
		})
	}

	if (!existsSync(filePath)) {
		throw createError({
			statusCode: 404,
			message: `DocType '${doctype}' not found`,
		})
	}

	try {
		const content = await readFile(filePath, 'utf-8')
		const data = JSON.parse(content)

		return {
			name: doctype
				.split('-')
				.map(w => w.charAt(0).toUpperCase() + w.slice(1))
				.join(' '),
			slug: doctype,
			schema: data.schema || [],
		}
	} catch (error: any) {
		throw createError({
			statusCode: 500,
			message: `Failed to read doctype: ${error.message}`,
		})
	}
})
