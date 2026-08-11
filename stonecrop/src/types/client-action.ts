/**
 * Payload emitted with the 'action' event when the user triggers a declared action —
 * an FSM transition or a stateless Command.
 *
 * Defined here rather than in `@stonecrop/desktop` because the shell that *emits* it and the
 * runner that *consumes* it now live in different packages, and desktop already depends on this
 * one. `@stonecrop/desktop` re-exports it, so a host importing it from there is unaffected.
 *
 * @public
 */
export type ActionEventPayload = {
	/** The declared action name (e.g. 'SAVE', 'SUBMIT', 'APPROVE') */
	name: string
	doctype: string
	recordId: string
	/** Snapshot of the form data at the time the action was triggered */
	data: Record<string, any>
}

/**
 * Result of dispatching an action to its server handler.
 * @public
 */
export type ActionDispatchResult = { success: boolean; data: unknown; error: string | null }

/**
 * An action that did not complete, described well enough for a host to render it.
 *
 * An object rather than a bare message on purpose: a notification says *what* failed, and the
 * action, doctype and record are all known at the point of failure. It is also the shape that can
 * gain a field later without breaking a host that already destructures it.
 *
 * @public
 */
export interface ActionFailure {
	/** Human-readable reason — the server's own message where there is one. */
	message: string
	/** The action that was clicked, not necessarily the one a `clientHandler` dispatched. */
	action: string
	/** Slug of the doctype the action was raised on. */
	doctype: string
	/** Record the action was raised against; the `new` route segment for an unsaved record. */
	recordId: string
	/** The thrown value, present only when the failure was a throw rather than a refused dispatch. */
	cause?: unknown
}

/**
 * Everything known about a dispatch at the point the argument array is built.
 * @public
 */
export interface ActionArgsContext {
	/** Slug of the doctype the action was raised on. */
	doctype: string
	/** The action being dispatched. */
	action: string
	/** The route's record segment — {@link DRAFT_RECORD_ID} for an unsaved record. */
	recordId: string
	/** Whether `recordId` is the draft segment rather than a real identity. */
	isDraft: boolean
	/** The form snapshot being sent. */
	data: Record<string, unknown>
	/** Extra fields a `clientHandler` passed to `runAction`. */
	extra?: Record<string, unknown>
}

/**
 * Where a record ended up after the server settled its identity.
 * @public
 */
export interface FollowRecordContext {
	/** Slug of the doctype the action was raised on. */
	doctype: string
	/** The identity the server settled on — where the record now lives. */
	recordId: string
	/** The identity that was dispatched, which is no longer valid. */
	previousRecordId: string
}

/**
 * Host overrides for `useClientAction`.
 *
 * These are the three things that legitimately differ between applications: how your backend wants
 * an action's arguments shaped, where the user should end up after a create, and how a failure is
 * shown. Everything else is framework behaviour and is deliberately not configurable — in
 * particular, resolving a record's identity and keying it into HST stay sealed, because that is
 * the rule the adapter re-derives server-side, and every host that re-derived it got it wrong.
 *
 * @public
 */
export interface UseClientActionOptions {
	/**
	 * Called instead of the built-in alert when an action fails. Supply this to route failures into
	 * the host's own notification system, or pass a no-op to suppress them entirely.
	 *
	 * It fully replaces the default, console log included — a host that wants one writes it.
	 */
	onError?: (failure: ActionFailure) => void
	/**
	 * Build the opaque argument array handed to `DataClient.runAction`.
	 *
	 * The default is `[{ id, data }]`, omitting `id` entirely for a draft — the envelope every
	 * in-repo server handler destructures. Supply this when your backend expects another shape;
	 * `examples/desktop` uses positional `[recordId, data]`, for instance. Nothing validates the
	 * array, so both ends of your own stack have to agree on it.
	 *
	 * Whatever you return is sent verbatim. It does not affect how the *result* is stored — that
	 * is keyed off the returned record's declared identity, not off what was sent.
	 */
	buildArgs?: (context: ActionArgsContext) => unknown[]
	/**
	 * Move the user to where a record ended up when the server settled on a different identity —
	 * the create case, and any action that rewrites a natural key.
	 *
	 * The default is `router.replace('/{doctype}/{recordId}')`. `replace`, not `push`: the route
	 * being left behind was never a record, so going Back to `/{doctype}/new` would show an empty
	 * form that creates yet another record. Supply this for a locale prefix, a nested path, or to
	 * stay put; the store has already been updated either way.
	 */
	followRecord?: (context: FollowRecordContext) => void | Promise<void>
}
