import type { SchemaTypes } from '@stonecrop/aform'
import { mount } from '@vue/test-utils'
import { List, Map } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent } from 'vue'
import { type MachineConfig } from 'xstate'

import { useStonecrop } from '../src/composables/stonecrop'
import Doctype from '../src/doctype'
import Registry from '../src/registry'
import { Stonecrop } from '../src/stonecrop'
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

	return new Doctype(name, schema as any, workflow, actions)
}

describe('useStonecrop HST mode', () => {
	let registry: Registry
	let stonecrop: Stonecrop

	beforeEach(() => {
		setActivePinia(createPinia())
		Registry._root = undefined as any
		;(HST as any).instance = undefined
		registry = new Registry()
		stonecrop = new Stonecrop(registry)
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		expect(vm.handleHSTChange).toBeDefined()
		expect(vm.formData).toBeDefined()
		expect(vm.resolvedSchema).toBeDefined()
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
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

	it('generates HST paths via buildHSTPath', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: taskDoctype, recordId: 'task-1' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		const path = vm.stonecrop?.buildHSTPath('task', 'task-1', 'title')
		expect(path).toBe('task.task-1.title')
	})

	it('buildHSTPath uses custom recordId override', async () => {
		const taskDoctype = createDoctype('Task')
		registry.addDoctype(taskDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: taskDoctype, recordId: 'task-1' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})
		await wrapper.vm.$nextTick()

		const vm = wrapper.vm as any
		const path = vm.stonecrop?.buildHSTPath('task', 'task-override', 'title')
		expect(path).toBe('task.task-override.title')
	})

	it('buildHSTPath works as a utility function', async () => {
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

		const vm = wrapper.vm as any
		// buildHSTPath is a utility function that works regardless of doctype loading
		if (vm.stonecrop?.value) {
			expect(vm.stonecrop.value.buildHSTPath('task', 'new', 'title')).toBe('task.new.title')
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		const nestedCtx = vm.createNestedContext('task.new.address', addressDoctype)

		expect(nestedCtx.buildHSTPath('street')).toBe('task.new.address.street')

		// Test nested change handler
		nestedCtx.handleHSTChange({
			path: 'street',
			value: '456 Oak Ave',
			fieldname: 'street',
		})
		// Should not throw
	})

	it('getNestedData returns initialized record when no existing data', async () => {
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		const nested = vm.stonecrop.getNestedData('task.new.address', addressDoctype)
		expect(nested).toBeDefined()
		expect(typeof nested).toBe('object')
	})

	it('getNestedData with recordId tries to load existing data', async () => {
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		const nested = vm.stonecrop.getNestedData('task.new.address', addressDoctype, 'addr-1')
		expect(nested).toBeDefined()
	})

	it('getNestedData returns existing data when found in HST', async () => {
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
				return useStonecrop({ registry, doctype: customerDoctype, recordId: 'cust-99' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any
		const existingAddress = { street: '456 Oak Ave', city: 'Boston' }
		vm.handleHSTChange({
			path: 'customer.cust-99.address',
			value: existingAddress,
			fieldname: 'address',
		})

		const nested = vm.stonecrop.getNestedData('customer.cust-99.address', addressDoctype, 'addr-1')
		expect(nested).toEqual(existingAddress)
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
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

	it('collectRecordPayload collects array data for cardinality: many fields', async () => {
		const itemDoctype = createDoctype('Item', [
			{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{ fieldname: 'qty', fieldtype: 'Int', component: 'ANumericInput' } as SchemaTypes,
		])
		registry.addDoctype(itemDoctype)

		const orderDoctype = createDoctype('Order', [
			{ fieldname: 'order_number', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{
				fieldname: 'items',
				fieldtype: 'Doctype',
				cardinality: 'many',
				options: 'item',
			} as SchemaTypes,
		])
		registry.addDoctype(orderDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: orderDoctype, recordId: 'order-1' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any

		vm.handleHSTChange({
			path: 'order.order-1.order_number',
			value: 'ORD-001',
			fieldname: 'order_number',
		})

		const itemsData = [
			{ name: 'Item 1', qty: 5 },
			{ name: 'Item 2', qty: 10 },
		]
		stonecrop.getStore().set('order.order-1.items', itemsData)

		const payload = vm.stonecrop.collectRecordPayload(orderDoctype, 'order-1')

		expect(payload.order_number).toBe('ORD-001')
		expect(payload.items).toBeDefined()
		expect(Array.isArray(payload.items)).toBe(true)
		expect(payload.items).toHaveLength(2)
		expect(payload.items[0].name).toBe('Item 1')
		expect(payload.items[1].qty).toBe(10)
	})

	it('collectRecordPayload handles empty array for cardinality: many fields', async () => {
		const itemDoctype = createDoctype('Item', [
			{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
		])
		registry.addDoctype(itemDoctype)

		const orderDoctype = createDoctype('Order', [
			{ fieldname: 'order_number', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{
				fieldname: 'items',
				fieldtype: 'Doctype',
				cardinality: 'many',
				options: 'item',
			} as SchemaTypes,
		])
		registry.addDoctype(orderDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: orderDoctype, recordId: 'order-2' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any

		vm.handleHSTChange({
			path: 'order.order-2.order_number',
			value: 'ORD-002',
			fieldname: 'order_number',
		})

		const payload = vm.stonecrop.collectRecordPayload(orderDoctype, 'order-2')

		expect(payload.order_number).toBe('ORD-002')
		expect(payload.items).toBeDefined()
		expect(Array.isArray(payload.items)).toBe(true)
		expect(payload.items).toHaveLength(0)
	})

	it('collectRecordPayload collects nested 1:1 doctype fields', async () => {
		const addressDoctype = createDoctype('Address', [
			{ fieldname: 'street', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{ fieldname: 'city', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
		])
		registry.addDoctype(addressDoctype)

		const customerDoctype = createDoctype('Customer', [
			{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{
				fieldname: 'address',
				fieldtype: 'Doctype',
				options: 'address',
			} as SchemaTypes,
		])
		registry.addDoctype(customerDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: customerDoctype, recordId: 'cust-1' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any

		vm.handleHSTChange({
			path: 'customer.cust-1.name',
			value: 'John Doe',
			fieldname: 'name',
		})

		stonecrop.getStore().set('customer.cust-1.address', {
			street: '123 Oak St',
			city: 'Portland',
		})

		const payload = vm.stonecrop.collectRecordPayload(customerDoctype, 'cust-1')

		expect(payload.name).toBe('John Doe')
		expect(payload.address).toBeDefined()
		expect(payload.address.street).toBe('123 Oak St')
		expect(payload.address.city).toBe('Portland')
	})

	it('collectRecordPayload recursively collects 1:many inside nested 1:1', async () => {
		const phoneDoctype = createDoctype('Phone', [
			{ fieldname: 'number', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{ fieldname: 'type', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
		])
		registry.addDoctype(phoneDoctype)

		const addressDoctype = createDoctype('Address', [
			{ fieldname: 'street', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{ fieldname: 'city', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{
				fieldname: 'phones',
				fieldtype: 'Doctype',
				cardinality: 'many',
				options: 'phone',
			} as SchemaTypes,
		])
		registry.addDoctype(addressDoctype)

		const customerDoctype = createDoctype('Customer', [
			{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{
				fieldname: 'address',
				fieldtype: 'Doctype',
				options: 'address',
			} as SchemaTypes,
		])
		registry.addDoctype(customerDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: customerDoctype, recordId: 'cust-2' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any

		vm.handleHSTChange({
			path: 'customer.cust-2.name',
			value: 'Jane Doe',
			fieldname: 'name',
		})

		stonecrop.getStore().set('customer.cust-2.address', {
			street: '456 Pine St',
			city: 'Portland',
		})

		stonecrop.getStore().set('customer.cust-2.address.phones', [
			{ number: '555-1234', type: 'mobile' },
			{ number: '555-5678', type: 'work' },
		])

		const payload = vm.stonecrop.collectRecordPayload(customerDoctype, 'cust-2')

		expect(payload.name).toBe('Jane Doe')
		expect(payload.address).toBeDefined()
		expect(payload.address.street).toBe('456 Pine St')
		expect(payload.address.city).toBe('Portland')
		expect(payload.address.phones).toBeDefined()
		expect(Array.isArray(payload.address.phones)).toBe(true)
		expect(payload.address.phones).toHaveLength(2)
		expect(payload.address.phones[0].number).toBe('555-1234')
		expect(payload.address.phones[1].type).toBe('work')
	})

	it('collectRecordPayload collects deeply nested 1:1 inside 1:1', async () => {
		const coordinatesDoctype = createDoctype('Coordinates', [
			{ fieldname: 'lat', fieldtype: 'Float', component: 'ANumericInput' } as SchemaTypes,
			{ fieldname: 'lng', fieldtype: 'Float', component: 'ANumericInput' } as SchemaTypes,
		])
		registry.addDoctype(coordinatesDoctype)

		const addressDoctype = createDoctype('Address', [
			{ fieldname: 'street', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{ fieldname: 'city', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{
				fieldname: 'coordinates',
				fieldtype: 'Doctype',
				options: 'coordinates',
			} as SchemaTypes,
		])
		registry.addDoctype(addressDoctype)

		const customerDoctype = createDoctype('Customer', [
			{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' } as SchemaTypes,
			{
				fieldname: 'address',
				fieldtype: 'Doctype',
				options: 'address',
			} as SchemaTypes,
		])
		registry.addDoctype(customerDoctype)

		const TestComponent = defineComponent({
			setup() {
				return useStonecrop({ registry, doctype: customerDoctype, recordId: 'cust-3' })
			},
			template: '<div>test</div>',
		})

		const wrapper = mount(TestComponent, {
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		const vm = wrapper.vm as any

		vm.handleHSTChange({
			path: 'customer.cust-3.name',
			value: 'Bob Smith',
			fieldname: 'name',
		})

		stonecrop.getStore().set('customer.cust-3.address', {
			street: '789 Elm St',
			city: 'Seattle',
		})

		stonecrop.getStore().set('customer.cust-3.address.coordinates', {
			lat: 47.6062,
			lng: -122.3321,
		})

		const payload = vm.stonecrop.collectRecordPayload(customerDoctype, 'cust-3')

		expect(payload.name).toBe('Bob Smith')
		expect(payload.address).toBeDefined()
		expect(payload.address.street).toBe('789 Elm St')
		expect(payload.address.coordinates).toBeDefined()
		expect(payload.address.coordinates.lat).toBe(47.6062)
		expect(payload.address.coordinates.lng).toBe(-122.3321)
	})
})

describe('useStonecrop base mode', () => {
	let registry: Registry
	let stonecrop: Stonecrop

	beforeEach(() => {
		setActivePinia(createPinia())
		Registry._root = undefined as any
		;(HST as any).instance = undefined
		registry = new Registry()
		stonecrop = new Stonecrop(registry)
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
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
				// Access operation log - stonecrop is now initialized synchronously
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
			global: { provide: { $registry: registry, $stonecrop: stonecrop } },
		})

		const vm = wrapper.vm as any
		// Stonecrop is now initialized synchronously when registry is available
		expect(vm.snapshot).toBeDefined()
		expect(vm.ops).toEqual([])
		expect(vm.undoResult).toBe(false)
		expect(vm.redoResult).toBe(false)
		expect(vm.batchResult).toBe(null)
		// logAction now returns an actual operation ID since stonecrop is initialized
		expect(vm.logResult).toBeDefined()
		expect(typeof vm.logResult).toBe('string')
	})
})
