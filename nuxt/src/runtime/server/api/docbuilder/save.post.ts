import { existsSync } from 'node:fs'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
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

	// The builder only ever sends the URL slug (e.g. 'order'), never the display name. Resolve to
	// the doctype's actual source file (case-insensitive) so we read AND write the same file it
	// already lives in — preserving its real filename casing, its required `name`, and any keys the
	// builder doesn't display (mode/options/default on fields, handler/confirm on actions). A brand-
	// new doctype has no source file, so it uses the requested name verbatim.
	const requested = body.doctype
	const exactPath = resolve(doctypesDir, `${requested}.json`)

	// Security check — ensure the resolved path stays inside doctypesDir
	if (!exactPath.startsWith(doctypesDir + '/')) {
		throw createError({
			status: 400,
			message: 'Invalid doctype name',
		})
	}

	let filePath = exactPath
	if (!existsSync(filePath)) {
		const files = await readdir(doctypesDir).catch(() => [] as string[])
		const match = files.find(f => f.toLowerCase() === `${requested.toLowerCase()}.json`)
		if (match) {
			filePath = resolve(doctypesDir, match)
		}
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

	// `name` is required by the doctype schema and is never sent by the builder. Preserve the
	// existing value verbatim; fall back to the requested name only when creating a new doctype.
	if (typeof doctypeData.name !== 'string' || doctypeData.name.length === 0) {
		doctypeData.name = requested
	}

	// Remove legacy 'schema' key if present — standardise on 'fields'
	delete doctypeData.schema

	try {
		await writeFile(filePath, JSON.stringify(doctypeData, null, '\t') + '\n', 'utf-8')
		return { success: true, path: `doctypes/${basename(filePath)}` }
	} catch (error: any) {
		throw createError({
			status: 500,
			message: `Failed to save file: ${error.message}`,
		})
	}
})
