import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { collectExportTargets, readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * node_editor declares `./styles` but does not use `libInjectCss`: its stylesheet is emitted as
 * `dist/node-editor.css` for the host to import explicitly, so the export-target check is what
 * covers it and there is deliberately no side-effect-import assertion.
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
