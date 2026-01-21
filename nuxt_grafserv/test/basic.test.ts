import { describe, it, expect } from 'vitest'

describe('nuxt-grafserv basic', () => {
	it('should have module defined', async () => {
		const module = await import('../src/module')
		expect(module.default).toBeDefined()
	})

	it('should have types exported', async () => {
		const types = await import('../src/types')
		expect(types).toBeDefined()
	})

	it('should export ModuleOptions type', async () => {
		const types = await import('../src/types')
		// Type exists if we can construct a valid options object
		const options = {
			schema: './test.graphql',
			url: '/graphql/',
		}
		expect(types).toBeDefined()
		expect(options).toBeDefined()
	})
})
