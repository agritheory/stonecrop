import { reactive } from 'vue'

import { getGlobalTriggerEngine } from './field-triggers'
import { parsePath } from './stores/path'
import type { EditableRecord } from './types/editable-record'
import type { HSTNode } from './types/hst'

function readField(record: Record<string, any>, fieldname: string): any {
	return parsePath(fieldname).reduce<any>((value, segment) => (value == null ? undefined : value[segment]), record)
}

function writeField(record: Record<string, any>, fieldname: string, value: any): void {
	const segments = parsePath(fieldname)
	const last = segments.pop()
	if (last === undefined) throw new Error('Cannot set value on empty path')
	let target = record
	for (const segment of segments) {
		target = target[segment]
		if (target == null) throw new Error(`Cannot set property on null/undefined path: ${fieldname}`)
	}
	target[last] = value
}

/**
 * A record not saved yet, held here rather than in the store: a store key for it was tried and failed
 * (see `DRAFT_RECORD_ID`). Setting a field runs that field's rules, as a store write does for a saved
 * record, and those rules reach this record through the same `get` and `set`. As in the store, a
 * set inside a group the record does not have throws.
 *
 * @param doctype - the record's doctype slug
 * @param store - the shared store, handed to rules for reading other records
 * @param startingValues - the record's values before anything is set; they run no rules
 */
export function newRecord(
	doctype: string,
	store: HSTNode,
	startingValues: Record<string, unknown> = {}
): EditableRecord {
	const values = reactive<Record<string, any>>({ ...startingValues })

	const record: EditableRecord = {
		get: fieldname => readField(values, fieldname),
		set: (fieldname, value) => {
			const beforeValue = record.get(fieldname)
			if (Object.is(beforeValue, value)) return
			writeField(values, fieldname, value)
			getGlobalTriggerEngine()
				.executeFieldTriggers({
					fieldname,
					beforeValue,
					afterValue: value,
					operation: 'set',
					doctype,
					timestamp: new Date(),
					store,
					get: field => record.get(field),
					set: (field, fieldValue) => record.set(field, fieldValue),
				})
				.catch((error: unknown) => {
					console.warn('Field trigger error:', error instanceof Error ? error.message : error)
				})
		},
	}
	return record
}
