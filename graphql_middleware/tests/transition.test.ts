import { describe, it, expect, vi } from 'vitest'

import { applyGuardedTransition } from '../src/dispatch/transition'

/** Fresh spies per case — a backend sitting in 'Draft' with no data-write path, like PostGraphile. */
const io = () => ({ readState: vi.fn(async () => 'Draft'), writeState: vi.fn(async () => {}) })

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

	it('fails loudly for a side-effect action with no nextState and no registered effect', async () => {
		// A stateless command reaches the dispatch with nothing to transition and no handler to
		// run. It must surface an error rather than report success while doing nothing — and name
		// both repairs, since the two live with different authors (doctype vs adapter).
		const readState = vi.fn(async () => 'Active')
		const writeState = vi.fn(async () => {})
		const result = await applyGuardedTransition({ label: 'Save' }, { readState, writeState })
		expect(result.success).toBe(false)
		expect(result.error).toContain('Save')
		expect(result.error).toContain('nothing was executed')
		expect(result.error).toContain('register a server-side handler')
		// short-circuits before touching the backend
		expect(readState).not.toHaveBeenCalled()
		expect(writeState).not.toHaveBeenCalled()
	})

	describe('a record that does not exist', () => {
		// `readState` answering `null` is the backend saying the lookup missed. Before that answer
		// existed, both cases below read state `''` and produced a wrong result whose flavour
		// depended only on whether the action declared `allowedStates` — misleading for the
		// guarded one, silently successful for the other.

		it('rejects a transition without writing, and says so plainly', async () => {
			const writeState = vi.fn(async () => {})
			const result = await applyGuardedTransition(
				{ label: 'Submit', allowedStates: ['Draft'], nextState: 'Active' },
				{ readState: async () => null, writeState }
			)
			expect(result.success).toBe(false)
			expect(result.error).toContain('does not exist')
			// The old message blamed the state, which sent you looking at the workflow.
			expect(result.error).not.toContain('not allowed')
			expect(writeState).not.toHaveBeenCalled()
		})

		it('rejects an unguarded self-transition instead of reporting a false success', async () => {
			// The worst of the two: with no `allowedStates` there was nothing to fail against, so
			// this returned `{ success: true, data: {} }` and wrote nothing.
			const writeData = vi.fn(async () => ({}))
			const result = await applyGuardedTransition(
				{ label: 'Save', selfTransition: true },
				{ readState: async () => null, writeState: async () => {}, writeData },
				{ title: 'edited' }
			)
			expect(result.success).toBe(false)
			expect(result.error).toContain('does not exist')
			expect(writeData).not.toHaveBeenCalled()
		})

		it('never reaches a registered effect', async () => {
			const runEffect = vi.fn(async () => ({ ok: true }))
			const result = await applyGuardedTransition(
				{ label: 'Recalculate', allowedStates: ['Draft'], nextState: 'Active' },
				{ readState: async () => null, writeState: async () => {}, runEffect }
			)
			expect(result.success).toBe(false)
			expect(runEffect).not.toHaveBeenCalled()
		})

		it('still treats `undefined` as an existing record with no workflow state', async () => {
			// The other half of the distinction, and the reason `null` was needed rather than
			// tightening the existing falsy check: this case must keep working.
			const writeState = vi.fn(async () => {})
			const result = await applyGuardedTransition(
				{ label: 'Reset', nextState: 'Draft' },
				{ readState: async () => undefined, writeState }
			)
			expect(result.success).toBe(true)
			expect(writeState).toHaveBeenCalledWith('Draft')
		})

		it('is not consulted for a command that reads no state', async () => {
			// A record-less command must not be rejected for having no record.
			const readState = vi.fn(async () => null)
			const result = await applyGuardedTransition(
				{ label: 'Reindex' },
				{ readState, writeState: async () => {}, runEffect: async () => ({ done: true }) }
			)
			expect(result.success).toBe(true)
			expect(readState).not.toHaveBeenCalled()
		})
	})

	describe('adapter-owned effects (runEffect)', () => {
		it('makes a stateless command executable, with the handler result as the payload', async () => {
			// The gap this closes: without a registered effect the same action fails outright
			// (asserted above). Registering one is the *only* difference here.
			const runEffect = vi.fn(async () => ({ id: '1', total: 42 }))
			const backend = io()
			const result = await applyGuardedTransition({ label: 'Recalculate' }, { ...backend, runEffect })

			expect(result.success).toBe(true)
			expect(result.data).toEqual({ id: '1', total: 42 })
			expect(runEffect).toHaveBeenCalledOnce()
			// A handler must not move the record — the state outcome is the doctype's call.
			expect(backend.writeState).not.toHaveBeenCalled()
		})

		it('does not read state for an unguarded command with no state outcome', async () => {
			// The doctype backing a record-less command need not have a `status` column at all;
			// reading one it does not have would fail an action that never consults it.
			const backend = io()
			await applyGuardedTransition({ label: 'Reindex' }, { ...backend, runEffect: async () => null })
			expect(backend.readState).not.toHaveBeenCalled()
		})

		it('still enforces the doctype guard — a denied command never reaches the handler', async () => {
			// The split under test: the doctype decides *whether* it may run, the adapter only
			// decides *what happens*. A handler cannot be the thing that grants permission.
			const runEffect = vi.fn(async () => ({ ok: true }))
			const result = await applyGuardedTransition(
				{ label: 'Recalculate', allowedStates: ['Draft'] },
				{ readState: async () => 'Closed', writeState: async () => {}, runEffect }
			)
			expect(result.success).toBe(false)
			expect(result.error).toContain('not allowed')
			expect(runEffect).not.toHaveBeenCalled()
		})

		it('passes the guard-read state to the handler so it need not re-query', async () => {
			const runEffect = vi.fn(async (_state: string | undefined) => null)
			await applyGuardedTransition(
				{ label: 'Recalculate', allowedStates: ['Draft'] },
				{ readState: async () => 'Draft', writeState: async () => {}, runEffect }
			)
			expect(runEffect).toHaveBeenCalledWith('Draft')
		})

		it('runs the effect before the state write, and a throw rejects without transitioning', async () => {
			// Ordering is the safety property: a handler that fails must not leave the record
			// sitting in the target state.
			const writeState = vi.fn(async () => {})
			const result = await applyGuardedTransition(
				{ label: 'Approve', allowedStates: ['Draft'], nextState: 'Approved' },
				{
					readState: async () => 'Draft',
					writeState,
					runEffect: async () => Promise.reject(new Error('budget exceeded')),
				}
			)
			expect(result.success).toBe(false)
			// Attributed to the action: the handler is code the doctype author cannot see.
			expect(result.error).toContain('Approve')
			expect(result.error).toContain('budget exceeded')
			expect(writeState).not.toHaveBeenCalled()
		})

		it('combines an effect with a transition, preferring the handler record over the bare state', async () => {
			const writeState = vi.fn(async () => {})
			const result = await applyGuardedTransition(
				{ label: 'Approve', allowedStates: ['Draft'], nextState: 'Approved' },
				{
					readState: async () => 'Draft',
					writeState,
					runEffect: async () => ({ id: '1', status: 'Approved', approvedBy: 'ada' }),
				}
			)
			expect(result.success).toBe(true)
			expect(writeState).toHaveBeenCalledWith('Approved')
			// The full row describes the record better than `{ state }`, which is all a bare
			// transition knows — and this is what the client writes back into the store.
			expect(result.data).toEqual({ id: '1', status: 'Approved', approvedBy: 'ada' })
		})

		it('keeps the bare state payload when the handler returns nothing', async () => {
			const result = await applyGuardedTransition(
				{ label: 'Approve', nextState: 'Approved' },
				{ readState: async () => 'Draft', writeState: async () => {}, runEffect: async () => undefined }
			)
			expect(result.success).toBe(true)
			expect(result.data).toEqual({ state: 'Approved' })
		})

		it('lets a handler be the persistence path when the backend cannot write data', async () => {
			// PostGraphile has no writeData, so a self-transition there fails loudly (asserted
			// below). A registered effect supplies the missing capability.
			const result = await applyGuardedTransition(
				{ label: 'Save', selfTransition: true, allowedStates: ['Draft'] },
				{
					readState: async () => 'Draft',
					writeState: async () => {},
					runEffect: async () => ({ id: '1', status: 'Draft', title: 'edited' }),
				},
				{ title: 'edited' }
			)
			expect(result.success).toBe(true)
			expect(result.data).toEqual({ id: '1', status: 'Draft', title: 'edited' })
		})

		it('prefers the backend record over the handler result on a self-transition', async () => {
			// writeData runs last and returns the row as it now stands, so it is the fresher of
			// the two. The handler still runs — it is additive, not a replacement.
			const runEffect = vi.fn(async () => ({ id: '1', stale: true }))
			const result = await applyGuardedTransition(
				{ label: 'Save', selfTransition: true },
				{
					readState: async () => 'Draft',
					writeState: async () => {},
					writeData: async patch => ({ id: '1', status: 'Draft', ...patch }),
					runEffect,
				},
				{ title: 'edited' }
			)
			expect(runEffect).toHaveBeenCalledOnce()
			expect(result.data).toEqual({ id: '1', status: 'Draft', title: 'edited' })
		})
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
