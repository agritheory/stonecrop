import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { validateDoctype } from '../src/index'

/**
 * What the CLI actually writes.
 *
 * Spawns `dist/cli.js` rather than reassembling its serialization, because the defect this guards
 * lives in the write path itself: a helper can strip `kind` perfectly while the caller forgets to
 * call it, and a test that stringifies the merge result on its own behalf would pass either way.
 * `rush build` runs before `rush test` in CI, so dist is present; a missing one fails loudly here
 * rather than skipping, since a skipped guard reports the same green as a passing one.
 */

const CLI = resolve(__dirname, '../dist/cli.js')

const SDL = `
	type Task { id: ID! title: String! status: String }
	type Query { tasks: [Task!]! }
`

let dir: string

beforeAll(() => {
	dir = mkdtempSync(join(tmpdir(), 'stonecrop-cli-'))
	const sdlPath = join(dir, 'schema.graphql')
	const out = join(dir, 'out')
	mkdirSync(out)
	writeFileSync(sdlPath, SDL, 'utf-8')

	if (!existsSync(CLI)) {
		throw new Error(
			`${CLI} is missing — run \`vite build\` in this package before the tests, or CI's build phase did not run.`
		)
	}
	execFileSync('node', [CLI, 'generate', '-s', sdlPath, '-o', out], { encoding: 'utf-8' })
})

afterAll(() => rmSync(dir, { recursive: true, force: true }))

describe('generated doctype files', { tags: ['unit'] }, () => {
	const read = () => {
		const out = join(dir, 'out')
		return readdirSync(out).map(f => ({ file: f, text: readFileSync(join(out, f), 'utf-8') }))
	}

	it('writes the entity and its aggregate', () => {
		expect(
			read()
				.map(f => f.file)
				.toSorted()
		).toEqual(['task.json', 'tasks.json'])
	})

	it('writes no `kind` discriminant', () => {
		for (const { file, text } of read()) {
			expect(text, `${file} carries the parser's discriminant`).not.toContain('"kind"')
		}
	})

	it('still declares fields, so the check above is not passing on an empty file', () => {
		// The control for the negative assertion: a doctype with no fields would trivially contain
		// no `kind`, and would report exactly the same green.
		for (const { file, text } of read()) {
			const parsed = JSON.parse(text)
			expect(parsed.fields.length, `${file} has no fields`).toBeGreaterThan(0)
			expect(parsed.fields.every((f: Record<string, unknown>) => !('kind' in f))).toBe(true)
		}
	})

	it('is still a valid doctype once parsed, because injectKind restores the tag', () => {
		for (const { file, text } of read()) {
			const result = validateDoctype(JSON.parse(text))
			expect(result.success, `${file}: ${JSON.stringify(result.errors)}`).toBe(true)
		}
	})
})
