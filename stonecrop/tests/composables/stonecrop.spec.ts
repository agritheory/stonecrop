import { mount } from '@vue/test-utils'
import { List } from 'immutable'
import type { DoctypeField } from '@stonecrop/schema'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { defineComponent } from 'vue'
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
	const mockSchema = List<DoctypeField>([
		{
			kind: 'field',
			fieldname: 'title',
			component: 'ATextInput',
			label: 'Title',
		},
	])

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

	return new Doctype(name, mockSchema, mockWorkflow)
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

		const vm = wrapper.vm
		expect(vm.stonecrop).toBeDefined()

		// Should be Stonecrop instance after onMounted
		expect(vm.stonecrop).toBeInstanceOf(Stonecrop)
		// Check that the registry is the same (comparing name instead of object identity)
		expect(vm.stonecrop!.registry.name).toBe(registry.name)
		expect(vm.stonecrop!.getStore).toBeDefined()
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

		const vm = wrapper.vm
		expect(vm.stonecrop).toBeDefined()
		expect(vm.stonecrop).toBeInstanceOf(Stonecrop)
		// Check that the registry is the same (comparing name instead of object identity)
		expect(vm.stonecrop!.registry.name).toBe(registry.name)
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

		const vm = wrapper.vm
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

		const vm = wrapper.vm
		// Should still create Stonecrop instance
		expect(vm.stonecrop).toBeInstanceOf(Stonecrop)
	})

	it('infers nothing from the route: no getMeta, no fetch, and base mode only', async () => {
		// The inverse of two tests that used to live here, which asserted that a no-argument call
		// resolved the route's doctype and fetched its record. Every no-argument caller wanted only
		// the instance, so each of those fetches was paid for output nobody read.
		const mockGetMeta = vi.fn().mockResolvedValue(createMockDoctype('Task'))
		registry.getMeta = mockGetMeta
		const getRecord = vi.spyOn(stonecrop, 'getRecord').mockResolvedValue(undefined as any)

		vi.spyOn(mockRouter, 'currentRoute', 'get').mockReturnValue({
			value: { path: '/task/123', params: {} },
		})

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop()
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})

		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 20))

		expect(mockGetMeta).not.toHaveBeenCalled()
		expect(getRecord).not.toHaveBeenCalled()
		expect(stonecrop.getRecordIds('task')).toEqual([])
		// Base mode: the HST surface is only offered when a doctype is named.
		expect('formData' in wrapper.vm).toBe(false)
		expect('handleHSTChange' in wrapper.vm).toBe(false)
		expect(wrapper.vm.stonecrop).toBeDefined()
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

		const vm = wrapper.vm
		expect(vm.stonecrop).toBeDefined()
		// Test HST-based methods exist
		expect(typeof vm.stonecrop!.records).toBe('function')
		expect(typeof vm.stonecrop!.addRecord).toBe('function')

		// Test that records returns HST node
		const records = vm.stonecrop!.records('task')
		expect(records.getPath).toBeDefined()
		expect(records.getPath()).toBe('task')
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

		const vm = wrapper.vm

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

		const vm = wrapper.vm

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

		const vm = wrapper.vm

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

		const vm = wrapper.vm

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

		const vm = wrapper.vm

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

		const vm = wrapper.vm

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
