import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * node_editor keeps Vue, VueFlow and dagre external, and relies on `vite-plugin-lib-inject-css` to
 * make the entry pull in its own stylesheet. Both are asserted against a written-down expectation
 * rather than re-derived from `vite.config.ts`, so a change to either shows up as a diff a reviewer
 * has to approve.
 */
describe('dist contract', { tags: ['unit'] }, () => {
	it('leaves exactly the expected dependencies external', () => {
		const { chunks, bare } = readDistContract(packageRoot)
		expect(chunks).toBeGreaterThan(0)

		expect(
			bare,
			`The set of externals changed. @vue-flow/core carries its own component registry, so a ` +
				`bundled copy silently stops sharing state with the host's.`
		).toEqual(['@dagrejs/dagre', '@vue-flow/core', 'vue'])
	})

	it('side-effect-imports its stylesheet from the entry', () => {
		const { css } = readDistContract(packageRoot)

		expect(
			css,
			`libInjectCss no longer injects the stylesheet import. Consumers that import the package ` +
				`without also importing '@stonecrop/node-editor/styles' render unstyled, with no error.`
		).toEqual(['./assets/index.css'])
	})
})
