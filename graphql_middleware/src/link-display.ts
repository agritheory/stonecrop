import type { DoctypeMeta } from '@stonecrop/schema'
import { camelToSnake, flattenFields, getDisplayField, getRecordIdField, linkDisplayFieldname } from '@stonecrop/schema'
import type { PgClient } from '@dataplan/pg'

import { getMeta } from './registry/doctypes'
import { resolveTableName } from './tables'

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
		if (!targetMeta) continue

		// `getDisplayField` rather than a lookup written here: it is the same call `DoctypeMeta`
		// makes at the load gate, so a nomination that parsed is one this can build a SELECT from.
		// A hand-rolled scan here admitted `computed` fields, whose column does not exist.
		const displayField = getDisplayField(targetMeta.fields, targetMeta.displayField)
		if (!displayField) continue

		specs.push({
			fieldname: field.fieldname,
			displayField: displayField.fieldname,
			targetPkFieldname: getRecordIdField(targetMeta.fields),
			targetTable: resolveTableName(targetMeta.name, tables),
		})
	}

	return specs
}

/**
 * Add `fieldname__display` alongside each inline foreign-key field when the target doctype
 * declares a `displayField`. Scalar FK values only — expanded relations are skipped.
 *
 * Takes every row at once and issues one lookup per FK field, not per row. Callers holding a batch
 * must pass the whole batch: called per row inside a loader's own loop it reinstates the N+1 the
 * loader exists to prevent, and does so invisibly, since the result is identical either way.
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

	await Promise.all(
		specs.map(async spec => {
			const ids = new Set<string>()
			for (const row of rows) {
				const id = fkIdKey(row[spec.fieldname])
				if (id !== undefined) ids.add(id)
			}
			if (ids.size === 0) return

			const pkColumn = camelToSnake(spec.targetPkFieldname)
			const displayColumn = camelToSnake(spec.displayField)
			const displayAlias =
				displayColumn !== spec.displayField ? `"${displayColumn}" AS "${spec.displayField}"` : `"${spec.displayField}"`

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
		})
	)
}
