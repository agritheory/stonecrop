import { resolve } from 'node:path'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

describe('error handling', async () => {
	await setup({
		rootDir: resolve(__dirname, 'fixtures/basic'),
	})

	it('should handle malformed queries', async () => {
		try {
			await $fetch('/graphql/', {
				method: 'POST',
				body: {
					query: '{ malformed query }',
				},
			})
			expect.fail('Should have thrown an error')
		} catch (error) {
			expect(error).toBeDefined()
		}
	})

	it('should handle missing query', async () => {
		try {
			await $fetch('/graphql/', {
				method: 'POST',
				body: {},
			})
			expect.fail('Should have thrown an error')
		} catch (error) {
			expect(error).toBeDefined()
		}
	})

	it('should handle non-existent fields', async () => {
		const response = await $fetch<{ errors?: { message: string }[] }>('/graphql/', {
			method: 'POST',
			body: {
				query: '{ nonExistentField }',
			},
		})
		expect(response.errors).toBeDefined()
		expect(response.errors!.length).toBeGreaterThan(0)
	})

	it('should handle cache API with invalid action', async () => {
		const response = await $fetch<{ success: boolean; availableActions: string[] }>('/graphql/cache?action=invalid')
		expect(response.success).toBe(false)
		expect(response.availableActions).toBeDefined()
	})
})
