import { parsePath } from './stores/path'
import type { EditableRecord } from './types/editable-record'
import type { HSTNode } from './types/hst'

/**
 * A record's path in its store, `doctype.recordId`. An ID the store would not keep as one part of a
 * path is refused: an empty one would address every record of the doctype, and one with a dot or a
 * bracket would address part of another record.
 *
 * @param slug - the record's doctype
 * @param recordId - the record's ID
 * @throws Error if `recordId` is empty, or holds a dot or a bracket
 */
export function recordPath(slug: string, recordId: string): string {
	if (recordId === '') throw new Error(`No record ID given for ${slug}`)
	if (parsePath(recordId)[0] !== recordId) throw new Error(`Record ID ${recordId} for ${slug} can't contain a dot`)
	return `${slug}.${recordId}`
}

/**
 * A saved record's fields, read and set by name through the store that holds it. A set is a store
 * write, so it runs the rules of the field it sets. A set with no field name throws, rather than
 * reaching the store as a write to the whole record.
 *
 * @param store - the store holding the record
 * @param path - the record's path in that store, from {@link recordPath}
 */
export function recordInStore(store: HSTNode, path: string): EditableRecord {
	return {
		get: fieldname => store.get(fieldname ? `${path}.${fieldname}` : path),
		set: (fieldname, value) => {
			if (parsePath(fieldname).length === 0) throw new Error('Cannot set value on empty path')
			store.set(`${path}.${fieldname}`, value)
		},
	}
}

/**
 * For a rule run with no record to reach: `get` and `set` throw the reason, rather than reading
 * nothing and setting nowhere.
 *
 * @param reason - why there is no record
 */
export function noRecord(reason: string): EditableRecord {
	const refuse = (): never => {
		throw new Error(reason)
	}
	return { get: refuse, set: refuse }
}
