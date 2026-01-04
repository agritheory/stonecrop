import { describe, it, expect, vi } from 'vitest'
import { yogaCaslPlugin } from '../src/middleware/yoga'

describe('Yoga CASL Plugin', () => {
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
		await yogaCaslPlugin.onContextBuilding(contextParams as any)

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

		await yogaCaslPlugin.onContextBuilding(contextParams as any)

		// Check that the ability was created with editor permissions
		expect(extendedData.ability).toBeDefined()
		expect(extendedData.user.roles).toContain('editor')

		// The ability should have the permissions we expect for an editor
		const ability = extendedData.ability
		expect(ability.can('read', 'Query')).toBe(true)
	})
})
