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

describe('following the warning that asks for a primaryKey', { tags: ['unit'] }, () => {
	// The loop a consumer with a natural-key table actually walks: generate, read "declare a
	// primaryKey on uom.json and re-run", do exactly that, re-run. The aggregate has to appear —
	// otherwise the instruction is a dead end and no sequence of edits ever produces the file.
	const NATURAL_KEY_SDL = `
		type Uom { code: ID! uomName: String! }
		type Query { uoms: [Uom!]! }
	`

	let out: string
	let root: string

	beforeAll(() => {
		root = mkdtempSync(join(tmpdir(), 'stonecrop-cli-nk-'))
		const sdlPath = join(root, 'schema.graphql')
		out = join(root, 'out')
		mkdirSync(out)
		writeFileSync(sdlPath, NATURAL_KEY_SDL, 'utf-8')

		execFileSync('node', [CLI, 'generate', '-s', sdlPath, '-o', out], { encoding: 'utf-8' })

		// Do what the warning asks, on the file it names.
		const entityPath = join(out, 'uom.json')
		const entity = JSON.parse(readFileSync(entityPath, 'utf-8'))
		for (const field of entity.fields) {
			if (field.fieldname === 'code') field.primaryKey = true
		}
		writeFileSync(entityPath, JSON.stringify(entity, null, '\t') + '\n', 'utf-8')

		execFileSync('node', [CLI, 'generate', '-s', sdlPath, '-o', out], { encoding: 'utf-8' })
	})

	afterAll(() => rmSync(root, { recursive: true, force: true }))

	it('writes the aggregate on the re-run', () => {
		expect(readdirSync(out).toSorted()).toEqual(['uom.json', 'uoms.json'])
	})

	it('keys that aggregate on the declared column', () => {
		const aggregate = JSON.parse(readFileSync(join(out, 'uoms.json'), 'utf-8'))
		expect(aggregate.fields).toEqual([expect.objectContaining({ fieldname: 'code', primaryKey: true })])
	})

	it('leaves the author’s declaration on the entity untouched', () => {
		// Generation verifies, never overwrites — the whole reason the author's key is authoritative.
		const entity = JSON.parse(readFileSync(join(out, 'uom.json'), 'utf-8'))
		expect(entity.fields.find((f: Record<string, unknown>) => f.fieldname === 'code')?.primaryKey).toBe(true)
	})
})

describe('a primaryKey declared inside a fieldset', { tags: ['unit'] }, () => {
	// A fieldset is a layout grouping, not a scope: a field inside one still has a column and can
	// still declare the key. Reading only the top level ignores the declaration silently, which is
	// the defect `getPrimaryKeyField` was fixed for — the authored reader must not reintroduce it.
	let out: string
	let root: string

	beforeAll(() => {
		root = mkdtempSync(join(tmpdir(), 'stonecrop-cli-fs-'))
		const sdlPath = join(root, 'schema.graphql')
		out = join(root, 'out')
		mkdirSync(out)
		writeFileSync(sdlPath, `type Uom { code: ID! uomName: String! }\ntype Query { uoms: [Uom!]! }`, 'utf-8')

		execFileSync('node', [CLI, 'generate', '-s', sdlPath, '-o', out], { encoding: 'utf-8' })

		const entityPath = join(out, 'uom.json')
		const entity = JSON.parse(readFileSync(entityPath, 'utf-8'))
		const code = entity.fields.find((f: Record<string, unknown>) => f.fieldname === 'code')
		code.primaryKey = true
		entity.fields = [
			{ fieldname: 'identity', component: 'AFieldset', schema: [code] },
			...entity.fields.filter((f: Record<string, unknown>) => f.fieldname !== 'code'),
		]
		writeFileSync(entityPath, JSON.stringify(entity, null, '\t') + '\n', 'utf-8')

		execFileSync('node', [CLI, 'generate', '-s', sdlPath, '-o', out], { encoding: 'utf-8' })
	})

	afterAll(() => rmSync(root, { recursive: true, force: true }))

	it('is honoured, so the aggregate is still written', () => {
		expect(readdirSync(out).toSorted()).toEqual(['uom.json', 'uoms.json'])
	})

	it('keys the aggregate on the nested column', () => {
		const aggregate = JSON.parse(readFileSync(join(out, 'uoms.json'), 'utf-8'))
		expect(aggregate.fields).toEqual([expect.objectContaining({ fieldname: 'code', primaryKey: true })])
	})
})

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
