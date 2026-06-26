import { describe, it, expect } from 'vitest'
import { isActionAllowedInState } from '../src/doctype'

// The single source of truth for "is this action runnable from the current state",
// shared by the frontend (getAvailableTransitions) and the server dispatch guard.
// The load-bearing rule is that empty/absent allowedStates means "available in ALL
// states" — a naive `allowedStates.includes(currentState)` would invert that.
describe('isActionAllowedInState', () => {
	it('allows an action whose allowedStates includes the current state', () => {
		expect(isActionAllowedInState({ allowedStates: ['Draft', 'Assigned'] }, 'Draft')).toBe(true)
	})

	it('blocks an action whose allowedStates excludes the current state', () => {
		expect(isActionAllowedInState({ allowedStates: ['Draft'] }, 'Closed')).toBe(false)
	})

	it('treats absent allowedStates as available in all states', () => {
		expect(isActionAllowedInState({}, 'AnyState')).toBe(true)
	})

	it('treats an empty allowedStates array as available in all states', () => {
		expect(isActionAllowedInState({ allowedStates: [] }, 'AnyState')).toBe(true)
	})
})
