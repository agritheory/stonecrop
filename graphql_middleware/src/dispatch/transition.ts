import { isActionAllowedInState } from '@stonecrop/schema'

/**
 * Backend IO the dispatch layer injects so the transition logic stays storage-agnostic.
 * The same guard runs whether the record lives in Postgres, a mock executor, or an
 * in-memory Map — only these two closures change per backend.
 * @public
 */
export interface GuardedTransitionIO {
	/** Read the record's current workflow state (the value of its `status` field), or undefined if unknown. */
	readState: () => Promise<string | undefined>
	/** Persist the record's new workflow state, written verbatim. */
	writeState: (nextState: string) => Promise<void>
	/**
	 * Persist record field data for a mutate-in-place self-transition, returning the full updated
	 * record (so the client writeback reflects the new data). Optional: a backend with no data-write
	 * path (e.g. PostGraphile today, which writes only `status`) omits it, and a self-transition is
	 * then rejected loudly rather than silently dropped.
	 */
	writeData?: (patch: Record<string, unknown>) => Promise<Record<string, unknown>>
}

/**
 * Apply a workflow action's state transition on the server, enforcing `allowedStates`.
 *
 * The server owns the transition: it reads the record's authoritative current state,
 * rejects the action when `isActionAllowedInState` denies it, then writes `nextState`
 * verbatim. Storage access is injected via `io` so this one guard serves every backend
 * and can never disagree with the frontend's `getAvailableTransitions`, which shares the
 * same predicate.
 *
 * There are three action shapes this guard distinguishes:
 *  - A cross-state **transition** (has `nextState`): writes the new `status`, guarded by `allowedStates`.
 *  - A **self-transition** (`selfTransition: true`, no `nextState`, e.g. `Save`): stays in the current
 *    state and persists record field `data` in place via `io.writeData`, guarded by `allowedStates`.
 *    A backend without a data-write path rejects it loudly instead of dropping it silently.
 *  - Anything else with no `nextState` and no `selfTransition` flag is a genuine authoring mistake (or a
 *    stateless side-effect command whose server handler is not wired — the intended `callHandler` primitive
 *    is still unimplemented): it fails loudly before touching the backend rather than reporting a false success.
 *
 * @param actionDef - The action's `label`, `allowedStates`, and either `nextState` (transition) or `selfTransition`
 * @param io - Backend read/write closures
 * @param data - Record field data for a self-transition's mutate-in-place write (ignored by transitions)
 * @returns Action result envelope — the resulting `data.state` for a transition, the full record for a self-transition
 * @public
 */
export async function applyGuardedTransition(
	actionDef: { label?: string; allowedStates?: string[]; nextState?: string; selfTransition?: boolean },
	io: GuardedTransitionIO,
	data?: Record<string, unknown>
): Promise<{ success: boolean; data: unknown; error: string | null }> {
	// A non-self action with no target has nothing to apply — fail loudly WITHOUT touching the backend
	// (a stateless command's server handler is not wired; a genuine bug should not read/write anything).
	if (!actionDef.selfTransition && actionDef.nextState == null) {
		return {
			success: false,
			data: null,
			error: `Action "${actionDef.label ?? 'unknown'}" has no workflow transition and no server-side effect is wired — nothing was executed.`,
		}
	}

	const currentState = (await io.readState()) ?? ''

	if (!isActionAllowedInState(actionDef, currentState)) {
		return {
			success: false,
			data: null,
			error: `Action not allowed from state: ${currentState || '(unknown)'}`,
		}
	}

	// Self-transition: mutate record data in place, keep the current state. Requires a backend data-write
	// capability; without it (e.g. PostGraphile today) reject loudly. The full updated record is returned
	// so the client writeback reflects the new data.
	if (actionDef.selfTransition) {
		if (!io.writeData) {
			return {
				success: false,
				data: null,
				error: `Action "${actionDef.label ?? 'unknown'}" persists record data in place, which this backend does not support.`,
			}
		}
		const record = await io.writeData(data ?? {})
		return { success: true, data: record, error: null }
	}

	// NON-ATOMIC: the current state is read above and nextState written here as two
	// separate statements. Two concurrent transitions on the same record can both pass
	// the guard before either writes, so both "succeed" even when the workflow intended
	// them to be mutually exclusive. Closing this requires guarding and writing in one
	// statement — an atomic `UPDATE ... SET status = nextState WHERE status = ANY(allowedStates)`
	// — and reporting "no rows updated" as a rejected transition. Deferred for now.
	if (actionDef.nextState == null) {
		// Unreachable (guarded above), but keeps `nextState` narrowed to a string below.
		return { success: false, data: null, error: 'nothing was executed' }
	}
	await io.writeState(actionDef.nextState)

	return {
		success: true,
		data: { state: actionDef.nextState },
		error: null,
	}
}
