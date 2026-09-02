import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * desktop keeps Vue, Pinia and its `@stonecrop/*` siblings external, and relies on
 * `vite-plugin-lib-inject-css` to make the entry pull in its own stylesheet. Both are asserted
 * against a written-down expectation rather than re-derived from `vite.config.ts`, so a change to
 * either shows up as a diff a reviewer has to approve.
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

	it('side-effect-imports its stylesheet from the entry', () => {
		const { css } = readDistContract(packageRoot)

		expect(
			css,
			`libInjectCss no longer injects the stylesheet import. Consumers that import the package ` +
				`without also importing '@stonecrop/desktop/styles' render unstyled, with no error.`
		).toEqual(['./assets/index.css'])
	})
})
