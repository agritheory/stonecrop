import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { convertGraphQLSchema, mergeIntrospectedDoctype } from '@stonecrop/schema'

/**
 * Regeneration oracle for the playground's GraphQL-introspected doctypes.
 *
 * Re-running the documented CLI command over the checked-in introspection snapshot must be a
 * **no-op**:
 *
 *   stonecrop-schema generate -i introspection.json -o doctypes \
 *     --include Country,Continent,Language,State,Subdivision
 *
 * That is a stronger property than the byte-identity check this replaced. The old test compared
 * the files to raw converter output plus an `overrides.json` of hand-tuning; it could only pass if
 * every durable edit was mirrored in that side file. The doctypes are now the source of truth, so
 * this asserts what actually matters: generation confirms them and changes nothing.
 *
 * If it fails, the doctype and the schema have genuinely diverged — fix whichever is wrong. Do not
 * "fix" it by pasting generator output over the file; that is what discards curation.
 */

const playgroundDir = resolve(__dirname, '../playground')
const doctypesDir = join(playgroundDir, 'doctypes')

const INCLUDE = ['Country', 'Continent', 'Language', 'State', 'Subdivision']

describe('playground doctype generation', { tags: ['unit'] }, () => {
	const introspection = JSON.parse(readFileSync(join(playgroundDir, 'introspection.json'), 'utf-8'))
	const generated = convertGraphQLSchema(introspection.data ?? introspection, { include: INCLUDE })

	it('converts exactly the included types', () => {
		expect(generated.map(d => d.name).sort()).toEqual([...INCLUDE].sort())
	})

	it('regenerating over the checked-in doctypes is a no-op', () => {
		for (const doctype of generated) {
			const path = join(doctypesDir, `${doctype.slug}.json`)
			const onDisk = readFileSync(path, 'utf-8')
			const { doctype: merged } = mergeIntrospectedDoctype(JSON.parse(onDisk), doctype)

			// Byte-identity against the CLI's serialization (tab-indented, trailing newline) — this
			// guards content, key order and formatting alike, so a merge that reordered keys would
			// be caught even when the data is equivalent.
			expect(onDisk, `${doctype.slug}.json is not regenerate-stable`).toBe(JSON.stringify(merged, null, '\t') + '\n')
		}
	})

	it('reports no identity drift against the snapshot', () => {
		// The countries schema has no derivable primary key — every type is keyed on `code`, which
		// SDL cannot distinguish from any other column. The doctypes declare none either, so the two
		// agree. A failure here means the converter started guessing.
		for (const doctype of generated) {
			const onDisk = JSON.parse(readFileSync(join(doctypesDir, `${doctype.slug}.json`), 'utf-8'))
			const { drift } = mergeIntrospectedDoctype(onDisk, doctype)
			expect(drift.identityDrift, `${doctype.slug}`).toEqual([])
			expect(
				doctype.fields.some(f => f.primaryKey),
				`${doctype.slug} should derive no primary key`
			).toBe(false)
		}
	})
})
