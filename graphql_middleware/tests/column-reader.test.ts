import type { PgCodec, PgExecutor } from '@dataplan/pg'
import { TYPES } from '@dataplan/pg'
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
