import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readDistContract } from '../../common/test-support/dist-contract'

/**
 * The export-target walk this file used to carry is publint's now. Do not reinstate it: the walk
 * read `exports` only, so a broken `bin` entry passed every assertion here while publint caught it.
 *
 * It existed because rockfoil declared `"./styles": "./dist/assets/index.css"` for a stylesheet it
 * has never had, copy-pasted from atable/aform/beam. Three siblings support `/styles`, so a
 * consumer following that convention hit ERR_MODULE_NOT_FOUND.
 */
const packageRoot = resolve(__dirname, '..')

describe('package exports', { tags: ['unit'] }, () => {
	it('leaves exactly the expected dependencies external', () => {
		const { chunks, bare } = readDistContract(packageRoot)
		expect(chunks).toBeGreaterThan(0)

		expect(
			bare,
			`The set of externals changed. rockfoil externalises everything non-relative, so a ` +
				`specifier disappearing here means the bundler stopped honouring that rule.`
		).toEqual(['postgraphile/utils'])
	})
})
