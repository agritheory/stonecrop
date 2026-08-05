import { isActionAllowedInState } from '@stonecrop/schema'

/**
 * Backend IO the dispatch layer injects so the transition logic stays storage-agnostic.
 * The same guard runs whether the record lives in Postgres, a mock executor, or an
 * in-memory Map — only these closures change per backend.
 * @public
 */
export interface GuardedTransitionIO {
	/**
	 * Read the record's current workflow state — the value of its `status` field.
	 *
	 * Three answers, and the difference between the last two matters:
	 *  - a string — the record's current state
	 *  - `undefined` — the record exists but carries no workflow state
	 *  - `null` — **there is no such record**
	 *
	 * Collapsing those two into `undefined` is what let an action against a missing record report
	 * success: the state read as `''`, an action declaring no `allowedStates` passed the guard, and
	 * the write then found nothing to write. Backends must return `null` when the lookup misses.
	 */
	readState: () => Promise<string | null | undefined>
	/** Persist the record's new workflow state, written verbatim. */
	writeState: (nextState: string) => Promise<void>
	/**
	 * Persist a record's field data for a self-transition, returning the full record as it now
	 * stands (so the client writeback reflects it).
	 *
	 * **This is an upsert, and it is the create path.** Saving a record is one request whether or
	 * not the row is there yet, so there is no create action and no create mutation — `exists` says
	 * which case you are in, and the second argument exists only because the dispatcher already
	 * knows: it read the record's state to run the guard. When `exists` is false, mint or derive the
	 * identity here and return the created record; identity is the backend's business, not the
	 * dispatcher's. Read the declared `primaryKey` out of `data` for a natural-keyed doctype — that
	 * value is a field the user filled in — and mint one only when the doctype is surrogate-keyed.
	 *
	 * Never return an empty object for a creation: the dispatcher treats that as a backend that
	 * only knows how to patch, and fails loudly rather than reporting a save that stored nothing.
	 *
	 * Optional. A backend with no data-write path omits it, which is how it declines both saving
	 * and creating; a self-transition is then rejected loudly rather than silently dropped — unless
	 * `runEffect` is supplied, in which case the handler is the persistence path.
	 */
	writeData?: (patch: Record<string, unknown>, exists: boolean) => Promise<Record<string, unknown>>
	/**
	 * Run the adapter's side effect for this action, after the guard has passed and before any
	 * state is written. This is the seam a **database author** wires — see
	 * `StonecropPluginOptions.actionHandlers` for the Postgres adapter's registration surface.
	 *
	 * It is what makes a stateless Command (no `nextState`, no `selfTransition`) executable at
	 * all: without one, such an action has nothing to apply and fails loudly.
	 *
	 * Throwing rejects the action — nothing is written. Returning a full record makes it the
	 * client writeback payload; returning `undefined` leaves the doctype's own outcome to
	 * decide what comes back.
	 *
	 * @param currentState - The state the guard read, or `undefined` when nothing required reading it
	 * @returns The updated record, or `undefined` to leave the result payload to the state outcome
	 */
	runEffect?: (currentState: string | undefined) => Promise<unknown>
}

/**
 * Apply a workflow action on the server, enforcing `allowedStates`.
 *
 * The server owns the transition: it reads the record's authoritative current state,
 * rejects the action when `isActionAllowedInState` denies it, then applies the outcome.
 * Storage access is injected via `io` so this one guard serves every backend and can never
 * disagree with the frontend's `getAvailableTransitions`, which shares the same predicate.
 *
 * **The doctype decides whether an action may run and what state results; the adapter decides
 * what actually happens.** `allowedStates`, `nextState` and `selfTransition` are authored in the
 * doctype (in DocBuilder, by whoever models the workflow); the effect is registered by whoever
 * owns the database. Neither names the other: an action never carries a handler name, and a
 * handler never overrides the guard.
 *
 * There are four action shapes this distinguishes:
 *  - A cross-state **transition** (has `nextState`): writes the new `status`, guarded by `allowedStates`.
 *  - A **self-transition** (`selfTransition: true`, no `nextState`, e.g. `Save`): stays in the current
 *    state and persists record field `data` in place via `io.writeData`, guarded by `allowedStates`.
 *    When the target record does not exist the same write creates it — saving a record is one
 *    request whether or not the row is there yet, so there is no separate create action, no create
 *    mutation, and no second write path for it.
 *  - A **stateless command** (neither of the above) with an `io.runEffect`: the handler is the whole
 *    outcome. Still guarded by `allowedStates`, and still forbidden from moving the record.
 *  - Anything else — no `nextState`, no `selfTransition`, no registered effect — is either a genuine
 *    authoring mistake or a command whose handler was never wired. It fails loudly before touching
 *    the backend rather than reporting a false success.
 *
 * @param actionDef - The action's `label`, `allowedStates`, and either `nextState` (transition) or `selfTransition`
 * @param io - Backend read/write closures, plus the optional adapter-owned effect
 * @param data - Record field data for a self-transition's mutate-in-place write (ignored by transitions)
 * @returns Action result envelope — the freshest record the backend produced, or the resulting state
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
			//
			// A registered effect does NOT run here. An effect is written against an existing row,
			// and firing it against a just-created one is a different contract than the one it was
			// registered under; making creation observable to effects is deferred rather than
			// guessed at.
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

	// The effect runs after the guard and before any write, so a handler that rejects cannot
	// leave the record in the target state. Its throw is attributed to the action by name —
	// the adapter's handler is code the doctype author cannot see, so an anonymous failure
	// would be undebuggable from either side.
	let effectResult: unknown
	if (io.runEffect) {
		try {
			effectResult = await io.runEffect(currentState)
		} catch (err) {
			return {
				success: false,
				data: null,
				error: `Action "${label}" failed: ${err instanceof Error ? err.message : String(err)}`,
			}
		}
	}

	// Self-transition: mutate record data in place, keep the current state. The full updated
	// record is returned so the client writeback reflects the new data. When the backend has no
	// data-write path the effect above already did the persisting (guarded at the top).
	if (isSelfTransition) {
		const record = io.writeData ? await io.writeData(data ?? {}, true) : effectResult
		return { success: true, data: record ?? null, error: null }
	}

	// NON-ATOMIC: the current state is read above and nextState written here as two
	// separate statements — and a registered effect runs between them. Two concurrent
	// transitions on the same record can both pass the guard before either writes, so both
	// "succeed" even when the workflow intended them to be mutually exclusive. Closing this
	// requires guarding and writing in one statement — an atomic
	// `UPDATE ... SET status = nextState WHERE status = ANY(allowedStates)` — and reporting
	// "no rows updated" as a rejected transition. Deferred for now.
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
