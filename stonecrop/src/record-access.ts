import { parsePath } from './stores/path'
import type { EditableRecord } from './types/editable-record'
import type { HSTNode } from './types/hst'

/**
 * A saved record's fields, read and set by name through the store that holds it. A set is a store
 * write, so it runs the rules of the field it sets. A set with no field name throws, rather than
 * reaching the store as a write to the whole record.
 *
 * @param store - the store holding the record
 * @param recordPath - the record's path in that store, `doctype.recordId`
 */
export function recordInStore(store: HSTNode, recordPath: string): EditableRecord {
	return {
		get: fieldname => store.get(fieldname ? `${recordPath}.${fieldname}` : recordPath),
		set: (fieldname, value) => {
			if (parsePath(fieldname).length === 0) throw new Error('Cannot set value on empty path')
			store.set(`${recordPath}.${fieldname}`, value)
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
