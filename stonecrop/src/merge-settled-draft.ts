/**
 * Apply an awaitable compose result without clobbering fields the user edited after the sync snapshot.
 * @public
 */
export function mergeComposeSettled(
	current: Record<string, unknown>,
	syncSnapshot: Record<string, unknown>,
	settled: Record<string, unknown>
): Record<string, unknown> {
	const merged: Record<string, unknown> = { ...settled }
	for (const key of Object.keys(current)) {
		if (!Object.is(current[key], syncSnapshot[key])) {
			merged[key] = current[key]
		}
	}
	return merged
}
