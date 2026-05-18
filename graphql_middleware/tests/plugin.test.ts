import { describe, it, expect, vi } from 'vitest'

import { createStonecropPlugin } from '../src/plugin/postgraphile'

// ===========================================================================
// createStonecropPlugin — inflection resolution coverage
// ===========================================================================

describe('createStonecropPlugin', { tags: ['unit', 'graphql'] }, () => {
	const mockExecutor = { query: vi.fn(), mutate: vi.fn() }

	it('creates a plugin with default inflection', () => {
		const plugin = createStonecropPlugin({ executor: mockExecutor })
		expect(plugin).toBeDefined()
	})

	it('accepts partial inflection overrides', () => {
		const plugin = createStonecropPlugin({
			executor: mockExecutor,
			inflection: {
				recordFieldName: t => `${t}ByRowId`,
				recordArgName: () => 'rowId',
			},
		})
		expect(plugin).toBeDefined()
	})

	it('accepts full inflection overrides', () => {
		const plugin = createStonecropPlugin({
			executor: mockExecutor,
			inflection: {
				recordFieldName: t => `custom_${t}`,
				connectionFieldName: t => `list_${t}`,
				orderByTypeName: t => `${t}Sort`,
				recordArgName: () => 'nodeId',
				recordArgType: () => 'ID!',
			},
		})
		expect(plugin).toBeDefined()
	})

	it('accepts reverseConnectionName override', () => {
		const plugin = createStonecropPlugin({
			executor: mockExecutor,
			inflection: {
				reverseConnectionName: ({ target }) => `Custom_${target}`,
			},
		})
		expect(plugin).toBeDefined()
	})
})
