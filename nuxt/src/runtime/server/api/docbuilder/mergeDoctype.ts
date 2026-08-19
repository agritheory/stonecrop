import { stripFieldKind } from '@stonecrop/schema'

// Pure helpers for the docbuilder save merge. Kept free of `#imports`/h3 so they can be unit-tested
// outside a Nuxt server context (save.post.ts itself can't be imported in a plain vitest run).

/**
 * Reorder `next`'s keys to follow `reference`'s key order, appending any keys not present in
 * `reference` (in their original `next` order) and dropping reference-only keys.
 *
 * The docbuilder rebuilds the workflow.actions map on every graph edit (node_editor emits transition
 * actions first, then stateless ones), which reshuffles a doctype's action order — e.g. a leading
 * `save` command jumps below the transitions — producing a spurious diff on the first save even when
 * only a node was dragged. Users can't reorder actions in the builder, so the on-disk order is always
 * the intended one: re-imposing it keeps saves byte-stable while still honouring adds/removes.
 */
export function orderKeysByReference<T>(
	next: Record<string, T> | undefined,
	reference: Record<string, T> | undefined
): Record<string, T> | undefined {
	if (!next || !reference) return next
	const result: Record<string, T> = {}
	// Reference order first (only keys still present in next)...
	for (const key of Object.keys(reference)) {
		const value = next[key]
		if (value !== undefined) result[key] = value
	}
	// ...then any next-only keys, in their original next order. Object.entries yields a defined value
	// (typed `T`, not `T | undefined`), so no index-access narrowing/cast is needed.
	for (const [key, value] of Object.entries(next)) {
		if (!Object.prototype.hasOwnProperty.call(result, key)) result[key] = value
	}
	return result
}

/** The subset of the save request body this merge reads. Extra keys are ignored, not written. */
export interface SaveDoctypeBody {
	fields: unknown[]
	workflow?: unknown
}

/**
 * Build the object the docbuilder save writes to disk, from the file already there plus the
 * builder's submission.
 *
 * This is the last of four hops that must each preserve keys the builder never displays — the
 * graph edit, the actions-panel edit, the fields-panel edit, then this. The invariant has already
 * regressed twice upstream (once dropping `clientHandler`, once dropping `triggers`), both times
 * because a hop enumerated named keys instead of spreading, so it is worth stating exactly what
 * this hop does and does not guarantee:
 *
 * - **Top-level keys survive** by spread. Anything on disk that the builder doesn't model —
 *   `links`, `primaryKey`, `source`, a consumer's own key — is carried through untouched.
 * - **Field-level keys are NOT this hop's job.** `fields` is replaced wholesale with what the
 *   client sent, so a key dropped in the browser is dropped here too. Hop 3 owns that.
 *
 * @param existing - The parsed doctype already on disk, or `{}` when creating one
 * @param body - The builder's submission
 * @param requestedName - The slug the builder asked to save, used only as a `name` fallback
 */
export function mergeSavedDoctype(
	existing: Record<string, unknown>,
	body: SaveDoctypeBody,
	requestedName: string
): Record<string, unknown> {
	const doctypeData: Record<string, unknown> = {
		...existing,
		// `kind` is the parser's discriminant, not authored data — the builder holds fields that
		// went through `normalizeFieldKind`, so it submits one on every field. Writing it back put
		// a key on disk that no author typed and that `injectKind` re-derives on every read.
		fields: body.fields.map(stripFieldKind),
	}

	// A null workflow means "this doctype has no workflow" — omit the key rather than writing
	// `"workflow": null`, which fails doctype validation (the schema expects an object) and
	// corrupts CLI-generated files on a plain field save. An existing workflow is preserved by the
	// spread; body.workflow only ever narrows to null when the doctype had no workflow to begin with.
	if (body.workflow !== undefined && body.workflow !== null) {
		// Re-impose the on-disk action order: the builder rebuilds workflow.actions on every graph
		// edit (transitions first, then stateless), which would otherwise reshuffle the file on the
		// first save.
		const existingActions = (existing.workflow as { actions?: Record<string, unknown> } | undefined)?.actions
		const workflow = body.workflow as { actions?: Record<string, unknown> }
		doctypeData.workflow = workflow.actions
			? { ...workflow, actions: orderKeysByReference(workflow.actions, existingActions) }
			: workflow
	} else if (doctypeData.workflow === null || doctypeData.workflow === undefined) {
		delete doctypeData.workflow
	}

	// `name` is required by the doctype schema and is never sent by the builder. Preserve the
	// existing value verbatim; fall back to the requested name only when creating a new doctype.
	if (typeof doctypeData.name !== 'string' || doctypeData.name.length === 0) {
		doctypeData.name = requestedName
	}

	// Remove legacy 'schema' key if present — standardise on 'fields'
	delete doctypeData.schema

	return doctypeData
}
