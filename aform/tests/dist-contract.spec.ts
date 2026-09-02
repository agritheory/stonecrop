import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * aform keeps Vue, Pinia, `@vueuse/*` and every `@stonecrop/*` sibling external, and relies on
 * `vite-plugin-lib-inject-css` to make the entry pull in its own stylesheet. Both are asserted
 * against a written-down expectation rather than re-derived from `vite.config.ts`, so a change to
 * either shows up as a diff a reviewer has to approve.
 */
describe('dist contract', { tags: ['unit'] }, () => {
	it('leaves exactly the expected dependencies external', () => {
		const { chunks, bare } = readDistContract(packageRoot)

		// A closure of zero chunks makes every assertion below vacuous.
		expect(chunks).toBeGreaterThan(0)

		expect(
			bare,
			`The set of externals changed. A specifier that disappeared is now bundled into dist — ` +
				`for vue or pinia that ships a second copy into every consumer app.`
		).toEqual(['@stonecrop/atable', '@stonecrop/schema', '@vueuse/components', '@vueuse/core', 'vue'])
	})

	it('side-effect-imports its stylesheet from the entry', () => {
		const { css } = readDistContract(packageRoot)

		expect(
			css,
			`libInjectCss no longer injects the stylesheet import. Consumers that import the package ` +
				`without also importing '@stonecrop/aform/styles' render unstyled.`
		).toEqual(['./assets/index.css'])
	})
})
