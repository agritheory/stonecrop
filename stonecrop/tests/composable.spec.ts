import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { defineComponent, ref, computed } from 'vue'

import { useStonecrop } from '../src/composable'
import Registry from '../src/registry'
import { Stonecrop } from '../src/stonecrop'
import { HST } from '../src/stores/hst'
import DoctypeMeta from '../src/doctype'
import { List, Map } from 'immutable'
import { createMachine, type MachineConfig } from 'xstate'
import type { SchemaTypes } from '@stonecrop/aform'

// Configure jsdom environment
/**
 * @vitest-environment jsdom
 */

const createMockDoctype = (name: string) => {
	const mockSchema = List([
		{
			fieldname: 'title',
			component: 'ATextInput',
			label: 'Title',
		},
	] as SchemaTypes[])

	const mockWorkflowConfig: MachineConfig<any, any, any> = {
		id: name.toLowerCase(),
		initial: 'draft',
		states: {
			draft: { on: { load: { target: 'pending' } } },
			pending: {
				on: {
					approve: { target: 'completed' },
					reject: { target: 'draft' },
				},
			},
			completed: { type: 'final' },
		},
	}

	const mockWorkflow = createMachine(mockWorkflowConfig)

	const mockActions = Map({
		load: ['loadData'],
		save: ['validateData', 'saveData'],
	})

	return new DoctypeMeta(name, mockSchema, mockWorkflow, mockActions)
}

describe('useStonecrop composable', () => {
	let mockRouter: any
	let registry: Registry

	beforeEach(() => {
		// Reset static instances
		Registry._root = undefined as any
		// Reset HST singleton too if it exists
		;(HST as any).instance = undefined

		mockRouter = createRouter({
			history: createMemoryHistory(),
			routes: [
				{ path: '/records/:records', name: 'list', component: {} },
				{ path: '/records/:records/:record', name: 'form', component: {} },
			],
		})

		registry = new Registry(mockRouter)

		// Reset fetch mock
		vi.clearAllMocks()
	})

	it('returns a stonecrop reference with HST integration', async () => {
		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent)

		// Wait for onMounted to complete
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		expect(vm.stonecrop).toBeDefined()

		// Should be Stonecrop instance after onMounted
		expect(vm.stonecrop).toBeInstanceOf(Stonecrop)
		// Check that the registry is the same (comparing name instead of object identity)
		expect(vm.stonecrop.registry.name).toBe(registry.name)
		expect(vm.stonecrop.getStore).toBeDefined()
	})

	it('uses injected registry when no registry is provided', async () => {
		const TestComponent = defineComponent({
			setup() {
				return useStonecrop()
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				provide: {
					$registry: registry,
				},
			},
		})

		// Wait for onMounted to complete
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		expect(vm.stonecrop).toBeDefined()
		expect(vm.stonecrop).toBeInstanceOf(Stonecrop)
		// Check that the registry is the same (comparing name instead of object identity)
		expect(vm.stonecrop.registry.name).toBe(registry.name)
	})

	it('sets undefined stonecrop instance when no registry is available', async () => {
		const TestComponent = defineComponent({
			setup() {
				return useStonecrop()
			},
			template: '<div>test</div>',
		})

		// Mock console.error to prevent error output in tests and catch the error
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		// The mount should succeed, but the component should have undefined stonecrop
		const wrapper = mount(TestComponent)
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		// The stonecrop ref should remain undefined due to error in onMounted
		expect(vm.stonecrop).toBeUndefined()

		// Restore console.error
		consoleSpy.mockRestore()
	})

	it('handles missing registry router gracefully', async () => {
		const registryWithoutRouter = new Registry()

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry: registryWithoutRouter })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent)

		// Wait for onMounted to complete
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		// Should still create Stonecrop instance
		expect(vm.stonecrop).toBeInstanceOf(Stonecrop)
	})

	it('handles route with doctype slug and creates HST sections', async () => {
		const mockDoctype = createMockDoctype('Task')
		const mockGetMeta = vi.fn().mockResolvedValue(mockDoctype)
		registry.getMeta = mockGetMeta

		const mockFetch = vi.fn().mockResolvedValue({
			json: () =>
				Promise.resolve([
					{ id: '1', title: 'Task 1' },
					{ id: '2', title: 'Task 2' },
				]),
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
				return useStonecrop({ registry })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent)

		// Wait for async operations to complete
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 10))

		const vm = wrapper.vm as any
		expect(mockGetMeta).toHaveBeenCalledWith('task')

		// Check that HST store has the doctype section
		if (vm.stonecrop) {
			const store = vm.stonecrop.getStore()
			expect(store.has('task')).toBe(true)
		}
	})

	it('handles route with both doctype and record id', async () => {
		const mockDoctype = createMockDoctype('Task')
		const mockGetMeta = vi.fn().mockResolvedValue(mockDoctype)
		registry.getMeta = mockGetMeta

		const mockFetch = vi.fn().mockResolvedValue({
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
				return useStonecrop({ registry })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent)

		// Wait for async operations to complete
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 10))

		const vm = wrapper.vm as any
		expect(mockGetMeta).toHaveBeenCalledWith('task')

		// Check that stonecrop is working
		if (vm.stonecrop) {
			expect(vm.stonecrop.getRecordIds('task').length).toBeGreaterThan(0)
		}
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
				return useStonecrop({ registry })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent)

		// Wait for onMounted to complete
		await wrapper.vm.$nextTick()

		expect(mockGetMeta).not.toHaveBeenCalled()
	})

	it('provides HST-based record access methods', async () => {
		const mockDoctype = createMockDoctype('Task')
		registry.addDoctype(mockDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent)

		// Wait for onMounted to complete
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		if (vm.stonecrop) {
			// Test HST-based methods exist
			expect(typeof vm.stonecrop.records).toBe('function')
			expect(typeof vm.stonecrop.addRecord).toBe('function')

			// Test that records returns HST node
			const records = vm.stonecrop.records('task')
			expect(records.getPath).toBeDefined()
			expect(records.getPath()).toBe('task')
		}
	})
})

describe('useStonecrop router-based HST integration', () => {
	let mockRouter: any
	let registry: Registry

	beforeEach(() => {
		// Reset static instances
		Registry._root = undefined as any
		;(HST as any).instance = undefined

		mockRouter = createRouter({
			history: createMemoryHistory(),
			routes: [
				{ path: '/records/:records', name: 'list', component: {} },
				{ path: '/records/:records/:record', name: 'form', component: {} },
			],
		})

		registry = new Registry(mockRouter)

		// Reset fetch mock
		vi.clearAllMocks()
	})

	it('should initialize HST integration when doctype is loaded from router', async () => {
		const mockDoctype = createMockDoctype('Issue')
		const mockGetMeta = vi.fn().mockResolvedValue(mockDoctype)
		registry.getMeta = mockGetMeta

		vi.spyOn(mockRouter, 'currentRoute', 'get').mockReturnValue({
			value: {
				name: 'issue',
				path: '/issue/1',
				params: {
					records: 'issue',
					record: '1',
				},
			},
		})

		const TestComponent = defineComponent({
			setup() {
				// Using composable without explicit doctype, expecting router-based setup
				const result = useStonecrop()

				return {
					...result,
					// These should be defined but currently aren't
					hasHSTIntegration: !!(result.formData && result.handleHSTChange),
				}
			},
			template: '<div>{{ hasHSTIntegration }}</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				provide: {
					$registry: registry,
				},
			},
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any

		// This test will currently FAIL because router-based setup
		// doesn't initialize HST integration
		expect(vm.formData).toBeDefined()
		expect(vm.handleHSTChange).toBeDefined()
		expect(vm.provideHSTPath).toBeDefined()
		expect(vm.hstStore).toBeDefined()
	})

	it('should handle field changes with router-loaded doctype', async () => {
		const mockDoctype = createMockDoctype('Todo')
		const mockGetMeta = vi.fn().mockResolvedValue(mockDoctype)
		registry.getMeta = mockGetMeta

		vi.spyOn(mockRouter, 'currentRoute', 'get').mockReturnValue({
			value: {
				name: 'todo-detail',
				path: '/todo/1',
				params: {
					records: 'todo',
					record: '1',
				},
			},
		})

		const TestComponent = defineComponent({
			template: `
				<div>
					<input
						v-model="title"
						@input="handleTitleChange"
						data-testid="title-input"
					/>
					<div data-testid="hst-path">{{ hstPath }}</div>
				</div>
			`,
			setup() {
				const composableResult = useStonecrop()

				const title = ref('')

				const handleTitleChange = (event: Event) => {
					const value = (event.target as HTMLInputElement).value

					// This will fail because handleHSTChange doesn't exist
					// when doctype is loaded from router
					if (composableResult.handleHSTChange) {
						composableResult.handleHSTChange({
							path: composableResult.provideHSTPath?.('title') || '',
							value,
							fieldname: 'title',
						})
					}
				}

				const hstPath = computed(() => {
					// This will be undefined with current implementation
					return composableResult.provideHSTPath?.('title') || 'undefined'
				})

				return {
					title,
					handleTitleChange,
					hstPath,
					...composableResult,
				}
			},
		})

		const wrapper = mount(TestComponent, {
			global: {
				provide: {
					$registry: registry,
				},
			},
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const input = wrapper.find('[data-testid="title-input"]')
		const pathDiv = wrapper.find('[data-testid="hst-path"]')

		// Verify HST path is generated (will fail currently)
		expect(pathDiv.text()).not.toBe('undefined')
		expect(pathDiv.text()).toContain('todo.1.title')

		// Simulate field change
		await input.setValue('New Todo Title')

		const vm = wrapper.vm as any
		// Verify the change was handled (will fail currently)
		expect(vm.formData?.title).toBe('New Todo Title')
	})
})
