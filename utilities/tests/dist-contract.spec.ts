import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * utilities is a dependency of atable and aform, so a bundled Vue here is inherited by both — the
 * duplicate arrives in a consumer's app without either of those packages changing.
 */
describe('dist contract', { tags: ['unit'] }, () => {
	it('leaves exactly the expected dependencies external', () => {
		const { chunks, bare } = readDistContract(packageRoot)
		expect(chunks).toBeGreaterThan(0)

		expect(
			bare,
			`The set of externals changed. A bundled vue here reaches every consumer of atable and ` +
				`aform, which both depend on this package.`
		).toEqual(['@vueuse/core', 'vue'])
	})
})
