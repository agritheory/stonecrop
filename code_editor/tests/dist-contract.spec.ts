import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * code_editor deliberately bundles Monaco rather than externalising it — `external` is `['vue']`
 * alone, though `monaco-editor` and `@monaco-editor/loader` are both runtime dependencies. The
 * expectation below therefore asserts that Monaco stays *in*, which is the opposite of what the
 * other packages assert and the reason this is written down rather than derived from package.json.
 */
describe('dist contract', { tags: ['unit'] }, () => {
	it('leaves vue external and keeps Monaco bundled', () => {
		const { chunks, bare } = readDistContract(packageRoot)
		expect(chunks).toBeGreaterThan(0)

		expect(
			bare,
			`The set of externals changed. Monaco appearing here means it is no longer bundled, ` +
				`which breaks consumers that do not install it themselves.`
		).toEqual(['vue'])
	})
})
