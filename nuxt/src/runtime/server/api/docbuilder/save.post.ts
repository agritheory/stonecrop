import { existsSync } from 'node:fs'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { createError, defineEventHandler, readBody } from 'h3'
import { useRuntimeConfig } from '#imports'

import { mergeSavedDoctype } from './mergeDoctype'

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
	// builder doesn't display (mode/options/default on fields, handler on actions). A brand-
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

	// Create guard: a create must never overwrite an existing doctype. The new-doctype flow
	// sends `create: true`; `filePath` above already resolves case-insensitive collisions (requesting
	// 'user' when 'User.json' exists), so this rejects exactly the file the write below would target.
	// Updates send no flag and keep the existing deep-merge-overwrite behaviour. The client guards the
	// common case before POSTing, but a stale list or a direct POST can only be caught here.
	if (body.create === true && existsSync(filePath)) {
		throw createError({
			status: 409,
			message: `A doctype named "${requested}" already exists.`,
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

	// The merge itself is pure and lives in ./mergeDoctype so it can be unit-tested outside a Nuxt
	// server context — this handler cannot be imported in a plain vitest run.
	const doctypeData = mergeSavedDoctype(existing, body, requested)

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
