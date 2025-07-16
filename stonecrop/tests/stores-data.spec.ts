import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useDataStore } from '../src/stores/data'

describe('Data Store', () => {
	beforeEach(() => {
		const pinia = createPinia()
		setActivePinia(pinia)
	})

	it('initializes with empty records array', () => {
		const store = useDataStore()

		expect(store.records).toEqual([])
		expect(Array.isArray(store.records)).toBe(true)
	})

	it('initializes with empty record object', () => {
		const store = useDataStore()

		expect(store.record).toEqual({})
		expect(typeof store.record).toBe('object')
	})

	it('can update records array', () => {
		const store = useDataStore()
		const testRecords = [
			{ id: 1, title: 'Task 1' },
			{ id: 2, title: 'Task 2' },
		]

		store.records = testRecords
		expect(store.records).toEqual(testRecords)
	})

	it('can update single record', () => {
		const store = useDataStore()
		const testRecord = { id: 1, title: 'Test Task', status: 'active' }

		store.record = testRecord
		expect(store.record).toEqual(testRecord)
	})

	it('maintains reactivity for records', () => {
		const store = useDataStore()
		const initialRecords = [{ id: 1, title: 'Initial' }]

		store.records = initialRecords
		expect(store.records).toEqual(initialRecords)

		// Add a new record
		store.records.push({ id: 2, title: 'Added' })
		expect(store.records).toHaveLength(2)
		expect(store.records[1]).toEqual({ id: 2, title: 'Added' })
	})

	it('maintains reactivity for record', () => {
		const store = useDataStore()

		store.record = { id: 1, title: 'Initial' }
		expect(store.record.title).toBe('Initial')

		// Update a property
		store.record.title = 'Updated'
		expect(store.record.title).toBe('Updated')
	})

	it('can reset records to empty state', () => {
		const store = useDataStore()

		// Set some data
		store.records = [{ id: 1, title: 'Test' }]
		store.record = { id: 1, title: 'Test Record' }

		// Reset
		store.records = []
		store.record = {}

		expect(store.records).toEqual([])
		expect(store.record).toEqual({})
	})
})
