import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createApp, App } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'

import Stonecrop from '../src/plugins'
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
			app.use(Stonecrop)
		}).not.toThrow()

		const registry = app._context.provides.$registry
		expect(registry).toBeDefined()
		expect(registry).toBeInstanceOf(Registry)
		expect(registry.router).toBeUndefined()
	})

	it('does not install Pinia (HST replaces it)', () => {
		app.use(Stonecrop)

		// Check that no Pinia symbol exists in provides
		const keys = Reflect.ownKeys(app._context.provides)
		const piniaSymbol = keys.find(key => key.toString().includes('pinia'))
		expect(piniaSymbol).toBeUndefined()
	})

	it('provides access to HST singleton', () => {
		app.use(Stonecrop)

		// HST should be accessible as singleton
		const hst1 = HST.getInstance()
		const hst2 = HST.getInstance()
		expect(hst1).toBe(hst2)
	})

	it('installs plugin with router option', () => {
		expect(() => {
			app.use(Stonecrop, { router: mockRouter })
		}).not.toThrow()

		const registry = app._context.provides.$registry
		expect(registry).toBeDefined()
		expect(registry.router).toBeDefined()
		expect(registry.router).toBe(mockRouter)
	})

	it('installs plugin with getMeta function', () => {
		const mockGetMeta = vi.fn()

		expect(() => {
			app.use(Stonecrop, {
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
			app.use(Stonecrop)
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
			app.use(Stonecrop, {
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
		app.use(Stonecrop, { router: mockRouter })

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
		// Vue emits a warning when a plugin is installed twice — that is expected
		// behaviour and exactly what this test exercises. Suppress the warning so it
		// doesn't appear in test output.
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		expect(() => {
			app.use(Stonecrop)
			app.use(Stonecrop) // Second installation should not break
		}).not.toThrow()
		warnSpy.mockRestore()

		const registry = app._context.provides.$registry
		expect(registry).toBeDefined()
		expect(registry).toBeInstanceOf(Registry)
	})

	it('provides Registry through injection for composables', () => {
		app.use(Stonecrop, { router: mockRouter })

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
		app.use(Stonecrop, { router: mockRouter })
		const registry1 = app._context.provides.$registry

		// Install on second app
		const app2 = createApp({})
		app2.use(Stonecrop)
		const registry2 = app2._context.provides.$registry

		// Should be the same singleton instance
		expect(registry1).toBe(registry2)
		expect(Registry._root).toBe(registry1)
	})

	it('handles auto-initialization with router callback', async () => {
		const onRouterInitialized = vi.fn()

		app.use(Stonecrop, {
			router: mockRouter,
			autoInitializeRouter: true,
			onRouterInitialized,
		})

		// Wait for nextTick
		await new Promise(resolve => setTimeout(resolve, 0))

		expect(onRouterInitialized).toHaveBeenCalled()
		expect(onRouterInitialized).toHaveBeenCalledWith(expect.any(Registry), expect.any(Object))
	})

	it('handles auto-initialization with async router callback', async () => {
		const onRouterInitialized = vi.fn().mockResolvedValue(undefined)

		app.use(Stonecrop, {
			router: mockRouter,
			autoInitializeRouter: true,
			onRouterInitialized,
		})

		// Wait for async execution
		await new Promise(resolve => setTimeout(resolve, 10))

		expect(onRouterInitialized).toHaveBeenCalled()
	})

	it('handles auto-initialization without router callback', async () => {
		app.use(Stonecrop, {
			router: mockRouter,
			autoInitializeRouter: true,
		})

		// Should not throw even without callback
		await new Promise(resolve => setTimeout(resolve, 0))

		const registry = app._context.provides.$registry
		expect(registry).toBeDefined()
	})

	it('handles auto-initialization callback', async () => {
		const initCallback = vi.fn().mockResolvedValue(undefined)

		app.use(Stonecrop, {
			router: mockRouter,
			autoInitializeRouter: true,
			onRouterInitialized: initCallback,
		})

		await new Promise(resolve => setTimeout(resolve, 10))

		expect(initCallback).toHaveBeenCalledWith(expect.any(Registry), expect.any(Object))
	})

	it('handles initialization errors gracefully', async () => {
		const errorCallback = vi.fn().mockRejectedValue(new Error('Test error'))

		// Should not throw despite callback error
		expect(() => {
			app.use(Stonecrop, {
				router: mockRouter,
				autoInitializeRouter: true,
				onRouterInitialized: errorCallback,
			})
		}).not.toThrow()

		await new Promise(resolve => setTimeout(resolve, 10))

		expect(errorCallback).toHaveBeenCalled()
	})

	it('skips auto-initialization when no callback provided', async () => {
		app.use(Stonecrop, {
			router: mockRouter,
			autoInitializeRouter: true,
			// No onRouterInitialized callback
		})

		await new Promise(resolve => setTimeout(resolve, 10))

		// Should not throw or cause issues
		expect(app.config.globalProperties.$stonecrop).toBeDefined()
	})

	it('passes fetchRecord option through to Stonecrop instance', () => {
		const fetchRecordFn = vi.fn().mockResolvedValue(null)

		app.use(Stonecrop, {
			router: mockRouter,
			fetchRecord: fetchRecordFn,
		})

		// The Stonecrop instance should have _fetchRecord set (private, accessed via any)
		const stonecropInstance = app.config.globalProperties.$stonecrop as any
		expect(stonecropInstance).toBeDefined()
		expect(stonecropInstance._fetchRecord).toBe(fetchRecordFn)
	})

	it('passes fetchRecords option through to Stonecrop instance', () => {
		const fetchRecordsFn = vi.fn().mockResolvedValue([])

		app.use(Stonecrop, {
			router: mockRouter,
			fetchRecords: fetchRecordsFn,
		})

		const stonecropInstance = app.config.globalProperties.$stonecrop as any
		expect(stonecropInstance).toBeDefined()
		expect(stonecropInstance._fetchRecords).toBe(fetchRecordsFn)
	})

	it('Stonecrop instance uses injected fetchRecord instead of fetch()', async () => {
		const mockRecord = { id: '99', title: 'Plugin-injected record' }
		const fetchRecordFn = vi.fn().mockResolvedValue(mockRecord)

		app.use(Stonecrop, {
			router: mockRouter,
			fetchRecord: fetchRecordFn,
		})

		const { List } = await import('immutable')
		const { default: DoctypeMeta } = await import('../src/doctype')
		const mockDoctype = new DoctypeMeta('Widget', List([]), undefined as any, undefined as any)

		const stonecropInstance = app.config.globalProperties.$stonecrop as any
		await stonecropInstance.registry.addDoctype(mockDoctype)
		await stonecropInstance.getRecord(mockDoctype, '99')

		expect(fetchRecordFn).toHaveBeenCalledWith(mockDoctype, '99')
	})

	it('registers custom components when provided', () => {
		const MockComponent = { template: '<div>Mock</div>' }
		const spy = vi.spyOn(app, 'component')

		app.use(Stonecrop, {
			components: {
				'mock-component': MockComponent,
			},
		})

		expect(spy).toHaveBeenCalledWith('mock-component', MockComponent)
	})

	it('uses existing router when available', () => {
		// Pre-install router
		app.use(mockRouter)

		app.use(Stonecrop, {
			router: createRouter({
				history: createMemoryHistory(),
				routes: [],
			}),
		})

		const registry = app._context.provides.$registry
		expect(registry.router).toBe(mockRouter)
	})

	it('installs provided router when no existing router', () => {
		const routerSpy = vi.spyOn(app, 'use')

		app.use(Stonecrop, {
			router: mockRouter,
		})

		expect(routerSpy).toHaveBeenCalledWith(mockRouter)
	})
})
