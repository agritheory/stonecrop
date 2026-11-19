import { nextTick } from 'vue'

/*
A form reports an edit as a new record, and its host hands that record back only on the next render. Edits
made before then, as a script filling several fields at once makes them, would each be built on the record
the form was last handed, so each would undo the one before it (#559).

So the changes reported for each record a form was handed are kept until the next render, and an edit made
before then lays them, and its own, over that record. Only the changes are kept, not the record reported, so a
value a host writes into the record it handed, such as a field it fills when another changes, is kept too. They
are kept by the record handed, not by form: a fieldset's form is handed its form's own record, so edits made
through either build on each other.

They are dropped on the next tick, so an edit its host declined to take is not carried into an edit made after
the form has re-rendered. An edit made before then, in the same go, still carries it: the form cannot tell a
declined edit from one its host has yet to hand back.
*/
const pending = new WeakMap<object, Record<string, any>>()

/** The record an edit to `handed` builds on: `handed` with the changes reported for it this tick laid over it. */
export const latestRecord = (handed: Record<string, any>): Record<string, any> => {
	const changes = pending.get(handed)
	return changes ? { ...handed, ...changes } : handed
}

/** Notes `changes` as reported for `handed`, until the next tick, and returns the record to report. */
export const noteReported = (handed: Record<string, any>, changes: Record<string, any>): Record<string, any> => {
	const kept = { ...pending.get(handed), ...changes }
	pending.set(handed, kept)
	void nextTick(() => {
		if (pending.get(handed) === kept) pending.delete(handed)
	})
	return { ...handed, ...kept }
}

/**
 * The fields of `reported` that differ from `handed`: what a nested form changed, out of the whole record it
 * reports. A fieldset's form and an expanded row's form each report their whole record, laid over the record
 * they were handed; taking all of it as changes would put back that record's old value of a field the host has
 * since filled in itself, such as a City it fills when Name changes.
 */
export const changedFields = (reported: Record<string, any>, handed: Record<string, any>): Record<string, any> =>
	Object.fromEntries(Object.entries(reported).filter(([key, value]) => !Object.is(value, handed[key])))
