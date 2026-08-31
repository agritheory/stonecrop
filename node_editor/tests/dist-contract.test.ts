import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * node_editor declares `./styles` but does not use `libInjectCss`: its stylesheet is emitted as
 * `dist/node-editor.css` for the host to import explicitly, so there is deliberately no
 * side-effect-import assertion. publint checks the file behind `./styles` exists.
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
})
