import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

/**
 * Every export subpath must point at a file the build actually produces.
 *
 * rockfoil declared `"./styles": "./dist/assets/index.css"` for a stylesheet it has never had —
 * copy-pasted from atable/aform/beam, which do emit one. It was inert because nothing imported it,
 * but three sibling packages support `/styles`, so a consumer following that convention hit
 * ERR_MODULE_NOT_FOUND against a package that is server-side and contains no CSS at all.
 *
 * Scope, and its limits, stated so this is not mistaken for a repo-wide guard:
 *
 * - It covers rockfoil only. A repo-wide version needs a job that builds every package and then
 *   runs tests: `pr-checks` builds everything but runs no tests, and the per-package matrix only
 *   runs for packages whose own files changed. Promote this once that job exists.
 * - Wildcard subpaths (`./runtime/*`) are skipped. The target is a pattern, not a path, and
 *   `existsSync` on the literal string reports a miss for a directory that is present.
 * - It reads the built `dist/`, so it fails on an unbuilt checkout. That is deliberate: a check
 *   that skipped itself when `dist` was absent would pass in exactly the case it exists to catch.
 */

const packageRoot = resolve(__dirname, '..')
const manifest = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8')) as {
	exports?: Record<string, unknown>
}

/** Flatten the exports map into `[subpath + condition, target]` pairs, dropping wildcard patterns. */
function collectTargets(): { label: string; target: string }[] {
	const found: { label: string; target: string }[] = []

	const walk = (node: unknown, label: string): void => {
		if (typeof node === 'string') {
			if (node.includes('*')) return
			found.push({ label, target: node })
			return
		}
		if (node && typeof node === 'object') {
			for (const [condition, child] of Object.entries(node)) {
				walk(child, `${label} [${condition}]`)
			}
		}
	}

	for (const [subpath, node] of Object.entries(manifest.exports ?? {})) {
		if (subpath.includes('*')) continue
		walk(node, subpath)
	}

	return found
}

describe('package exports', { tags: ['unit'] }, () => {
	it('declares an exports map', () => {
		expect(Object.keys(manifest.exports ?? {}).length).toBeGreaterThan(0)
	})

	it('resolves every declared export target to a file on disk', () => {
		const targets = collectTargets()

		// Guard against a vacuous pass: if the walk found nothing, the assertion below is
		// trivially true and would keep passing however badly the exports map broke.
		expect(targets.length).toBeGreaterThan(0)

		const missing = targets
			.filter(({ target }) => !existsSync(resolve(packageRoot, target)))
			.map(({ label, target }) => `${label} -> ${target}`)

		expect(
			missing,
			`These export targets do not exist. Either the build no longer emits them or the ` +
				`subpath was copied from a package that does. If this fails on a clean checkout, ` +
				`run \`rushx build\` first — this test reads dist/ on purpose.\n  ${missing.join('\n  ')}`
		).toEqual([])
	})
})
