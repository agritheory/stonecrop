import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createError, defineEventHandler, getRouterParam, useRuntimeConfig } from '#imports'

export default defineEventHandler(async event => {
	const doctype = getRouterParam(event, 'doctype')

	if (!doctype) {
		throw createError({
			status: 400,
			message: 'Missing doctype parameter',
		})
	}

	const config = useRuntimeConfig()
	const doctypesDir = config.stonecrop?.doctypesDir || resolve(process.cwd(), 'doctypes')

	// Security check — ensure the resolved path stays inside doctypesDir (checked after resolution)
	const exactPath = resolve(doctypesDir, `${doctype}.json`)
	if (!exactPath.startsWith(doctypesDir + '/')) {
		throw createError({
			status: 400,
			message: 'Invalid doctype name',
		})
	}

	// Case-insensitive file lookup: try exact match first, then scan directory
	let filePath = exactPath
	if (!existsSync(filePath)) {
		const files = await readdir(doctypesDir).catch(() => [] as string[])
		const match = files.find(f => f.toLowerCase() === `${doctype.toLowerCase()}.json`)
		if (match) {
			filePath = resolve(doctypesDir, match)
		}
	}

	if (!existsSync(filePath)) {
		throw createError({
			status: 404,
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
			fields: data.fields ?? [],
			workflow: data.workflow ?? null,
		}
	} catch (error: any) {
		throw createError({
			status: 500,
			message: `Failed to read doctype: ${error.message}`,
		})
	}
})
