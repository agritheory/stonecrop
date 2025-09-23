import type { SchemaTypes } from '@stonecrop/aform'
import { List, Map } from 'immutable'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'

import DoctypeMeta from '../src/doctype'
import Registry from '../src/registry'
import { Stonecrop } from '../src/stonecrop'
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

		return new DoctypeMeta(name, mockSchema, mockWorkflowConfig, mockActions)
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
		let mockDoctype: DoctypeMeta

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

		it('returns records hash using DoctypeMeta object', () => {
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

		it('adds record using DoctypeMeta object', () => {
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
		let mockDoctype: DoctypeMeta

		beforeEach(() => {
			mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)
		})

		it('getRecords fetches and stores records in HST', async () => {
			const mockRecords = [
				{ id: '1', title: 'Task 1' },
				{ id: '2', title: 'Task 2' },
			]

			const mockResponse = {
				json: vi.fn().mockResolvedValue(mockRecords),
			}
			vi.mocked(fetch).mockResolvedValue(mockResponse as any)

			await stonecrop.getRecords(mockDoctype)

			expect(fetch).toHaveBeenCalledWith('/task')

			// Check that records are stored in HST with proper wrapping
			const recordIds = stonecrop.getRecordIds('task')
			expect(recordIds).toEqual(['1', '2'])

			const record1 = stonecrop.getRecordById('task', '1')
			expect(record1!.get('title')).toBe('Task 1')
			expect(record1!.getPath).toBeDefined()
		})

		it('getRecord fetches and stores single record', async () => {
			const mockRecord = { id: '123', title: 'Test Task' }

			const mockResponse = {
				json: vi.fn().mockResolvedValue(mockRecord),
			}
			vi.mocked(fetch).mockResolvedValue(mockResponse as any)

			await stonecrop.getRecord(mockDoctype, '123')

			expect(fetch).toHaveBeenCalledWith('/task/123')

			// Check that record is stored
			const record = stonecrop.getRecordById('task', '123')
			expect(record!.get('title')).toBe('Test Task')
			expect(record!.get('id')).toBe('123')
		})
	})

	describe('Legacy Compatibility', () => {
		it('maintains setup method for backward compatibility', () => {
			const mockDoctype = createMockDoctype('Task')

			expect(() => {
				stonecrop.setup(mockDoctype)
			}).not.toThrow()

			// Should ensure doctype exists in store
			expect(stonecrop.getStore().has('task')).toBe(true)
		})

		it('maintains runAction method for backward compatibility', () => {
			const mockDoctype = createMockDoctype('Task')

			expect(() => {
				stonecrop.runAction(mockDoctype, 'load', ['arg1'])
			}).not.toThrow()
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

			// Let's debug what's in the store
			const store = stonecrop.getStore()
			console.log('Store has task:', store.has('task'))
			console.log('Store has task.123:', store.has('task.123'))

			const record = stonecrop.getRecordById('task', '123')
			console.log('Record is:', record)
			console.log('Record path:', record?.getPath())

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
})
