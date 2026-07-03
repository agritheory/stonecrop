import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { convertGraphQLSchema } from '@stonecrop/schema'

/**
 * Reproducibility oracle for the playground's GraphQL-introspected doctypes.
 *
 * The checked-in doctype JSONs must be exactly what the documented CLI command
 * produces from the checked-in introspection snapshot + overrides file:
 *
 *   stonecrop-schema generate -i introspection.json -o doctypes \
 *     --include Country,Continent,Language,State,Subdivision \
 *     --overrides overrides.json
 *
 * If this fails, the fix is to update overrides.json (durable hand-tuning
 * lives there) and re-run the command — never to hand-edit the output files.
 *
 * overrides.json deliberately lives at the playground root, NOT inside
 * doctypes/ — the module (docbuilder + route-gen) and the client glob treat
 * every JSON in doctypesDir as a doctype.
 */

const playgroundDir = resolve(__dirname, '../playground')
const doctypesDir = join(playgroundDir, 'doctypes')

const INCLUDE = ['Country', 'Continent', 'Language', 'State', 'Subdivision']

describe('playground doctype generation', { tags: ['unit'] }, () => {
	it('checked-in doctypes are byte-identical to generator output for the snapshot + overrides', () => {
		const introspection = JSON.parse(readFileSync(join(playgroundDir, 'introspection.json'), 'utf-8'))
		const overrides = JSON.parse(readFileSync(join(playgroundDir, 'overrides.json'), 'utf-8'))

		const generated = convertGraphQLSchema(introspection.data ?? introspection, {
			include: INCLUDE,
			typeOverrides: overrides,
		})

		expect(generated.map(d => d.name).sort()).toEqual([...INCLUDE].sort())

		for (const doctype of generated) {
			const onDisk = readFileSync(join(doctypesDir, `${doctype.slug}.json`), 'utf-8')
			// Byte-identity with the CLI's serialization (tab-indented + trailing
			// newline) — guards content, key order, and formatting drift alike.
			expect(
				onDisk,
				`${doctype.slug}.json drifted from generator output — update overrides.json and re-run the CLI`
			).toBe(JSON.stringify(doctype, null, '\t') + '\n')
		}
	})
})
