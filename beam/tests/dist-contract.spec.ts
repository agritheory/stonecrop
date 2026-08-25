import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { collectExportTargets, readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * beam externalises two plain npm packages by name — `mqtt` and `onscan.js` — rather than by a
 * scope pattern, so a matcher change affects them differently from the `@vueuse/*` entries.
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
			`The set of externals changed. A specifier that disappeared is now bundled into dist — ` +
				`for vue that ships a second copy into every consumer app.`
		).toEqual(['@vueuse/components', '@vueuse/core', 'mqtt', 'onscan.js', 'vue'])
	})

	it('side-effect-imports its stylesheet from the entry', () => {
		const { css } = readDistContract(packageRoot)

		expect(
			css,
			`libInjectCss no longer injects the stylesheet import. Consumers that import the package ` +
				`without also importing '@stonecrop/beam/styles' render unstyled.`
		).toEqual(['./assets/index.css'])
	})
})
