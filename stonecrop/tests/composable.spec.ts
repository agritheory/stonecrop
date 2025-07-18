import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { defineComponent } from 'vue'

import { useStonecrop } from '../src/composable'
import Registry from '../src/registry'

describe('useStonecrop composable', () => {
	let mockRouter: any
	let registry: Registry
	let pinia: ReturnType<typeof createPinia>

	beforeEach(() => {
		pinia = createPinia()
		setActivePinia(pinia)

		// Reset the static instance
		Registry._root = undefined as any

		mockRouter = createRouter({
			history: createWebHistory(),
			routes: [
				{ path: '/records/:records', name: 'list', component: {} },
				{ path: '/records/:records/:record', name: 'form', component: {} },
			],
		})

		registry = new Registry(mockRouter)

		// Reset fetch mock
		vi.clearAllMocks()
	})

	it('returns a stonecrop reference', async () => {
		const TestComponent = defineComponent({
			setup() {
				return useStonecrop(registry)
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, { global: { plugins: [pinia] } })

		const vm = wrapper.vm as any
		expect(vm.stonecrop).toBeDefined()
		expect(vm.stonecrop.registry).toBeDefined()
		expect(vm.stonecrop.registry).toBeInstanceOf(Registry)
	})

	it('uses injected registry when no registry is provided', () => {
		const TestComponent = defineComponent({
			setup() {
				return useStonecrop()
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				plugins: [pinia],
				provide: {
					$registry: registry,
				},
			},
		})

		const vm = wrapper.vm as any
		expect(vm.stonecrop).toBeDefined()
		expect(vm.stonecrop.registry).toBeDefined()
		expect(vm.stonecrop.registry).toBeInstanceOf(Registry)
		expect(vm.stonecrop.registry.name).toBe(registry.name)
	})

	it('handles missing Pinia gracefully', async () => {
		const TestComponent = defineComponent({
			setup() {
				// This should work since we're just testing the composable setup
				return useStonecrop(registry)
			},
			template: '<div>test</div>',
		})

		// Mount without pinia - the composable should still set up the reactive ref
		expect(() => {
			mount(TestComponent)
		}).not.toThrow()
	})

	it('handles missing registry router gracefully', async () => {
		const registryWithoutRouter = new Registry()

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop(registryWithoutRouter)
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, { global: { plugins: [pinia] } })

		const vm = wrapper.vm as any
		expect(vm.stonecrop).toBeDefined()
		expect(vm.stonecrop.registry).toBeDefined()
		expect(vm.stonecrop.registry.router).toBeDefined()
	})

	it('handles route with doctype slug', async () => {
		const mockGetMeta = vi.fn()
		registry.getMeta = mockGetMeta

		const mockFetch = vi.fn().mockResolvedValue({
			data: { title: 'Test Task' },
			json: () => Promise.resolve({ title: 'Test Task' }),
		})
		vi.stubGlobal('fetch', mockFetch)

		// Mock router current route
		vi.spyOn(mockRouter, 'currentRoute', 'get').mockReturnValue({
			value: {
				params: {
					records: 'task',
				},
			},
		})

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop(registry)
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				plugins: [pinia],
			},
		})

		await wrapper.vm.$nextTick()
		expect(mockGetMeta).toHaveBeenCalledWith('task')
	})

	it('handles route with both doctype and record id', async () => {
		const mockGetMeta = vi.fn()
		registry.getMeta = mockGetMeta

		const mockFetch = vi.fn().mockResolvedValue({
			data: { id: '123', title: 'Test Task' },
			json: () => Promise.resolve({ id: '123', title: 'Test Task' }),
		})
		vi.stubGlobal('fetch', mockFetch)

		// Mock router current route
		vi.spyOn(mockRouter, 'currentRoute', 'get').mockReturnValue({
			value: {
				params: {
					records: 'task',
					record: '123',
				},
			},
		})

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop(registry)
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				plugins: [pinia],
			},
		})

		await wrapper.vm.$nextTick()
		expect(mockGetMeta).toHaveBeenCalledWith('task')
	})

	it('returns early when no doctype slug or record id', async () => {
		const mockGetMeta = vi.fn()
		registry.getMeta = mockGetMeta

		// Mock router current route with no relevant params
		vi.spyOn(mockRouter, 'currentRoute', 'get').mockReturnValue({
			value: {
				params: {},
			},
		})

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop(registry)
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				plugins: [pinia],
			},
		})

		await wrapper.vm.$nextTick()
		expect(mockGetMeta).not.toHaveBeenCalled()
	})
})
