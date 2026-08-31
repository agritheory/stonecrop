import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * desktop declares `./styles` but does not use `libInjectCss`: its stylesheet is emitted as
 * `dist/desktop.css` for the host to import explicitly, so there is deliberately no
 * side-effect-import assertion. publint checks the file behind `./styles` exists.
 *
 * `vue-router` is externalised in the config but absent from the built entry, so it is not in the
 * expectation below — this records what the bundle actually imports, not what it may import.
 */
describe('dist contract', { tags: ['unit'] }, () => {
	it('leaves exactly the expected dependencies external', () => {
		const { chunks, bare } = readDistContract(packageRoot)
		expect(chunks).toBeGreaterThan(0)

		// `@stonecrop/schema` is absent because Desktop.vue's only reference is a type position,
		// which erases at build. A value import added back lands here.
		expect(
			bare,
			`The set of externals changed. Vue must stay external so this package shares the host ` +
				`app's single instance of it.`
		).toEqual(['@stonecrop/aform', '@stonecrop/stonecrop', 'vue'])
	})
})
