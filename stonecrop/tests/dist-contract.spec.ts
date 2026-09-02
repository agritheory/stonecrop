import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * The widest Vue-side external surface: three singleton-sensitive peers (`vue`, `pinia`,
 * `vue-router`) alongside `immutable`, whose bundled copy would make identity comparisons against
 * a consumer's own collections fail silently.
 *
 * `xstate` and `pinia-shared-state` are runtime dependencies that the built entry does not reach,
 * so they are absent here by design.
 */
describe('dist contract', { tags: ['unit'] }, () => {
	it('leaves exactly the expected dependencies external', () => {
		const { chunks, bare } = readDistContract(packageRoot)
		expect(chunks).toBeGreaterThan(0)

		expect(
			bare,
			`The set of externals changed. vue, pinia and vue-router must stay external so this ` +
				`package shares the host app's single instance of each.`
		).toEqual(['@stonecrop/aform', '@stonecrop/schema', '@vueuse/core', 'immutable', 'pinia', 'vue', 'vue-router'])
	})
})
