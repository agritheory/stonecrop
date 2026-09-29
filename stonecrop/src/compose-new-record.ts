import type { ResolvedField } from '@stonecrop/aform'

import { resolveDefaultToken, resolveTokensInRecord } from './default-tokens'
import type Doctype from './doctype'
import type Registry from './registry'
import { rowComposeSchema } from './table-row-schema'
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

function applyResolvedTokens(
	working: Record<string, unknown>,
	schema: ResolvedField[],
	registry: Registry,
	doctype: Doctype,
	now: Date
): void {
	Object.assign(
		working,
		resolveTokensInRecord(working, schema, now, {
			registry,
			doctype,
		})
	)
}

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
 */
async function applyDocument(
	target: Record<string, unknown>,
	document: DefaultsDocument,
	schema: ResolvedField[],
	run: Run,
	path: string
): Promise<void> {
	await Promise.all(
		Object.entries(document).map(async ([key, rawValue]) => {
			const fieldPath = `${path} › ${key}`
			// A shallow copy: the function reads the record so far, and a copy it changes cannot reach the draft.
			const context: DefaultsContext = { doctype: run.doctype, record: { ...target }, fieldname: key }
			const evaluated = await evaluate(rawValue, context, run, fieldPath)
			if (!evaluated.ok) return
			const field = schema.find(f => f.fieldname === key)
			await assignField(target, key, evaluated.value, field, run, fieldPath)
		})
	)
}

async function assignField(
	target: Record<string, unknown>,
	key: string,
	value: unknown,
	field: ResolvedField | undefined,
	run: Run,
	path: string
): Promise<void> {
	if (field?.kind === 'table' && Array.isArray(value)) {
		const rowSchema = rowComposeSchema(field, run.registry, run.doctype)
		target[key] = await Promise.all(
			value.map((row, index) => composeTableRow(row, rowSchema, run, `${path}[${index}]`))
		)
		return
	}

	if (field && (field.kind === 'link' || field.kind === 'fieldset') && isDefaultsDocument(value)) {
		const existing = isPlainObject(target[key]) ? target[key] : {}
		await applyDocument(existing, value, field.schema, run, path)
		target[key] = existing
		return
	}

	if (isPlainObject(value) && !field) {
		const existing = isPlainObject(target[key]) ? target[key] : {}
		target[key] = { ...existing, ...value }
		return
	}

	const component = field?.kind === 'field' ? field.component : undefined
	target[key] = resolveDefaultToken(value, component, run.now)
}

async function composeTableRow(
	row: unknown,
	childSchema: ResolvedField[],
	run: Run,
	path: string
): Promise<Record<string, unknown>> {
	const floor = run.registry.initializeRecord(childSchema)
	const rowRecord = resolveTokensInRecord(floor, childSchema, run.now)
	if (!isDefaultsDocument(row)) return rowRecord
	await applyDocument(rowRecord, row, childSchema, run, path)
	return resolveTokensInRecord(rowRecord, childSchema, run.now, { registry: run.registry, doctype: run.doctype })
}

/** A layer is a document, or a function that returns one; either way it is applied only once it is whole. */
async function applyLayer(
	target: Record<string, unknown>,
	layer: DefaultsSource | undefined,
	schema: ResolvedField[],
	run: Run,
	path: string
): Promise<void> {
	if (!layer) return
	const evaluated = await evaluate(layer, { doctype: run.doctype, record: { ...target } }, run, path)
	if (!evaluated.ok || !isDefaultsDocument(evaluated.value)) return
	await applyDocument(target, evaluated.value, schema, run, path)
}

/**
 * Build a new record, once, from every starting value: the schema's empty values and field defaults, the
 * doctype's `defaults`, the source registered for it (after the defaults loader, if one is set), then the
 * caller's `overlay`. Layers apply in that order, so a later one wins however long an earlier one took.
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
		await evaluate(registry.ensureDefaultsSourceLoaded(doctype.slug), { doctype, record: {} }, run, 'defaults loader')

		const schema = registry.resolveSchema(doctype)
		const working: Record<string, unknown> = resolveTokensInRecord(registry.initializeRecord(schema), schema, now, {
			registry,
			doctype,
		})

		await applyLayer(working, doctype.defaults, schema, run, 'doctype defaults')
		await applyLayer(working, registry.getRegisteredDefaults(doctype.slug), schema, run, 'registered defaults')
		if (options?.overlay) {
			await applyDocument(working, options.overlay, schema, run, 'overlay')
		}

		applyResolvedTokens(working, schema, registry, doctype, now)

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
