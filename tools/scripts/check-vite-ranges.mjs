#!/usr/bin/env node
//
// Fails when an installed package declares a Vite range that the Vite it actually gets does not
// satisfy, or when more than one Vite is installed.
//
// The `overrides` in pnpm-workspace.yaml give every package in the graph the catalog's `vite`, which
// is Vite+'s core, whatever range that package asked for, and pnpm compares neither side: an
// override replaces a dependency's range without checking it, and `peerDependencyRules.allowAny`
// silences every peer range on Vite. A Nuxt that needs a newer Vite than our Vite+ bundles would
// install cleanly and fail, or build wrong, only when it ran.
//
// Reads the graph from pnpm itself: `pnpm why` for which packages resolve `vite`, and each one's own
// package.json for the spec it declares.

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { bundledVite, oneVite, rangeProblem } from './vite-range.mjs'

const FIELDS = ['dependencies', 'optionalDependencies', 'peerDependencies']

const pnpm = args => execFileSync('pnpm', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
const manifestIn = dir => JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))

// A workspace package declares `vite` as `catalog:`, the very entry the override installs.
const members = new Set(JSON.parse(pnpm(['list', '-r', '--depth', '-1', '--json'])).map(pkg => pkg.name))

// `pnpm why` names each dependent but not its directory, so every installed manifest is read once,
// keyed the way `pnpm why` names it. The list also names optional packages for other platforms,
// which were never installed; a dependent among them would fail below rather than pass.
const installed = new Map()
for (const dir of pnpm(['list', '-r', '--depth', 'Infinity', '--parseable']).split('\n')) {
	if (dir === '' || !existsSync(join(dir, 'package.json'))) continue
	const manifest = manifestIn(dir)
	installed.set(`${manifest.name}@${manifest.version}`, manifest)
}

const resolutions = JSON.parse(pnpm(['why', 'vite', '-r', '--json']))
// vite-plus itself depends on `vite`, so an empty answer means this read pnpm wrongly, not that
// there is nothing to check.
if (resolutions.length === 0) throw new Error('pnpm reports no package resolving vite, not even vite-plus')

const problems = []
const givens = []
let checked = 0
for (const resolution of resolutions) {
	const manifest = manifestIn(resolution.path)
	const given = { name: manifest.name, version: manifest.version, vite: bundledVite(manifest) }
	givens.push(given)

	// One dependent appears once per peer combination it was installed with.
	const dependents = new Set(resolution.dependents.map(({ name, version }) => `${name}@${version}`))
	for (const dependent of dependents) {
		const declared = installed.get(dependent)
		if (declared === undefined) {
			throw new Error(`pnpm lists ${dependent} as depending on vite, but not where it is installed`)
		}
		if (members.has(declared.name)) continue

		const specs = FIELDS.map(field => declared[field]?.vite).filter(spec => spec !== undefined)
		if (specs.length === 0) throw new Error(`${dependent} resolves vite but declares no spec for it`)
		for (const spec of specs) {
			const problem = rangeProblem(spec, given)
			if (problem !== undefined) problems.push(`${dependent} ${problem}`)
		}
		checked++
	}
}
const duplicate = oneVite(givens)
if (duplicate !== undefined) problems.push(duplicate)

if (problems.length === 0) {
	const vites = givens.map(given => `Vite ${given.vite} inside ${given.name}@${given.version}`).join(', ')
	console.log(`All ${checked} packages depending on vite accept the one installed: ${vites}.`)
	process.exit(0)
}

for (const problem of problems) console.error(`::error::${problem}`)
console.error(
	`\n${problems.length} to reconcile. Move \`vite-plus\` and the catalog's \`vite\` alias together to a ` +
		`release whose Vite these accept, or hold back whichever package wants a Vite newer than ours.`
)
process.exit(1)
