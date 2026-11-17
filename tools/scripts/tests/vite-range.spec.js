import { describe, expect, it } from 'vite-plus/test'

import { bundledVite, oneVite, rangeProblem } from '../vite-range.mjs'

const core = { name: '@voidzero-dev/vite-plus-core', version: '1.3.0', vite: '8.3.4' }

describe('rangeProblem', { tags: ['unit'] }, () => {
	it('accepts a range the Vite inside the core satisfies', () => {
		expect(rangeProblem('^8.2.0', core)).toBeUndefined()
	})

	// The case pnpm stays silent on: the override replaces the range without comparing it.
	it('reports a range only a newer Vite satisfies', () => {
		expect(rangeProblem('^8.4.0', core)).toBe(
			'wants Vite ^8.4.0, and gets Vite 8.3.4 inside @voidzero-dev/vite-plus-core@1.3.0'
		)
	})

	it('compares an npm alias with the core itself, not with the Vite inside it', () => {
		expect(rangeProblem('npm:@voidzero-dev/vite-plus-core@1.3.0', core)).toBeUndefined()
		expect(rangeProblem('npm:@voidzero-dev/vite-plus-core@1.4.0', core)).toBe(
			'wants @voidzero-dev/vite-plus-core@1.4.0, and gets @voidzero-dev/vite-plus-core@1.3.0'
		)
	})

	it('reports a spec it cannot read rather than passing it', () => {
		expect(rangeProblem('github:vitejs/vite', core)).toMatch(/neither a version range nor an npm alias/)
	})
})

describe('oneVite', { tags: ['unit'] }, () => {
	it('accepts one core, however many peer variants pnpm lists it under', () => {
		expect(oneVite([core, { ...core }])).toBeUndefined()
	})

	it('reports a second core, which every spec can satisfy on its own', () => {
		expect(oneVite([core, { ...core, version: '1.2.0' }])).toBe(
			'vite resolves to 2 packages, @voidzero-dev/vite-plus-core@1.3.0 and @voidzero-dev/vite-plus-core@1.2.0, ' +
				'so two toolchains are installed'
		)
	})
})

describe('bundledVite', { tags: ['unit'] }, () => {
	it('reads the Vite that Vite+ core declares it bundles', () => {
		const manifest = { name: core.name, version: '1.3.0', bundledVersions: { vite: '8.3.4' } }
		expect(bundledVite(manifest)).toBe('8.3.4')
	})

	it('takes plain Vite at its own version', () => {
		expect(bundledVite({ name: 'vite', version: '8.3.4' })).toBe('8.3.4')
	})

	it('throws for a package declaring no bundled Vite', () => {
		expect(() => bundledVite({ name: 'not-vite', version: '1.0.0' })).toThrow(/declares no bundled Vite/)
	})
})
