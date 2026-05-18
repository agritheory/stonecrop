import { describe, it, expect, vi } from 'vitest'

import { yogaCaslPlugin, createYogaPlugin } from '../src/middleware/yoga'

describe('Yoga CASL Plugin', { tags: ['unit', 'graphql'] }, () => {
	it('should be a valid Yoga plugin', () => {
		expect(yogaCaslPlugin).toBeDefined()
		expect(typeof yogaCaslPlugin).toBe('object')
		expect(yogaCaslPlugin).toHaveProperty('onContextBuilding')
	})

	it('should extend context with ability and user', async () => {
		const mockContext = {}
		const extendContext = vi.fn(extension => {
			Object.assign(mockContext, extension)
		})

		const contextParams = {
			context: mockContext,
			extendContext,
		}

		// Execute the plugin
		await yogaCaslPlugin.onContextBuilding!(contextParams as any)

		expect(extendContext).toHaveBeenCalled()
		expect(extendContext).toHaveBeenCalledWith(
			expect.objectContaining({
				ability: expect.any(Object),
				user: expect.objectContaining({
					id: '1',
					roles: ['editor'],
				}),
			})
		)
	})

	it('should create ability with editor permissions', async () => {
		const mockContext = {}
		let extendedData: any = {}
		const extendContext = vi.fn(extension => {
			extendedData = extension
		})

		const contextParams = {
			context: mockContext,
			extendContext,
		}

		await yogaCaslPlugin.onContextBuilding!(contextParams as any)

		// Check that the ability was created with editor permissions
		expect(extendedData.ability).toBeDefined()
		expect(extendedData.user.roles).toContain('editor')

		// The ability should have the permissions we expect for an editor
		const ability = extendedData.ability
		expect(ability.can('read', 'Query')).toBe(true)
	})

	describe('createYogaPlugin', () => {
		it('should create a plugin with default options', () => {
			const plugin = createYogaPlugin()

			expect(plugin).toBeDefined()
			expect(plugin).toHaveProperty('onExecute')
			expect(typeof plugin.onExecute).toBe('function')
		})

		it('should create a plugin with custom options', () => {
			const customBuilder = async () => {
				const { defaultAbilityBuilder } = await import('../src/middleware/ability')
				return defaultAbilityBuilder()
			}

			const plugin = createYogaPlugin({
				abilityBuilder: customBuilder,
			})

			expect(plugin).toBeDefined()
			expect(plugin).toHaveProperty('onExecute')
		})

		it('should log message when onExecute is called', async () => {
			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
			const plugin = createYogaPlugin()

			const mockArgs = {
				args: {
					schema: {},
					document: {},
					contextValue: {},
				},
			}

			await plugin.onExecute(mockArgs)

			expect(consoleSpy).toHaveBeenCalledWith('Yoga plugin not yet implemented')
			consoleSpy.mockRestore()
		})
	})

	describe('yogaCaslPlugin edge cases', () => {
		it('should handle missing onContextBuilding gracefully', async () => {
			// Test that the plugin has the expected property
			expect(yogaCaslPlugin.onContextBuilding).toBeDefined()
		})

		it('should extend context even with empty initial context', async () => {
			let extendedData: any = {}
			const extendContext = vi.fn(extension => {
				extendedData = extension
			})

			const contextParams = {
				context: {},
				extendContext,
			}

			await yogaCaslPlugin.onContextBuilding!(contextParams as any)

			expect(extendContext).toHaveBeenCalled()
			expect(extendedData).toHaveProperty('ability')
			expect(extendedData).toHaveProperty('user')
		})

		it('should create ability with default permissions', async () => {
			let extendedData: any = {}
			const extendContext = vi.fn(extension => {
				extendedData = extension
			})

			const contextParams = {
				context: {},
				extendContext,
			}

			await yogaCaslPlugin.onContextBuilding!(contextParams as any)

			const ability = extendedData.ability

			// Default ability should have Query read access
			expect(ability.can('read', 'Query')).toBe(true)
		})

		it('should handle context extension errors', async () => {
			const extendContext = vi.fn(() => {
				throw new Error('Extension failed')
			})

			const contextParams = {
				context: {},
				extendContext,
			}

			// Should not throw, but let the error propagate
			await expect(yogaCaslPlugin.onContextBuilding!(contextParams as any)).rejects.toThrow('Extension failed')
		})
	})
})
