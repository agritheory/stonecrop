// nuxt-yoga/test/middleware.test.ts
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('middleware', async () => {
	await setup({
		rootDir: fileURLToPath(new URL('./fixtures/middleware', import.meta.url)),
		dev: true,
		server: true,
	})

	it('should execute middleware in order', async () => {
		const response = await $fetch('/graphql/', {
			method: 'POST',
			body: {
				query: '{ middlewareTest }',
			},
		})

		// The middleware test fixture adds a value to the result
		expect(response.data.middlewareTest).toContain('middleware-executed')
	})

	it('should pass context through middleware chain', async () => {
		const response = await $fetch('/graphql/', {
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
