import { execFileSync } from 'node:child_process'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { parseWorkspaceMembers, workspaceMembers } from '../workspace-members.mjs'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../../..')

describe('workspaceMembers', { tags: ['unit'] }, () => {
	// pnpm parses the same file for itself, so it is the one oracle that can disagree. Both callers
	// read a short list as less work rather than as a failure, which is why drift here is silent:
	// the publish contract checks fewer packages and the build's symlink guard skips a tree.
	it('agrees with the directories pnpm resolves', { timeout: 60_000 }, () => {
		const listed = JSON.parse(
			execFileSync('pnpm', ['list', '-r', '--depth', '-1', '--json'], { cwd: rootDir, encoding: 'utf8' })
		)
		const resolved = listed.map(pkg => relative(rootDir, pkg.path)).filter(dir => dir !== '')

		expect(workspaceMembers().toSorted()).toEqual(resolved.toSorted())
	})
})

describe('parseWorkspaceMembers', { tags: ['unit'] }, () => {
	it('stops at the next top-level key', () => {
		const yaml = ['packages:', '  - aform', '', 'peerDependencyRules:', '  ignoreMissing:', '    - react'].join('\n')

		expect(parseWorkspaceMembers(yaml)).toEqual(['aform'])
	})

	it('reads past a blank line and a comment at column zero', () => {
		const yaml = ['packages:', '  - aform', '', '# Members are listed one by one.', '  - utilities'].join('\n')

		expect(parseWorkspaceMembers(yaml)).toEqual(['aform', 'utilities'])
	})

	it('throws rather than reporting a workspace with no members', () => {
		expect(() => parseWorkspaceMembers("catalog:\n  vue: '^3.5.0'\n")).toThrow(/no members/)
	})
})
