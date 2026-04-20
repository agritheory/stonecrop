import { readFileSync } from 'fs'
import { join } from 'path'
import { describe, it, expect, vi } from 'vitest'

import { createStonecropPlugin } from '../src/plugin/postgraphile'

// ===========================================================================
// createStonecropPlugin — inflection resolution coverage
// ===========================================================================

describe('createStonecropPlugin', () => {
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
})

// ===========================================================================
// GraphQL Schema Structure Validation
// ===========================================================================

describe('StonecropWorkflowMeta schema', () => {
	const sourceFile = readFileSync(join(__dirname, '../src/plugin/postgraphile.ts'), 'utf-8')

	it('defines StonecropWorkflowAction type with required subfields', () => {
		expect(sourceFile).toContain('type StonecropWorkflowAction {')
		expect(sourceFile).toContain('label: String!')
		expect(sourceFile).toContain('handler: String!')
		expect(sourceFile).toContain('requiredFields: [String!]')
		expect(sourceFile).toContain('allowedStates: [String!]')
		expect(sourceFile).toContain('confirm: Boolean')
		expect(sourceFile).toContain('args: JSON')
	})

	it('defines StonecropWorkflowMeta.actions as array of StonecropWorkflowAction, not JSON scalar', () => {
		expect(sourceFile).toContain('actions: [StonecropWorkflowAction!]')
		expect(sourceFile).not.toContain('actions: JSON')
	})
})
