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

	it('installs plugin with router option', () => {
		expect(() => {
			app.use(StonecropPlugin, { router: mockRouter })
		}).not.toThrow()

		const registry = app._context.provides.$registry
		expect(registry).toBeDefined()
		expect(registry.router).toBeDefined()
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

	it('uses existing router from app', () => {
		// Set up app with router first
		app.config.globalProperties.$router = mockRouter

		expect(() => {
			app.use(StonecropPlugin)
		}).not.toThrow()

		const registry = app._context.provides.$registry
		expect(registry).toBeDefined()
		expect(registry.router).toBeDefined()
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

		for (const [tag, component] of Object.entries(mockComponents)) {
			expect(app._context.components[tag]).toBe(component)
		}
	})
})
