#!/usr/bin/env node

/**
 * Validates every publishable package against its own packed tarball.
 *
 * Not replaceable by a per-package test: the suites typecheck as a bundler only, so the other three
 * resolution modes are invisible to them.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..')

/**
 * An exception list, not a target list: anything absent must pass. Compared as a set, so a package
 * that starts passing also fails the gate — delete its entry rather than let the exemption outlive
 * the defect.
 */
const ATTW_EXPECTED_FAILURES = new Map([
	['@stonecrop/aform', 'ships .vue specifiers in its declarations; bundler-only by construction'],
	['@stonecrop/atable', 'ships .vue specifiers in its declarations; bundler-only by construction'],
	['@stonecrop/beam', 'ships .vue specifiers in its declarations; bundler-only by construction'],
	['@stonecrop/code-editor', 'ships .vue specifiers in its declarations; bundler-only by construction'],
	['@stonecrop/desktop', 'ships .vue specifiers in its declarations; bundler-only by construction'],
	['@stonecrop/node-editor', 'ships .vue specifiers in its declarations; bundler-only by construction'],
	['@stonecrop/casl-middleware', 'extensionless relative imports in the ./types subpath fail node16 ESM'],
	['@stonecrop/stonecrop', 'extensionless relative imports in the ./types subpath fail node16 ESM'],
])

const readJson = path => JSON.parse(readFileSync(path, 'utf8'))

/** Workspace members, read from the file that defines them so a new one is covered automatically. */
function workspaceMembers() {
	const raw = readFileSync(join(rootDir, 'pnpm-workspace.yaml'), 'utf8')
	const members = []
	let inPackages = false
	for (const line of raw.split('\n')) {
		if (/^packages:/.test(line)) {
			inPackages = true
			continue
		}
		if (inPackages) {
			const entry = line.match(/^\s+-\s+(\S+)\s*$/)
			if (entry) members.push(entry[1])
			else if (line.trim() !== '' && !line.trimStart().startsWith('#')) break
		}
	}
	if (members.length === 0) throw new Error('Parsed no members from pnpm-workspace.yaml')
	return members
}

function run(command, args, cwd) {
	try {
		const stdout = execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
		return { code: 0, output: stdout }
	} catch (error) {
		return { code: error.status ?? 1, output: `${error.stdout ?? ''}${error.stderr ?? ''}` }
	}
}

const publishable = workspaceMembers()
	.map(dir => ({ dir, manifestPath: join(rootDir, dir, 'package.json') }))
	.filter(({ manifestPath }) => existsSync(manifestPath))
	.map(entry => ({ ...entry, manifest: readJson(entry.manifestPath) }))
	.filter(({ manifest }) => !manifest.private && manifest.name)

if (publishable.length === 0) throw new Error('Found no publishable packages; the member parse is wrong')

const staging = mkdtempSync(join(tmpdir(), 'stonecrop-publish-'))
const publintFailures = []
const attwFailures = []
const attwSkipped = []

try {
	for (const { dir, manifest } of publishable) {
		const cwd = join(rootDir, dir)

		const publint = run('pnpm', ['exec', 'publint'], cwd)
		if (publint.code !== 0) publintFailures.push({ name: manifest.name, output: publint.output.trim() })

		// `themes` ships only CSS, so attw has nothing to resolve.
		const declaresTypes = Boolean(manifest.types) || JSON.stringify(manifest.exports ?? {}).includes('"types"')
		if (!declaresTypes) {
			attwSkipped.push(manifest.name)
			continue
		}

		const before = new Set(readdirSync(staging))
		const packed = run('pnpm', ['pack', '--pack-destination', staging], cwd)
		if (packed.code !== 0) {
			publintFailures.push({ name: manifest.name, output: `pnpm pack failed:\n${packed.output.trim()}` })
			continue
		}
		const tarball = readdirSync(staging).find(file => !before.has(file))
		if (!tarball) throw new Error(`pnpm pack produced no new tarball for ${manifest.name}`)

		// esm-only: the default profile also fails these on the require()-from-CJS path, which no
		// package here claims to support.
		const attw = run('pnpm', ['exec', 'attw', join(staging, tarball), '--profile', 'esm-only'], cwd)
		if (attw.code !== 0) attwFailures.push({ name: manifest.name, output: attw.output.trim() })
	}
} finally {
	rmSync(staging, { recursive: true, force: true })
}

const problems = []

if (publintFailures.length > 0) {
	problems.push(
		`publint rejected ${publintFailures.length} package(s). Every path a manifest names must ` +
			`exist inside its own tarball.\n\n` +
			publintFailures.map(({ name, output }) => `--- ${name}\n${output}`).join('\n\n')
	)
}

const actualAttwFailures = new Set(attwFailures.map(({ name }) => name))
const expectedAttwFailures = new Set(ATTW_EXPECTED_FAILURES.keys())

const newlyFailing = [...actualAttwFailures].filter(name => !expectedAttwFailures.has(name))
const nowPassing = [...expectedAttwFailures].filter(name => !actualAttwFailures.has(name))

if (newlyFailing.length > 0) {
	problems.push(
		`attw rejected ${newlyFailing.length} package(s) that are expected to pass:\n\n` +
			newlyFailing.map(name => `--- ${name}\n${attwFailures.find(f => f.name === name).output}`).join('\n\n')
	)
}

if (nowPassing.length > 0) {
	problems.push(
		`attw now passes for ${nowPassing.join(', ')}, which ATTW_EXPECTED_FAILURES still lists as ` +
			`broken. Delete those entries in common/scripts/check-publish-contract.mjs — an exemption ` +
			`kept past its defect hides the next real one.`
	)
}

if (problems.length > 0) {
	console.error(problems.join('\n\n'))
	process.exit(1)
}

const skipNote = attwSkipped.length > 0 ? ` (${attwSkipped.join(', ')} declare no types)` : ''
console.log(
	`publint clean across ${publishable.length} publishable packages; attw matches its ` +
		`${expectedAttwFailures.size} pinned exceptions${skipNote}.`
)
