import type { DoctypeMeta } from '@stonecrop/schema'
import { camelToSnake, getRecordIdField, linkDisplayFieldname, pascalToSnake } from '@stonecrop/schema'
import type { PgClient } from '@dataplan/pg'

import { flattenFields } from './fields'
import { getMeta } from './registry/doctypes'

type SqlQueryFn = (
	pgClient: PgClient,
	query: { text: string; values?: unknown[] }
) => Promise<{ rows: readonly Record<string, unknown>[] }>

interface LinkDisplaySpec {
	fieldname: string
	displayField: string
	targetPkFieldname: string
	targetTable: string
}

function resolveTableName(name: string, tables?: Record<string, string>): string {
	const target = tables?.[name] ?? pascalToSnake(name)
	const dotIndex = target.indexOf('.')
	if (dotIndex > 0) {
		return `"${target.slice(0, dotIndex)}"."${target.slice(dotIndex + 1)}"`
	}
	return `"${target}"`
}

/** Normalize a scalar FK cell value to a non-empty string id, or skip objects/null. */
function fkIdKey(value: unknown): string | undefined {
	if (value == null || typeof value === 'object') return undefined
	if (typeof value === 'string') return value === '' ? undefined : value
	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
		return String(value)
	}
	return undefined
}

function collectLinkDisplaySpecs(meta: DoctypeMeta, tables?: Record<string, string>): LinkDisplaySpec[] {
	const specs: LinkDisplaySpec[] = []

	for (const field of flattenFields(meta.fields)) {
		if (field.kind !== 'field' || !field.doctype) continue

		const targetMeta = getMeta(field.doctype)
		const displayField = targetMeta?.displayField
		if (!displayField) continue

		const targetHasDisplayField = flattenFields(targetMeta.fields).some(f => f.fieldname === displayField)
		if (!targetHasDisplayField) continue

		specs.push({
			fieldname: field.fieldname,
			displayField,
			targetPkFieldname: getRecordIdField(targetMeta.fields),
			targetTable: resolveTableName(targetMeta.name, tables),
		})
	}

	return specs
}

/**
 * Add `fieldname__display` alongside each inline foreign-key field when the target doctype
 * declares a `displayField`. Scalar FK values only — expanded relations are skipped.
 */
export async function enrichLinkDisplayFields(
	pgClient: PgClient,
	meta: DoctypeMeta,
	rows: Record<string, unknown>[],
	tables: Record<string, string> | undefined,
	debugSql: SqlQueryFn
): Promise<void> {
	const specs = collectLinkDisplaySpecs(meta, tables)
	if (specs.length === 0 || rows.length === 0) return

	for (const spec of specs) {
		const ids = new Set<string>()
		for (const row of rows) {
			const id = fkIdKey(row[spec.fieldname])
			if (id !== undefined) ids.add(id)
		}
		if (ids.size === 0) continue

		const pkColumn = camelToSnake(spec.targetPkFieldname)
		const displayColumn = camelToSnake(spec.displayField)
		const displayAlias =
			displayColumn !== spec.displayField ? `"${displayColumn}" AS "${spec.displayField}"` : `"${spec.displayField}"`

		// oxlint-disable-next-line eslint/no-await-in-loop -- one lookup batch per FK field; fields are few per doctype
		const { rows: displayRows } = await debugSql(pgClient, {
			text: `SELECT "${pkColumn}" AS "${spec.targetPkFieldname}", ${displayAlias} FROM ${spec.targetTable} WHERE "${pkColumn}"::text = ANY($1::text[])`,
			values: [Array.from(ids)],
		})

		const displayById = new Map<string, unknown>()
		for (const displayRow of displayRows) {
			displayById.set(String(displayRow[spec.targetPkFieldname]), displayRow[spec.displayField])
		}

		for (const row of rows) {
			const id = fkIdKey(row[spec.fieldname])
			if (id === undefined) continue
			const displayValue = displayById.get(id)
			if (displayValue == null || displayValue === '') continue
			row[linkDisplayFieldname(spec.fieldname)] = displayValue
		}
	}
}
