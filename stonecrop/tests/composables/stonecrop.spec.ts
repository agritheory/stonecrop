import type { DoctypeField } from '@stonecrop/schema'
import { mount } from '@vue/test-utils'
import { List, Map } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { defineComponent, ref, computed } from 'vue'
import { type MachineConfig } from 'xstate'

import { useStonecrop } from '../../src/composables/stonecrop'
import Registry from '../../src/registry'
import { Stonecrop } from '../../src/stonecrop'
import { HST } from '../../src/stores/hst'
import Doctype from '../../src/doctype'

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
	] as DoctypeField[])

	const mockWorkflow: MachineConfig<any, any, any> = {
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

	const mockActions = Map({
		load: ['loadData'],
		save: ['validateData', 'saveData'],
	})

	return new Doctype(name, mockSchema, mockWorkflow, mockActions)
}

describe('useStonecrop composable', { tags: ['unit'] }, () => {
	let mockRouter: any
	let registry: Registry
	let stonecrop: Stonecrop

	beforeEach(() => {
		setActivePinia(createPinia())

		// Reset static instances
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
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
		stonecrop = new Stonecrop(registry)

		// Reset fetch mock
		vi.clearAllMocks()
	})

	it('returns a stonecrop reference with HST integration', async () => {
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
					$stonecrop: stonecrop,
				},
			},
		})

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
					$stonecrop: stonecrop,
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
		// Reset singleton to test "no stonecrop available" scenario
		Stonecrop._root = undefined as any

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop()
			},
			template: '<div>test</div>',
		})

		// Mounting without providing $registry or $stonecrop is intentional — it
		// exercises the "no registry" path. Vue warns about the missing injections;
		// suppress both warn and error so they don't pollute test output.
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		// The mount should succeed, but the component should have undefined stonecrop
		const wrapper = mount(TestComponent)
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		// The stonecrop ref should remain undefined due to error in onMounted
		expect(vm.stonecrop).toBeUndefined()

		// Restore mocks
		warnSpy.mockRestore()
		consoleSpy.mockRestore()
	})

	it('handles missing registry router gracefully', async () => {
		const registryWithoutRouter = new Registry()

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop()
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				provide: {
					$registry: registryWithoutRouter,
					$stonecrop: new Stonecrop(registryWithoutRouter),
				},
			},
		})

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
				path: '/task',
				params: {},
			},
		})

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
					$stonecrop: stonecrop,
				},
			},
		})

		// Wait for async operations to complete
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 10))

		const vm = wrapper.vm as any
		expect(mockGetMeta).toHaveBeenCalledWith({
			path: '/task',
			segments: ['task'],
		})

		// Check that HST store has the doctype section
		expect(vm.stonecrop).toBeDefined()
		const store = vm.stonecrop.getStore()
		expect(store.has('task')).toBe(true)
	})

	it('handles route with both doctype and record id', async () => {
		const mockDoctype = createMockDoctype('Task')
		const mockGetMeta = vi.fn().mockResolvedValue(mockDoctype)
		registry.getMeta = mockGetMeta

		// Mock client for record fetching
		const mockClient = {
			getMeta: vi.fn(),
			getRecord: vi.fn().mockResolvedValue({ record: { id: '123', title: 'Test Task' }, unknownLinks: [] }),
			getRecords: vi.fn(),
			runAction: vi.fn(),
		}
		stonecrop.setClient(mockClient)

		// Mock router current route
		vi.spyOn(mockRouter, 'currentRoute', 'get').mockReturnValue({
			value: {
				path: '/task/123',
				params: {},
			},
		})

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
					$stonecrop: stonecrop,
				},
			},
		})

		// Wait for async operations to complete
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 10))

		const vm = wrapper.vm as any
		expect(mockGetMeta).toHaveBeenCalledWith({
			path: '/task/123',
			segments: ['task', '123'],
		})

		// Check that stonecrop is working
		expect(vm.stonecrop).toBeDefined()
		expect(vm.stonecrop.getRecordIds('task').length).toBeGreaterThan(0)
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
				return useStonecrop()
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				provide: {
					$registry: registry,
					$stonecrop: stonecrop,
				},
			},
		})

		// Wait for onMounted to complete
		await wrapper.vm.$nextTick()

		expect(mockGetMeta).not.toHaveBeenCalled()
	})

	it('provides HST-based record access methods', async () => {
		const mockDoctype = createMockDoctype('Task')
		registry.addDoctype(mockDoctype)

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
					$stonecrop: stonecrop,
				},
			},
		})

		// Wait for onMounted to complete
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		expect(vm.stonecrop).toBeDefined()
		// Test HST-based methods exist
		expect(typeof vm.stonecrop.records).toBe('function')
		expect(typeof vm.stonecrop.addRecord).toBe('function')

		// Test that records returns HST node
		const records = vm.stonecrop.records('task')
		expect(records.getPath).toBeDefined()
		expect(records.getPath()).toBe('task')
	})
})

describe('useStonecrop router-based HST integration', { tags: ['unit'] }, () => {
	let mockRouter: any
	let registry: Registry
	let stonecrop: Stonecrop

	beforeEach(() => {
		setActivePinia(createPinia())

		// Reset static instances
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
		;(HST as any).instance = undefined

		mockRouter = createRouter({
			history: createMemoryHistory(),
			routes: [
				{ path: '/records/:records', name: 'list', component: {} },
				{ path: '/records/:records/:record', name: 'form', component: {} },
			],
		})

		registry = new Registry(mockRouter)
		stonecrop = new Stonecrop(registry)

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

				// Type guard to check if we have HST integration
				const hasFormData = 'formData' in result
				const hasHandleChange = 'handleHSTChange' in result

				return {
					...result,
					// These should be defined but currently aren't
					hasHSTIntegration: hasFormData && hasHandleChange,
				}
			},
			template: '<div>{{ hasHSTIntegration }}</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				provide: {
					$registry: registry,
					$stonecrop: stonecrop,
				},
			},
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any

		const result = vm
		expect(result.formData).toBeDefined()
		expect(result.handleHSTChange).toBeDefined()
		expect(result.provideHSTPath).toBeDefined()
		expect(result.hstStore).toBeDefined()
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

					// Type guard to check if we have HST integration
					if ('handleHSTChange' in composableResult && 'provideHSTPath' in composableResult) {
						const result = composableResult as any
						result.handleHSTChange({
							path: result.provideHSTPath('title') || '',
							value,
							fieldname: 'title',
						})
					}
				}

				const hstPath = computed(() => {
					// Type guard for provideHSTPath
					if ('provideHSTPath' in composableResult) {
						const result = composableResult as any
						return result.provideHSTPath('title') || 'undefined'
					}
					return 'undefined'
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
					$stonecrop: stonecrop,
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
		expect(vm.formData).toBeDefined()
		expect(vm.formData.title).toBe('New Todo Title')
	})
})

describe('useStonecrop with string doctype lazy-loading', { tags: ['unit'] }, () => {
	let mockRouter: any
	let registry: Registry
	let stonecrop: Stonecrop

	beforeEach(() => {
		setActivePinia(createPinia())

		// Reset static instances
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
		;(HST as any).instance = undefined

		mockRouter = createRouter({
			history: createMemoryHistory(),
			routes: [
				{ path: '/records/:records', name: 'list', component: {} },
				{ path: '/records/:records/:record', name: 'form', component: {} },
			],
		})

		registry = new Registry(mockRouter)
		stonecrop = new Stonecrop(registry)

		vi.clearAllMocks()
	})

	it('accepts string doctype and lazy-loads via getMeta', async () => {
		const mockDoctype = createMockDoctype('Task')
		const mockGetMeta = vi.fn().mockResolvedValue(mockDoctype)
		registry.getMeta = mockGetMeta

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ doctype: 'task', recordId: '123' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				provide: {
					$registry: registry,
					$stonecrop: stonecrop,
				},
			},
		})

		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 10))

		const vm = wrapper.vm as any

		// getMeta should have been called
		expect(mockGetMeta).toHaveBeenCalledWith({
			path: '/task',
			segments: ['task'],
		})

		// resolvedDoctype should be set
		expect(vm.resolvedDoctype).toBeDefined()
		expect(vm.resolvedDoctype?.name).toBe('Task')

		// isLoading should be false after load
		expect(vm.isLoading).toBe(false)

		// error should be null
		expect(vm.error).toBeNull()
	})

	it('returns doctype from registry if already loaded', async () => {
		const mockDoctype = createMockDoctype('Task')
		registry.addDoctype(mockDoctype)

		const mockGetMeta = vi.fn()
		registry.getMeta = mockGetMeta

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ doctype: 'task', recordId: '123' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				provide: {
					$registry: registry,
					$stonecrop: stonecrop,
				},
			},
		})

		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 10))

		const vm = wrapper.vm as any

		// getMeta should NOT have been called since doctype was in registry
		expect(mockGetMeta).not.toHaveBeenCalled()

		// resolvedDoctype should be set from registry
		expect(vm.resolvedDoctype).toBeDefined()
		expect(vm.resolvedDoctype?.name).toBe('Task')
	})

	it('sets error when doctype not found and no getMeta', async () => {
		// No getMeta configured, doctype not in registry

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ doctype: 'nonexistent', recordId: '123' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				provide: {
					$registry: registry,
					$stonecrop: stonecrop,
				},
			},
		})

		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 10))

		const vm = wrapper.vm as any

		// isLoading should be false
		expect(vm.isLoading).toBe(false)

		// error should be set
		expect(vm.error).toBeDefined()
		expect(vm.error?.message).toContain('not found in registry')

		// resolvedDoctype should be undefined
		expect(vm.resolvedDoctype).toBeUndefined()
	})

	it('sets error when getMeta returns null', async () => {
		const mockGetMeta = vi.fn().mockResolvedValue(null)
		registry.getMeta = mockGetMeta

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ doctype: 'nonexistent', recordId: '123' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				provide: {
					$registry: registry,
					$stonecrop: stonecrop,
				},
			},
		})

		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 10))

		const vm = wrapper.vm as any

		expect(vm.isLoading).toBe(false)
		expect(vm.error).toBeDefined()
		expect(vm.error?.message).toContain('getMeta returned no result')
	})

	it('sets error when getMeta throws', async () => {
		const mockGetMeta = vi.fn().mockRejectedValue(new Error('Network error'))
		registry.getMeta = mockGetMeta

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ doctype: 'task', recordId: '123' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				provide: {
					$registry: registry,
					$stonecrop: stonecrop,
				},
			},
		})

		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 10))

		const vm = wrapper.vm as any

		expect(vm.isLoading).toBe(false)
		expect(vm.error).toBeDefined()
		expect(vm.error?.message).toBe('Network error')
	})

	it('sets resolvedDoctype immediately for Doctype instance', async () => {
		const mockDoctype = createMockDoctype('Task')

		const TestComponent = defineComponent({
			setup() {
				const result = useStonecrop({ doctype: mockDoctype, recordId: '123' })
				// Check resolvedDoctype immediately (before onMounted)
				return {
					...result,
					immediateResolvedDoctype: result.resolvedDoctype.value,
				}
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: {
				provide: {
					$registry: registry,
					$stonecrop: stonecrop,
				},
			},
		})

		const vm = wrapper.vm as any

		// resolvedDoctype should be set immediately for Doctype instance
		expect(vm.immediateResolvedDoctype).toBeDefined()
		expect(vm.immediateResolvedDoctype?.name).toBe('Task')
	})

	it('provides HST path with string doctype after lazy load', async () => {
		const mockDoctype = createMockDoctype('Task')
		const mockGetMeta = vi.fn().mockResolvedValue(mockDoctype)
		registry.getMeta = mockGetMeta

		const TestComponent = defineComponent({
			setup() {
				const result = useStonecrop({ doctype: 'task', recordId: 'test-123' })
				return result
			},
			template: '<div>{{ hstPath }}</div>',
			computed: {
				hstPath() {
					return (this as any).provideHSTPath('title')
				},
			},
		})

		const wrapper = mount(TestComponent, {
			global: {
				provide: {
					$registry: registry,
					$stonecrop: stonecrop,
				},
			},
		})

		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 10))

		// After lazy load, HST path should work
		expect(wrapper.vm.hstPath).toBe('task.test-123.title')
	})
})
