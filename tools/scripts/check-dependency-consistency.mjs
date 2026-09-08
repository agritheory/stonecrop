#!/usr/bin/env node
//
// Fails when one dependency is declared two different ways across the workspace.
//
// Rush's `rush check` enforced a single SemVer range per dependency across every project, and
// nothing in pnpm or Vite+ replaces it. The catalog in pnpm-workspace.yaml makes divergence
// impossible for the dependencies already listed there; this is the backstop that catches a
// dependency added to a second package without joining it, which `catalogMode: prefer` allows.
//
// Deliberately reads only package.json files, never the catalog: "every shared dependency reads
// `catalog:`" is checkable without knowing what the catalog contains, and a check that re-derived
// the catalog's contents could agree with a wrong catalog.

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const RESOLVED = ['dependencies', 'devDependencies']
const ALL = [...RESOLVED, 'peerDependencies']

const members = JSON.parse(execFileSync('pnpm', ['list', '-r', '--depth', '-1', '--json'], { encoding: 'utf8' }))

// name -> field -> declared value -> [package names]
const declarations = new Map()
for (const { name, path } of members) {
	const manifest = JSON.parse(readFileSync(`${path}/package.json`, 'utf8'))
	for (const field of ALL) {
		for (const [dep, range] of Object.entries(manifest[field] ?? {})) {
			// A workspace link carries no range to disagree about.
			if (range.startsWith('workspace:')) continue
			if (!declarations.has(dep)) declarations.set(dep, new Map())
			const byField = declarations.get(dep)
			if (!byField.has(field)) byField.set(field, new Map())
			const byRange = byField.get(field)
			if (!byRange.has(range)) byRange.set(range, [])
			byRange.get(range).push(name)
		}
	}
}

const collect = (byField, fields) => {
	const ranges = new Map()
	for (const field of fields) {
		for (const [range, pkgs] of byField.get(field) ?? new Map()) {
			ranges.set(range, [...(ranges.get(range) ?? []), ...pkgs])
		}
	}
	return ranges
}

const problems = []
for (const [dep, byField] of [...declarations].sort()) {
	// Installed ranges and peer ranges are two different claims, so they are checked as two separate
	// sets rather than one. A peer range says what a consumer may pair this package with; an
	// installed range says what the workspace builds against. Requiring them to match would forbid
	// the ordinary case of a peer range deliberately wider than the version we develop on.
	const installed = collect(byField, RESOLVED)
	const peers = collect(byField, ['peerDependencies'])

	if (installed.size > 1) problems.push({ dep, kind: 'installed at differing ranges', ranges: installed })
	if (peers.size > 1) problems.push({ dep, kind: 'declared as a peer at differing ranges', ranges: peers })

	// Shared and still literal: it belongs in the catalog. Peers are exempt for the reason above —
	// tying one to the catalog would narrow it silently on every dev bump.
	const shared = new Set([...installed.values()].flat())
	if (installed.size === 1 && shared.size > 1 && ![...installed.keys()].includes('catalog:')) {
		problems.push({ dep, kind: 'installed by several packages but not in the catalog', ranges: installed })
	}
}

if (problems.length === 0) {
	console.log(`Dependency declarations are consistent across ${members.length} workspace packages.`)
	process.exit(0)
}

for (const { dep, kind, ranges } of problems) {
	console.error(`::error::${dep} is ${kind}`)
	for (const [range, pkgs] of [...ranges].sort()) {
		console.error(`    ${range.padEnd(14)} ${[...new Set(pkgs)].sort().join(', ')}`)
	}
}
console.error(
	`\n${problems.length} to reconcile. For an installed range, add the dependency to the \`catalog:\` ` +
		`block in pnpm-workspace.yaml and declare it as "catalog:" in every package. For a peer range, ` +
		`settle on one range by hand — peers stay literal on purpose.`
)
process.exit(1)
