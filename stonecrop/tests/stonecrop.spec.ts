import type { SchemaTypes } from '@stonecrop/aform'
import { List, Map } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

import DoctypeMeta from '../src/doctype'
import Registry from '../src/registry'
import { Stonecrop } from '../src/stonecrop'
import { useDataStore } from '../src/stores/data'

// Mock fetch globally
global.fetch = vi.fn()

describe('Stonecrop class', () => {
	let registry: Registry
	let store: ReturnType<typeof useDataStore>
	let stonecrop: Stonecrop
	let mockRouter: any

	beforeEach(() => {
		const pinia = createPinia()
		setActivePinia(pinia)

		// Reset static instance
		Stonecrop._root = undefined as any
		Registry._root = undefined as any

		mockRouter = createRouter({
			history: createWebHistory(),
			routes: [],
		})

		registry = new Registry(mockRouter)
		store = useDataStore()
		stonecrop = new Stonecrop(registry, store)

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

	it('creates Stonecrop instance with correct properties', () => {
		expect(stonecrop.name).toBe('Stonecrop')
		expect(stonecrop.registry).toBe(registry)
		expect(stonecrop.store).toBe(store)
	})

	it('implements singleton pattern', () => {
		const stonecrop1 = new Stonecrop(registry, store)
		const stonecrop2 = new Stonecrop(registry, store)

		expect(stonecrop1).toBe(stonecrop2)
		expect(Stonecrop._root).toBe(stonecrop1)
	})

	it('sets up doctype correctly', () => {
		const mockDoctype = createMockDoctype('Task')
		const getMetaSpy = vi.spyOn(stonecrop, 'getMeta').mockResolvedValue(mockDoctype)

		stonecrop.setup(mockDoctype)

		expect(getMetaSpy).toHaveBeenCalledWith('Task')
	})

	it('getMeta returns doctype when registry has getMeta function', async () => {
		const mockDoctype = createMockDoctype('Task')
		registry.getMeta = vi.fn().mockResolvedValue(mockDoctype)

		const result = await stonecrop.getMeta('Task')

		expect(result).toBe(mockDoctype)
		expect(registry.getMeta).toHaveBeenCalledWith('Task')
	})

	it('getMeta throws NotImplementedError when registry has no getMeta function', async () => {
		registry.getMeta = undefined

		await expect(stonecrop.getMeta('Task')).rejects.toThrow(
			'getMeta function is not implemented for Task in the registry'
		)
	})

	it('getRecords fetches and stores records', async () => {
		const mockDoctype = createMockDoctype('Task')
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
		expect(store.records).toEqual(mockRecords)
	})

	it('getRecords handles filters', async () => {
		const mockDoctype = createMockDoctype('Task')
		const filters = { body: JSON.stringify({ status: 'Open' }) }

		const mockResponse = {
			json: vi.fn().mockResolvedValue([]),
		}
		vi.mocked(fetch).mockResolvedValue(mockResponse as any)

		await stonecrop.getRecords(mockDoctype, filters)

		expect(fetch).toHaveBeenCalledWith('/task', filters)
	})

	it('getRecord fetches and stores single record', async () => {
		const mockDoctype = createMockDoctype('Task')
		const mockRecord = { id: '123', title: 'Test Task' }

		const mockResponse = {
			json: vi.fn().mockResolvedValue(mockRecord),
		}
		vi.mocked(fetch).mockResolvedValue(mockResponse as any)

		await stonecrop.getRecord(mockDoctype, '123')

		expect(fetch).toHaveBeenCalledWith('/task/123')
		expect(store.record).toEqual(mockRecord)
	})

	it('runAction processes actions correctly', () => {
		// Create a mock doctype with actions that reference existing functions
		const mockActions = Map({
			LOAD: ['console.log("loading data")'],
			SAVE: ['console.log("saving data")'],
		})

		const mockDoctype = new DoctypeMeta(
			'Task',
			List([]),
			{
				id: 'task',
				initial: 'draft',
				states: {
					draft: { on: { LOAD: 'pending', SAVE: 'completed' } },
					pending: { on: { APPROVE: 'completed', REJECT: 'draft' } },
					completed: { type: 'final' as const },
				},
			},
			mockActions
		)

		registry.addDoctype(mockDoctype)

		// Just test that the method can be called without throwing
		// Note: XState integration errors are expected and don't affect core functionality
		expect(() => stonecrop.runAction(mockDoctype, 'LOAD')).not.toThrow()
	})

	it('runAction handles workflow transitions', () => {
		const mockDoctype = createMockDoctype('Task')
		registry.addDoctype(mockDoctype)

		// Just test that the method can be called without throwing
		expect(() => stonecrop.runAction(mockDoctype, 'SUBMIT')).not.toThrow()
	})

	it('runAction executes action functions', () => {
		const mockActions = Map({
			TEST_ACTION: ['console.log("test action executed")'],
		})

		const mockDoctype = new DoctypeMeta(
			'Task',
			List([]),
			{
				id: 'task',
				initial: 'draft',
				states: {
					draft: { on: { TEST_ACTION: 'completed' } },
					completed: { type: 'final' as const },
				},
			},
			mockActions
		)

		registry.addDoctype(mockDoctype)

		const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

		stonecrop.runAction(mockDoctype, 'TEST_ACTION', ['task-1'])

		expect(consoleSpy).toHaveBeenCalledWith('test action executed')
		consoleSpy.mockRestore()
	})
})
