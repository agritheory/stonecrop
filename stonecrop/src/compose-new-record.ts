import type { ResolvedField } from '@stonecrop/aform'

import { resolveDefaultToken, resolveTokensInRecord } from './default-tokens'
import type Doctype from './doctype'
import type Registry from './registry'
import { rowComposeSchema } from './table-row-schema'
import type { DefaultsContext, DefaultsDocument, DefaultsSource, DefaultsValue } from './types/defaults'

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

function isThenable(value: unknown): value is PromiseLike<unknown> {
	return typeof value === 'object' && value !== null && typeof Reflect.get(value, 'then') === 'function'
}

function isDefaultsDocument(value: unknown): value is DefaultsDocument {
	return isPlainObject(value)
}

function deepCloneRecord(value: Record<string, unknown>): Record<string, unknown> {
	return structuredClone(value)
}

type PendingPatch = Promise<void>

/**
 * Apply one resolved defaults document onto `target`.
 */
function mergeDefaultsDocument(
	target: Record<string, unknown>,
	document: DefaultsDocument,
	schema: ResolvedField[],
	registry: Registry,
	doctype: Doctype,
	pending: PendingPatch[],
	now: Date
): void {
	for (const [key, rawValue] of Object.entries(document)) {
		const field = schema.find(f => f.fieldname === key)
		const recordSnapshot = deepCloneRecord(target)
		const fieldCtx: DefaultsContext = { doctype, record: recordSnapshot, fieldname: key }

		if (typeof rawValue === 'function') {
			const result = rawValue(fieldCtx)
			if (isThenable(result)) {
				pending.push(
					(async () => {
						const resolved = await result
						assignMergedField(target, key, resolved, field, schema, registry, doctype, pending, now)
					})()
				)
			} else {
				assignMergedField(target, key, result, field, schema, registry, doctype, pending, now)
			}
			continue
		}

		assignMergedField(target, key, rawValue, field, schema, registry, doctype, pending, now)
	}
}

function assignMergedField(
	target: Record<string, unknown>,
	key: string,
	value: DefaultsValue,
	field: ResolvedField | undefined,
	parentSchema: ResolvedField[],
	registry: Registry,
	doctype: Doctype,
	pending: PendingPatch[],
	now: Date
): void {
	if (field?.kind === 'table' && Array.isArray(value)) {
		const rowSchema = rowComposeSchema(field, registry, doctype)
		target[key] = value.map(row => composeTableRow(row, rowSchema, registry, doctype, pending, now))
		return
	}

	if (field && (field.kind === 'link' || field.kind === 'fieldset') && isDefaultsDocument(value)) {
		const existing = isPlainObject(target[key]) ? target[key] : {}
		mergeDefaultsDocument(existing, value, field.schema, registry, doctype, pending, now)
		target[key] = existing
		return
	}

	if (isPlainObject(value) && !field) {
		const existing = isPlainObject(target[key]) ? target[key] : {}
		target[key] = { ...existing, ...value }
		return
	}

	const component = field?.kind === 'field' ? field.component : undefined
	target[key] = resolveDefaultToken(value, component, now)
}

function composeTableRow(
	row: DefaultsValue,
	childSchema: ResolvedField[],
	registry: Registry,
	doctype: Doctype,
	pending: PendingPatch[],
	now: Date
): Record<string, unknown> {
	const floor = registry.initializeRecord(childSchema)
	let rowRecord = resolveTokensInRecord(floor, childSchema, now)
	if (isDefaultsDocument(row)) {
		mergeDefaultsDocument(rowRecord, row, childSchema, registry, doctype, pending, now)
		rowRecord = resolveTokensInRecord(rowRecord, childSchema, now, { registry, doctype })
	}
	return rowRecord
}

async function applyDefaultsLayer(
	target: Record<string, unknown>,
	layer: DefaultsSource | undefined,
	schema: ResolvedField[],
	registry: Registry,
	doctype: Doctype,
	pending: PendingPatch[],
	now: Date
): Promise<void> {
	if (!layer) return

	if (typeof layer === 'function') {
		const ctx: DefaultsContext = { doctype, record: deepCloneRecord(target) }
		const result = layer(ctx)
		if (isThenable(result)) {
			pending.push(
				(async () => {
					const document = await result
					mergeDefaultsDocument(target, document, schema, registry, doctype, pending, now)
				})()
			)
			return
		}
		mergeDefaultsDocument(target, result, schema, registry, doctype, pending, now)
		return
	}

	mergeDefaultsDocument(target, layer, schema, registry, doctype, pending, now)
}

export type ComposeNewRecordResult = {
	record: Record<string, unknown>
	/** Resolves when all awaitable defaults have been merged. */
	settled: Promise<Record<string, unknown>>
}

/**
 * Build a new record: schema floor, compose-time tokens, doctype defaults, registered source, optional overlay.
 * Sync functions block; promises merge when they settle.
 * @public
 */
export function composeNewRecordSync(
	registry: Registry,
	doctype: Doctype,
	options?: { overlay?: DefaultsDocument; now?: Date }
): ComposeNewRecordResult {
	const now = options?.now ?? new Date()
	const schema = registry.resolveSchema(doctype)
	const pending: PendingPatch[] = []

	const working: Record<string, unknown> = resolveTokensInRecord(registry.initializeRecord(schema), schema, now, {
		registry,
		doctype,
	})

	void applyDefaultsLayer(working, doctype.defaults, schema, registry, doctype, pending, now)
	void applyDefaultsLayer(
		working,
		registry.getRegisteredDefaults(doctype.slug),
		schema,
		registry,
		doctype,
		pending,
		now
	)

	if (options?.overlay) {
		mergeDefaultsDocument(working, options.overlay, schema, registry, doctype, pending, now)
	}

	applyResolvedTokens(working, schema, registry, doctype, now)

	const syncRecord = deepCloneRecord(working)

	if (pending.length === 0) {
		return { record: syncRecord, settled: Promise.resolve(deepCloneRecord(syncRecord)) }
	}

	const settled = Promise.all(pending).then(() => {
		applyResolvedTokens(working, schema, registry, doctype, now)
		return deepCloneRecord(working)
	})

	return { record: syncRecord, settled }
}

export async function composeNewRecord(
	registry: Registry,
	doctype: Doctype,
	options?: { overlay?: DefaultsDocument; now?: Date }
): Promise<ComposeNewRecordResult> {
	await registry.ensureDefaultsSourceLoaded(doctype.slug)
	return composeNewRecordSync(registry, doctype, options)
}
