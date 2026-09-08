#!/usr/bin/env node

/**
 * Runs api-extractor and drops its per-package boilerplate, forwarding every other line.
 *
 * The banner is four lines plus blanks in each of the thirteen packages that build a report. What
 * has to survive is the compiler-mismatch line: api-extractor pins its own TypeScript, one major
 * behind the catalog, and that line is the only sign the surface was analysed by the older one.
 *
 * The filter is a deny list of exact known-noise lines rather than a quiet flag, because
 * api-extractor reports real findings (ae-missing-release-tag and friends) on a successful run
 * too. Anything unrecognised is printed. On a failing run nothing is filtered at all.
 */

import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const NOISE = [
	/^api-extractor \d+\.\d+\.\d+\s+- https:\/\/api-extractor\.com\/$/,
	/^Analysis will use the bundled TypeScript version \d+\.\d+\.\d+$/,
	/^API Extractor completed successfully$/,
]

// api-extractor colours the banner, so the pattern has to see the text without escape codes.
const decolour = line => line.replace(/\[[0-9;]*m/g, '')

// Resolved from the calling package rather than taken off PATH, so the wrapper behaves the same
// run by hand as it does under a task runner that has put node_modules/.bin there.
const requireFromPackage = createRequire(join(process.cwd(), 'package.json'))
const manifestPath = requireFromPackage.resolve('@microsoft/api-extractor/package.json')
const { bin } = requireFromPackage(manifestPath)
const binPath = join(dirname(manifestPath), typeof bin === 'string' ? bin : bin['api-extractor'])

const result = spawnSync(process.execPath, [binPath, ...process.argv.slice(2)], {
	encoding: 'utf8',
	shell: false,
})

if (result.error) {
	console.error(result.error.message)
	process.exit(1)
}

const failed = result.status !== 0
const keep = stream =>
	(stream ?? '')
		.split('\n')
		.filter(line => {
			if (failed) return true
			const plain = decolour(line).trim()
			return plain !== '' && !NOISE.some(pattern => pattern.test(plain))
		})
		.join('\n')

const out = keep(result.stdout)
const err = keep(result.stderr)
if (out.trim()) process.stdout.write(`${out}\n`)
if (err.trim()) process.stderr.write(`${err}\n`)

process.exit(result.status ?? 1)
