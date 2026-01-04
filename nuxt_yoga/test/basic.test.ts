// nuxt-yoga/test/basic.test.ts
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('nuxt-yoga basic', async () => {
	await setup({
		rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
		dev: true,
		server: true,
	})

	it('should load the module', () => {
		// Module loads if we get here without errors
		expect(true).toBe(true)
	})

	it('should expose graphql endpoint', async () => {
		const response = await $fetch('/graphql/', {
			method: 'POST',
			body: {
				query: '{ __typename }',
			},
		})
		expect(response).toBeDefined()
		expect(response.data).toBeDefined()
	})

	it('should execute a simple query', async () => {
		const response = await $fetch('/graphql/', {
			method: 'POST',
			body: {
				query: '{ hello }',
			},
		})
		expect(response.data.hello).toBe('world')
	})

	it('should execute ping query', async () => {
		const response = await $fetch('/graphql/', {
			method: 'POST',
			body: {
				query: '{ ping }',
			},
		})
		expect(response.data.ping).toBe(true)
	})

	it('should execute a mutation', async () => {
		const response = await $fetch('/graphql/', {
			method: 'POST',
			body: {
				query: 'mutation { echo(message: "test") }',
			},
		})
		expect(response.data.echo).toBe('test')
	})

	it('should expose cache API', async () => {
		const response = await $fetch('/graphql/cache?action=stats')
		expect(response.success).toBe(true)
		expect(response.data).toBeDefined()
		expect(response.data.totalEntries).toBeTypeOf('number')
	})

	it('should clear cache', async () => {
		const response = await $fetch('/graphql/cache?action=clear')
		expect(response.success).toBe(true)
		expect(response.message).toContain('Cleared')
	})
})
