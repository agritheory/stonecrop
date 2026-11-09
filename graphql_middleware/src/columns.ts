import { LIST_TYPES, TYPES } from '@dataplan/pg'
import type { PgCodec, PgCodecAttribute, PgExecutor } from '@dataplan/pg'
import { sql } from 'postgraphile/pg-sql2'
import type { SQL } from 'postgraphile/pg-sql2'
import { Temporal } from 'temporal-polyfill'

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
	/** Each column cast to text, under its alias: as PostGraphile casts it, but for the exceptions `createColumnReader` names. */
	list: string
	/** Decodes every selected value in place with the codec PostGraphile decodes it with. */
	decodeRows(rows: readonly Record<string, unknown>[]): void
}

/** Builds the select list for a doctype's columns, and the SQL that binds a value to one. */
export interface ColumnReader {
	select(doctype: string, selections: readonly ColumnSelection[]): ColumnSelect
	/** `placeholder` as the value for `column`, cast where the column needs its value converted. */
	bind(doctype: string, column: string, placeholder: string): string
	/**
	 * A condition matching rows whose `column` is one of the ids in `placeholder`, compared by the
	 * column's own type so Postgres can use its index. `placeholder` binds one id as text, or a list of
	 * them as `text[]` when `many` is set. An id the column's type cannot hold (`abc` for a `uuid`, an
	 * empty string) matches nothing rather than failing the query.
	 */
	matchKey(doctype: string, column: string, placeholder: string, many?: boolean): string
	/**
	 * `value` encoded for `column` with the codec its read decodes it with, so a value a read served is
	 * written back as the same value. One of the wrong shape is refused, never written as another value.
	 */
	encode(doctype: string, column: string, value: unknown): EncodedValue
	/** Whether a write may set `column`: not one the database fills itself, which PostGraphile marks as neither insertable nor updatable. */
	writable(doctype: string, column: string): boolean
}

/** The value to bind for a column, or why the column cannot take the value it was sent (`must be a list`). */
export type EncodedValue = { value: unknown } | { refused: string }

/** A domain's underlying type, through any domains stacked on it. */
const baseCodec = (codec: PgCodec): PgCodec => (codec.domainOfCodec ? baseCodec(codec.domainOfCodec) : codec)

const DATE_TIME_TYPES = new Set<PgCodec>([TYPES.date, TYPES.timestamp, TYPES.timestamptz])
const GEOMETRIC_TYPES = new Set<PgCodec>([TYPES.point, TYPES.lseg, TYPES.box, TYPES.path, TYPES.polygon, TYPES.circle])

/** Whether a type's value is read as an object: JSON, a composite, a range or a geometric type. */
const readsAsObject = (codec: PgCodec): boolean =>
	codec === TYPES.json ||
	codec === TYPES.jsonb ||
	Boolean(codec.attributes) ||
	Boolean(codec.rangeOfCodec) ||
	GEOMETRIC_TYPES.has(codec)

const isRecord = (value: unknown): value is Record<string, unknown> =>
	value !== null && typeof value === 'object' && !Array.isArray(value)

const hasExactly = (value: Record<string, unknown>, keys: readonly string[]): boolean =>
	Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key))

/** Whether `value` has the shape a read of `codec` serves, so that encoding it cannot write some other value. */
const fitsShape = (codec: PgCodec, value: unknown): boolean => {
	if (value === null) return true
	const base = baseCodec(codec)
	if (base === TYPES.json || base === TYPES.jsonb) return true
	const { arrayOfCodec, rangeOfCodec, attributes } = base
	if (arrayOfCodec) return Array.isArray(value) && value.every(entry => fitsShape(arrayOfCodec, entry))
	if (rangeOfCodec) {
		const fitsBound = (bound: unknown) =>
			bound === null ||
			(isRecord(bound) &&
				hasExactly(bound, ['value', 'inclusive']) &&
				typeof bound.inclusive === 'boolean' &&
				bound.value !== null &&
				fitsShape(rangeOfCodec, bound.value))
		return isRecord(value) && hasExactly(value, ['start', 'end']) && fitsBound(value.start) && fitsBound(value.end)
	}
	if (attributes) {
		return (
			isRecord(value) &&
			hasExactly(value, Object.keys(attributes)) &&
			Object.entries(attributes).every(([name, attribute]) => fitsShape(attribute.codec, value[name]))
		)
	}
	return GEOMETRIC_TYPES.has(base) ? isRecord(value) : typeof value !== 'object'
}

const fields = (composite: PgCodec): string => Object.keys(composite.attributes ?? {}).join(', ')

/** The shape a read of `codec` serves, as a refusal names it. */
const shapeOf = (codec: PgCodec): string => {
	const base = baseCodec(codec)
	if (base.arrayOfCodec) {
		const element = baseCodec(base.arrayOfCodec)
		if (element.rangeOfCodec) return 'a list of ranges, each with a start and an end'
		if (element.attributes) return `a list of objects, each with exactly the fields ${fields(element)}`
		return readsAsObject(element) ? 'a list' : 'a list of single values'
	}
	if (base.rangeOfCodec) return 'a range with a start and an end'
	if (base.attributes) return `an object with exactly the fields ${fields(base)}`
	return GEOMETRIC_TYPES.has(base) ? 'an object' : 'a single value, not an object'
}

/** The cast for one date or time range, or `undefined` for any other type. */
const dateRangeCast = (codec: PgCodec): ((range: SQL) => SQL) | undefined => {
	const bound = baseCodec(codec).rangeOfCodec
	const castFromPg = bound && DATE_TIME_TYPES.has(baseCodec(bound)) ? baseCodec(bound).castFromPg : undefined
	if (!castFromPg) return undefined
	const edge = (fragment: SQL) =>
		sql`case when isfinite(${fragment}) then ${castFromPg(fragment)} else ${fragment}::text end`
	return range =>
		sql`case when ${range} is null then null else json_build_array(lower_inc(${range}), ${edge(sql`lower(${range})`)}, ${edge(sql`upper(${range})`)}, upper_inc(${range}))::text end`
}

/**
 * The select of a date or time range, or a list of them, keeping an infinite bound as the text Postgres
 * writes for it (`-infinity`) and a NULL range as null. Not PostGraphile's own cast, which reads an
 * infinite bound as no bound and a NULL range as one with no bounds, so a save of the read would write
 * `[-infinity, …)` back as `(, …)`. Bounds stay zone-free.
 */
const dateRangeSelect = (codec: PgCodec, columnSql: SQL): SQL | undefined => {
	const rangeCast = dateRangeCast(codec)
	if (rangeCast) return rangeCast(columnSql)
	const element = baseCodec(codec).arrayOfCodec
	const elementCast = element && dateRangeCast(element)
	if (!elementCast) return undefined
	const range = sql.identifier(Symbol('range'))
	return sql`case when ${columnSql} is null then null else array(select ${elementCast(range)} from unnest(${columnSql}) as ${range})::text end`
}

/**
 * Temporal writes a negative duration signed as a whole (`-P1DT1H`), which Postgres refuses; Postgres
 * reads the sign on each part (`P-1DT-1H`).
 */
const signEachPart = (duration: string): string =>
	duration.startsWith('-P') ? duration.slice(1).replace(/\d+(?:\.\d+)?(?=[YMWDHS])/g, '-$&') : duration

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

/** An interval as PostGraphile's cast writes it, `to_char(…, 'YYYY_MM_DD_HH24_MI_SS.US')`, each part signed apart. */
const INTERVAL_TEXT = /^(-?\d+)_(-?\d+)_(-?\d+)_(-?\d+)_(-?\d+)_(-?\d+)\.(-?\d+)$/

/**
 * An interval, as PostGraphile's cast writes it, read as an ISO 8601 duration (`P1DT2H30M`): the value
 * a duration field holds whatever the backend, as a day is `YYYY-MM-DD`. Postgres writes an ISO 8601
 * duration back natively.
 *
 * Parsed here, not by PostGraphile's codec, which reads a second and a half less (`-01.-500000`) as -1 s.
 *
 * Postgres signs each part apart, so it can hold "a day less an hour", which no ISO 8601 duration can.
 * Such an interval throws rather than being read as some other length.
 */
const isoDuration = (text: string, describe: () => string): string => {
	const match = INTERVAL_TEXT.exec(text)
	if (!match) throw new Error(`${describe()} is an interval in a form this reader does not know.`)
	const [years, months, days, hours, minutes, seconds, fraction] = match.slice(1).map(Number)
	const microseconds = seconds * 1e6 + fraction
	const parts = [years, months, days, hours, minutes, microseconds]
	if (parts.some(value => value > 0) && parts.some(value => value < 0)) {
		throw new Error(`${describe()} is an interval whose parts differ in sign, which no ISO 8601 duration can hold.`)
	}
	return Temporal.Duration.from({
		years,
		months,
		days,
		hours,
		minutes,
		seconds: Math.trunc(microseconds / 1e6),
		milliseconds: Math.trunc((microseconds % 1e6) / 1e3),
		microseconds: microseconds % 1e3,
	}).toString()
}

const readIntervalList = (text: string, describe: () => string): unknown =>
	LIST_TYPES.text
		.fromPg(text)
		.map((interval: string | null) => (interval === null ? null : isoDuration(interval, describe)))

/** Whether a column holds an interval or a list of them, each served as an ISO 8601 duration. */
const intervalShape = (codec: PgCodec): 'one' | 'list' | undefined => {
	if (baseCodec(codec) === TYPES.interval) return 'one'
	if (codec.arrayOfCodec && baseCodec(codec.arrayOfCodec) === TYPES.interval) return 'list'
	return undefined
}

/**
 * Reads a doctype's columns through the codecs PostGraphile introspected for its table, so each
 * value is the one PostGraphile's own query serves for that row, in any server zone: a `date` is
 * `2026-01-01`. Three exceptions: a `timestamp`, or a list of them, served as the moment each names in
 * the database's zone (`2026-01-01T09:00:00.000000+00:00`; see `momentConversion`); an `interval`, or
 * a list of them, served as an ISO 8601 duration (see `isoDuration`); and a date or time range, or a
 * list of them, keeping its infinite bounds and a NULL (see `dateRangeSelect`).
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

	const findAttribute = (doctype: string, tableCodec: PgCodec, column: string): PgCodecAttribute => {
		const attribute = tableCodec.attributes?.[column]
		if (!attribute) {
			throw new Error(
				`Doctype "${doctype}" declares a field for column "${column}", which ${resolveTableName(doctype, tables)} does not have.`
			)
		}
		return attribute
	}

	return {
		select(doctype, selections) {
			const tableCodec = findTableCodec(doctype)
			const table = resolveTableName(doctype, tables)
			// Keyed by alias, so a column selected twice under one key is decoded once, as `pg` keeps one.
			const decoders = new Map<string, (value: string) => unknown>()
			const list = selections
				.map(({ column, alias }) => {
					const columnCodec = findAttribute(doctype, tableCodec, column).codec
					const conversion = momentConversion(columnCodec)
					const readCodec = conversion?.codec ?? columnCodec
					const columnSql = conversion ? sql`${sql.identifier(column)}${conversion.castSql}` : sql.identifier(column)
					const cast =
						dateRangeSelect(columnCodec, columnSql) ?? readCodec.castFromPg?.(columnSql) ?? sql`${columnSql}::text`
					const compiled = sql.compile(sql`${cast} AS ${sql.identifier(alias)}`)
					// This list is spliced into SQL whose placeholders the caller numbers, so a cast carrying
					// its own `$1` would silently bind the caller's first value.
					if (compiled.values.length > 0) {
						throw new Error(
							`The codec for ${table}."${column}" casts with a bound value, which this adapter cannot select.`
						)
					}
					const shape = intervalShape(columnCodec)
					const describe = (text: string) => () => `"${alias}" from ${table} (${text})`
					decoders.set(
						alias,
						shape === 'one'
							? text => isoDuration(text, describe(text))
							: shape === 'list'
								? text => readIntervalList(text, describe(text))
								: readCodec.fromPg
					)
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
			const conversion = momentConversion(findAttribute(doctype, findTableCodec(doctype), column).codec)
			return conversion ? `${placeholder}::${conversion.type}` : placeholder
		},

		matchKey(doctype, column, placeholder, many = false) {
			const { sqlType } = findAttribute(doctype, findTableCodec(doctype), column).codec
			const compiled = sql.compile(sqlType)
			if (compiled.values.length > 0) {
				throw new Error(
					`The type of ${resolveTableName(doctype, tables)}."${column}" names a bound value, which this adapter cannot compare with.`
				)
			}
			const type = compiled.text
			const ids = many ? `${placeholder}::text[]` : `ARRAY[${placeholder}::text]`
			// Not `"id"::text = $1`, which reads the whole table: the index is on the column's own type.
			// Not `"id" = $1::uuid` either, which fails the query on a malformed id, even inside a `CASE`,
			// since Postgres converts a constant before the check runs. Each id is converted from a row of
			// `unnest`, so the conversion runs only for the ids `pg_input_is_valid` admits.
			return (
				`${sql.compile(sql.identifier(column)).text} = ANY(ARRAY(SELECT sent::${type} FROM unnest(${ids}) sent ` +
				`WHERE pg_input_is_valid(sent, '${type.replaceAll("'", "''")}')))`
			)
		},

		encode(doctype, column, value) {
			// SQL NULL; a parameter Postgres types from the column it is bound to needs no cast.
			if (value === null) return { value }
			const columnCodec = findAttribute(doctype, findTableCodec(doctype), column).codec
			const codec = baseCodec(columnCodec)
			// Its read is wrong (`{1,-1,0}` reads as two points at the origin), and Postgres refuses its encoding.
			if (codec === TYPES.line) return { refused: 'is a line, which cannot be saved' }
			// The code editor sends JSON as text, which Postgres reads as the value it names.
			if (codec === TYPES.json || codec === TYPES.jsonb) {
				return { value: typeof value === 'string' ? value : codec.toPg(value) }
			}
			if (!fitsShape(codec, value)) return { refused: `must be ${shapeOf(codec)}` }
			if (codec.arrayOfCodec) {
				// As text elements Postgres reads as intervals, since the interval codec writes only its own object.
				if (baseCodec(codec.arrayOfCodec) === TYPES.interval && Array.isArray(value)) {
					const durations = value.map((entry: unknown) => (typeof entry === 'string' ? signEachPart(entry) : entry))
					// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the text list codec writes a null element as NULL and any other as its text; its type names strings only
					return { value: LIST_TYPES.text.toPg(durations as string[]) }
				}
				// A list of zone-free timestamps arrives as moments, bound through `timestamptz[]` (`bind`).
				return { value: (momentConversion(columnCodec)?.codec ?? codec).toPg(value) }
			}
			if (codec === TYPES.interval && typeof value === 'string') return { value: signEachPart(value) }
			// A range, a composite or a geometric value, which the shape check has made an object.
			return readsAsObject(codec) ? { value: codec.toPg(value) } : { value }
		},

		writable(doctype, column) {
			const { extensions } = findAttribute(doctype, findTableCodec(doctype), column)
			return extensions?.isInsertable !== false || extensions?.isUpdatable !== false
		},
	}
}
