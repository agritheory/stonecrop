import { describe, it, expect } from 'vite-plus/test'
import { isActionAllowedInState, isActionAllowedOnNewRecord } from '../src/doctype'

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

// A record not created yet is in no state, so the page and the server guard must agree on what can
// run on one without a state to read.
describe('isActionAllowedOnNewRecord', () => {
	it('allows a self-transition, which creates the record, even one limited to states', () => {
		expect(isActionAllowedOnNewRecord({ selfTransition: true })).toBe(true)
		expect(isActionAllowedOnNewRecord({ selfTransition: true, allowedStates: ['Draft'] })).toBe(true)
	})

	it('allows an action that declares no allowedStates and does not move the record', () => {
		expect(isActionAllowedOnNewRecord({})).toBe(true)
		expect(isActionAllowedOnNewRecord({ allowedStates: [] })).toBe(true)
	})

	it('refuses a transition, which needs a record to move', () => {
		expect(isActionAllowedOnNewRecord({ nextState: 'Submitted' })).toBe(false)
		expect(isActionAllowedOnNewRecord({ allowedStates: ['Draft'], nextState: 'Submitted' })).toBe(false)
	})

	it('refuses an action limited to states, which needs the state of a record that exists', () => {
		expect(isActionAllowedOnNewRecord({ allowedStates: ['Draft'] })).toBe(false)
	})

	it('reads an absent declaration sent as null the same as one left out', () => {
		expect(isActionAllowedOnNewRecord({ allowedStates: null, nextState: null, selfTransition: null })).toBe(true)
	})
})
