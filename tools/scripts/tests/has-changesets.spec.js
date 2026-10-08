import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterEach, describe, expect, it } from 'vitest'

const script = join(dirname(fileURLToPath(import.meta.url)), '../has-changesets.sh')

let root
afterEach(() => rmSync(root, { recursive: true, force: true }))

// A fresh directory holding `.changeset` with the given files, as a repository root would.
const changesetDirectory = files => {
	root = mkdtempSync(join(tmpdir(), 'has-changesets-'))
	mkdirSync(join(root, '.changeset'))
	for (const file of files) writeFileSync(join(root, '.changeset', file), '')
	return root
}

const run = cwd => spawnSync('bash', [script], { cwd, encoding: 'utf8' })

describe('has-changesets.sh', { tags: ['unit'] }, () => {
	it('answers false when only the config and README are there', () => {
		const result = run(changesetDirectory(['config.json', 'README.md']))
		expect(result.status).toBe(0)
		expect(result.stdout.trim()).toBe('false')
	})

	it('answers true for a changeset beside them', () => {
		const result = run(changesetDirectory(['config.json', 'README.md', 'brave-cats-sing.md']))
		expect(result.status).toBe(0)
		expect(result.stdout.trim()).toBe('true')
	})

	// Broader than Changesets' own rule on purpose: any Markdown file means "release", so a file
	// Changesets would not count fails `changeset version` loudly instead of skipping a release.
	it('answers true for any Markdown file other than the README', () => {
		const result = run(changesetDirectory(['config.json', 'notes.md']))
		expect(result.stdout.trim()).toBe('true')
	})

	it('fails, rather than answering false, when there is no .changeset folder', () => {
		root = mkdtempSync(join(tmpdir(), 'has-changesets-'))
		const result = run(root)
		expect(result.status).not.toBe(0)
		expect(result.stdout.trim()).toBe('')
	})
})
