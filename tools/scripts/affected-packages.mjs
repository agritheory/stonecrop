#!/usr/bin/env node

/**
 * Prints, as a JSON array of member directories, the workspace members a change since <ref> can
 * break: each member whose own files changed, every member that depends on one of those, and every
 * member when a file they all read changed.
 *
 * Dependents come from pnpm's `...[ref]` selector, so they follow the graph the package.json files
 * declare. The path filters this replaced listed each package's own folder, so a change to schema
 * tested schema and none of the nine packages built on it.
 *
 * Usage: affected-packages.mjs <ref> [--with-script <name>]
 *
 * Reads the repository it runs in, as version-packages.sh does. `--with-script` keeps the members
 * that declare that script, the rule `vp run -r` selects by.
 */

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { parseArgs } from 'node:util'

import { parseWorkspaceMembers } from './workspace-members.mjs'

/**
 * Read by every member's build or tests, yet outside all of them. pnpm attributes a change here to
 * the workspace root, which nothing depends on, so it would otherwise select no member at all.
 * A trailing slash marks a folder.
 */
const SHARED = [
	'tools/vite/',
	'tools/test-support/',
	'tsconfig.json',
	'tsconfig.options.json',
	'pnpm-lock.yaml',
	'pnpm-workspace.yaml',
]

const { positionals, values } = parseArgs({
	allowPositionals: true,
	options: { 'with-script': { type: 'string' } },
})
const [ref] = positionals
if (!ref || positionals.length > 1) {
	console.error('usage: affected-packages.mjs <ref> [--with-script <name>]')
	process.exit(2)
}

const rootDir = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim()
const run = (command, args) => execFileSync(command, args, { cwd: rootDir, encoding: 'utf8' })

const members = parseWorkspaceMembers(readFileSync(join(rootDir, 'pnpm-workspace.yaml'), 'utf8'))
const changed = run('git', ['diff', '--name-only', ref, '--']).split('\n').filter(Boolean)
const sharedChanged = changed.some(file =>
	SHARED.some(shared => (shared.endsWith('/') ? file.startsWith(shared) : file === shared))
)

let affected
if (sharedChanged) {
	affected = members
} else {
	const selected = new Set(
		JSON.parse(run('pnpm', ['--filter', `...[${ref}]`, 'list', '--depth', '-1', '--json'])).map(({ path }) =>
			relative(rootDir, path)
		)
	)
	// In member order, so the same change always prints the same list.
	affected = members.filter(member => selected.has(member))
}

const script = values['with-script']
if (script) {
	affected = affected.filter(member => readJson(join(rootDir, member, 'package.json')).scripts?.[script])
}

console.log(JSON.stringify(affected))

function readJson(path) {
	return JSON.parse(readFileSync(path, 'utf8'))
}
