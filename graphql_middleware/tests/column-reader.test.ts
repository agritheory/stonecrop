import type { PgCodec, PgExecutor } from '@dataplan/pg'
import { LIST_TYPES, TYPES, domainOfCodec, listOfCodec } from '@dataplan/pg'
import { sql } from 'postgraphile/pg-sql2'
import { describe, it, expect } from 'vitest'

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

	// The list is spliced into SQL whose placeholders the caller numbers.
	it('refuses a codec whose cast binds a value', () => {
		const boundCast = {
			...TYPES.date,
			castFromPg: (fragment: unknown) => sql`to_char(${fragment as never}, ${sql.value('YYYY')})`,
		}
		const bound = tableCodec('public', 'sc_period', { starts_on: boundCast as unknown as PgCodec })
		expect(() =>
			createColumnReader({ bound }, fakeExecutor).select('ScPeriod', [{ column: 'starts_on', alias: 'startsOn' }])
		).toThrow('casts with a bound value')
	})
})
