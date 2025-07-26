import type { SchemaTypes } from '@stonecrop/aform'
import { List, Map } from 'immutable'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import type { UnknownMachineConfig } from 'xstate'

import DoctypeMeta from '../src/doctype'
import Registry from '../src/registry'
import { Stonecrop } from '../src/stonecrop'
import { HST, type HSTNode } from '../src/stores/hst'

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

	const createMockDoctype = (name: string) => {
		const mockSchema = List([
			{
				fieldname: 'title',
				component: 'ATextInput',
				label: 'Title',
			},
		] as SchemaTypes[])

		const mockWorkflow: UnknownMachineConfig = {
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

		return new DoctypeMeta(name, mockSchema, mockWorkflow, mockActions)
	}

	describe('Initialization', () => {
		it('creates Stonecrop instance with HST integration', () => {
			expect(stonecrop.registry).toBe(registry)
			expect(stonecrop.getStore).toBeDefined()
			expect(typeof stonecrop.getStore).toBe('function')
		})

		it('initializes HST store with existing Registry doctypes', () => {
			const mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)

			const newStonecrop = new Stonecrop(registry)
			const store = newStonecrop.getStore()

			expect(store.has('task')).toBe(true)
			expect(store.has('task.records')).toBe(true)
			expect(store.has('task.currentRecord')).toBe(true)
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
			expect(store.has('task.records')).toBe(true)
			expect(store.has('task.currentRecord')).toBe(true)
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
			expect(records.getPath()).toBe('task.records')
			expect(records.getParent).toBeDefined()
		})

		it('returns records hash using DoctypeMeta object', () => {
			const records = stonecrop.records(mockDoctype)

			expect(records.getPath()).toBe('task.records')
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

		it('manages current record with full HST reference', () => {
			const recordData = { id: '123', title: 'Test Task' }
			stonecrop.addRecord('task', '123', recordData)

			// Initially no current record
			expect(stonecrop.currentRecord('task')).toBeNull()

			// Set current record
			stonecrop.setCurrentRecord('task', '123')

			const currentRecord = stonecrop.currentRecord('task')
			expect(currentRecord).toBeDefined()
			expect(currentRecord!.get('id')).toBe('123')
			expect(currentRecord!.getPath).toBeDefined()
		})

		it('gets all record IDs', () => {
			stonecrop.addRecord('task', '123', { title: 'Task 1' })
			stonecrop.addRecord('task', '456', { title: 'Task 2' })

			const recordIds = stonecrop.getRecordIds('task')
			expect(recordIds).toEqual(['123', '456'])
		})

		it('removes record and clears current if needed', () => {
			stonecrop.addRecord('task', '123', { id: '123', title: 'Test Task' })
			stonecrop.setCurrentRecord('task', '123')

			// Verify record exists and is current
			expect(stonecrop.getRecordById('task', '123')).toBeDefined()
			expect(stonecrop.currentRecord('task')).toBeDefined()

			// Remove record
			stonecrop.removeRecord('task', '123')

			// Should be gone and current should be cleared
			expect(stonecrop.getRecordById('task', '123')).toBeUndefined()
			expect(stonecrop.currentRecord('task')).toBeNull()
		})

		it('clears all records for doctype', () => {
			stonecrop.addRecord('task', '123', { title: 'Task 1' })
			stonecrop.addRecord('task', '456', { title: 'Task 2' })
			stonecrop.setCurrentRecord('task', '123')

			stonecrop.clearRecords('task')

			expect(stonecrop.getRecordIds('task')).toEqual([])
			expect(stonecrop.currentRecord('task')).toBeNull()
		})

		it('ensures doctype exists when accessing records', () => {
			// Access records for non-existent doctype should create it
			const records = stonecrop.records('newdoctype')

			expect(records.getPath()).toBe('newdoctype.records')
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

			expect(fetch).toHaveBeenCalledWith('/task', undefined)

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

			// Check that record is stored and set as current
			const record = stonecrop.getRecordById('task', '123')
			expect(record!.get('title')).toBe('Test Task')

			const currentRecord = stonecrop.currentRecord('task')
			expect(currentRecord!.get('id')).toBe('123')
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
			console.log('Store has task.records:', store.has('task.records'))
			console.log('Store has task.records.123:', store.has('task.records.123'))

			const record = stonecrop.getRecordById('task', '123')
			console.log('Record is:', record)
			console.log('Record path:', record?.getPath())

			if (record) {
				const recordsSection = record.getParent()
				const doctypeSection = recordsSection?.getParent()
				const rootStore = doctypeSection?.getParent()

				expect(recordsSection?.getPath()).toBe('task.records')
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
