import { describe, it, expect, vi } from 'vitest'

import { applyGuardedTransition } from '../src/dispatch/transition'

describe('applyGuardedTransition', () => {
	it('writes nextState and succeeds when the action is allowed in the current state', async () => {
		let written: string | undefined
		const result = await applyGuardedTransition(
			{ label: 'Submit', allowedStates: ['Draft'], nextState: 'Active' },
			{
				readState: async () => 'Draft',
				writeState: async s => {
					written = s
				},
			}
		)
		expect(result.success).toBe(true)
		expect(result.data).toEqual({ state: 'Active' })
		expect(written).toBe('Active')
	})

	it('allows the transition from any state when allowedStates is empty/absent', async () => {
		const result = await applyGuardedTransition(
			{ label: 'Reset', nextState: 'Draft' },
			{ readState: async () => 'Whatever', writeState: async () => {} }
		)
		expect(result.success).toBe(true)
		expect(result.data).toEqual({ state: 'Draft' })
	})

	it('rejects without writing when the current state is not in allowedStates', async () => {
		const writeState = vi.fn(async () => {})
		const result = await applyGuardedTransition(
			{ label: 'Submit', allowedStates: ['Draft'], nextState: 'Active' },
			{ readState: async () => 'Active', writeState }
		)
		expect(result.success).toBe(false)
		expect(result.error).toContain('not allowed')
		expect(writeState).not.toHaveBeenCalled()
	})

	it('fails loudly for a side-effect action with no nextState — no false success, no IO', async () => {
		// A stateless Save reaches the transition dispatch with nothing to transition. It must
		// surface an error rather than report success while persisting nothing.
		const readState = vi.fn(async () => 'Active')
		const writeState = vi.fn(async () => {})
		const result = await applyGuardedTransition({ label: 'Save' }, { readState, writeState })
		expect(result.success).toBe(false)
		expect(result.error).toContain('Save')
		expect(result.error).toContain('nothing was executed')
		// short-circuits before touching the backend
		expect(readState).not.toHaveBeenCalled()
		expect(writeState).not.toHaveBeenCalled()
	})

	describe('self-transitions (mutate-in-place)', () => {
		it('writes record data, keeps the state, and returns the full record when allowed', async () => {
			const writeState = vi.fn(async () => {})
			const writeData = vi.fn(async (patch: Record<string, unknown>) => ({
				id: '1',
				status: 'Draft',
				...patch,
			}))
			const result = await applyGuardedTransition(
				{ label: 'Save', selfTransition: true, allowedStates: ['Draft', 'Pending'] },
				{ readState: async () => 'Draft', writeState, writeData },
				{ title: 'edited' }
			)
			expect(result.success).toBe(true)
			// Full record returned (data changed, status unchanged) — the writeback stores this verbatim.
			expect(result.data).toEqual({ id: '1', status: 'Draft', title: 'edited' })
			expect(writeData).toHaveBeenCalledWith({ title: 'edited' })
			// A self-transition never writes status.
			expect(writeState).not.toHaveBeenCalled()
		})

		it('rejects from a disallowed state without writing data', async () => {
			const writeData = vi.fn(async () => ({}))
			const result = await applyGuardedTransition(
				{ label: 'Save', selfTransition: true, allowedStates: ['Draft'] },
				{ readState: async () => 'Closed', writeState: async () => {}, writeData },
				{ title: 'edited' }
			)
			expect(result.success).toBe(false)
			expect(result.error).toContain('not allowed')
			expect(writeData).not.toHaveBeenCalled()
		})

		it('rejects loudly when the backend has no data-write capability', async () => {
			// PostGraphile today: writeData is absent. A self-transition must fail loudly, not silently.
			const result = await applyGuardedTransition(
				{ label: 'Save', selfTransition: true, allowedStates: ['Draft'] },
				{ readState: async () => 'Draft', writeState: async () => {} },
				{ title: 'edited' }
			)
			expect(result.success).toBe(false)
			expect(result.error).toContain('does not support')
		})
	})
})
