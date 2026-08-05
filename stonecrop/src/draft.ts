/**
 * The identity of a record the user is composing that does not exist on the server yet.
 *
 * A "draft" id is minted client-side so an unsaved record has somewhere to live in the route and
 * in HST before it has a real identity. The first successful save replaces it with whatever the
 * server assigns — see `Doctype.getRecordId` for how that identity is resolved.
 *
 * This lives in one place on purpose. It used to be written twice, in two dialects that did not
 * agree: the desktop shell minted `new-<timestamp>` while this package tested `recordId === 'new'`.
 * Every guard in the second dialect was therefore dead, which is why an unsaved record was fetched
 * from the server (it cannot exist), started with no initialized field defaults, and could be
 * reported as blocked by link data an unsaved record has no way to have.
 */

/** Prefix for a minted draft id. Timestamped so two drafts opened in different tabs cannot collide. */
const DRAFT_ID_PREFIX = 'new-'

/**
 * The original draft id, before ids were timestamped. Still recognised so a host that routes to
 * `/{doctype}/new`, or a record keyed under the bare placeholder, keeps working.
 */
const LEGACY_DRAFT_ID = 'new'

/**
 * Mint an id for a record that does not exist on the server yet.
 *
 * @returns A draft id `isDraftRecordId` will recognise
 *
 * @public
 */
export function newDraftRecordId(): string {
	return `${DRAFT_ID_PREFIX}${Date.now()}`
}

/**
 * Whether an id refers to a record that has not been saved yet.
 *
 * Guard anything that assumes the record exists — fetching it, resolving its links, judging
 * workflow readiness — with this rather than comparing against a literal.
 *
 * @param recordId - The record id to test
 * @returns `true` when the id is a draft, `false` for a real identity or no id at all
 *
 * @public
 */
export function isDraftRecordId(recordId: string | null | undefined): boolean {
	if (!recordId) return false
	return recordId === LEGACY_DRAFT_ID || recordId.startsWith(DRAFT_ID_PREFIX)
}
