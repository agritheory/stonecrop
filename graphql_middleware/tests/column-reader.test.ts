import type { PgCodec, PgExecutor } from '@dataplan/pg'
import { LIST_TYPES, TYPES, domainOfCodec, listOfCodec, rangeOfCodec, recordCodec } from '@dataplan/pg'
import { sql } from 'postgraphile/pg-sql2'
import { describe, it, expect } from 'vite-plus/test'

import { createColumnReader } from '../src/columns'
import { fakeExecutor } from './helpers/fakePgResources'

/** A table codec shaped as PostGraphile's introspection registers one. */
function tableCodec(
	schemaName: string,
	name: string,
	attributes: Record<string, PgCodec>,
	options: { executor?: PgExecutor; isTableLike?: boolean } = {}
): PgCodec {
	return {
		name,
		executor: options.executor ?? fakeExecutor,
		attributes: Object.fromEntries(Object.entries(attributes).map(([column, codec]) => [column, { codec }])),
		extensions: { isTableLike: options.isTableLike ?? true, pg: { serviceName: 'main', schemaName, name } },
	} as unknown as PgCodec
}

describe('createColumnReader', { tags: ['unit', 'graphql'] }, () => {
	const period = tableCodec('public', 'sc_period', { id: TYPES.int, starts_on: TYPES.date, notes: TYPES.json })

	it('casts each column as its codec does and decodes it with that codec', () => {
		const select = createColumnReader({ period }, fakeExecutor).select('ScPeriod', [
			{ column: 'id', alias: 'id' },
			{ column: 'starts_on', alias: 'startsOn' },
		])

		expect(select.table).toBe('"sc_period"')
		expect(select.list).toBe(`"id"::text AS "id", to_char("starts_on", 'YYYY-MM-DD'::text) AS "startsOn"`)
		const rows = [
			{ id: '7', startsOn: '2026-01-01' },
			{ id: null, startsOn: null },
		]
		select.decodeRows(rows)
		expect(rows).toEqual([
			{ id: 7, startsOn: '2026-01-01' },
			{ id: null, startsOn: null },
		])
	})

	it('refuses to decode a value that is not the text its select returns', () => {
		const select = createColumnReader({ period }, fakeExecutor).select('ScPeriod', [{ column: 'id', alias: 'id' }])
		const rows = [{ id: '7' }]
		select.decodeRows(rows)
		expect(() => select.decodeRows(rows)).toThrow('"id" from "sc_period" is number, not the text its select returns.')
	})

	// A decode that is not idempotent, so a second pass over one value throws rather than passing.
	it('decodes a column selected twice under one alias once', () => {
		const select = createColumnReader({ period }, fakeExecutor).select('ScPeriod', [
			{ column: 'notes', alias: 'notes' },
			{ column: 'notes', alias: 'notes' },
		])
		const rows = [{ notes: '{"a":1}' }]
		select.decodeRows(rows)
		expect(rows).toEqual([{ notes: { a: 1 } }])
	})

	it('refuses a table PostGraphile has not introspected', () => {
		expect(() => createColumnReader({ period }, fakeExecutor).select('ScMissing', [])).toThrow(
			'Doctype "ScMissing" reads "sc_missing", which PostGraphile has not introspected'
		)
	})

	it('does not read a table through a codec another executor owns, or a composite type', () => {
		const otherService = tableCodec('public', 'sc_period', { id: TYPES.int }, { executor: {} as PgExecutor })
		const compositeType = tableCodec('public', 'sc_period', { id: TYPES.int }, { isTableLike: false })
		expect(() => createColumnReader({ otherService, compositeType }, fakeExecutor).select('ScPeriod', [])).toThrow(
			'has not introspected'
		)
	})

	it('refuses a name two schemas share until `tables` names the schema', () => {
		const archived = tableCodec('archive', 'sc_period', { id: TYPES.text })
		expect(() => createColumnReader({ period, archived }, fakeExecutor).select('ScPeriod', [])).toThrow(
			'a name PostGraphile knows in more than one schema (public, archive)'
		)

		const select = createColumnReader({ period, archived }, fakeExecutor, { ScPeriod: 'archive.sc_period' }).select(
			'ScPeriod',
			[{ column: 'id', alias: 'id' }]
		)
		expect(select.table).toBe('"archive"."sc_period"')
		// The archive table's `id` is text, which PostGraphile selects verbatim; the public one's is not.
		expect(select.list).toBe('"id" AS "id"')
	})

	it('refuses a column the table does not have', () => {
		expect(() =>
			createColumnReader({ period }, fakeExecutor).select('ScPeriod', [{ column: 'ends_on', alias: 'endsOn' }])
		).toThrow('Doctype "ScPeriod" declares a field for column "ends_on", which "sc_period" does not have.')
	})

	describe('a zone-free timestamp column', () => {
		const stamp = domainOfCodec(TYPES.timestamp, 'stamp', sql.identifier('public', 'stamp'))
		const log = tableCodec('public', 'sc_log', {
			id: TYPES.int,
			opened_at: TYPES.timestamp,
			closed_at: stamp,
			seen_at: TYPES.timestamptz,
			reviewed_at: LIST_TYPES.timestamp,
			audited_at: listOfCodec(stamp),
			noted_at: LIST_TYPES.timestamptz,
		})
		const reader = createColumnReader({ log }, fakeExecutor)
		const asMoment = (column: string) => `to_char(${column}, 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text)`

		it('reads a timestamp, or a domain over one, as the moment it names in the database zone', () => {
			const select = reader.select('ScLog', [
				{ column: 'opened_at', alias: 'openedAt' },
				{ column: 'closed_at', alias: 'closedAt' },
				{ column: 'seen_at', alias: 'seenAt' },
			])
			expect(select.list).toBe(
				`${asMoment('"opened_at"::timestamptz')} AS "openedAt", ${asMoment('"closed_at"::timestamptz')} AS "closedAt", ` +
					`${asMoment('"seen_at"')} AS "seenAt"`
			)
		})

		it('binds a value to a timestamp, or a domain over one, through the database zone', () => {
			expect(reader.bind('ScLog', 'opened_at', '$1')).toBe('$1::timestamptz')
			expect(reader.bind('ScLog', 'closed_at', '$2')).toBe('$2::timestamptz')
			expect(reader.bind('ScLog', 'seen_at', '$3')).toBe('$3')
			expect(reader.bind('ScLog', 'id', '$4')).toBe('$4')
		})

		// PostGraphile's own list cast, with each element read as the moment it names.
		it('reads a list of timestamps, or of a domain over one, as the moments they name', () => {
			const select = reader.select('ScLog', [
				{ column: 'reviewed_at', alias: 'reviewedAt' },
				{ column: 'audited_at', alias: 'auditedAt' },
				{ column: 'noted_at', alias: 'notedAt' },
			])
			const momentList = (column: string) =>
				`(case when (${column}) is not distinct from null then null::text else array(select ` +
				`to_char(__entry__, 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text)\nfrom unnest(${column}) __entry__)::text end)`
			expect(select.list).toBe(
				`${momentList('"reviewed_at"::timestamptz[]')} AS "reviewedAt", ` +
					`${momentList('"audited_at"::timestamptz[]')} AS "auditedAt", ${momentList('"noted_at"')} AS "notedAt"`
			)
			const rows = [{ reviewedAt: '{"2026-01-02T10:30:00.000000+00:00"}', auditedAt: null, notedAt: '{}' }]
			select.decodeRows(rows)
			expect(rows).toEqual([{ reviewedAt: ['2026-01-02T10:30:00.000000+00:00'], auditedAt: null, notedAt: [] }])
		})

		it('binds a list of timestamps, or of a domain over one, through the database zone', () => {
			expect(reader.bind('ScLog', 'reviewed_at', '$1')).toBe('$1::timestamptz[]')
			expect(reader.bind('ScLog', 'audited_at', '$2')).toBe('$2::timestamptz[]')
			expect(reader.bind('ScLog', 'noted_at', '$3')).toBe('$3')
		})

		it('refuses to bind a column the table does not have', () => {
			expect(() => reader.bind('ScLog', 'closes_at', '$1')).toThrow(
				'Doctype "ScLog" declares a field for column "closes_at", which "sc_log" does not have.'
			)
		})
	})

	describe('structured columns', () => {
		const tsrange = rangeOfCodec(TYPES.timestamp, 'tsrange', sql.identifier('tsrange'))
		const int4range = rangeOfCodec(TYPES.int, 'int4range', sql.identifier('int4range'))
		const pair = recordCodec({
			name: 'sc_pair',
			identifier: sql.identifier('sc_pair'),
			attributes: { a: { codec: TYPES.int }, b: { codec: TYPES.text } },
			executor: fakeExecutor,
		})
		const shape = tableCodec('public', 'sc_shape', {
			label: TYPES.text,
			settings: TYPES.jsonb,
			raw: TYPES.json,
			events: listOfCodec(TYPES.jsonb),
			tags: LIST_TYPES.text,
			seen_at: LIST_TYPES.timestamp,
			took: TYPES.interval,
			laps: listOfCodec(TYPES.interval),
			ruler: TYPES.line,
			spot: TYPES.point,
			span: int4range,
			valid_during: tsrange,
			pair,
			pairs: listOfCodec(pair),
			windows: listOfCodec(tsrange),
		})
		const reader = createColumnReader({ shape }, fakeExecutor)
		const encode = (column: string, value: unknown) => reader.encode('ScShape', column, value)

		it.each([
			['a jsonb object as JSON text', 'settings', { a: [1, { b: null }] }, '{"a":[1,{"b":null}]}'],
			['a jsonb number', 'settings', 5, '5'],
			['JSON text as sent', 'raw', '{"b": 2}', '{"b": 2}'],
			['a list of text', 'tags', ['x', 'y,z', null], '{"x","y,z",NULL}'],
			['a list of jsonb', 'events', [{ x: 1 }], '{"{\\"x\\":1}"}'],
			[
				'a list of moments, for the timestamptz[] it is bound through',
				'seen_at',
				['2026-01-05T04:30:00.000Z'],
				'{"2026-01-05T04:30:00.000Z"}',
			],
			['a negative interval with the sign on each part', 'took', '-P1DT1.5S', 'P-1DT-1.5S'],
			['a positive interval as sent', 'took', 'PT1.5S', 'PT1.5S'],
			['a list of intervals, each signed on its parts', 'laps', ['-PT1H', 'PT2M', null], '{"PT-1H","PT2M",NULL}'],
			['a point', 'spot', { x: 1, y: 2 }, '(1,2)'],
			[
				'an integer range',
				'span',
				{ start: { value: 2, inclusive: true }, end: { value: 5, inclusive: false } },
				'["2","5")',
			],
			[
				'an unbounded range end',
				'valid_during',
				{ start: { value: '-infinity', inclusive: true }, end: null },
				'["-infinity",)',
			],
			['a scalar as sent', 'label', 'plain', 'plain'],
			['null', 'settings', null, null],
			['a composite', 'pair', { a: 1, b: 'x' }, '(1,x)'],
			['a list of composites', 'pairs', [{ a: 1, b: null }, null], '{"(1,)",NULL}'],
			[
				'a list of ranges',
				'windows',
				[{ start: { value: '2026-01-01T00:00:00', inclusive: true }, end: null }, null],
				'{"[\\"2026-01-01T00:00:00\\",)",NULL}',
			],
		])('encodes %s', (_, column, value, encoded) => {
			expect(encode(column, value)).toEqual({ value: encoded })
		})

		it.each([
			['a list sent as text', 'tags', 'x,y', 'must be a list of single values'],
			['a list of lists', 'tags', [['x'], ['y']], 'must be a list of single values'],
			['an object in a list of text', 'tags', [{ x: 1 }], 'must be a list of single values'],
			['a range with no bounds named', 'span', {}, 'must be a range with a start and an end'],
			['a range named by other keys', 'span', { lower: 1, upper: 5 }, 'must be a range with a start and an end'],
			[
				'a bound with no inclusivity',
				'span',
				{ start: { value: 1 }, end: null },
				'must be a range with a start and an end',
			],
			['a range sent as text', 'span', '[1,5)', 'must be a range with a start and an end'],
			[
				'a bound with no value',
				'span',
				{ start: { value: null, inclusive: true }, end: null },
				'must be a range with a start and an end',
			],
			[
				'a bound holding an object',
				'span',
				{ start: { value: { n: 1 }, inclusive: true }, end: null },
				'must be a range with a start and an end',
			],
			['a line', 'ruler', '{1,-1,0}', 'is a line, which cannot be saved'],
			['an object for a text column', 'label', { text: 'x' }, 'must be a single value, not an object'],
			['a list for a text column', 'label', ['x'], 'must be a single value, not an object'],
			['a point sent as text', 'spot', '(1,2)', 'must be an object'],
			['a composite missing a field', 'pair', { a: 5 }, 'must be an object with exactly the fields a, b'],
			['a composite named by other keys', 'pair', { aa: 5, bb: 'y' }, 'must be an object with exactly the fields a, b'],
			[
				'a composite holding an object',
				'pair',
				{ a: { n: 1 }, b: 'x' },
				'must be an object with exactly the fields a, b',
			],
			['a composite sent as text', 'pair', '(7,z)', 'must be an object with exactly the fields a, b'],
			[
				'a list of composites, one missing a field',
				'pairs',
				[{ a: 5 }],
				'must be a list of objects, each with exactly the fields a, b',
			],
			[
				'a list of ranges, one with no bounds named',
				'windows',
				[{}],
				'must be a list of ranges, each with a start and an end',
			],
			[
				'a list of ranges sent as one range',
				'windows',
				{ start: null, end: null },
				'must be a list of ranges, each with a start and an end',
			],
		])('refuses %s', (_, column, value, refused) => {
			expect(encode(column, value)).toEqual({ refused })
		})

		it('reads an interval as an ISO 8601 duration, a negative fraction of a second exactly', () => {
			const select = reader.select('ScShape', [
				{ column: 'took', alias: 'took' },
				{ column: 'laps', alias: 'laps' },
			])
			const rows = [
				{ took: '0000_00_00_00_00_-01.-500000', laps: '{0000_00_-1_00_00_00.000000,NULL,0001_02_00_00_00_01.500000}' },
			]
			select.decodeRows(rows)
			expect(rows).toEqual([{ took: '-PT1.5S', laps: ['-P1D', null, 'P1Y2MT1.5S'] }])
		})

		it('refuses an interval in a form it does not know, naming its column', () => {
			const select = reader.select('ScShape', [{ column: 'took', alias: 'took' }])
			expect(() => select.decodeRows([{ took: '1 day' }])).toThrow(
				'"took" from "sc_shape" (1 day) is an interval in a form this reader does not know.'
			)
		})

		// An infinite bound is read as Postgres writes it; PostGraphile's cast reads it as no bound.
		it('reads a date or time range keeping its infinite bounds, and any other range as PostGraphile does', () => {
			const select = reader.select('ScShape', [
				{ column: 'valid_during', alias: 'validDuring' },
				{ column: 'span', alias: 'span' },
			])
			const bound = (edge: string) =>
				`case when isfinite(${edge}("valid_during")) then to_char(${edge}("valid_during"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) else ${edge}("valid_during")::text end`
			expect(select.list).toBe(
				`case when "valid_during" is null then null else json_build_array(lower_inc("valid_during"), ${bound('lower')}, ${bound('upper')}, upper_inc("valid_during"))::text end AS "validDuring", ` +
					`"span"::text AS "span"`
			)
			const rows = [{ validDuring: '[true, "-infinity", "2026-06-01T00:00:00.000000", false]', span: '[1,10)' }]
			select.decodeRows(rows)
			expect(rows).toEqual([
				{
					validDuring: {
						start: { value: '-infinity', inclusive: true },
						end: { value: '2026-06-01T00:00:00.000000', inclusive: false },
					},
					span: { start: { value: 1, inclusive: true }, end: { value: 10, inclusive: false } },
				},
			])
		})
	})

	// The list is spliced into SQL whose placeholders the caller numbers.
	it('refuses a codec whose cast binds a value', () => {
		const boundCast = {
			...TYPES.date,
			castFromPg: (fragment: unknown) => sql`to_char(${fragment as never}, ${sql.value('YYYY')})`,
		}
		const bound = tableCodec('public', 'sc_period', { starts_on: boundCast })
		expect(() =>
			createColumnReader({ bound }, fakeExecutor).select('ScPeriod', [{ column: 'starts_on', alias: 'startsOn' }])
		).toThrow('casts with a bound value')
	})
})
