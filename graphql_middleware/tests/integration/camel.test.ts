import { parse } from 'graphql'
import type { GraphQLSchema } from 'graphql'
import type { GraphileConfig } from 'postgraphile/graphile-build'
import { Pool, type PoolClient } from 'pg'
import { makeSchema } from 'postgraphile'
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { execute, hookArgs } from 'postgraphile/grafast'
import { makePgService, makeWithPgClientViaPgClientAlreadyInTransaction } from 'postgraphile/adaptors/pg'
import { describe, it, expect, beforeAll, afterAll, inject } from 'vitest'

import { createStonecropPlugin } from '../../src/plugin/postgraphile'
import { loadDoctypesFromObject, clearRegistry } from '../../src/registry/doctypes'

let pool: Pool
let schema: GraphQLSchema
let resolvedPreset: GraphileConfig.ResolvedPreset
let releasePgService: (() => void | PromiseLike<void>) | undefined

beforeAll(async () => {
	const databaseUrl = inject('camelTestDatabaseUrl')

	loadDoctypesFromObject({
		ScCamelItem: {
			name: 'ScCamelItem',
			fields: [
				{ kind: 'field', fieldname: 'itemId', component: 'ATextInput', primaryKey: true, label: 'Item ID' },
				{ kind: 'field', fieldname: 'displayName', component: 'ATextInput', label: 'Display Name' },
				{ kind: 'field', fieldname: 'itemStatus', component: 'ATextInput', label: 'Item Status' },
			],
			links: {
				tags: {
					target: 'ScCamelTag',
					cardinality: 'noneOrMany' as const,
					backlink: 'camelItemId',
					fetch: { method: 'sync' as const },
				},
			},
		},
		ScCamelTag: {
			name: 'ScCamelTag',
			fields: [
				{ kind: 'field', fieldname: 'tagId', component: 'ATextInput', primaryKey: true, label: 'Tag ID' },
				{ kind: 'field', fieldname: 'tagLabel', component: 'ATextInput', label: 'Tag Label' },
				{ kind: 'field', fieldname: 'camelItemId', component: 'ATextInput', label: 'Camel Item ID' },
			],
		},
		// No `primaryKey` and no `id` field, so no identity can be resolved at all — note this is
		// distinct from declaring no key over a table that has `id`, which resolves through the
		// documented fallback. `stonecropRecord` must refuse this one by name.
		ScNoPk: {
			name: 'ScNoPk',
			fields: [
				{ kind: 'field', fieldname: 'body', component: 'ATextInput', label: 'Body' },
				{ kind: 'field', fieldname: 'item_id', component: 'ATextInput', label: 'Item ID' },
			],
		},
	})

	pool = new Pool({ connectionString: databaseUrl, max: 1 })
	const pgService = makePgService({ connectionString: databaseUrl })
	releasePgService = pgService.release
	const result = await makeSchema({
		extends: [PostGraphileAmberPreset],
		plugins: [createStonecropPlugin({ tables: { ScNoPk: 'sc_note' } })],
		pgServices: [pgService],
	})
	schema = result.schema
	resolvedPreset = result.resolvedPreset
}, 60_000)

afterAll(async () => {
	clearRegistry()
	await pool?.end()
	await releasePgService?.()
})

async function runQuery(query: string, variables?: Record<string, unknown>): Promise<Record<string, unknown>> {
	const client: PoolClient = await pool.connect()
	await client.query('BEGIN')
	let queryResult: Record<string, unknown> = {}
	try {
		const withPgClient = makeWithPgClientViaPgClientAlreadyInTransaction(client, true)
		const args = await hookArgs({
			schema,
			document: parse(query),
			variableValues: variables ?? {},
			contextValue: Object.create(null) as Record<string, unknown>,
			resolvedPreset,
			requestContext: {},
		})
		args.contextValue.withPgClient = withPgClient
		queryResult = (await execute(args)) as Record<string, unknown>
	} finally {
		try {
			await client.query('ROLLBACK')
		} catch {
			client.release(new Error('rollback failed'))
		}
		client.release()
	}
	return queryResult
}

// ===========================================================================
// Column aliasing: fieldname keys in response, not raw DB column names
// ===========================================================================

describe('stonecropRecord — camelCase fieldnames', { tags: ['integration', 'graphql'] }, () => {
	it('returns row keyed by fieldnames (camelCase), not raw DB column names', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScCamelItem", id: "1") { doctype data } }`)
		const record = (result as any).data?.stonecropRecord
		expect(record?.doctype).toBe('ScCamelItem')
		const data = record?.data as Record<string, unknown>
		expect(data).not.toBeNull()
		// Fieldname keys must be present
		expect(data?.displayName).toBe('Alpha')
		expect(data?.itemStatus).toBe('Draft')
		expect(data?.itemId).toBeDefined()
		// Raw DB column names must NOT be present
		expect(data?.display_name).toBeUndefined()
		expect(data?.item_status).toBeUndefined()
		expect(data?.item_id).toBeUndefined()
	})

	it('returns null data for a missing id', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScCamelItem", id: "9999") { doctype data } }`)
		const record = (result as any).data?.stonecropRecord
		expect(record?.data).toBeNull()
	})

	it('errors when the doctype declares neither a primaryKey nor an `id` field', async () => {
		// This used to answer `data: null` — the same shape as a record that does not exist. It is
		// the sharpest case for why that was wrong: `sc_note` *does* have an `id` column, but the
		// doctype never declares it, so `getSqlColumns` would not select it and every lookup would
		// miss against a column that was right there. Declaring `id`, or a `primaryKey`, is the fix,
		// and the error has to say so.
		const result = await runQuery(`query { stonecropRecord(doctype: "ScNoPk", id: "1") { doctype data } }`)
		expect((result as any).data?.stonecropRecord).toBeNull()
		expect(String((result as any).errors?.[0]?.message ?? '')).toContain('ScNoPk')
	})
})

// ===========================================================================
// Backlink camelToSnake: camelCase backlink fieldname resolves to snake_case column
// ===========================================================================

describe('stonecropRecord — camelCase backlink', { tags: ['integration', 'graphql'] }, () => {
	it('populates sync-linked records via camelCase backlink fieldname', async () => {
		const result = await runQuery(
			`query { stonecropRecord(doctype: "ScCamelItem", id: "1", options: { includeNested: true }) { data } }`
		)
		const data = (result as any).data?.stonecropRecord?.data
		expect(Array.isArray(data?.tags)).toBe(true)
		expect(data.tags.length).toBe(2)
	})

	it('tag rows carry fieldname keys (camelCase), not raw DB column names', async () => {
		const result = await runQuery(
			`query { stonecropRecord(doctype: "ScCamelItem", id: "1", options: { includeNested: true }) { data } }`
		)
		const tags = (result as any).data?.stonecropRecord?.data?.tags as Array<Record<string, unknown>>
		const first = tags?.[0]
		expect(first?.tagLabel).toBe('urgent')
		expect(first?.camelItemId).toBeDefined()
		// Raw DB column names must NOT be present
		expect(first?.tag_label).toBeUndefined()
		expect(first?.camel_item_id).toBeUndefined()
	})
})

// ===========================================================================
// stonecropRecords — camelCase filter and orderBy
// ===========================================================================

describe('stonecropRecords — camelCase fieldnames', { tags: ['integration', 'graphql'] }, () => {
	it('returns all records', async () => {
		const result = await runQuery(`query { stonecropRecords(doctype: "ScCamelItem") { count data } }`)
		const records = (result as any).data?.stonecropRecords
		expect(records?.count).toBe(2)
		expect(records?.data.length).toBe(2)
	})

	it('filters by a camelCase fieldname', async () => {
		const result = await runQuery(
			`query { stonecropRecords(doctype: "ScCamelItem", filters: { displayName: "Alpha" }) { count data } }`
		)
		const records = (result as any).data?.stonecropRecords
		expect(records?.count).toBe(1)
		expect(records?.data[0]?.displayName).toBe('Alpha')
	})

	it('orders by a camelCase fieldname ascending', async () => {
		const result = await runQuery(
			`query { stonecropRecords(doctype: "ScCamelItem", orderBy: "displayName_ASC") { data } }`
		)
		const data = (result as any).data?.stonecropRecords?.data as Array<Record<string, unknown>>
		expect(data[0]?.displayName).toBe('Alpha')
		expect(data[1]?.displayName).toBe('Beta')
	})

	it('orders by a camelCase fieldname descending', async () => {
		const result = await runQuery(
			`query { stonecropRecords(doctype: "ScCamelItem", orderBy: "displayName_DESC") { data } }`
		)
		const data = (result as any).data?.stonecropRecords?.data as Array<Record<string, unknown>>
		expect(data[0]?.displayName).toBe('Beta')
		expect(data[1]?.displayName).toBe('Alpha')
	})

	it('result rows carry fieldname keys (camelCase), not raw DB column names', async () => {
		const result = await runQuery(`query { stonecropRecords(doctype: "ScCamelItem") { data } }`)
		const row = ((result as any).data?.stonecropRecords?.data as Array<Record<string, unknown>>)?.[0]
		expect(row?.displayName).toBeDefined()
		expect(row?.itemStatus).toBeDefined()
		expect(row?.display_name).toBeUndefined()
		expect(row?.item_status).toBeUndefined()
	})
})
