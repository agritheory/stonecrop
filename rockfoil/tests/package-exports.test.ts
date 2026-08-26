import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { collectExportTargets, readDistContract } from '../../common/test-support/dist-contract'

/**
 * Every export subpath must point at a file the build actually produces.
 *
 * rockfoil declared `"./styles": "./dist/assets/index.css"` for a stylesheet it has never had —
 * copy-pasted from atable/aform/beam, which do emit one. It was inert because nothing imported it,
 * but three sibling packages support `/styles`, so a consumer following that convention hit
 * ERR_MODULE_NOT_FOUND against a package that is server-side and contains no CSS at all.
 *
 * The walk this used to carry inline now lives in `common/test-support/dist-contract.ts`, which
 * every built package calls: the check is no longer rockfoil-only, and the note that used to stand
 * here asking for it to be promoted has been acted on. Wildcard subpaths are still skipped there,
 * because the target is a pattern rather than a path and `existsSync` on the literal string reports
 * a miss for a directory that is present.
 *
 * It reads the built `dist/`, so it fails on an unbuilt checkout. That is deliberate: a check that
 * skipped itself when `dist` was absent would pass in exactly the case it exists to catch.
 */
const packageRoot = resolve(__dirname, '..')

describe('package exports', { tags: ['unit'] }, () => {
	it('declares an exports map', () => {
		expect(collectExportTargets(packageRoot).length).toBeGreaterThan(0)
	})

	it('resolves every declared export target to a file on disk', () => {
		const targets = collectExportTargets(packageRoot)

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
				`run \`pnpm run build\` first — this test reads dist/ on purpose.\n  ${missing.join('\n  ')}`
		).toEqual([])
	})

	it('leaves exactly the expected dependencies external', () => {
		const { chunks, bare } = readDistContract(packageRoot)
		expect(chunks).toBeGreaterThan(0)

		expect(
			bare,
			`The set of externals changed. rockfoil externalises everything non-relative, so a ` +
				`specifier disappearing here means the bundler stopped honouring that rule.`
		).toEqual(['postgraphile/utils'])
	})
})
