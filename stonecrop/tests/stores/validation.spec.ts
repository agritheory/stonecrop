import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useValidationStore } from '../../src/stores/validation'
import type { TriggerDefinition } from '@stonecrop/schema'

// The canonical v1 use case: validate two dependent dates when either is edited.
const dateOrder: Record<string, TriggerDefinition> = {
	dateOrder: {
		label: 'Date order',
		on: ['start_date', 'end_date'],
		clientHandler: "if (record.end_date < record.start_date) setError('end_date', 'End before start')",
	},
}

describe('Validation Store', { tags: ['unit'] }, () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	describe('error state', () => {
		it('is valid when empty', () => {
			const store = useValidationStore()
			expect(store.isValid).toBe(true)
			expect(store.errorsFor('end_date')).toEqual([])
		})

		it('records an error via setError and reports invalid', () => {
			const store = useValidationStore()
			store.setError('dateOrder', 'end_date', 'End before start')
			expect(store.isValid).toBe(false)
			expect(store.errorsFor('end_date')).toEqual(['End before start'])
		})

		it("clearTrigger removes only that trigger's errors", () => {
			const store = useValidationStore()
			store.setError('dateOrder', 'end_date', 'End before start')
			store.setError('other', 'name', 'Required')
			store.clearTrigger('dateOrder')
			expect(store.errorsFor('end_date')).toEqual([])
			expect(store.errorsFor('name')).toEqual(['Required'])
			expect(store.isValid).toBe(false)
		})

		it('clearAll empties everything', () => {
			const store = useValidationStore()
			store.setError('dateOrder', 'end_date', 'x')
			store.clearAll()
			expect(store.isValid).toBe(true)
		})

		it('exposes errorsByField for prop-feeding a renderer', () => {
			const store = useValidationStore()
			store.setError('dateOrder', 'end_date', 'End before start')
			expect(store.errorsByField).toEqual({ end_date: ['End before start'] })
		})
	})

	describe('validateField', () => {
		it('runs a trigger whose `on` includes the changed field and flags the error field', async () => {
			const store = useValidationStore()
			await store.validateField(dateOrder, 'start_date', { start_date: '2020-01-02', end_date: '2020-01-01' })
			expect(store.isValid).toBe(false)
			expect(store.errorsFor('end_date')).toEqual(['End before start'])
		})

		it('passes when the record is valid', async () => {
			const store = useValidationStore()
			await store.validateField(dateOrder, 'start_date', { start_date: '2020-01-01', end_date: '2020-01-02' })
			expect(store.isValid).toBe(true)
		})

		it('does not run a trigger whose `on` excludes the changed field', async () => {
			const store = useValidationStore()
			// dates are out of order, but the edited field is not in the trigger's `on` set
			await store.validateField(dateOrder, 'note', { start_date: '2020-01-02', end_date: '2020-01-01', note: 'x' })
			expect(store.isValid).toBe(true)
		})

		it("re-running replaces the trigger's prior contributions (namespaced clear)", async () => {
			const store = useValidationStore()
			await store.validateField(dateOrder, 'end_date', { start_date: '2020-01-02', end_date: '2020-01-01' })
			expect(store.isValid).toBe(false)
			// user fixes the value; the same trigger re-runs and clears its stale error
			await store.validateField(dateOrder, 'end_date', { start_date: '2020-01-01', end_date: '2020-01-02' })
			expect(store.isValid).toBe(true)
			expect(store.errorsFor('end_date')).toEqual([])
		})

		it("injects value as the changed field's current value", async () => {
			const store = useValidationStore()
			const triggers: Record<string, TriggerDefinition> = {
				nonEmpty: { on: ['name'], clientHandler: "if (!value) setError('name', 'Required')" },
			}
			await store.validateField(triggers, 'name', { name: '' })
			expect(store.errorsFor('name')).toEqual(['Required'])
			store.clearAll()
			await store.validateField(triggers, 'name', { name: 'Ada' })
			expect(store.isValid).toBe(true)
		})

		it("does not mutate the caller's record but can read siblings", async () => {
			const store = useValidationStore()
			const record = { start_date: '2020-01-01', end_date: '2020-01-02', touched: false }
			const triggers: Record<string, TriggerDefinition> = {
				mutator: {
					on: ['start_date'],
					clientHandler: "record.touched = true; if (record.end_date) setError('end_date', 'seen')",
				},
			}
			await store.validateField(triggers, 'start_date', record)
			expect(record.touched).toBe(false) // caller's record is a frozen copy — untouched
			expect(store.errorsFor('end_date')).toEqual(['seen']) // sibling field was readable
		})

		it('fails open when a validator throws (advisory: no block, logs loudly)', async () => {
			const err = vi.spyOn(console, 'error').mockImplementation(() => {})
			const store = useValidationStore()
			const triggers: Record<string, TriggerDefinition> = {
				boom: { on: ['name'], clientHandler: "throw new Error('boom')" },
			}
			await store.validateField(triggers, 'name', { name: 'x' })
			expect(store.isValid).toBe(true) // fail-open: a broken validator never blocks save
			expect(err).toHaveBeenCalled() // but it's surfaced at error severity for the author
			err.mockRestore()
		})
	})

	describe('validateRecord', () => {
		it('runs all triggers regardless of which field changed (save-time gate)', async () => {
			const store = useValidationStore()
			await store.validateRecord(dateOrder, { start_date: '2020-01-02', end_date: '2020-01-01' })
			expect(store.isValid).toBe(false)
			expect(store.errorsFor('end_date')).toEqual(['End before start'])
		})
	})
})
