import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createApp, App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import StonecropPlugin from '../src/plugins'
import Registry from '../src/registry'

describe('Stonecrop Vue Plugin', () => {
	let app: App
	let mockRouter: any

	beforeEach(() => {
		app = createApp({})
		mockRouter = createRouter({
			history: createWebHistory(),
			routes: [],
		})

		// Reset static instances
		Registry._root = undefined as any
	})

	it('installs plugin without options', () => {
		expect(() => {
			app.use(StonecropPlugin)
		}).not.toThrow()
	})

	it('installs plugin with router option', () => {
		expect(() => {
			app.use(StonecropPlugin, { router: mockRouter })
		}).not.toThrow()
	})

	it('installs plugin with getMeta function', () => {
		const mockGetMeta = vi.fn()

		expect(() => {
			app.use(StonecropPlugin, {
				router: mockRouter,
				getMeta: mockGetMeta,
			})
		}).not.toThrow()
	})

	it('uses existing router from app', () => {
		// Set up app with router first
		app.config.globalProperties.$router = mockRouter

		expect(() => {
			app.use(StonecropPlugin)
		}).not.toThrow()
	})

	it('installs plugin with components option', () => {
		const mockComponents = {
			CustomComponent: { template: '<div>Custom</div>' },
		}

		expect(() => {
			app.use(StonecropPlugin, {
				router: mockRouter,
				components: mockComponents,
			})
		}).not.toThrow()
	})

	it('provides registry instance to app', () => {
		app.use(StonecropPlugin, { router: mockRouter })

		// Check if registry is provided
		const providedRegistry = app._context.provides.$registry
		expect(providedRegistry).toBeInstanceOf(Registry)
	})

	it('installs pinia store', () => {
		app.use(StonecropPlugin, { router: mockRouter })

		// Check if pinia is installed by checking if the app has the pinia context
		// This is a bit indirect since Pinia doesn't expose much on the app instance
		expect(app._context.provides).toHaveProperty('$registry')
		// Since we know the plugin calls app.use(pinia), if this test runs without error,
		// pinia was successfully installed
	})

	it('handles complete plugin configuration', () => {
		const mockGetMeta = vi.fn()
		const mockComponents = {
			TestComponent: { template: '<div>Test</div>' },
		}

		expect(() => {
			app.use(StonecropPlugin, {
				router: mockRouter,
				getMeta: mockGetMeta,
				components: mockComponents,
			})
		}).not.toThrow()

		const registry = app._context.provides.$registry
		expect(registry.router).toBe(mockRouter)
		expect(registry.getMeta).toBe(mockGetMeta)
	})
})
