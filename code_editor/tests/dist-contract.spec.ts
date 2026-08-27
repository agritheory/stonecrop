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
 * code_editor deliberately bundles Monaco rather than externalising it — `external` is `['vue']`
 * alone, though `monaco-editor` and `@monaco-editor/loader` are both runtime dependencies. The
 * expectation below therefore asserts that Monaco stays *in*, which is the opposite of what the
 * other packages assert and the reason this is written down rather than derived from package.json.
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

	it('leaves vue external and keeps Monaco bundled', () => {
		const { chunks, bare } = readDistContract(packageRoot)
		expect(chunks).toBeGreaterThan(0)

		expect(
			bare,
			`The set of externals changed. Monaco appearing here means it is no longer bundled, ` +
				`which breaks consumers that do not install it themselves.`
		).toEqual(['vue'])
	})

	it('ships declarations a consumer can resolve', () => {
		expect(
			readTypesDefects(packageRoot).filter(defect => TYPE_ERASING_CODES.has(defect.code)),
			`The published types do not typecheck on their own. A consumer with skipLibCheck on — the ` +
				`common default — sees no error and silently gets \`any\` for the affected exports.`
		).toEqual([])
	})
})
