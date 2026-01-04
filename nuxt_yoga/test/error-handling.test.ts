// nuxt-yoga/test/error-handling.test.ts
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('error handling', async () => {
	await setup({
		rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
		dev: true,
		server: true,
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
		const response = await $fetch('/graphql/', {
			method: 'POST',
			body: {
				query: '{ nonExistentField }',
			},
		})
		expect(response.errors).toBeDefined()
		expect(response.errors.length).toBeGreaterThan(0)
	})

	it('should handle cache API with invalid action', async () => {
		const response = await $fetch('/graphql/cache?action=invalid')
		expect(response.success).toBe(false)
		expect(response.availableActions).toBeDefined()
	})
})
