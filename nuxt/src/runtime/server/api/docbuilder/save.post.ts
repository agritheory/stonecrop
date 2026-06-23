import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
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

	if (!body.fields || !Array.isArray(body.fields)) {
		throw createError({
			status: 400,
			message: 'Missing or invalid fields array',
		})
	}

	const config = useRuntimeConfig()
	const doctypesDir = config.stonecrop?.doctypesDir || resolve(process.cwd(), 'doctypes')

	// Sanitize filename
	const filename = body.doctype.toLowerCase().replace(/\s+/g, '-')
	const filePath = resolve(doctypesDir, `${filename}.json`)

	// Security check — ensure the resolved path stays inside doctypesDir
	if (!filePath.startsWith(doctypesDir + '/')) {
		throw createError({
			status: 400,
			message: 'Invalid doctype name',
		})
	}

	// Read existing file to deep-merge — preserves keys the builder doesn't display
	let existing: Record<string, unknown> = {}
	if (existsSync(filePath)) {
		try {
			const content = await readFile(filePath, 'utf-8')
			existing = JSON.parse(content)
		} catch {
			// Unreadable existing file — start fresh rather than corrupt
		}
	}

	const doctypeData: Record<string, unknown> = {
		...existing,
		fields: body.fields,
	}

	if (body.workflow !== undefined) {
		doctypeData.workflow = body.workflow
	}

	// Remove legacy 'schema' key if present — standardise on 'fields'
	delete doctypeData.schema

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
