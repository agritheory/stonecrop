import { resolve } from 'node:path'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

describe('middleware', async () => {
	await setup({
		rootDir: resolve(__dirname, 'fixtures/middleware'),
	})

	it('should execute middleware in order', async () => {
		const response = await $fetch<{ data: { middlewareTest: string } }>('/graphql/', {
			method: 'POST',
			body: {
				query: '{ middlewareTest }',
			},
		})

		// The middleware test fixture adds a value to the result
		expect(response.data.middlewareTest).toContain('middleware-executed')
	})

	it('should pass context through middleware chain', async () => {
		const response = await $fetch<{ data: { contextTest: string } }>('/graphql/', {
			method: 'POST',
			headers: {
				'x-test-header': 'test-value',
			},
			body: {
				query: '{ contextTest }',
			},
		})

		expect(response.data.contextTest).toContain('test-value')
	})
})
