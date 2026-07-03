import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { validateDoctype } from '@stonecrop/schema'

/**
 * Content-integrity gate for the playground's doctypes folder — the merged
 * default example ships GraphQL-introspected doctypes (country, continent,
 * language) alongside the hand-authored docbuilder workflow fixtures
 * (issue, assignment, user).
 */

const doctypesDir = resolve(__dirname, '../playground/doctypes')

const doctypeFiles = () => readdirSync(doctypesDir).filter(f => f.endsWith('.json'))

const loadAll = () =>
	doctypeFiles().map(file => ({
		file,
		doctype: JSON.parse(readFileSync(join(doctypesDir, file), 'utf-8')) as Record<string, unknown>,
	}))

describe('playground doctypes', { tags: ['unit'] }, () => {
	it('contains exactly the merged doctype set', () => {
		expect(doctypeFiles().sort()).toEqual([
			'assignment.json',
			'continent.json',
			'country.json',
			'issue.json',
			'language.json',
			'state.json',
			'subdivision.json',
			'user.json',
		])
	})

	it('every doctype passes schema validation', () => {
		for (const { file, doctype } of loadAll()) {
			const result = validateDoctype(doctype)
			expect(result.success, `${file}: ${JSON.stringify(!result.success && result.errors)}`).toBe(true)
		}
	})

	it('has no dangling link targets', () => {
		const all = loadAll()
		const known = new Set<string>()
		for (const { doctype } of all) {
			if (typeof doctype.name === 'string') known.add(doctype.name.toLowerCase())
			if (typeof doctype.slug === 'string') known.add(doctype.slug.toLowerCase())
		}

		for (const { file, doctype } of all) {
			const targets: Array<[string, string]> = []

			const links = (doctype.links ?? {}) as Record<string, { target?: string }>
			for (const [linkName, link] of Object.entries(links)) {
				if (link?.target) targets.push([`links.${linkName}`, link.target])
			}

			const fields = (doctype.fields ?? []) as Array<Record<string, unknown>>
			for (const field of fields) {
				if (field.fieldtype === 'Link' && typeof field.options === 'string') {
					targets.push([`fields.${String(field.fieldname)}`, field.options])
				}
			}

			for (const [path, target] of targets) {
				expect(
					known.has(target.toLowerCase()),
					`${file} ${path} → "${target}" resolves to no doctype in the folder`
				).toBe(true)
			}
		}
	})
})
