#!/usr/bin/env node

/**
 * Validates every publishable package against its own packed tarball.
 *
 * Not replaceable by a per-package test: the suites typecheck as a bundler only, so the other three
 * resolution modes are invisible to them.
 */

import { execFile } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { availableParallelism, tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import { workspaceMembers } from './workspace-members.mjs'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..')

/**
 * An exception list, not a target list: anything absent must pass. Compared as a set, so a package
 * that starts passing also fails the gate — delete its entry rather than let the exemption outlive
 * the defect.
 */
const ATTW_EXPECTED_FAILURES = new Map([
	['@stonecrop/aform', 'ships .vue specifiers in its declarations; bundler-only by construction'],
	['@stonecrop/atable', 'ships .vue specifiers in its declarations; bundler-only by construction'],
	['@stonecrop/code-editor', 'ships .vue specifiers in its declarations; bundler-only by construction'],
	['@stonecrop/desktop', 'ships .vue specifiers in its declarations; bundler-only by construction'],
	['@stonecrop/node-editor', 'ships .vue specifiers in its declarations; bundler-only by construction'],
])

const readJson = path => JSON.parse(readFileSync(path, 'utf8'))

const execFileAsync = promisify(execFile)

async function run(command, args, cwd) {
	try {
		const { stdout } = await execFileAsync(command, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
		return { code: 0, output: stdout }
	} catch (error) {
		return {
			code: typeof error.code === 'number' ? error.code : 1,
			output: `${error.stdout ?? ''}${error.stderr ?? ''}`,
		}
	}
}

/**
 * A CLI's entry point, run with this Node rather than through `pnpm exec`, which spent most of each
 * check starting pnpm. Read off disk because publint's `exports` hides its package.json from require.
 */
function binOf(packageName, binName) {
	const packageDir = join(rootDir, 'node_modules', packageName)
	return join(packageDir, readJson(join(packageDir, 'package.json')).bin[binName])
}

const publintBin = binOf('publint', 'publint')
const attwBin = binOf('@arethetypeswrong/cli', 'attw')

const publishable = workspaceMembers()
	.map(dir => ({ dir, manifestPath: join(rootDir, dir, 'package.json') }))
	.filter(({ manifestPath }) => existsSync(manifestPath))
	.map(entry => ({ ...entry, manifest: readJson(entry.manifestPath) }))
	.filter(({ manifest }) => !manifest.private && manifest.name)

if (publishable.length === 0) throw new Error('Found no publishable packages; the member parse is wrong')

/** Checks one package. Each one packs into its own folder, so the tarball is the only file there. */
async function check({ dir, manifest }, staging) {
	const cwd = join(rootDir, dir)
	const result = { name: manifest.name, publint: null, attw: null, skipped: false }

	const publint = await run(process.execPath, [publintBin], cwd)
	if (publint.code !== 0) result.publint = publint.output.trim()

	// `themes` ships only CSS, so attw has nothing to resolve.
	const declaresTypes = Boolean(manifest.types) || JSON.stringify(manifest.exports ?? {}).includes('"types"')
	if (!declaresTypes) {
		result.skipped = true
		return result
	}

	const destination = join(staging, dir.replaceAll('/', '_'))
	mkdirSync(destination)
	const packed = await run('pnpm', ['pack', '--pack-destination', destination], cwd)
	if (packed.code !== 0) {
		result.publint = [result.publint, `pnpm pack failed:\n${packed.output.trim()}`].filter(Boolean).join('\n\n')
		return result
	}
	const [tarball] = readdirSync(destination)
	if (!tarball) throw new Error(`pnpm pack produced no tarball for ${manifest.name}`)

	// esm-only: the default profile also fails these on the require()-from-CJS path, which no
	// package here claims to support.
	const attw = await run(process.execPath, [attwBin, join(destination, tarball), '--profile', 'esm-only'], cwd)
	if (attw.code !== 0) result.attw = attw.output.trim()
	return result
}

/** Runs `task` over `items` at most `limit` at a time, keeping results in input order. */
async function mapConcurrently(items, limit, task) {
	const results = Array.from({ length: items.length })
	let next = 0
	const worker = async () => {
		while (next < items.length) {
			const index = next++
			// oxlint-disable-next-line eslint/no-await-in-loop -- each worker takes one package at a time; the workers run concurrently
			results[index] = await task(items[index])
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
	return results
}

// The packages share nothing, so they are checked side by side. One at a time, this was the
// longest step in pr-checks after the build itself.
const staging = mkdtempSync(join(tmpdir(), 'stonecrop-publish-'))
let results
try {
	results = await mapConcurrently(publishable, availableParallelism(), entry => check(entry, staging))
} finally {
	rmSync(staging, { recursive: true, force: true })
}

const publintFailures = results.filter(r => r.publint !== null).map(r => ({ name: r.name, output: r.publint }))
const attwFailures = results.filter(r => r.attw !== null).map(r => ({ name: r.name, output: r.attw }))
const attwSkipped = results.filter(r => r.skipped).map(r => r.name)

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
			`broken. Delete those entries in tools/scripts/check-publish-contract.mjs — an exemption ` +
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
