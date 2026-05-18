import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

/**
 * E2E test for nuxt-grafserv with basic resolvers
 *
 * This test verifies that the Nuxt module works correctly with simple
 * GraphQL schemas and resolvers (without PostGraphile).
 */
// Skipped: @vue/compiler-sfc@3.5.x CJS bundle does bare require('magic-string')
// without interop helpers; vite-node resolves it via the ESM condition and returns
// a namespace object instead of the constructor. Fixed in Vue 3.6.0+. This is a
// test-tooling issue only — the GraphQL server works correctly in normal Nuxt builds.
describe.skip('Basic Resolvers E2E', { tags: ['e2e', 'nuxt', 'graphql'] }, async () => {
	// Setup Nuxt with the basic fixture
	await setup({
		rootDir: fileURLToPath(new URL('../fixtures/basic', import.meta.url)),
		server: true,
		browser: false,
	})

	it('serves GraphiQL interface at /graphql/', async () => {
		const html = await $fetch('/graphql/', {
			headers: {
				Accept: 'text/html',
			},
		})

		// GraphiQL/Ruru should return HTML
		expect(typeof html).toBe('string')
		expect(html.length).toBeGreaterThan(0)
	})

	it('executes simple query', async () => {
		const response = await $fetch('/graphql/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: '{ hello }',
			}),
		})

		expect(response).toEqual({
			data: {
				hello: 'Hello, World!',
			},
		})
	})

	it('executes query with arguments', async () => {
		const response = await $fetch('/graphql/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: '{ user(id: "1") { id name email } }',
			}),
		})

		expect(response).toEqual({
			data: {
				user: {
					id: '1',
					name: 'Alice',
					email: 'alice@example.com',
				},
			},
		})
	})

	it('executes query returning array', async () => {
		const response = await $fetch('/graphql/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: '{ users { id name } }',
			}),
		})

		expect(response).toEqual({
			data: {
				users: [
					{ id: '1', name: 'Alice' },
					{ id: '2', name: 'Bob' },
				],
			},
		})
	})
})
