import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { TriggerDefinition } from '@stonecrop/schema'
import { executeClientHandler } from '../client-handler'

/**
 * A single validation error contributed by a trigger, displayed on a field.
 * @public
 */
export interface ValidationError {
	/** The trigger that produced this error — the namespace a re-run clears before repopulating */
	trigger: string
	/** The fieldname the error displays on (the `setError` target, not necessarily a fired field) */
	field: string
	/** The message to display */
	message: string
}

/**
 * Reactive per-field validation error store + the advisory field-validation trigger engine.
 *
 * Holds the errors produced by field-validation triggers (see `TriggerDefinition` in
 * `@stonecrop/schema`) and runs a trigger's `clientHandler` on demand. Errors are **namespaced
 * by trigger**: re-running a trigger clears its own prior contributions before repopulating, so a
 * corrected value clears its stale error without disturbing other triggers.
 *
 * The engine is **advisory** and does **no rollback** — an invalid value stays in the record so the
 * user can fix it; validity is reported separately via `isValid` (read by the save gate) and
 * the per-field messages are surfaced via `errorsByField` / `errorsFor` for display.
 *
 * @public
 */
export const useValidationStore = defineStore('stonecrop-validation', () => {
	const errors = ref<ValidationError[]>([])

	/** True when no field currently carries a validation error. */
	const isValid = computed(() => errors.value.length === 0)

	/** Errors grouped by field — the shape a renderer consumes (e.g. AForm `:errors`). */
	const errorsByField = computed<Record<string, string[]>>(() => {
		const map: Record<string, string[]> = {}
		for (const e of errors.value) {
			if (!map[e.field]) map[e.field] = []
			map[e.field].push(e.message)
		}
		return map
	})

	/** Messages currently displayed on `field`. */
	function errorsFor(field: string): string[] {
		return errors.value.filter(e => e.field === field).map(e => e.message)
	}

	/** Record an error contributed by `trigger`, displayed on `field`. */
	function setError(trigger: string, field: string, message: string) {
		errors.value.push({ trigger, field, message })
	}

	/** Remove every error contributed by `trigger` (its namespace). */
	function clearTrigger(trigger: string) {
		errors.value = errors.value.filter(e => e.trigger !== trigger)
	}

	/** Remove every validation error. */
	function clearAll() {
		errors.value = []
	}

	/**
	 * Run a single trigger against a read-only snapshot of `record`. Clears the trigger's prior
	 * errors, then executes its `clientHandler` with `{ record, value, setError }`. Fails **open** —
	 * a throwing validator warns and records nothing, so a broken validator never blocks the user.
	 */
	async function runTrigger(name: string, def: TriggerDefinition, record: Record<string, unknown>, value: unknown) {
		clearTrigger(name)
		// Shallow-frozen copy: the validator reads siblings but can neither mutate the record nor
		// reassign fields (advisory reads only) — and mutation can't leak back to the caller.
		const frozen = Object.freeze({ ...record })
		const boundSetError = (field: string, message: string) => setError(name, field, message)
		try {
			await executeClientHandler(def.clientHandler, { record: frozen, value, setError: boundSetError })
		} catch (error) {
			// Advisory by design: a broken validator must never block save (a bug in one trigger must
			// not trap the user, especially in production). It fails OPEN — but a throw is an error in
			// the author's code, so surface it loudly (error severity, trigger named) rather than
			// silently: a broken validator that just "does nothing" is the real footgun here.
			if (typeof console !== 'undefined') {
				console.error(
					`Validation trigger "${name}" threw and was ignored (advisory — save is not blocked). ` +
						`Fix its clientHandler:`,
					error
				)
			}
		}
	}

	/**
	 * Run every trigger whose `on` set includes `changedField`, passing that field's current value.
	 * Call on the edit path (desktop-driven) so editing either bound field re-validates the pair.
	 */
	async function validateField(
		triggers: Record<string, TriggerDefinition>,
		changedField: string,
		record: Record<string, unknown>
	): Promise<void> {
		const runs: Promise<void>[] = []
		for (const [name, def] of Object.entries(triggers)) {
			if (def.on.includes(changedField)) {
				runs.push(runTrigger(name, def, record, record[changedField]))
			}
		}
		await Promise.all(runs)
	}

	/**
	 * Run **all** triggers (no fired-field filter) — the authoritative client gate at save-attempt,
	 * covering triggers whose fields were never edited. `value` is undefined (no single changed field).
	 */
	async function validateRecord(
		triggers: Record<string, TriggerDefinition>,
		record: Record<string, unknown>
	): Promise<void> {
		await Promise.all(Object.entries(triggers).map(([name, def]) => runTrigger(name, def, record, undefined)))
	}

	return {
		errors,
		isValid,
		errorsByField,
		errorsFor,
		setError,
		clearTrigger,
		clearAll,
		validateField,
		validateRecord,
	}
})
