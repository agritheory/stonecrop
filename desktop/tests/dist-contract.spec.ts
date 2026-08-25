import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { collectExportTargets, readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * desktop declares `./styles` but does not use `libInjectCss`: its stylesheet is emitted as
 * `dist/desktop.css` for the host to import explicitly. The export-target check therefore covers
 * the stylesheet here, and there is deliberately no side-effect-import assertion.
 *
 * `vue-router` is externalised in the config but absent from the built entry, so it is not in the
 * expectation below — this records what the bundle actually imports, not what it may import.
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
			`The set of externals changed. Pinia and Vue must stay external so this package shares ` +
				`the host app's single instance of each.`
		).toEqual(['@stonecrop/aform', '@stonecrop/schema', '@stonecrop/stonecrop', 'vue'])
	})
})
