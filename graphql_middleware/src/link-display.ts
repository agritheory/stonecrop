import type { DoctypeMeta } from '@stonecrop/schema'
import { camelToSnake, flattenFields, getDisplayField, getRecordIdField } from '@stonecrop/schema'
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

/**
 * Normalize a scalar SQL cell value to a non-empty string, or nothing.
 *
 * One rule for the three reads that all need it — the FK a lookup keys on, the target's own key
 * in the result, and the display text stamped into the payload. Rejecting objects is what each
 * of those wants: an object FK is a link that was already expanded, and an object display column
 * is the `[object Object]` a bare `String()` would otherwise write into the payload as though it
 * were the record's name. Falling back to the raw id is visibly unhelpful; that is not.
 */
function scalarText(value: unknown): string | undefined {
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
 * Replace inline link FK scalars with `{ id, displayText }` when the target doctype declares a
 * `displayField`. Expanded relations (object values) are skipped.
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
				const id = scalarText(row[spec.fieldname])
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

			const displayById = new Map<string, string>()
			for (const displayRow of displayRows) {
				const key = scalarText(displayRow[spec.targetPkFieldname])
				const text = scalarText(displayRow[spec.displayField])
				if (key === undefined || text === undefined) continue
				displayById.set(key, text)
			}

			for (const row of rows) {
				const rawId = row[spec.fieldname]
				const idKey = scalarText(rawId)
				if (idKey === undefined) continue
				const displayText = displayById.get(idKey)
				if (displayText === undefined) continue
				row[spec.fieldname] = { id: rawId, displayText }
			}
		})
	)
}
