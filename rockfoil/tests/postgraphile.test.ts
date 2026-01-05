import { describe, it, expect, vi } from 'vitest'

// Mock postgraphile/utils with a simple implementation
vi.mock('postgraphile/utils', () => ({
	makeWrapPlansPlugin: (config: any) => ({
		name: 'TestPlugin',
		version: '1.0.0',
		_config: config, // Store config for testing
	}),
}))

import { createPglRockfoilPlugin } from '../src/middleware/postgraphile'

describe('Rockfoil PostGraphile Plugin', () => {
	describe('createPglRockfoilPlugin', () => {
		it('should create a valid plugin with empty hook map', () => {
			const plugin = createPglRockfoilPlugin({})
			expect(plugin).toBeDefined()
			expect(plugin.name).toBe('TestPlugin')
			expect(plugin.version).toBe('1.0.0')
		})

		it('should create a plugin with query hooks', () => {
			const hookMap = {
				testField: {
					beforeQuery: vi.fn(),
					afterQuery: vi.fn(),
				},
			}

			const plugin = createPglRockfoilPlugin(hookMap)
			expect(plugin).toBeDefined()
			expect(plugin.name).toBe('TestPlugin')
		})

		it('should create a plugin with mutation hooks', () => {
			const hookMap = {
				createTest: {
					beforeMutation: vi.fn(),
					afterMutation: vi.fn(),
				},
			}

			const plugin = createPglRockfoilPlugin(hookMap)
			expect(plugin).toBeDefined()
			expect(plugin.name).toBe('TestPlugin')
		})

		it('should handle complex hook map', () => {
			const hookMap = {
				field1: {
					beforeQuery: vi.fn(),
				},
				field2: {
					afterQuery: vi.fn(),
				},
				field3: {
					beforeMutation: vi.fn(),
					afterMutation: vi.fn(),
				},
			}

			const plugin = createPglRockfoilPlugin(hookMap)
			expect(plugin).toBeDefined()
		})
	})
})
