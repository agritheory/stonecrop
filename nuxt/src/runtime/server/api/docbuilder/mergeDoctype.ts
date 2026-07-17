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
