import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
	collectExportTargets,
	readDistContract,
	readTypesDefects,
	TYPE_ERASING_CODES,
} from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * aform keeps Vue, Pinia, `@vueuse/*` and every `@stonecrop/*` sibling external, and relies on
 * `vite-plugin-lib-inject-css` to make the entry pull in its own stylesheet. Both are asserted
 * against a written-down expectation rather than re-derived from `vite.config.ts`, so a change to
 * either shows up as a diff a reviewer has to approve.
 */
describe('dist contract', { tags: ['unit'] }, () => {
	it('resolves every declared export target to a file on disk', () => {
		const targets = collectExportTargets(packageRoot)
		expect(targets.length).toBeGreaterThan(0)

		const missing = targets
			.filter(({ target }) => !existsSync(resolve(packageRoot, target)))
			.map(({ label, target }) => `${label} -> ${target}`)

		expect(missing, `Export targets missing from dist. Run \`pnpm run build\` first.`).toEqual([])
	})

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

	// Builds a whole TypeScript program over the emitted declarations, so this costs seconds, not
	// milliseconds. The default 5s timeout passes locally and times out on CI's slower runners.
	it('ships declarations a consumer can resolve', () => {
		expect(
			readTypesDefects(packageRoot).filter(defect => TYPE_ERASING_CODES.has(defect.code)),
			`The published types do not typecheck on their own. A consumer with skipLibCheck on — the ` +
				`common default — sees no error and silently gets \`any\` for the affected exports.`
		).toEqual([])
	}, 60_000)
})
