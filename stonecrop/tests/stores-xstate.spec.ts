import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useCounterStore, counterMachine } from '../src/stores/xstate'

describe('XState Store', () => {
	beforeEach(() => {
		const pinia = createPinia()
		setActivePinia(pinia)
	})

	it('initializes counter machine with correct initial state', () => {
		expect(counterMachine.id).toBe('counter')
		expect(counterMachine.config.initial).toBe('active')
	})

	it('creates counter store with initial context', () => {
		const store = useCounterStore()

		expect(store.state.context.count).toBe(0)
		expect(store.state.value).toBe('active')
	})

	it('handles INC event to increment counter', () => {
		const store = useCounterStore()

		store.send({ type: 'INC' })
		expect(store.state.context.count).toBe(1)

		store.send({ type: 'INC' })
		expect(store.state.context.count).toBe(2)
	})

	it('handles DEC event to decrement counter', () => {
		const store = useCounterStore()
		const startingCount = store.state.context.count

		// First increment to have a positive number
		store.send({ type: 'INC' })
		store.send({ type: 'INC' })
		expect(store.state.context.count).toBe(startingCount + 2)

		// Then decrement
		store.send({ type: 'DEC' })
		expect(store.state.context.count).toBe(startingCount + 1)

		store.send({ type: 'DEC' })
		expect(store.state.context.count).toBe(startingCount)
	})

	it('can decrement below zero', () => {
		const store = useCounterStore()

		// Reset to zero first by checking current count and adjusting
		const currentCount = store.state.context.count
		for (let i = 0; i < currentCount + 1; i++) {
			store.send({ type: 'DEC' })
		}
		expect(store.state.context.count).toBe(-1)

		store.send({ type: 'DEC' })
		expect(store.state.context.count).toBe(-2)
	})

	it('remains in active state regardless of events', () => {
		const store = useCounterStore()

		expect(store.state.value).toBe('active')

		store.send({ type: 'INC' })
		expect(store.state.value).toBe('active')

		store.send({ type: 'DEC' })
		expect(store.state.value).toBe('active')
	})

	it('handles multiple rapid events correctly', () => {
		const store = useCounterStore()

		const initialCount = store.state.context.count

		// Send multiple events in sequence
		for (let i = 0; i < 5; i++) {
			store.send({ type: 'INC' })
		}
		expect(store.state.context.count).toBe(initialCount + 5)

		for (let i = 0; i < 3; i++) {
			store.send({ type: 'DEC' })
		}
		expect(store.state.context.count).toBe(initialCount + 2)
	})

	it('maintains state consistency across multiple store instances', () => {
		const store1 = useCounterStore()
		const store2 = useCounterStore()

		// Both stores should reference the same state
		expect(store1).toBe(store2)

		const initialCount = store1.state.context.count
		store1.send({ type: 'INC' })
		expect(store2.state.context.count).toBe(initialCount + 1)
	})
})
