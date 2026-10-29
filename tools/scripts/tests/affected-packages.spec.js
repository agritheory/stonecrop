import { execFileSync, spawnSync } from 'node:child_process'
import { appendFileSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vite-plus/test'

import { parseWorkspaceMembers } from '../workspace-members.mjs'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../../..')
const script = join(rootDir, 'tools/scripts/affected-packages.mjs')

// A worktree of HEAD, so each case edits real files and diffs them against a real ref, without
// touching this checkout.
let worktree
beforeAll(() => {
	worktree = join(mkdtempSync(join(tmpdir(), 'affected-packages-')), 'repo')
	execFileSync('git', ['worktree', 'add', '--detach', '--quiet', worktree, 'HEAD'], { cwd: rootDir })
})
afterAll(() => {
	execFileSync('git', ['worktree', 'remove', '--force', worktree], { cwd: rootDir })
	rmSync(dirname(worktree), { recursive: true, force: true })
})
afterEach(() => execFileSync('git', ['checkout', '--quiet', '--', '.'], { cwd: worktree }))

const touch = file => appendFileSync(join(worktree, file), '\n')
const affected = (...args) => {
	const result = spawnSync('node', [script, ...args], { cwd: worktree, encoding: 'utf8' })
	if (result.status !== 0) throw new Error(result.stderr)
	return JSON.parse(result.stdout)
}
const members = () => parseWorkspaceMembers(readFileSync(join(worktree, 'pnpm-workspace.yaml'), 'utf8'))

describe('affected-packages.mjs', { tags: ['integration'] }, () => {
	it('selects nothing when nothing changed', () => {
		expect(affected('HEAD')).toEqual([])
	})

	// The path filters it replaced tested schema alone, and none of the packages built on it.
	it('selects a changed member and every member that depends on it', () => {
		touch('schema/src/index.ts')
		const selected = affected('HEAD')
		expect(selected).toEqual(expect.arrayContaining(['schema', 'stonecrop', 'desktop', 'nuxt']))
		expect(selected).not.toContain('rockfoil')
	})

	it('selects every member when a tree they all read changed', () => {
		touch('tools/test-support/dist-contract.ts')
		expect(affected('HEAD')).toEqual(members())
	})

	it('selects every member when the lockfile changed', () => {
		touch('pnpm-lock.yaml')
		expect(affected('HEAD')).toEqual(members())
	})

	it('selects no member for a change outside all of them', () => {
		touch('README.md')
		expect(affected('HEAD')).toEqual([])
	})

	it('keeps only the members declaring a script when asked', () => {
		touch('tools/vite/build-task.ts')
		const selected = affected('HEAD', '--with-script', 'test:coverage')
		expect(selected).toContain('schema')
		expect(selected).not.toContain('themes')
		expect(selected).not.toContain('tools/scripts')
	})

	it('fails, rather than selecting nothing, for a ref git cannot resolve', () => {
		const result = spawnSync('node', [script, 'no-such-ref'], { cwd: worktree, encoding: 'utf8' })
		expect(result.status).not.toBe(0)
		expect(result.stdout).toBe('')
	})
})
