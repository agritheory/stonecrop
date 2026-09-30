import type { ResolvedField } from '@stonecrop/aform'

import { resolveDefaultToken, resolveTokensInRecord } from './default-tokens'
import type Doctype from './doctype'
import { columnFields, recordFields, type RecordField } from './record-fields'
import type Registry from './registry'
import type {
	ComposeNewRecordOptions,
	ComposeNewRecordResult,
	DefaultsContext,
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
 * One row of a table's starting value: the row's own empty values and its doctype's `defaults`, then the row's
 * entries. A linked table's rows are records of its target doctype; an inline table's rows have one value per
 * column.
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
	const floor =
		table.holds === 'rows'
			? registry.initializeRecord(registry.resolveSchema(table.target))
			: registry.initializeRecord(
					table.columns.map((column): ResolvedField => ({
						kind: 'field',
						fieldname: column.fieldname,
						component: column.component ?? 'ATextInput',
						label: column.label,
					}))
				)
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
 * Build a new record, once, from every starting value: the schema's empty values, the doctype's `defaults`, then
 * the source the app registered for it. Layers apply in that order, so the registered source wins however long
 * the doctype's took.
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
