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
 * The only package whose entry splits into more than one chunk, so it is also the only one where
 * the closure walk has to follow a relative hop to see the real externals: `dist/index.js`
 * re-exports from a hashed sibling and imports nothing bare itself.
 *
 * `pluralize` is a runtime dependency that is deliberately bundled, which is why the expectation
 * lists `graphql` and `zod` only.
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

	it('follows the chunk graph past the entry', () => {
		const { chunks } = readDistContract(packageRoot)

		// Guards the assertion below: were the walk to stop at `dist/index.js`, `bare` would be
		// empty and would keep matching an expectation that had been quietly emptied to suit it.
		expect(chunks).toBeGreaterThan(1)
	})

	it('leaves exactly the expected dependencies external', () => {
		const { bare } = readDistContract(packageRoot)

		expect(
			bare,
			`The set of externals changed. zod and graphql must stay external — a bundled zod means ` +
				`instanceof checks fail against a consumer's own schemas.`
		).toEqual(['graphql', 'zod'])
	})

	it('ships declarations a consumer can resolve', () => {
		expect(
			readTypesDefects(packageRoot).filter(defect => TYPE_ERASING_CODES.has(defect.code)),
			`The published types do not typecheck on their own. A consumer with skipLibCheck on — the ` +
				`common default — sees no error and silently gets \`any\` for the affected exports.`
		).toEqual([])
	})
})
