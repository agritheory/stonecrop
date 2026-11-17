import { isActionAllowedInState } from '@stonecrop/schema'

/**
 * The storage calls `applyGuardedTransition` makes. Each backend supplies its own.
 * @public
 */
export interface GuardedTransitionIO {
	/**
	 * Read the record's workflow state: its state, `undefined` when it exists with no state, or
	 * `null` when there is no such record. Return `null`, not `undefined`, for a missing record, or
	 * an action on it can report success while writing nothing.
	 *
	 * For a self-transition sent with an id that matches no record, throw instead: the record was
	 * deleted since it was read, and creating it would report a lost update as a success.
	 */
	readState: () => Promise<string | null | undefined>
	/** Write the record's new workflow state. */
	writeState: (nextState: string) => Promise<void>
	/**
	 * Save a self-transition's field data and return the whole record, including its key. When
	 * `exists` is false, create the record: take its key from `patch` for a natural-keyed doctype,
	 * or mint one. An empty return for a create fails the action.
	 *
	 * Optional: without it, a self-transition fails unless `runEffect` is supplied. Never called
	 * when `runEffect` is supplied.
	 */
	writeData?: (patch: Record<string, unknown>, exists: boolean) => Promise<Record<string, unknown>>
	/**
	 * Run the server-side handler registered for this action, once it passes its `allowedStates`
	 * check (a self-transition creating a record skips that check), and before the state is
	 * written. A stateless command fails without one.
	 *
	 * Its return becomes the result's `data`. On a self-transition it is the whole save, on a record
	 * not created yet too, and must return the record it saved or the action fails. Throwing fails
	 * the action; undoing what it wrote is the backend's job (the Postgres adapter runs each action
	 * in a transaction).
	 *
	 * @param currentState - The state `readState` returned (`''` for a record with no state), or
	 * `undefined` when it was not read or the record does not exist yet
	 */
	runEffect?: (currentState: string | undefined) => Promise<unknown>
}

/**
 * Run a workflow action on the server: check `allowedStates`, then apply the action through `io`.
 *
 * - A **transition** (`nextState`) runs `io.runEffect` if supplied, then writes the new state.
 *
 * - A **self-transition** (`selfTransition`, such as Save) saves the record's data and keeps its
 *   state, through `io.runEffect` if supplied and `io.writeData` otherwise.
 *
 * - A **stateless command** (neither) runs `io.runEffect` and leaves the state alone.
 *
 * - Anything else fails without touching the backend.
 *
 * On a record that does not exist yet, a self-transition creates it without checking
 * `allowedStates`, a command with no `allowedStates` runs, and anything else fails: the actions
 * `isActionAllowedOnNewRecord` allows. On a saved record the check is the same rule the client's
 * `getAvailableTransitions` uses.
 *
 * @param actionDef - The action's `label`, `allowedStates`, and `nextState` or `selfTransition`
 * @param io - The backend's storage calls
 * @param data - The record's field data, for a self-transition
 * @returns Whether the action succeeded, the record or state it produced, and any error
 * @public
 */
export async function applyGuardedTransition(
	actionDef: { label?: string; allowedStates?: string[]; nextState?: string; selfTransition?: boolean },
	io: GuardedTransitionIO,
	data?: Record<string, unknown>
): Promise<{ success: boolean; data: unknown; error: string | null }> {
	const label = actionDef.label ?? 'unknown'
	const isSelfTransition = actionDef.selfTransition === true
	const hasStateOutcome = isSelfTransition || actionDef.nextState != null

	// A throw is attributed to the action by name: the adapter's handler is code the doctype
	// author cannot see, so an anonymous failure would be undebuggable from either side.
	const runEffect = async (effect: NonNullable<GuardedTransitionIO['runEffect']>, currentState: string | undefined) => {
		try {
			return { ran: true as const, result: await effect(currentState) }
		} catch (err) {
			const error = `Action "${label}" failed: ${err instanceof Error ? err.message : String(err)}`
			return { ran: false as const, failure: { success: false, data: null, error } }
		}
	}

	// A self-transition with an effect: the effect is the write, on a new record and a saved one
	// alike, and owes the record it saved, as `writeData` does.
	const saveThroughEffect = async (
		effect: NonNullable<GuardedTransitionIO['runEffect']>,
		currentState: string | undefined
	) => {
		const effectOutcome = await runEffect(effect, currentState)
		if (!effectOutcome.ran) return effectOutcome.failure
		const record = effectOutcome.result
		if (record === null || typeof record !== 'object' || Array.isArray(record) || Object.keys(record).length === 0) {
			return {
				success: false,
				data: null,
				error: `${label} failed: the server did not return the saved record.`,
			}
		}
		return { success: true, data: record, error: null }
	}

	// Nothing to apply and no effect registered — fail loudly WITHOUT touching the backend.
	// This is the honest report for both causes: an action authored with no outcome, and a
	// command whose server handler the adapter never registered.
	if (!hasStateOutcome && !io.runEffect) {
		return {
			success: false,
			data: null,
			error: `Action "${label}" has no workflow transition and no server-side effect is wired — nothing was executed. Give it a nextState or selfTransition in the doctype, or register a server-side handler for it on the adapter.`,
		}
	}

	// A self-transition exists to persist data; with no way at all to do that — no data write, no
	// create, no effect — reject before running anything rather than half-applying.
	if (isSelfTransition && !io.writeData && !io.runEffect) {
		return {
			success: false,
			data: null,
			error: `Action "${label}" persists record data in place, which this backend does not support.`,
		}
	}

	// Read the authoritative state only when something actually consumes it: the guard, or a
	// state outcome that the caller's readState is paired with. A handler-only command on a
	// doctype with no `status` column must not be forced through a read it never uses.
	const isGuarded = (actionDef.allowedStates?.length ?? 0) > 0
	let currentState: string | undefined
	if (isGuarded || hasStateOutcome) {
		const state = await io.readState()
		// A missing record is reported, never guarded around. Reaching the guard with a state of
		// `''` produced two wrong answers depending only on whether the action declared
		// `allowedStates`: a misleading "not allowed from state: (unknown)" when it did, and a
		// silent `{ success: true }` writing nothing when it did not.
		if (state === null) {
			// A self-transition against a record that is not there is a create — the same write,
			// against a row that does not exist yet. The guard is deliberately skipped:
			// `allowedStates` constrains movement between states, and a record being created is not
			// in one; its initial state is the backend's to set.
			if (isSelfTransition && io.runEffect) return saveThroughEffect(io.runEffect, undefined)
			if (isSelfTransition && io.writeData) {
				const created = await io.writeData(data ?? {}, false)
				// A backend that only knows how to patch returns nothing here, having matched no
				// row. Reporting that as success is the exact bug the `null` answer above exists to
				// kill, so it must not come back through the create path.
				if (!created || Object.keys(created).length === 0) {
					return {
						success: false,
						data: null,
						error: `Action "${label}" targets a record that does not exist, and the backend did not create it.`,
					}
				}
				return { success: true, data: created, error: null }
			}
			return {
				success: false,
				data: null,
				error: `Action "${label}" targets a record that does not exist — nothing was executed.`,
			}
		}
		currentState = state ?? ''
	}

	if (!isActionAllowedInState(actionDef, currentState ?? '')) {
		return {
			success: false,
			data: null,
			error: `Action not allowed from state: ${currentState || '(unknown)'}`,
		}
	}

	// Self-transition: mutate record data in place, keep the current state. The full updated
	// record is returned so a created record's identity is known. Never `writeData` after an
	// effect: the effect is the write, and a second one would put the form's values back over it.
	if (isSelfTransition) {
		if (io.runEffect) return saveThroughEffect(io.runEffect, currentState)
		const record = await io.writeData?.(data ?? {}, true)
		return { success: true, data: record ?? null, error: null }
	}

	// The effect runs after the guard and before any write, so a handler that rejects cannot
	// leave the record in the target state.
	let effectResult: unknown
	if (io.runEffect) {
		const effect = await runEffect(io.runEffect, currentState)
		if (!effect.ran) return effect.failure
		effectResult = effect.result
	}

	// The state is read above and written here as two calls, with any effect between them. A
	// backend must hold the record between the two, or two concurrent transitions can both pass
	// the guard; the Postgres adapter does, by reading with FOR UPDATE inside the action's
	// transaction.
	if (actionDef.nextState == null) {
		// A stateless command: the effect (guaranteed present by the top guard) is the whole
		// outcome. It must not move the record — that is the doctype's call, not the handler's.
		return { success: true, data: effectResult ?? null, error: null }
	}
	await io.writeState(actionDef.nextState)

	// The freshest thing the backend produced wins: a handler that returned a record describes
	// the row better than the state alone, which is all a bare transition knows.
	return {
		success: true,
		data: effectResult ?? { state: actionDef.nextState },
		error: null,
	}
}
