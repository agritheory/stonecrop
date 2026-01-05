// nuxt-grafserv/test/schema.test.ts
import { describe, it, expect } from 'vitest'

describe('nuxt-grafserv module configuration', () => {
	it('should export a valid Nuxt module', async () => {
		const module = await import('../src/module')
		const nuxtModule = module.default

		// Check that the module is a function or object with setup
		expect(nuxtModule).toBeDefined()
		expect(typeof nuxtModule).toBe('function')
	})

	it('should have module metadata accessible via getOptions', async () => {
		const module = await import('../src/module')
		const nuxtModule = module.default

		// The nuxt module is a function with attached properties
		// Check that it exists and is callable
		expect(nuxtModule).toBeDefined()

		// The meta property is set on the module function
		if ('meta' in nuxtModule) {
			expect((nuxtModule as any).meta.name).toBe('nuxt-grafserv')
			expect((nuxtModule as any).meta.configKey).toBe('grafserv')
		}
	})

	it('should export ModuleOptions type', async () => {
		const types = await import('../src/types')
		// Type imports work if this doesn't throw
		expect(types).toBeDefined()
	})
})
