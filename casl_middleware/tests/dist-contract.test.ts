import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * `postgraphile/utils` is a subpath export, not a bare package name. A bundler that resolves
 * subpaths differently would inline it while still leaving plain `graphql` external, so the two
 * are asserted together rather than as one "nothing got bundled" claim.
 */
describe('dist contract', { tags: ['unit'] }, () => {
	it('leaves exactly the expected dependencies external', () => {
		const { chunks, bare } = readDistContract(packageRoot)
		expect(chunks).toBeGreaterThan(0)

		expect(
			bare,
			`The set of externals changed. A specifier that disappeared is now bundled into dist, ` +
				`which for graphql means two incompatible copies at runtime.`
		).toEqual(['@casl/ability', 'graphql', 'postgraphile/utils'])
	})
})
