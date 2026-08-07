/**
 * The route identity of a record the user is composing that does not exist on the server yet.
 *
 * Rejected: minting `new-<timestamp>` so a draft had a store key too. Nothing ever created that
 * HST node, so every write to `doctype.<draftId>.<field>` threw on the missing ancestor, and the
 * form's data survived only because Vue cached the empty object the getter returned and the form
 * mutated it in place — any invalidation discarded the edits silently. Seeding the node instead
 * makes the draft a phantom row, because `getRecords` lists every key under the doctype.
 *
 * So a draft is held off-HST by whoever renders the form, and reaches the server as an action
 * carrying no record id, which the write path already reads as "create".
 */

/**
 * The record-id segment a draft route carries: `/{doctype}/new`.
 *
 * Route only — never a store key, and never sent: an action dispatched for a draft omits the id
 * rather than sending this.
 *
 * @public
 */
export const DRAFT_RECORD_ID = 'new'

/**
 * Whether a record id refers to a record that has not been saved yet.
 *
 * Guard anything that assumes the record exists — fetching it, resolving its links, judging
 * workflow readiness — with this rather than the literal. The shell and this package once spelled
 * the rule differently, which left every guard here dead.
 *
 * @param recordId - The record id to test
 * @returns `true` when the id is the draft segment, `false` for a real identity or no id at all
 *
 * @public
 */
export function isDraftRecordId(recordId: string | null | undefined): boolean {
	return recordId === DRAFT_RECORD_ID
}
