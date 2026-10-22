import { resolveDefaultToken, resolveTokensInRecord } from './default-tokens'
import type Doctype from './doctype'
import { columnFields, recordFields, type RecordField } from './record-fields'
import type Registry from './registry'
import type {
	ComposeNewRecordOptions,
	ComposeNewRecordResult,
	DefaultsContext,
	DefaultsData,
	DefaultsDocument,
	DefaultsSource,
} from './types/defaults'

/**
 * How long a new record waits for a starting value that has not arrived. A value still missing by then is
 * skipped and reported, and the record opens without it.
 * @public
 */
export const DEFAULTS_TIMEOUT_MS = 5000

const TIMED_OUT = Symbol('timed out')

/** One composition: what every value in it shares, and what went wrong along the way. */
type Run = {
	registry: Registry
	doctype: Doctype
	now: Date
	/** Settles, never rejects, once the composition has waited as long as it will. */
	deadline: Promise<typeof TIMED_OUT>
	timeoutMs: number
	problems: string[]
	errors: unknown[]
}

type Evaluated = { ok: true; value: unknown } | { ok: false }

/** A field whose value is a list of rows: of a linked doctype, or of an inline table's columns. */
type RowsField = Extract<RecordField, { holds: 'rows' | 'columns' }>

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isDefaultsDocument(value: unknown): value is DefaultsDocument {
	return isPlainObject(value)
}

/**
 * Call a defaults function (or take a literal) and wait for its value until the run's deadline. A throw, a
 * rejection or the deadline each skip this one value and record why; nothing else in the run is affected.
 */
async function evaluate(raw: unknown, context: DefaultsContext, run: Run, path: string): Promise<Evaluated> {
	try {
		const produced: unknown = typeof raw === 'function' ? raw(context) : raw
		const value = await Promise.race([Promise.resolve(produced), run.deadline])
		if (value === TIMED_OUT) {
			run.problems.push(`${path}: no answer within ${run.timeoutMs} ms`)
			return { ok: false }
		}
		return { ok: true, value }
	} catch (error) {
		run.problems.push(`${path}: ${error instanceof Error ? error.message : String(error)}`)
		run.errors.push(error)
		return { ok: false }
	}
}

/**
 * Apply one defaults document onto `target`. Its fields are awaited side by side; each lands when it is ready,
 * and a field that fails leaves `target`'s value for it untouched.
 *
 * A key that names no field of the record is skipped and reported, since it would otherwise reach the save as
 * a field nobody declared. A grouped section's name is one such key: the section only groups fields, and each
 * of them takes its own entry.
 */
async function applyDocument(
	target: Record<string, unknown>,
	document: DefaultsDocument,
	fields: ReadonlyMap<string, RecordField>,
	run: Run,
	path: string,
	within: readonly Doctype[]
): Promise<void> {
	await Promise.all(
		Object.entries(document).map(async ([key, rawValue]) => {
			const fieldPath = `${path} › ${key}`
			const field = fields.get(key)
			if (!field) {
				run.problems.push(`${fieldPath}: no field by that name`)
				return
			}
			// A shallow copy: the function reads the record so far, and a copy it changes cannot reach the draft.
			const context: DefaultsContext = { doctype: run.doctype, record: { ...target }, fieldname: key }
			const evaluated = await evaluate(rawValue, context, run, fieldPath)
			if (!evaluated.ok) return
			await assignField(target, field, evaluated.value, run, fieldPath, within)
		})
	)
}

async function assignField(
	target: Record<string, unknown>,
	field: RecordField,
	value: unknown,
	run: Run,
	path: string,
	within: readonly Doctype[]
): Promise<void> {
	const key = field.fieldname
	if ((field.holds === 'rows' || field.holds === 'columns') && Array.isArray(value)) {
		target[key] = await Promise.all(value.map((row, index) => composeRow(row, field, run, `${path}[${index}]`, within)))
		return
	}

	if (field.holds === 'record' && isDefaultsDocument(value)) {
		const existing = isPlainObject(target[key]) ? target[key] : {}
		await applyDocument(existing, value, recordFields(run.registry, field.target), run, path, within)
		target[key] = existing
		return
	}

	target[key] = resolveDefaultToken(value, field.holds === 'value' ? field.component : undefined, run.now)
}

/**
 * Apply a doctype's own `defaults` onto a record of it, and each embedded record's doctype's `defaults` onto that
 * record first, so the containing doctype's entries win. Only where the record holds an embedded record, which
 * `resolveSchema` decided, so a doctype that embeds itself stops where its form does.
 *
 * `within` is the doctypes whose `defaults` are being applied above this record. Defaults that start a row of a
 * doctype already among them would never end, so they stop there and are reported.
 */
async function applyDoctypeDefaults(
	target: Record<string, unknown>,
	doctype: Doctype,
	run: Run,
	path: string,
	within: readonly Doctype[]
): Promise<void> {
	if (within.includes(doctype)) {
		run.problems.push(
			`${path}: a new ${doctype.doctype} inside a new ${doctype.doctype} would never end, so it starts empty`
		)
		return
	}
	const fields = recordFields(run.registry, doctype)
	for (const field of fields.values()) {
		const embedded = target[field.fieldname]
		if (field.holds === 'record' && isPlainObject(embedded)) {
			await applyDoctypeDefaults(embedded, field.target, run, `${path} › ${field.fieldname}`, within)
		}
	}
	await applyLayer(target, doctype.defaults, fields, run, path, [...within, doctype])
}

/**
 * One row of a table's starting value: its doctype's `defaults`, then the row's entries. A linked table's rows are
 * records of its target doctype; an inline table's rows have no doctype, so they hold only their entries.
 */
async function composeRow(
	row: unknown,
	table: RowsField,
	run: Run,
	path: string,
	within: readonly Doctype[]
): Promise<Record<string, unknown>> {
	const { registry, now } = run
	const fields = table.holds === 'rows' ? recordFields(registry, table.target) : columnFields(table.columns)
	const floor: Record<string, unknown> =
		table.holds === 'rows' ? registry.initializeRecord(registry.resolveSchema(table.target)) : {}
	if (table.holds === 'rows') await applyDoctypeDefaults(floor, table.target, run, `${path} defaults`, within)
	const rowRecord = resolveTokensInRecord(floor, fields, registry, now)
	if (!isDefaultsDocument(row)) {
		run.problems.push(`${path}: gave back ${JSON.stringify(row)}, not a document of field values`)
		return rowRecord
	}
	await applyDocument(rowRecord, row, fields, run, path, within)
	return resolveTokensInRecord(rowRecord, fields, registry, now)
}

/** A layer is a document, or a function that returns one; either way it is applied only once it is whole. */
async function applyLayer(
	target: Record<string, unknown>,
	layer: DefaultsSource | undefined,
	fields: ReadonlyMap<string, RecordField>,
	run: Run,
	path: string,
	within: readonly Doctype[]
): Promise<void> {
	if (!layer) return
	const evaluated = await evaluate(layer, { doctype: run.doctype, record: { ...target } }, run, path)
	if (!evaluated.ok) return
	if (!isDefaultsDocument(evaluated.value)) {
		run.problems.push(`${path}: gave back ${JSON.stringify(evaluated.value)}, not a document of field values`)
		return
	}
	await applyDocument(target, evaluated.value, fields, run, path, within)
}

/**
 * Build a new record, once, from every starting value: the doctype's `defaults`, then the source the app registered
 * for it, then any values the app filled the record in with (`prefill`), over the record's tables and embedded
 * records. Layers apply in that order, so a later one wins however long an earlier one took. A field none sets has
 * no value, so a save leaves it to the database's default.
 *
 * Nothing is returned until every value is in, so nothing is written to the record after a user can see it.
 * A value that throws, rejects, or has not arrived within `timeoutMs` (default {@link DEFAULTS_TIMEOUT_MS}) is
 * skipped and reported with `console.warn`; the record still opens with everything else.
 * @public
 */
export async function composeNewRecord(
	registry: Registry,
	doctype: Doctype,
	options?: ComposeNewRecordOptions
): Promise<ComposeNewRecordResult> {
	const now = options?.now ?? new Date()
	const timeoutMs = options?.timeoutMs ?? DEFAULTS_TIMEOUT_MS
	let timer: ReturnType<typeof setTimeout> | undefined
	const run: Run = {
		registry,
		doctype,
		now,
		timeoutMs,
		problems: [],
		errors: [],
		deadline: new Promise(resolve => {
			timer = setTimeout(() => resolve(TIMED_OUT), timeoutMs)
		}),
	}

	try {
		const fields = recordFields(registry, doctype)
		const floor = registry.initializeRecord(registry.resolveSchema(doctype))
		const working = resolveTokensInRecord(floor, fields, registry, now)

		await applyDoctypeDefaults(working, doctype, run, 'doctype defaults', [])
		await applyLayer(working, registry.getRegisteredDefaults(doctype.slug), fields, run, 'registered defaults', [
			doctype,
		])
		await applyLayer(working, options?.prefill, fields, run, 'filled values', [doctype])

		Object.assign(working, resolveTokensInRecord(working, fields, registry, now))

		if (run.problems.length > 0) {
			console.warn(
				`[stonecrop] A new ${doctype.doctype} opened without some starting values:\n- ${run.problems.join('\n- ')}`,
				...run.errors
			)
		}

		return { record: working }
	} finally {
		clearTimeout(timer)
	}
}

/** What checking filled values shares: the registry their tables resolve through, and how a refusal reads. */
type PrefillCheck = {
	registry: Registry
	refused: (reason: string) => Error
}

/**
 * A record written as `{ ... }`, a reactive one included. A `Date`, a `Map` or a class instance is not one: copying
 * its own fields would hand the form an empty object in its place.
 */
function isPlainRecord(value: unknown): value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null) return false
	const prototype: unknown = Object.getPrototypeOf(value)
	return prototype === Object.prototype || prototype === null
}

/** Copy a field's own value, refusing anything inside it but lists, records, strings, numbers, booleans and null. */
function copyFilledValue(value: unknown, path: string, check: PrefillCheck): DefaultsData {
	if (typeof value === 'function') throw check.refused(`"${path}" can't be a function`)
	if (Array.isArray(value)) return value.map((item, index) => copyFilledValue(item, `${path}[${index}]`, check))
	if (isPlainRecord(value)) {
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, item]) => item !== undefined)
				.map(([key, item]) => [key, copyFilledValue(item, `${path}.${key}`, check)])
		)
	}
	if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
		return value
	}
	throw check.refused(`"${path}" must be plain data`)
}

/** A field given as `undefined` is skipped, as JSON drops it, so its default stays. */
function checkFilledDocument(
	values: Record<string, unknown>,
	fields: ReadonlyMap<string, RecordField>,
	prefix: string,
	check: PrefillCheck
): { [field: string]: DefaultsData } {
	const copy: { [field: string]: DefaultsData } = {}
	for (const [key, value] of Object.entries(values)) {
		if (value === undefined) continue
		const path = `${prefix}${key}`
		const field = fields.get(key)
		if (!field) throw check.refused(`it has no field "${path}"`)
		copy[key] = checkFilledField(field, value, path, check)
	}
	return copy
}

/** One field's filled value, held as the build will apply it: rows as a list of records, an embedded record as one. */
function checkFilledField(field: RecordField, value: unknown, path: string, check: PrefillCheck): DefaultsData {
	if (field.holds === 'rows' || field.holds === 'columns') {
		if (!Array.isArray(value)) throw check.refused(`"${path}" must be a list`)
		const rowFields = field.holds === 'rows' ? recordFields(check.registry, field.target) : columnFields(field.columns)
		return value.map((row: unknown, index) => {
			if (!isPlainRecord(row)) throw check.refused(`"${path}[${index}]" must be a record`)
			return checkFilledDocument(row, rowFields, `${path}[${index}].`, check)
		})
	}
	if (field.holds === 'record') {
		// A read gives an absent embedded record as null.
		if (value === null) return null
		if (!isPlainRecord(value)) throw check.refused(`"${path}" must be a record`)
		return checkFilledDocument(value, recordFields(check.registry, field.target), `${path}.`, check)
	}
	return copyFilledValue(value, path, check)
}

/**
 * Check values an app fills a new record in with against the fields the build applies them to, and copy them, so a
 * mistake fails where the app hands them over instead of opening a form with blanks.
 * @internal
 */
export function checkPrefill(registry: Registry, doctype: Doctype, values: unknown): { [field: string]: DefaultsData } {
	const check: PrefillCheck = {
		registry,
		refused: reason => new Error(`Couldn't open a new ${doctype.doctype}: ${reason}.`),
	}
	if (!isPlainRecord(values)) throw check.refused('its values must be a record')
	return checkFilledDocument(values, recordFields(registry, doctype), '', check)
}
