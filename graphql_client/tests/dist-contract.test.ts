import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { collectExportTargets, readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * graphql_client's built entry imports nothing bare: its only dependency, `@stonecrop/schema`, is
 * re-exported as `export type` and erased at compile time, leaving inline query strings and no
 * runtime edge. The empty expectation is therefore the real contract, and the chunk-count guard
 * below is what stops it degenerating into a test that would pass against an empty `dist/`.
 */
describe('dist contract', { tags: ['unit'] }, () => {
	it('resolves every declared export target to a file on disk', () => {
		const targets = collectExportTargets(packageRoot)
		expect(targets.length).toBeGreaterThan(0)

		const missing = targets
			.filter(({ target }) => !existsSync(resolve(packageRoot, target)))
			.map(({ label, target }) => `${label} -> ${target}`)

		expect(missing, `Export targets missing from dist. Run \`rushx build\` first.`).toEqual([])
	})

	it('imports nothing at runtime', () => {
		const { chunks, bare } = readDistContract(packageRoot)
		expect(chunks).toBeGreaterThan(0)

		expect(
			bare,
			`This package gained a runtime import. That is not automatically wrong, but it changes ` +
				`what a consumer must install, so it should be a deliberate edit to this expectation.`
		).toEqual([])
	})
})
