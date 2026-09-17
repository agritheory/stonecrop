import type { PgCodec, PgExecutor } from '@dataplan/pg'
import { sql } from 'postgraphile/pg-sql2'

import { resolveTable, resolveTableName } from './tables'

/** A column to read, and the key its value comes back under. */
export interface ColumnSelection {
	column: string
	alias: string
}

/** One doctype's table, with a select list whose values read as PostGraphile reads them. */
export interface ColumnSelect {
	/** The quoted table. */
	table: string
	/** Each column cast to text the way PostGraphile casts it, under its alias. */
	list: string
	/** Decodes every selected value in place with the codec PostGraphile decodes it with. */
	decodeRows(rows: readonly Record<string, unknown>[]): void
}

/** Builds the select list for a doctype's columns. */
export interface ColumnReader {
	select(doctype: string, selections: readonly ColumnSelection[]): ColumnSelect
}

/**
 * Reads a doctype's columns through the codecs PostGraphile introspected for its table, so each
 * value is the one PostGraphile's own query serves for that row: a `date` is `2026-01-01` and a
 * `timestamp` is `2026-01-01T09:00:00.000000`, in any server zone.
 *
 * Not `pg`'s type parsers: they turn `date` and `timestamp` into a Date at the server's local time,
 * which names another day or hour outside UTC, and a save writes that shifted value back. Not a
 * process-wide `setTypeParser` either, which changes every other `pg` query in the host.
 */
export function createColumnReader(
	codecs: Readonly<Record<string, PgCodec>>,
	executor: PgExecutor,
	tables?: Record<string, string>
): ColumnReader {
	const tableCodecsByName = new Map<string, PgCodec[]>()
	for (const codec of Object.values(codecs)) {
		const pg = codec.extensions?.pg
		if (!codec.attributes || !codec.extensions?.isTableLike || !pg || codec.executor !== executor) continue
		tableCodecsByName.set(pg.name, [...(tableCodecsByName.get(pg.name) ?? []), codec])
	}

	const findTableCodec = (doctype: string): PgCodec => {
		const table = resolveTable(doctype, tables)
		const matches = (tableCodecsByName.get(table.name) ?? []).filter(
			codec => table.schema === undefined || codec.extensions?.pg?.schemaName === table.schema
		)
		if (matches.length === 1) return matches[0]
		const quoted = resolveTableName(doctype, tables)
		if (matches.length === 0) {
			throw new Error(
				`Doctype "${doctype}" reads ${quoted}, which PostGraphile has not introspected, so its columns ` +
					`cannot be read the way PostGraphile reads them. Add the table's schema to the pgService, ` +
					`or map the doctype in \`tables\` to a table PostGraphile knows.`
			)
		}
		const schemas = matches.map(codec => codec.extensions?.pg?.schemaName).join(', ')
		throw new Error(
			`Doctype "${doctype}" reads ${quoted}, a name PostGraphile knows in more than one schema ` +
				`(${schemas}). Map the doctype in \`tables\` to "schema.table".`
		)
	}

	return {
		select(doctype, selections) {
			const codec = findTableCodec(doctype)
			const table = resolveTableName(doctype, tables)
			// Keyed by alias, so a column selected twice under one key is decoded once, as `pg` keeps one.
			const decoders = new Map<string, (value: string) => unknown>()
			const list = selections
				.map(({ column, alias }) => {
					const attribute = codec.attributes?.[column]
					if (!attribute) {
						throw new Error(
							`Doctype "${doctype}" declares a field for column "${column}", which ${table} does not have.`
						)
					}
					const columnSql = sql.identifier(column)
					const cast = attribute.codec.castFromPg?.(columnSql) ?? sql`${columnSql}::text`
					const compiled = sql.compile(sql`${cast} AS ${sql.identifier(alias)}`)
					// This list is spliced into SQL whose placeholders the caller numbers, so a cast carrying
					// its own `$1` would silently bind the caller's first value.
					if (compiled.values.length > 0) {
						throw new Error(
							`The codec for ${table}."${column}" casts with a bound value, which this adapter cannot select.`
						)
					}
					decoders.set(alias, attribute.codec.fromPg)
					return compiled.text
				})
				.join(', ')

			return {
				table,
				list,
				decodeRows(rows) {
					for (const row of rows) {
						for (const [alias, fromPg] of decoders) {
							const value = row[alias]
							if (value === null) continue
							// The list casts every column to text, so anything else is a row this select did not
							// produce, or one decoded already.
							if (typeof value !== 'string') {
								throw new Error(`"${alias}" from ${table} is ${typeof value}, not the text its select returns.`)
							}
							row[alias] = fromPg(value)
						}
					}
				},
			}
		},
	}
}
