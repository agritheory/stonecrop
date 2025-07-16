import type { SchemaTypes } from '@stonecrop/aform'
import { mount } from '@vue/test-utils'
import { List, Map } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { defineComponent } from 'vue'

import { useStonecrop } from '../src/composable'
import DoctypeMeta from '../src/doctype'
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

	const createMockDoctype = (name: string) => {
		const mockSchema = List([
			{
				fieldname: 'title',
				component: 'ATextInput',
				label: 'Title',
			},
		] as SchemaTypes[])

		const mockWorkflow = {
			id: name.toLowerCase(),
			initial: 'draft',
			states: {
				draft: { on: { SUBMIT: 'pending' } },
				pending: { on: { APPROVE: 'completed', REJECT: 'draft' } },
				completed: { type: 'final' as const },
			},
		}

		const mockActions = Map({
			LOAD: ['loadData'],
			SAVE: ['validateData', 'saveData'],
		})

		return new DoctypeMeta(name, mockSchema, mockWorkflow, mockActions)
	}

	it('returns a reactive stonecrop reference', () => {
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

		const vm = wrapper.vm as any
		expect(vm.stonecrop).toBeDefined()
		expect(vm.stonecrop.value).toBeUndefined() // Initially undefined until mounted
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

	it('handles missing router gracefully', async () => {
		const registryWithoutRouter = new Registry()

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop(registryWithoutRouter)
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				plugins: [pinia],
			},
		})

		const vm = wrapper.vm as any
		expect(vm.stonecrop).toBeDefined()
		// Should not throw error, just return early
	})

	it('handles route with doctype slug', async () => {
		const mockGetMeta = vi.fn().mockResolvedValue(createMockDoctype('Task'))
		registry.getMeta = mockGetMeta

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
		const mockGetMeta = vi.fn().mockResolvedValue(createMockDoctype('Task'))
		registry.getMeta = mockGetMeta

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
