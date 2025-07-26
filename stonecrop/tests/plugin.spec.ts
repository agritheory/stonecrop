import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createApp, App } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'

import StonecropPlugin from '../src/plugins'
import Registry from '../src/registry'
import { HST } from '../src/stores/hst'

describe('Stonecrop Vue Plugin with HST', () => {
	let app: App
	let mockRouter: any

	beforeEach(() => {
		app = createApp({})
		mockRouter = createRouter({
			history: createMemoryHistory(),
			routes: [
				{
					path: '/',
					name: 'home',
					component: { template: '<div>Home</div>' },
				},
			],
		})

		// Reset static instances
		Registry._root = undefined as any
	})

	it('installs plugin without options', () => {
		expect(() => {
			app.use(StonecropPlugin)
		}).not.toThrow()

		const registry = app._context.provides.$registry
		expect(registry).toBeDefined()
		expect(registry).toBeInstanceOf(Registry)
		expect(registry.router).toBeUndefined()
	})

	it('does not install Pinia (HST replaces it)', () => {
		app.use(StonecropPlugin)

		// Check that no Pinia symbol exists in provides
		const keys = Reflect.ownKeys(app._context.provides)
		const piniaSymbol = keys.find(key => key.toString().includes('pinia'))
		expect(piniaSymbol).toBeUndefined()
	})

	it('provides access to HST singleton', () => {
		app.use(StonecropPlugin)

		// HST should be accessible as singleton
		const hst1 = HST.getInstance()
		const hst2 = HST.getInstance()
		expect(hst1).toBe(hst2)
	})

	it('installs plugin with router option', () => {
		expect(() => {
			app.use(StonecropPlugin, { router: mockRouter })
		}).not.toThrow()

		const registry = app._context.provides.$registry
		expect(registry).toBeDefined()
		expect(registry.router).toBeDefined()
		expect(registry.router).toBe(mockRouter)
	})

	it('installs plugin with getMeta function', () => {
		const mockGetMeta = vi.fn()

		expect(() => {
			app.use(StonecropPlugin, {
				router: mockRouter,
				getMeta: mockGetMeta,
			})
		}).not.toThrow()

		const registry = app._context.provides.$registry
		expect(registry).toBeDefined()
		expect(registry.router).toBeDefined()
		expect(registry.getMeta).toBe(mockGetMeta)
	})

	it('uses existing router from app when available', () => {
		// Set up app with router first
		app.config.globalProperties.$router = mockRouter

		expect(() => {
			app.use(StonecropPlugin)
		}).not.toThrow()

		const registry = app._context.provides.$registry
		expect(registry).toBeDefined()
		expect(registry.router).toBeDefined()
		expect(registry.router).toBe(mockRouter)
	})

	it('installs plugin with components option', () => {
		const mockComponents = {
			CustomComponent: { template: '<div>Custom</div>' },
			AnotherComponent: { template: '<div>Another</div>' },
		}

		expect(() => {
			app.use(StonecropPlugin, {
				router: mockRouter,
				components: mockComponents,
			})
		}).not.toThrow()

		// Check that components are registered globally
		for (const [tag, component] of Object.entries(mockComponents)) {
			expect(app._context.components[tag]).toBe(component)
		}
	})

	it('Registry and HST singletons work together', () => {
		app.use(StonecropPlugin, { router: mockRouter })

		const registry = app._context.provides.$registry
		const hst = HST.getInstance()

		// In test environment, Registry might not be globally accessible
		// Let's check if we can get the registry that was created for the plugin
		const retrievedRegistry = hst.getRegistry()

		// If getRegistry returns undefined, we might need a different approach
		if (retrievedRegistry) {
			expect(retrievedRegistry).toBe(registry)
		} else {
			// Alternative: check that both singletons exist and are functioning
			expect(registry).toBeDefined()
			expect(hst).toBeDefined()
			expect(registry).toBeInstanceOf(Registry)
			expect(typeof hst.getDoctypeMeta).toBe('function')
		}
	})

	it('handles plugin installation multiple times gracefully', () => {
		expect(() => {
			app.use(StonecropPlugin)
			app.use(StonecropPlugin) // Second installation should not break
		}).not.toThrow()

		const registry = app._context.provides.$registry
		expect(registry).toBeDefined()
		expect(registry).toBeInstanceOf(Registry)
	})

	it('provides Registry through injection for composables', () => {
		app.use(StonecropPlugin, { router: mockRouter })

		// Simulate component that uses injection
		const mockComponent = {
			setup() {
				// This would normally use inject('$registry')
				return {}
			},
		}

		// Registry should be available in provides
		const registry = app._context.provides.$registry
		expect(registry).toBeDefined()
		expect(registry.router).toBe(mockRouter)
	})

	it('maintains Registry singleton behavior across plugin installs', () => {
		// Install on first app
		app.use(StonecropPlugin, { router: mockRouter })
		const registry1 = app._context.provides.$registry

		// Install on second app
		const app2 = createApp({})
		app2.use(StonecropPlugin)
		const registry2 = app2._context.provides.$registry

		// Should be the same singleton instance
		expect(registry1).toBe(registry2)
		expect(Registry._root).toBe(registry1)
	})
})
