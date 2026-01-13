import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { defineEventHandler, useRuntimeConfig } from '#imports'

export default defineEventHandler(async event => {
	// Get doctypes directory from runtime config or default to 'doctypes'
	const config = useRuntimeConfig()
	const doctypesDir = config.stonecrop?.doctypesDir || resolve(process.cwd(), 'doctypes')

	if (!existsSync(doctypesDir)) {
		return []
	}

	try {
		const files = await readdir(doctypesDir)
		const jsonFiles = files.filter(f => extname(f) === '.json')

		const doctypes = await Promise.all(
			jsonFiles.map(async file => {
				const filePath = resolve(doctypesDir, file)
				const content = await readFile(filePath, 'utf-8')
				const data = JSON.parse(content)
				const name = file.replace('.json', '')

				return {
					name: name
						.split('-')
						.map(w => w.charAt(0).toUpperCase() + w.slice(1))
						.join(' '),
					slug: name,
					fieldCount: data.schema?.length || 0,
				}
			})
		)

		return doctypes
	} catch (error) {
		console.error('Error reading doctypes:', error)
		return []
	}
})
