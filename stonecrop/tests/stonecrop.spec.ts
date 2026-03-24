import type { SchemaTypes } from '@stonecrop/aform'
import { List, Map } from 'immutable'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'

import Doctype from '../src/doctype'
import Registry from '../src/registry'
import { Stonecrop } from '../src/stonecrop'
import type { StonecropOptions } from '../src/stonecrop'
import { ImmutableDoctype } from '../src/types'

// Mock fetch globally
global.fetch = vi.fn()

describe('Stonecrop class with HST integration', () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let mockRouter: any

	beforeEach(() => {
		// Reset static instances
		Registry._root = undefined as any

		mockRouter = createRouter({
			history: createMemoryHistory(),
			routes: [],
		})

		registry = new Registry(mockRouter)
		stonecrop = new Stonecrop(registry)

		// Reset fetch mock
		vi.clearAllMocks()
	})

	function createMockDoctype(name: string) {
		const mockSchema: ImmutableDoctype['schema'] = List<SchemaTypes>([
			{ name: 'title', label: 'Title', fieldtype: 'Data' } as SchemaTypes,
			{ name: 'status', label: 'Status', fieldtype: 'Select' } as SchemaTypes,
		])

		const mockWorkflowConfig: ImmutableDoctype['workflow'] = {
			id: 'mockWorkflow',
			initial: 'draft',
			states: {
				draft: {
					on: {
						submit: { target: 'pending' },
					},
				},
				pending: {
					on: {
						approve: { target: 'completed' },
						reject: { target: 'draft' },
					},
				},
				completed: { type: 'final' },
			},
		}

		const mockActions: ImmutableDoctype['actions'] = Map({
			load: ['loadData'],
			save: ['validateData', 'saveData'],
		})

		return new Doctype(name, mockSchema, mockWorkflowConfig, mockActions)
	}

	describe('Initialization', () => {
		it('creates Stonecrop instance with HST integration', () => {
			expect(stonecrop).toBeInstanceOf(Stonecrop)
			expect(stonecrop.getStore).toBeDefined()
			expect(typeof stonecrop.getStore).toBe('function')
		})

		it('initializes HST store with existing Registry doctypes', () => {
			const mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)

			const newStonecrop = new Stonecrop(registry)
			const store = newStonecrop.getStore()

			expect(store.has('task')).toBe(true)
		})

		it('sets up automatic Registry sync', () => {
			const store = stonecrop.getStore()

			// Initially no doctype
			expect(store.has('task')).toBe(false)

			// Add doctype to registry
			const mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)

			// Should auto-create HST section
			expect(store.has('task')).toBe(true)
		})
	})

	describe('HST Record Management', () => {
		let mockDoctype: Doctype

		beforeEach(() => {
			mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)
		})

		it('returns records hash as HST node', () => {
			const records = stonecrop.records('task')

			expect(records.getPath).toBeDefined()
			expect(records.getPath()).toBe('task')
			expect(records.getParent).toBeDefined()
		})

		it('returns records hash using Doctype object', () => {
			const records = stonecrop.records(mockDoctype)

			expect(records.getPath()).toBe('task')
		})

		it('adds record with proper HST wrapping', () => {
			const recordData = { id: '123', title: 'Test Task' }

			stonecrop.addRecord('task', '123', recordData)

			const record = stonecrop.getRecordById('task', '123')
			expect(record).toBeDefined()
			expect(record!.get('id')).toBe('123')
			expect(record!.get('title')).toBe('Test Task')

			// Should have tree navigation capabilities
			expect(record!.getPath).toBeDefined()
			expect(record!.getParent).toBeDefined()
		})

		it('adds record using Doctype object', () => {
			const recordData = { id: '123', title: 'Test Task' }

			stonecrop.addRecord(mockDoctype, '123', recordData)

			const record = stonecrop.getRecordById(mockDoctype, '123')
			expect(record).toBeDefined()
			expect(record!.get('title')).toBe('Test Task')
		})

		it('gets all record IDs', () => {
			stonecrop.addRecord('task', '123', { title: 'Task 1' })
			stonecrop.addRecord('task', '456', { title: 'Task 2' })

			const recordIds = stonecrop.getRecordIds('task')
			expect(recordIds).toEqual(['123', '456'])
		})

		it('removes record', () => {
			stonecrop.addRecord('task', '123', { id: '123', title: 'Test Task' })

			// Verify record exists
			expect(stonecrop.getRecordById('task', '123')).toBeDefined()

			// Remove record
			stonecrop.removeRecord('task', '123')

			// Should be gone
			expect(stonecrop.getRecordById('task', '123')).toBeUndefined()
		})

		it('clears all records for doctype', () => {
			stonecrop.addRecord('task', '123', { title: 'Task 1' })
			stonecrop.addRecord('task', '456', { title: 'Task 2' })

			stonecrop.clearRecords('task')

			expect(stonecrop.getRecordIds('task')).toEqual([])
		})

		it('ensures doctype exists when accessing records', () => {
			// Access records for non-existent doctype should create it
			const records = stonecrop.records('newdoctype')

			expect(records.getPath()).toBe('newdoctype')
			expect(stonecrop.getStore().has('newdoctype')).toBe(true)
		})
	})

	describe('Server Integration', () => {
		let mockDoctype: Doctype
		let mockClient: any

		beforeEach(() => {
			mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)

			// Create a mock client for server integration tests
			mockClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn(),
				getRecords: vi.fn(),
				runAction: vi.fn(),
			}
			stonecrop.setClient(mockClient)
		})

		it('getRecords fetches and stores records in HST', async () => {
			const mockRecords = [
				{ id: '1', title: 'Task 1' },
				{ id: '2', title: 'Task 2' },
			]
			mockClient.getRecords.mockResolvedValue(mockRecords)

			await stonecrop.getRecords(mockDoctype)

			expect(mockClient.getRecords).toHaveBeenCalledWith(mockDoctype)

			// Check that records are stored in HST with proper wrapping
			const recordIds = stonecrop.getRecordIds('task')
			expect(recordIds).toEqual(['1', '2'])

			const record1 = stonecrop.getRecordById('task', '1')
			expect(record1!.get('title')).toBe('Task 1')
			expect(record1!.getPath).toBeDefined()
		})

		it('getRecord fetches and stores single record', async () => {
			const mockRecord = { id: '123', title: 'Test Task' }
			mockClient.getRecord.mockResolvedValue(mockRecord)

			await stonecrop.getRecord(mockDoctype, '123')

			expect(mockClient.getRecord).toHaveBeenCalledWith(mockDoctype, '123')

			// Check that record is stored
			const record = stonecrop.getRecordById('task', '123')
			expect(record!.get('title')).toBe('Test Task')
			expect(record!.get('id')).toBe('123')
		})
	})

	describe('DataClient integration', () => {
		let mockDoctype: Doctype

		beforeEach(() => {
			// Reset registry for each test
			Registry._root = undefined as any
			const localRouter = createRouter({ history: createMemoryHistory(), routes: [] })
			registry = new Registry(localRouter)
			mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)
		})

		it('getRecord delegates to client.getRecord when client provided', async () => {
			const mockRecord = { id: 'abc', title: 'Client Task' }
			const mockClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn().mockResolvedValue(mockRecord),
				getRecords: vi.fn(),
				runAction: vi.fn(),
			}

			const options: StonecropOptions = { client: mockClient }
			const localStonecrop = new Stonecrop(registry, undefined, options)

			await localStonecrop.getRecord(mockDoctype, 'abc')

			expect(mockClient.getRecord).toHaveBeenCalledOnce()
			expect(mockClient.getRecord).toHaveBeenCalledWith(mockDoctype, 'abc')
			expect(fetch).not.toHaveBeenCalled()

			const stored = localStonecrop.getRecordById('task', 'abc')
			expect(stored!.get('title')).toBe('Client Task')
		})

		it('getRecords delegates to client.getRecords when client provided', async () => {
			const mockRecords = [
				{ id: '1', title: 'Record A' },
				{ id: '2', title: 'Record B' },
			]
			const mockClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn(),
				getRecords: vi.fn().mockResolvedValue(mockRecords),
				runAction: vi.fn(),
			}

			const options: StonecropOptions = { client: mockClient }
			const localStonecrop = new Stonecrop(registry, undefined, options)

			await localStonecrop.getRecords(mockDoctype)

			expect(mockClient.getRecords).toHaveBeenCalledOnce()
			expect(mockClient.getRecords).toHaveBeenCalledWith(mockDoctype)
			expect(fetch).not.toHaveBeenCalled()

			const ids = localStonecrop.getRecordIds('task')
			expect(ids).toEqual(['1', '2'])
		})

		it('getRecord throws error when no client configured', async () => {
			const localStonecrop = new Stonecrop(registry)

			await expect(localStonecrop.getRecord(mockDoctype, '42')).rejects.toThrow('No data client configured')
		})

		it('getRecords throws error when no client configured', async () => {
			const localStonecrop = new Stonecrop(registry)

			await expect(localStonecrop.getRecords(mockDoctype)).rejects.toThrow('No data client configured')
		})

		it('getRecord does not add record to HST when client returns null', async () => {
			const mockClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn().mockResolvedValue(null),
				getRecords: vi.fn(),
				runAction: vi.fn(),
			}
			const options: StonecropOptions = { client: mockClient }
			const localStonecrop = new Stonecrop(registry, undefined, options)

			await localStonecrop.getRecord(mockDoctype, 'missing-id')

			const stored = localStonecrop.getRecordById('task', 'missing-id')
			expect(stored).toBeUndefined()
		})

		it('setClient allows deferred client configuration', async () => {
			const mockRecord = { id: 'deferred', title: 'Deferred Task' }
			const mockClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn().mockResolvedValue(mockRecord),
				getRecords: vi.fn(),
				runAction: vi.fn(),
			}

			const localStonecrop = new Stonecrop(registry)

			// Client not set initially
			expect(localStonecrop.getClient()).toBeUndefined()

			// Set client after construction
			localStonecrop.setClient(mockClient)
			expect(localStonecrop.getClient()).toBe(mockClient)

			// Now getRecord should work
			await localStonecrop.getRecord(mockDoctype, 'deferred')
			expect(mockClient.getRecord).toHaveBeenCalledOnce()
		})

		it('dispatchAction delegates to client.runAction', async () => {
			const mockResult = { success: true, data: { id: '1', status: 'submitted' }, error: null }
			const mockClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn(),
				getRecords: vi.fn(),
				runAction: vi.fn().mockResolvedValue(mockResult),
			}

			const options: StonecropOptions = { client: mockClient }
			const localStonecrop = new Stonecrop(registry, undefined, options)

			const result = await localStonecrop.dispatchAction(mockDoctype, 'SUBMIT', ['1'])

			expect(mockClient.runAction).toHaveBeenCalledOnce()
			expect(mockClient.runAction).toHaveBeenCalledWith(mockDoctype, 'SUBMIT', ['1'])
			expect(result).toEqual(mockResult)
		})

		it('dispatchAction throws error when no client configured', async () => {
			const localStonecrop = new Stonecrop(registry)

			await expect(localStonecrop.dispatchAction(mockDoctype, 'SUBMIT', ['1'])).rejects.toThrow(
				'No data client configured'
			)
		})
	})

	describe('getRecordState', () => {
		let mockDoctype: Doctype

		beforeEach(() => {
			mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)
		})

		it('returns the status field value when the record has a status', () => {
			stonecrop.addRecord('task', 'r-1', { id: 'r-1', status: 'pending' })

			const state = stonecrop.getRecordState('task', 'r-1')
			expect(state).toBe('pending')
		})

		it('falls back to the workflow initial state when the record has no status field', () => {
			stonecrop.addRecord('task', 'r-2', { id: 'r-2', title: 'No status here' })

			const state = stonecrop.getRecordState('task', 'r-2')
			expect(state).toBe('draft')
		})

		it('falls back to the workflow initial state when status is an empty string', () => {
			stonecrop.addRecord('task', 'r-3', { id: 'r-3', status: '' })

			const state = stonecrop.getRecordState('task', 'r-3')
			expect(state).toBe('draft')
		})

		it('returns empty string when the doctype has no workflow', () => {
			const noWorkflowDoctype = new Doctype('Bare', List<SchemaTypes>([]), undefined as any, Map({}))
			// Use a fresh registry to avoid singleton collision
			Registry._root = undefined as any
			const localRegistry = new Registry()
			localRegistry.addDoctype(noWorkflowDoctype)
			const localStonecrop = new Stonecrop(localRegistry)
			localStonecrop.addRecord('bare', 'r-4', { id: 'r-4' })

			const state = localStonecrop.getRecordState('bare', 'r-4')
			expect(state).toBe('')
		})

		it('accepts a Doctype instance instead of a string slug', () => {
			stonecrop.addRecord('task', 'r-5', { id: 'r-5', status: 'completed' })

			const state = stonecrop.getRecordState(mockDoctype, 'r-5')
			expect(state).toBe('completed')
		})

		it('falls back to initial state for a non-existent record', () => {
			// record 'ghost' was never added
			const state = stonecrop.getRecordState('task', 'ghost')
			expect(state).toBe('draft')
		})

		describe('WorkflowMeta format support', () => {
			it('returns first state as initial for WorkflowMeta format', () => {
				Registry._root = undefined as any
				const localRegistry = new Registry()
				const localStonecrop = new Stonecrop(localRegistry)

				const workflowMeta = {
					states: ['planning', 'review', 'approved'],
					actions: {
						submit: { label: 'Submit', handler: 'plan:submit', allowedStates: ['planning'] },
					},
				}
				const planDoctype = new Doctype('Plan', List<SchemaTypes>([]), workflowMeta, Map({}))
				localRegistry.addDoctype(planDoctype)
				localStonecrop.addRecord('plan', 'p-1', { id: 'p-1' })

				const state = localStonecrop.getRecordState('plan', 'p-1')
				expect(state).toBe('planning')
			})

			it('returns status field when present, regardless of workflow format', () => {
				Registry._root = undefined as any
				const localRegistry = new Registry()
				const localStonecrop = new Stonecrop(localRegistry)

				const workflowMeta = {
					states: ['planning', 'review', 'approved'],
					actions: {},
				}
				const planDoctype = new Doctype('Plan', List<SchemaTypes>([]), workflowMeta, Map({}))
				localRegistry.addDoctype(planDoctype)
				localStonecrop.addRecord('plan', 'p-2', { id: 'p-2', status: 'review' })

				const state = localStonecrop.getRecordState('plan', 'p-2')
				expect(state).toBe('review')
			})

			it('handles WorkflowMeta with empty states array', () => {
				Registry._root = undefined as any
				const localRegistry = new Registry()
				const localStonecrop = new Stonecrop(localRegistry)

				const emptyStatesMeta = {
					states: [],
					actions: {},
				}
				const doctype = new Doctype('Empty', List<SchemaTypes>([]), emptyStatesMeta, Map({}))
				localRegistry.addDoctype(doctype)
				localStonecrop.addRecord('empty', 'e-1', { id: 'e-1' })

				const state = localStonecrop.getRecordState('empty', 'e-1')
				expect(state).toBe('')
			})

			it('handles WorkflowMeta without states property', () => {
				Registry._root = undefined as any
				const localRegistry = new Registry()
				const localStonecrop = new Stonecrop(localRegistry)

				const noStatesMeta = {
					actions: { save: { label: 'Save', handler: 'save' } },
				}
				const doctype = new Doctype('NoStates', List<SchemaTypes>([]), noStatesMeta, Map({}))
				localRegistry.addDoctype(doctype)
				localStonecrop.addRecord('no-states', 'ns-1', { id: 'ns-1' })

				const state = localStonecrop.getRecordState('no-states', 'ns-1')
				expect(state).toBe('')
			})
		})
	})

	describe('Advanced HST Usage', () => {
		it('provides access to root HST store', () => {
			const store = stonecrop.getStore()

			expect(store.get).toBeDefined()
			expect(store.set).toBeDefined()
			expect(store.has).toBeDefined()
			expect(store.getPath).toBeDefined()
			expect(store.getPath()).toBe('')
		})

		it('supports tree navigation between records and store sections', () => {
			const mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)

			stonecrop.addRecord('task', '123', { id: '123', title: 'Test Task' })

			const store = stonecrop.getStore()
			const record = stonecrop.getRecordById('task', '123')

			if (record) {
				const doctypeSection = record.getParent()
				const rootStore = doctypeSection?.getParent()

				expect(doctypeSection?.getPath()).toBe('task')
				expect(rootStore?.getPath()).toBe('')
			} else {
				throw new Error('Record not found')
			}
		})

		it('supports nested record data with tree navigation', () => {
			const mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)

			const recordData = {
				id: '123',
				title: 'Test Task',
				details: {
					priority: 'high',
					assignee: {
						name: 'John Doe',
						email: 'john@example.com',
					},
				},
			}

			stonecrop.addRecord('task', '123', recordData)

			const record = stonecrop.getRecordById('task', '123')!
			const assignee = record.getNode('details.assignee')

			expect(assignee.get('name')).toBe('John Doe')
			expect(assignee.getParent()!.getPath()).toContain('details')
		})
	})

	describe('collectRecordPayload', () => {
		beforeEach(() => {
			Registry._root = undefined as any
		})

		it('collects simple field values from record', () => {
			const doctype = Doctype.fromObject({
				name: 'Task',
				fields: [
					{ fieldname: 'title', fieldtype: 'Data' } as SchemaTypes,
					{ fieldname: 'status', fieldtype: 'Data' } as SchemaTypes,
				],
			})
			registry.addDoctype(doctype)

			stonecrop.addRecord('task', 'task-1', { title: 'Test Task', status: 'open' })

			const payload = stonecrop.collectRecordPayload(doctype, 'task-1')

			expect(payload.title).toBe('Test Task')
			expect(payload.status).toBe('open')
		})

		it('collects array data for cardinality: many fields', () => {
			const itemDoctype = Doctype.fromObject({
				name: 'Item',
				fields: [{ fieldname: 'name', fieldtype: 'Data' } as SchemaTypes],
			})
			registry.addDoctype(itemDoctype)

			const orderDoctype = Doctype.fromObject({
				name: 'Order',
				fields: [
					{ fieldname: 'order_number', fieldtype: 'Data' } as SchemaTypes,
					{
						fieldname: 'items',
						fieldtype: 'Doctype',
						cardinality: 'many',
						options: 'item',
					} as SchemaTypes,
				],
			})
			registry.addDoctype(orderDoctype)

			stonecrop.addRecord('order', 'order-1', { order_number: 'ORD-001' })
			stonecrop.getStore().set('order.order-1.items', [{ name: 'Item 1' }, { name: 'Item 2' }])

			const payload = stonecrop.collectRecordPayload(orderDoctype, 'order-1')

			expect(payload.order_number).toBe('ORD-001')
			expect(payload.items).toBeDefined()
			expect(Array.isArray(payload.items)).toBe(true)
			expect(payload.items).toHaveLength(2)
		})

		it('collects nested 1:1 doctype fields', () => {
			const addressDoctype = Doctype.fromObject({
				name: 'Address',
				fields: [
					{ fieldname: 'street', fieldtype: 'Data' } as SchemaTypes,
					{ fieldname: 'city', fieldtype: 'Data' } as SchemaTypes,
				],
			})
			registry.addDoctype(addressDoctype)

			const customerDoctype = Doctype.fromObject({
				name: 'Customer',
				fields: [
					{ fieldname: 'name', fieldtype: 'Data' } as SchemaTypes,
					{ fieldname: 'address', fieldtype: 'Doctype', options: 'address' } as SchemaTypes,
				],
			})
			registry.addDoctype(customerDoctype)

			stonecrop.addRecord('customer', 'cust-1', { name: 'John Doe' })
			stonecrop.getStore().set('customer.cust-1.address', { street: '123 Oak St', city: 'Portland' })

			const payload = stonecrop.collectRecordPayload(customerDoctype, 'cust-1')

			expect(payload.name).toBe('John Doe')
			expect(payload.address).toBeDefined()
			expect(payload.address.street).toBe('123 Oak St')
			expect(payload.address.city).toBe('Portland')
		})

		it('recursively collects nested 1:many inside 1:1', () => {
			const phoneDoctype = Doctype.fromObject({
				name: 'Phone',
				fields: [{ fieldname: 'number', fieldtype: 'Data' } as SchemaTypes],
			})
			registry.addDoctype(phoneDoctype)

			const addressDoctype = Doctype.fromObject({
				name: 'Address',
				fields: [
					{ fieldname: 'street', fieldtype: 'Data' } as SchemaTypes,
					{
						fieldname: 'phones',
						fieldtype: 'Doctype',
						cardinality: 'many',
						options: 'phone',
					} as SchemaTypes,
				],
			})
			registry.addDoctype(addressDoctype)

			const customerDoctype = Doctype.fromObject({
				name: 'Customer',
				fields: [
					{ fieldname: 'name', fieldtype: 'Data' } as SchemaTypes,
					{ fieldname: 'address', fieldtype: 'Doctype', options: 'address' } as SchemaTypes,
				],
			})
			registry.addDoctype(customerDoctype)

			stonecrop.addRecord('customer', 'cust-2', { name: 'Jane Doe' })
			stonecrop.getStore().set('customer.cust-2.address', { street: '456 Pine St' })
			stonecrop.getStore().set('customer.cust-2.address.phones', [{ number: '555-1234' }])

			const payload = stonecrop.collectRecordPayload(customerDoctype, 'cust-2')

			expect(payload.name).toBe('Jane Doe')
			expect(payload.address.phones).toBeDefined()
			expect(Array.isArray(payload.address.phones)).toBe(true)
			expect(payload.address.phones[0].number).toBe('555-1234')
		})

		it('collects deeply nested 1:1 inside 1:1', () => {
			const coordsDoctype = Doctype.fromObject({
				name: 'Coordinates',
				fields: [
					{ fieldname: 'lat', fieldtype: 'Float' } as SchemaTypes,
					{ fieldname: 'lng', fieldtype: 'Float' } as SchemaTypes,
				],
			})
			registry.addDoctype(coordsDoctype)

			const addressDoctype = Doctype.fromObject({
				name: 'Address',
				fields: [
					{ fieldname: 'street', fieldtype: 'Data' } as SchemaTypes,
					{ fieldname: 'coordinates', fieldtype: 'Doctype', options: 'coordinates' } as SchemaTypes,
				],
			})
			registry.addDoctype(addressDoctype)

			const customerDoctype = Doctype.fromObject({
				name: 'Customer',
				fields: [
					{ fieldname: 'name', fieldtype: 'Data' } as SchemaTypes,
					{ fieldname: 'address', fieldtype: 'Doctype', options: 'address' } as SchemaTypes,
				],
			})
			registry.addDoctype(customerDoctype)

			stonecrop.addRecord('customer', 'cust-3', { name: 'Bob Smith' })
			stonecrop.getStore().set('customer.cust-3.address', { street: '789 Elm St' })
			stonecrop.getStore().set('customer.cust-3.address.coordinates', { lat: 47.6062, lng: -122.3321 })

			const payload = stonecrop.collectRecordPayload(customerDoctype, 'cust-3')

			expect(payload.name).toBe('Bob Smith')
			expect(payload.address.coordinates).toBeDefined()
			expect(payload.address.coordinates.lat).toBe(47.6062)
			expect(payload.address.coordinates.lng).toBe(-122.3321)
		})

		it('handles empty record data', () => {
			const doctype = Doctype.fromObject({
				name: 'Task',
				fields: [{ fieldname: 'title', fieldtype: 'Data' } as SchemaTypes],
			})
			registry.addDoctype(doctype)

			stonecrop.addRecord('task', 'task-empty', {})

			const payload = stonecrop.collectRecordPayload(doctype, 'task-empty')

			expect(payload).toBeDefined()
		})
	})
})
