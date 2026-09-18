import { LIST_TYPES, TYPES } from '@dataplan/pg'
import type { PgCodec, PgExecutor } from '@dataplan/pg'
import { sql } from 'postgraphile/pg-sql2'
import type { SQL } from 'postgraphile/pg-sql2'

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

/** Builds the select list for a doctype's columns, and the SQL that binds a value to one. */
export interface ColumnReader {
	select(doctype: string, selections: readonly ColumnSelection[]): ColumnSelect
	/** `placeholder` as the value for `column`, cast where the column needs its value converted. */
	bind(doctype: string, column: string, placeholder: string): string
}

/** A domain's underlying type, through any domains stacked on it. */
const baseCodec = (codec: PgCodec): PgCodec => (codec.domainOfCodec ? baseCodec(codec.domainOfCodec) : codec)

/** How a column whose values carry no zone is converted into the moments they name. */
interface MomentConversion {
	/** The type Postgres converts it to, through the database's zone. */
	type: 'timestamptz' | 'timestamptz[]'
	castSql: SQL
	/** Reads the converted value as PostGraphile reads that type. */
	codec: PgCodec
}

/**
 * The conversion for a `timestamp` column, or a list of them: a clock reading with no zone, which
 * names no moment until a zone is chosen. It is read and bound through `timestamptz`, the cast
 * Postgres itself makes through the database's zone, so a value leaves as a moment and a moment
 * comes back to the same reading. Every other column needs none.
 *
 * Not PostGraphile's own text for it: that carries no zone, so a browser reads it in its own zone
 * and sends back UTC, and every save moved the stored time by the user's offset.
 */
const momentConversion = (codec: PgCodec): MomentConversion | undefined => {
	if (baseCodec(codec) === TYPES.timestamp) {
		return { type: 'timestamptz', castSql: sql`::timestamptz`, codec: TYPES.timestamptz }
	}
	if (codec.arrayOfCodec && baseCodec(codec.arrayOfCodec) === TYPES.timestamp) {
		return { type: 'timestamptz[]', castSql: sql`::timestamptz[]`, codec: LIST_TYPES.timestamptz }
	}
	return undefined
}

/**
 * Reads a doctype's columns through the codecs PostGraphile introspected for its table, so each
 * value is the one PostGraphile's own query serves for that row, in any server zone: a `date` is
 * `2026-01-01`. The exception is a `timestamp`, or a list of them, served as the moment each names in
 * the database's zone (`2026-01-01T09:00:00.000000+00:00`); see `momentConversion`.
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

	const findColumnCodec = (doctype: string, tableCodec: PgCodec, column: string): PgCodec => {
		const attribute = tableCodec.attributes?.[column]
		if (!attribute) {
			throw new Error(
				`Doctype "${doctype}" declares a field for column "${column}", which ${resolveTableName(doctype, tables)} does not have.`
			)
		}
		return attribute.codec
	}

	return {
		select(doctype, selections) {
			const tableCodec = findTableCodec(doctype)
			const table = resolveTableName(doctype, tables)
			// Keyed by alias, so a column selected twice under one key is decoded once, as `pg` keeps one.
			const decoders = new Map<string, (value: string) => unknown>()
			const list = selections
				.map(({ column, alias }) => {
					const columnCodec = findColumnCodec(doctype, tableCodec, column)
					const conversion = momentConversion(columnCodec)
					const readCodec = conversion?.codec ?? columnCodec
					const columnSql = conversion ? sql`${sql.identifier(column)}${conversion.castSql}` : sql.identifier(column)
					const cast = readCodec.castFromPg?.(columnSql) ?? sql`${columnSql}::text`
					const compiled = sql.compile(sql`${cast} AS ${sql.identifier(alias)}`)
					// This list is spliced into SQL whose placeholders the caller numbers, so a cast carrying
					// its own `$1` would silently bind the caller's first value.
					if (compiled.values.length > 0) {
						throw new Error(
							`The codec for ${table}."${column}" casts with a bound value, which this adapter cannot select.`
						)
					}
					decoders.set(alias, readCodec.fromPg)
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

		bind(doctype, column, placeholder) {
			const conversion = momentConversion(findColumnCodec(doctype, findTableCodec(doctype), column))
			return conversion ? `${placeholder}::${conversion.type}` : placeholder
		},
	}
}
