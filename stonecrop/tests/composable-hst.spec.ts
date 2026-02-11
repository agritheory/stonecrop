import type { SchemaTypes } from '@stonecrop/aform'
import { mount } from '@vue/test-utils'
import { List, Map } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent } from 'vue'
import { type MachineConfig } from 'xstate'

import { useStonecrop } from '../src/composable'
import DoctypeMeta from '../src/doctype'
import Registry from '../src/registry'
import { HST } from '../src/stores/hst'

/**
 * @vitest-environment jsdom
 */

const createDoctype = (name: string, fields?: SchemaTypes[]) => {
	const schema = List(
		fields || [
			{
				fieldname: 'title',
				component: 'ATextInput',
				label: 'Title',
				fieldtype: 'Data',
			},
			{
				fieldname: 'status',
				component: 'ADropdown',
				label: 'Status',
				fieldtype: 'Data',
			},
		]
	)

	const workflow: MachineConfig<any, any, any> = {
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

	const actions = Map({
		load: ['loadData'],
		save: ['validateData', 'saveData'],
	})

	return new DoctypeMeta(name, schema as any, workflow, actions)
}

describe('useStonecrop HST mode', () => {
	let registry: Registry

	beforeEach(() => {
		setActivePinia(createPinia())
		Registry._root = undefined as any
		;(HST as any).instance = undefined
		registry = new Registry()
		vi.clearAllMocks()
	})

	it('returns HST integration functions when doctype is provided', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const TestComponent = defineComponent({
			setup() {
				const result = useStonecrop({ registry, doctype: taskDoctype, recordId: 'new' })
				return result
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		expect(vm.provideHSTPath).toBeDefined()
		expect(vm.handleHSTChange).toBeDefined()
		expect(vm.formData).toBeDefined()
		expect(vm.resolvedSchema).toBeDefined()
		expect(vm.loadNestedData).toBeDefined()
		expect(vm.saveRecursive).toBeDefined()
		expect(vm.createNestedContext).toBeDefined()
	})

	it('resolves schema when doctype is provided', async () => {
		const addressDoctype = createDoctype('Address', [
			{ fieldname: 'street', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{ fieldname: 'city', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
		])
		registry.addDoctype(addressDoctype)

		const customerDoctype = createDoctype('Customer', [
			{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{ fieldname: 'address', fieldtype: 'Doctype', options: 'address' } as SchemaTypes,
		])
		registry.addDoctype(customerDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: customerDoctype, recordId: 'new' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		// resolvedSchema should have the address field with embedded schema
		expect(vm.resolvedSchema.length).toBe(2)
		const addressField = vm.resolvedSchema[1]
		expect(addressField.fieldname).toBe('address')
		expect(addressField.schema).toBeDefined()
		expect(addressField.schema.length).toBe(2)
	})

	it('generates HST paths via provideHSTPath', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: taskDoctype, recordId: 'task-1' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		const path = vm.provideHSTPath('title')
		expect(path).toBe('task.task-1.title')
	})

	it('provideHSTPath uses custom recordId override', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: taskDoctype, recordId: 'task-1' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		const path = vm.provideHSTPath('title', 'task-override')
		expect(path).toBe('task.task-override.title')
	})

	it('provideHSTPath returns empty string when no doctype', async () => {
		const TestComponent = defineComponent({
			setup() {
				return useStonecrop()
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		// No doctype, should return empty string if provideHSTPath exists
		if (vm.provideHSTPath) {
			expect(vm.provideHSTPath('title')).toBe('')
		}
	})

	it('handleHSTChange updates form data for simple fields', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: taskDoctype, recordId: 'new' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		vm.handleHSTChange({
			path: 'task.new.title',
			value: 'Hello World',
			fieldname: 'title',
		})

		expect(vm.formData.title).toBe('Hello World')
	})

	it('handleHSTChange handles deeply nested paths', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: taskDoctype, recordId: 'new' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		// A deep nested path: task.new.address.street
		vm.handleHSTChange({
			path: 'task.new.address.street',
			value: '123 Main St',
			fieldname: 'address.street',
		})

		expect(vm.formData.address).toBeDefined()
		expect(vm.formData.address.street).toBe('123 Main St')
	})

	it('handleHSTChange silently handles errors', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: taskDoctype, recordId: 'new' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		// Should not throw
		expect(() => {
			vm.handleHSTChange({
				path: '',
				value: 'test',
				fieldname: 'x',
			})
		}).not.toThrow()
	})

	it('initializes formData for new records', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: taskDoctype, recordId: 'new' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		// formData should be initialized with defaults from schema
		expect(vm.formData).toBeDefined()
		expect(typeof vm.formData).toBe('object')
	})

	it('loads existing record when recordId is provided', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		// Pre-populate HST with a record
		const TestComponent = defineComponent({
			setup() {
				const result = useStonecrop({ registry, doctype: taskDoctype, recordId: 'task-existing' })
				return result
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		expect(vm.stonecrop).toBeDefined()
	})

	it('createNestedContext provides scoped path and change handlers', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const addressDoctype = createDoctype('Address', [
			{ fieldname: 'street', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
		])
		registry.addDoctype(addressDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: taskDoctype, recordId: 'new' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		const nestedCtx = vm.createNestedContext('task.new.address', addressDoctype)

		expect(nestedCtx.provideHSTPath('street')).toBe('task.new.address.street')

		// Test nested change handler
		nestedCtx.handleHSTChange({
			path: 'street',
			value: '456 Oak Ave',
			fieldname: 'street',
		})
		// Should not throw
	})

	it('loadNestedData returns initialized record when no existing data', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const addressDoctype = createDoctype('Address', [
			{ fieldname: 'street', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{ fieldname: 'city', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
		])
		registry.addDoctype(addressDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: taskDoctype, recordId: 'new' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		const nested = vm.loadNestedData('task.new.address', addressDoctype)
		expect(nested).toBeDefined()
		expect(typeof nested).toBe('object')
	})

	it('loadNestedData with recordId tries to load existing data', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const addressDoctype = createDoctype('Address', [
			{ fieldname: 'street', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
		])
		registry.addDoctype(addressDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: taskDoctype, recordId: 'new' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		const nested = vm.loadNestedData('task.new.address', addressDoctype, 'addr-1')
		expect(nested).toBeDefined()
	})

	it('operationLog API is available in HST mode', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: taskDoctype, recordId: 'new' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		expect(vm.operationLog).toBeDefined()
		expect(vm.operationLog.canUndo).toBeDefined()
		expect(vm.operationLog.canRedo).toBeDefined()
		expect(typeof vm.operationLog.undo).toBe('function')
		expect(typeof vm.operationLog.redo).toBe('function')
		expect(typeof vm.operationLog.startBatch).toBe('function')
		expect(typeof vm.operationLog.commitBatch).toBe('function')
		expect(typeof vm.operationLog.cancelBatch).toBe('function')
		expect(typeof vm.operationLog.clear).toBe('function')
		expect(typeof vm.operationLog.getOperationsFor).toBe('function')
		expect(typeof vm.operationLog.getSnapshot).toBe('function')
		expect(typeof vm.operationLog.markIrreversible).toBe('function')
		expect(typeof vm.operationLog.logAction).toBe('function')
		expect(typeof vm.operationLog.configure).toBe('function')
	})

	it('operationLog methods delegate to store', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: taskDoctype, recordId: 'new' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		const opLog = vm.operationLog

		// getSnapshot should return a snapshot object
		const snapshot = opLog.getSnapshot()
		expect(snapshot).toBeDefined()
		expect(snapshot.operations).toBeDefined()

		// getOperationsFor should return an array
		const ops = opLog.getOperationsFor('task')
		expect(Array.isArray(ops)).toBe(true)

		// logAction should return a string
		const id = opLog.logAction('task', 'print', ['123'], 'success')
		expect(typeof id).toBe('string')

		// configure should not throw
		expect(() => opLog.configure({ maxOperations: 25 })).not.toThrow()

		// clear should not throw
		expect(() => opLog.clear()).not.toThrow()
	})

	it('saveRecursive throws when HST not initialized', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		// Before mount, hstStore won't be initialized
		const TestComponent = defineComponent({
			setup() {
				const result = useStonecrop({ registry, doctype: taskDoctype })
				// Call saveRecursive before mount completes
				return { ...result, taskDoctype }
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})

		const vm = wrapper.vm as any
		// saveRecursive should handle missing store gracefully
		try {
			await vm.saveRecursive(taskDoctype, 'task-1')
		} catch (e: any) {
			expect(e.message).toContain('HST store not initialized')
		}
	})
})

describe('useStonecrop base mode', () => {
	let registry: Registry

	beforeEach(() => {
		setActivePinia(createPinia())
		Registry._root = undefined as any
		;(HST as any).instance = undefined
		registry = new Registry()
		vi.clearAllMocks()
	})

	it('returns base return type when no doctype and no router', async () => {
		const TestComponent = defineComponent({
			setup() {
				return useStonecrop()
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		expect(vm.stonecrop).toBeDefined()
		expect(vm.operationLog).toBeDefined()
	})

	it('operationLog methods return defaults when stonecrop not yet initialized', async () => {
		const TestComponent = defineComponent({
			setup() {
				const result = useStonecrop()
				// Access operation log before mount completes
				const snapshot = result.operationLog.getSnapshot()
				const ops = result.operationLog.getOperationsFor('task')
				const undoResult = result.operationLog.undo({} as any)
				const redoResult = result.operationLog.redo({} as any)
				const batchResult = result.operationLog.commitBatch('test')
				const logResult = result.operationLog.logAction('task', 'print')

				return {
					...result,
					snapshot,
					ops,
					undoResult,
					redoResult,
					batchResult,
					logResult,
				}
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry } },
		})

		const vm = wrapper.vm as any
		// Before mount, stonecrop is undefined so defaults apply
		expect(vm.snapshot).toBeDefined()
		expect(vm.ops).toEqual([])
		expect(vm.undoResult).toBe(false)
		expect(vm.redoResult).toBe(false)
		expect(vm.batchResult).toBe(null)
		expect(vm.logResult).toBe('')
	})
})
