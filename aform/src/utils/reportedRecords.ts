import { nextTick } from 'vue'

/*
A form reports an edit as a new record, and its host hands that record back only on the next render. Edits
made before then, as a script filling several fields at once makes them, would each be built on the record
the form was last handed, so each would undo the one before it (#559).

So the record last reported for each record a form was handed is kept until the next render, and an edit
made before then builds on it. It is kept by the record handed, not by form: a fieldset's form is handed its
form's own record, so edits made through either build on each other. It is dropped on the next tick, so an
edit its host declined to take is not carried into a later one.
*/
const reported = new WeakMap<object, Record<string, any>>()

/** The record an edit to `handed` builds on: the last one reported for it this tick, or `handed` itself. */
export const latestRecord = (handed: Record<string, any>): Record<string, any> => reported.get(handed) ?? handed

/** Notes `record` as the latest reported for `handed`, until the next tick. */
export const noteReported = (handed: Record<string, any>, record: Record<string, any>) => {
	reported.set(handed, record)
	void nextTick(() => {
		if (reported.get(handed) === record) reported.delete(handed)
	})
}
