import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readDistContract } from '../../common/test-support/dist-contract'

const packageRoot = resolve(__dirname, '..')

/**
 * The widest external surface in the repo, and the one most sensitive to how a bundler classifies
 * specifiers: four `postgraphile/*` subpaths, two `node:` builtins, and two plain packages. The
 * `node:` entries matter on their own — a bundler that stopped treating them as external would try
 * to bundle `fs`, which fails at runtime rather than at build time.
 */
describe('dist contract', { tags: ['unit'] }, () => {
	it('leaves exactly the expected dependencies external', () => {
		const { chunks, bare } = readDistContract(packageRoot)
		expect(chunks).toBeGreaterThan(0)

		expect(
			bare,
			`The set of externals changed. A missing 'node:' entry means a Node builtin is being ` +
				`bundled; a missing 'postgraphile/*' entry means two copies of the schema builder.`
		).toEqual([
			'@dataplan/pg',
			'@stonecrop/schema',
			'node:fs',
			'node:path',
			'postgraphile/adaptors/pg',
			'postgraphile/grafast',
			'postgraphile/presets/amber',
			'postgraphile/utils',
		])
	})
})
