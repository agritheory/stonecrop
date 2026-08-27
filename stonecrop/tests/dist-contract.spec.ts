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
 * The widest Vue-side external surface: three singleton-sensitive peers (`vue`, `pinia`,
 * `vue-router`) alongside `immutable`, whose bundled copy would make identity comparisons against
 * a consumer's own collections fail silently.
 *
 * `xstate` and `pinia-shared-state` are runtime dependencies that the built entry does not reach,
 * so they are absent here by design.
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
		expect(chunks).toBeGreaterThan(0)

		expect(
			bare,
			`The set of externals changed. vue, pinia and vue-router must stay external so this ` +
				`package shares the host app's single instance of each.`
		).toEqual(['@stonecrop/aform', '@stonecrop/schema', '@vueuse/core', 'immutable', 'pinia', 'vue', 'vue-router'])
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
