import type { DoctypeMeta } from '@stonecrop/schema'
import { camelToSnake, getRecordIdField, linkDisplayFieldname, pascalToSnake } from '@stonecrop/schema'
import type { PgClient } from '@dataplan/pg'

import { flattenFields } from './fields'
import { getMeta } from './registry/doctypes'

type SqlQueryFn = <T>(
	pgClient: PgClient,
	query: { text: string; values?: unknown[] }
) => Promise<{ rows: readonly T[] }>

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
			const fkValue = row[spec.fieldname]
			if (fkValue == null || typeof fkValue === 'object') continue
			const id = String(fkValue)
			if (id !== '') ids.add(id)
		}
		if (ids.size === 0) continue

		const pkColumn = camelToSnake(spec.targetPkFieldname)
		const displayColumn = camelToSnake(spec.displayField)
		const displayAlias =
			displayColumn !== spec.displayField ? `"${displayColumn}" AS "${spec.displayField}"` : `"${spec.displayField}"`

		// oxlint-disable-next-line eslint/no-await-in-loop -- one lookup batch per FK field; fields are few per doctype
		const { rows: displayRows } = await debugSql<Record<string, unknown>>(pgClient, {
			text: `SELECT "${pkColumn}" AS "${spec.targetPkFieldname}", ${displayAlias} FROM ${spec.targetTable} WHERE "${pkColumn}"::text = ANY($1::text[])`,
			values: [Array.from(ids)],
		})

		const displayById = new Map<string, unknown>()
		for (const displayRow of displayRows) {
			displayById.set(String(displayRow[spec.targetPkFieldname]), displayRow[spec.displayField])
		}

		for (const row of rows) {
			const fkValue = row[spec.fieldname]
			if (fkValue == null || typeof fkValue === 'object') continue
			const displayValue = displayById.get(String(fkValue))
			if (displayValue == null || displayValue === '') continue
			row[linkDisplayFieldname(spec.fieldname)] = displayValue
		}
	}
}
