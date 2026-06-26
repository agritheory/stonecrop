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
 * An action with no `nextState` is a side-effect-only action (e.g. `Save`): the transition
 * dispatch has nothing to apply for it, and the side effect must run through a wired handler
 * that this path does not yet provide. Rather than report a false success while silently
 * dropping the request, it fails loudly. (A `callHandler` primitive to invoke registered
 * handlers by key is the intended home for those side effects; it is not implemented yet.)
 *
 * @param actionDef - The action's `label`, `allowedStates` (where it may run) and `nextState` (where it lands)
 * @param io - Backend read/write closures
 * @returns Action result envelope with the resulting state in `data.state`
 * @public
 */
export async function applyGuardedTransition(
	actionDef: { label?: string; allowedStates?: string[]; nextState?: string },
	io: GuardedTransitionIO
): Promise<{ success: boolean; data: unknown; error: string | null }> {
	if (actionDef.nextState == null) {
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

	// NON-ATOMIC: the current state is read above and nextState written here as two
	// separate statements. Two concurrent transitions on the same record can both pass
	// the guard before either writes, so both "succeed" even when the workflow intended
	// them to be mutually exclusive. Closing this requires guarding and writing in one
	// statement — an atomic `UPDATE ... SET status = nextState WHERE status = ANY(allowedStates)`
	// — and reporting "no rows updated" as a rejected transition. Deferred for now.
	await io.writeState(actionDef.nextState)

	return {
		success: true,
		data: { state: actionDef.nextState },
		error: null,
	}
}
