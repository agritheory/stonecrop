import { existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineEventHandler(async event => {
	const body = await readBody(event)
	console.log('[save.post] Received body:', JSON.stringify(body, null, 2))

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

	// Sanitize doctype name for filename
	const filename = body.doctype.toLowerCase().replace(/\s+/g, '-')
	console.log('[save.post] Saving doctype:', filename)

	// Resolve path to doctypes folder - use the playground's doctypes directory
	const doctypesDir = resolve(process.cwd(), 'doctypes')
	console.log('[save.post] Doctypes dir:', doctypesDir)

	// Ensure doctypes directory exists
	if (!existsSync(doctypesDir)) {
		console.log('[save.post] Creating doctypes directory')
		try {
			mkdirSync(doctypesDir, { recursive: true })
		} catch (mkdirError: any) {
			console.error('[save.post] Failed to create directory:', mkdirError)
			throw createError({
				status: 500,
				message: `Failed to create doctypes directory: ${mkdirError.message}`,
			})
		}
	}

	const filePath = resolve(doctypesDir, `${filename}.json`)
	console.log('[save.post] File path:', filePath)

	// Ensure we're not writing outside doctypes folder
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
		console.log('[save.post] Successfully saved to:', filePath)
		return { success: true, path: `doctypes/${filename}.json` }
	} catch (error: any) {
		console.error('[save.post] Failed to write file:', error)
		throw createError({
			status: 500,
			message: `Failed to save file: ${error.message}`,
		})
	}
})
