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
import { clearHandlers } from '../../src/registry/actions'

// ---------------------------------------------------------------------------
// Per-suite setup
// ---------------------------------------------------------------------------

let pool: Pool
let schema: GraphQLSchema
let resolvedPreset: GraphileConfig.ResolvedPreset
let releasePgService: (() => void | PromiseLike<void>) | undefined

beforeAll(async () => {
	const databaseUrl = inject('testDatabaseUrl')

	loadDoctypesFromObject({
		ScItem: {
			name: 'ScItem',
			fields: [
				{ kind: 'field', fieldname: 'id', fieldtype: 'PrimaryKey', label: 'ID' },
				{ kind: 'field', fieldname: 'name', fieldtype: 'Data', label: 'Name' },
				{ kind: 'field', fieldname: 'status', fieldtype: 'Data', label: 'Status' },
			],
			links: {
				tags: {
					target: 'ScTag',
					cardinality: 'noneOrMany' as const,
					backlink: 'item_id',
					fetch: { method: 'sync' as const },
				},
				notes: {
					target: 'ScNote',
					cardinality: 'noneOrMany' as const,
					backlink: 'item_id',
					fetch: { method: 'lazy' as const },
				},
			},
			workflow: {
				states: ['Draft', 'Active'],
				actions: {
					submit: { label: 'Submit', allowedStates: ['Draft'], nextState: 'Active' },
				},
			},
		},
		ScTag: {
			name: 'ScTag',
			fields: [
				{ kind: 'field', fieldname: 'id', fieldtype: 'PrimaryKey', label: 'ID' },
				{ kind: 'field', fieldname: 'label', fieldtype: 'Data', label: 'Label' },
				{ kind: 'field', fieldname: 'item_id', fieldtype: 'Data', label: 'Item ID' },
			],
		},
		ScNote: {
			name: 'ScNote',
			fields: [
				{ kind: 'field', fieldname: 'id', fieldtype: 'PrimaryKey', label: 'ID' },
				{ kind: 'field', fieldname: 'body', fieldtype: 'Data', label: 'Body' },
				{ kind: 'field', fieldname: 'item_id', fieldtype: 'Data', label: 'Item ID' },
			],
		},
		ScWidget: {
			name: 'ScWidget',
			fields: [
				{ fieldname: 'id', fieldtype: 'PrimaryKey', label: 'ID' },
				{
					fieldname: 'basicInfo_fieldset',
					fieldtype: 'Fieldset',
					component: 'AFieldset',
					schema: [
						{ fieldname: 'itemName', fieldtype: 'Data', label: 'Name' },
						{ fieldname: 'itemColor', fieldtype: 'Data', label: 'Color' },
					],
				},
			],
		},
		ScPart: {
			name: 'ScPart',
			fields: [
				{ fieldname: 'id', fieldtype: 'PrimaryKey', label: 'ID' },
				{ fieldname: 'gadget_id', fieldtype: 'Data', label: 'Gadget ID' },
				{ fieldname: 'partName', fieldtype: 'Data', label: 'Part Name' },
			],
		},
		ScGadget: {
			name: 'ScGadget',
			fields: [
				{ fieldname: 'id', fieldtype: 'PrimaryKey', label: 'ID' },
				{
					fieldname: 'info_fieldset',
					fieldtype: 'Fieldset',
					component: 'AFieldset',
					schema: [
						{ fieldname: 'gadgetName', fieldtype: 'Data', label: 'Name' },
						{ fieldname: 'parts', fieldtype: 'Link', options: 'ScPart' },
					],
				},
			],
			links: {
				parts: {
					target: 'ScPart',
					cardinality: 'noneOrMany' as const,
					backlink: 'gadget_id',
					fetch: { method: 'sync' as const },
				},
			},
		},
		ScProduct: {
			name: 'ScProduct',
			fields: [
				{ fieldname: 'id', fieldtype: 'PrimaryKey', label: 'ID' },
				{
					fieldname: 'info_fieldset',
					fieldtype: 'Fieldset',
					component: 'AFieldset',
					schema: [
						{ fieldname: 'productName', fieldtype: 'Data', label: 'Name' },
						{ fieldname: 'price', fieldtype: 'Int', label: 'Price' },
						{ fieldname: 'priceDisplay', fieldtype: 'Display', label: 'Formatted Price' },
					],
				},
			],
		},
	})

	pool = new Pool({ connectionString: databaseUrl, max: 1 })

	const pgService = makePgService({ connectionString: databaseUrl })
	releasePgService = pgService.release
	const result = await makeSchema({
		extends: [PostGraphileAmberPreset],
		plugins: [createStonecropPlugin()],
		pgServices: [pgService],
	})
	schema = result.schema
	resolvedPreset = result.resolvedPreset
}, 60_000)

afterAll(async () => {
	clearRegistry()
	clearHandlers()
	await pool?.end()
	await releasePgService?.()
})

// ---------------------------------------------------------------------------
// Helper: run a GraphQL query inside a rolled-back transaction
// ---------------------------------------------------------------------------

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
		// Override the pool-based withPgClient with our in-transaction version so all
		// SQL runs inside one rollback-able transaction.
		args.contextValue.withPgClient = withPgClient
		queryResult = (await execute(args)) as Record<string, unknown>
	} finally {
		try {
			await client.query('ROLLBACK')
		} catch {
			// If ROLLBACK itself fails the connection is in an unknown state; discard it.
			// Return the already-fetched result rather than losing it.
			client.release(new Error('rollback failed'))
		}
		client.release()
	}
	return queryResult
}

// ===========================================================================
// stonecropRecord
// ===========================================================================

describe('stonecropRecord', { tags: ['integration', 'graphql'] }, () => {
	it('fetches a record by id', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScItem", id: "1") { doctype data } }`)
		const record = (result as any).data?.stonecropRecord
		expect(record?.doctype).toBe('ScItem')
		expect(record?.data?.name).toBe('Alpha')
	})

	it('returns null data for a missing id', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScItem", id: "9999") { doctype data } }`)
		const record = (result as any).data?.stonecropRecord
		expect(record?.data).toBeNull()
	})

	it('includes sync-linked records when strategy is sync', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScItem", id: "1") { data } }`)
		const data = (result as any).data?.stonecropRecord?.data
		expect(Array.isArray(data?.tags)).toBe(true)
		expect(data.tags.length).toBe(2)
		expect(data.tags[0].label).toBe('urgent')
	})

	it('returns unknownLinks for requested links not in doctype', async () => {
		const result = await runQuery(
			`query { stonecropRecord(doctype: "ScItem", id: "1", options: { includeNested: ["missing"] }) { data unknownLinks } }`
		)
		const record = (result as any).data?.stonecropRecord
		expect(record?.unknownLinks).toContain('missing')
	})
})

// ===========================================================================
// stonecropRecords
// ===========================================================================

describe('stonecropRecords', { tags: ['integration', 'graphql'] }, () => {
	it('returns all records when no filters given', async () => {
		const result = await runQuery(`query { stonecropRecords(doctype: "ScItem") { count data } }`)
		const records = (result as any).data?.stonecropRecords
		expect(records?.count).toBe(3)
		expect(records?.data.length).toBe(3)
	})

	it('filters by a field value', async () => {
		const result = await runQuery(
			`query { stonecropRecords(doctype: "ScItem", filters: { status: "Active" }) { count data } }`
		)
		const records = (result as any).data?.stonecropRecords
		expect(records?.count).toBe(1)
		expect(records?.data[0].name).toBe('Beta')
	})

	it('respects limit and offset', async () => {
		const result = await runQuery(`query { stonecropRecords(doctype: "ScItem", limit: 1, offset: 1) { count data } }`)
		const records = (result as any).data?.stonecropRecords
		expect(records?.data.length).toBe(1)
		// count reflects the total, not the page size
		expect(typeof records?.count).toBe('number')
	})

	it('orders results by a column', async () => {
		const result = await runQuery(`query { stonecropRecords(doctype: "ScItem", orderBy: "name_DESC") { data } }`)
		const data = (result as any).data?.stonecropRecords?.data
		expect(data[0].name).toBe('Gamma')
	})
})

// ===========================================================================
// Lazy link retrieval
// ===========================================================================

describe('lazy link retrieval via stonecropRecords', { tags: ['integration', 'graphql'] }, () => {
	it('does not include lazy links in stonecropRecord by default', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScItem", id: "1") { data } }`)
		const data = (result as any).data?.stonecropRecord?.data
		// 'notes' is declared lazy; it should not be present in the default fetch
		expect(data).not.toHaveProperty('notes')
	})

	it('retrieves lazy-linked records via stonecropRecords with backlink filter', async () => {
		// Simulate a client-side lazy load: fetch notes for item 1 via backlink filter
		const result = await runQuery(
			`query { stonecropRecords(doctype: "ScNote", filters: { item_id: "1" }) { count data } }`
		)
		const records = (result as any).data?.stonecropRecords
		expect(records?.count).toBe(2)
		expect(records?.data.length).toBe(2)
		expect(records?.data.map((n: any) => n.body).toSorted()).toEqual(['First note', 'Second note'])
	})

	it('lazy link data matches what sync-fetch would have merged', async () => {
		// Fetch item 1 with explicit includeNested to force notes inclusion
		const syncResult = await runQuery(
			`query { stonecropRecord(doctype: "ScItem", id: "1", options: { includeNested: ["notes"] }) { data } }`
		)
		const syncData = (syncResult as any).data?.stonecropRecord?.data

		// Fetch same data lazily
		const lazyResult = await runQuery(
			`query { stonecropRecords(doctype: "ScNote", filters: { item_id: "1" }) { data } }`
		)
		const lazyData = (lazyResult as any).data?.stonecropRecords?.data

		// The data contents should match
		expect(syncData?.notes?.map((n: any) => n.body).toSorted()).toEqual(lazyData?.map((n: any) => n.body).toSorted())
	})
})

// ===========================================================================
// stonecropAction
// ===========================================================================

describe('stonecropAction', { tags: ['integration', 'graphql'] }, () => {
	it('applies the guarded transition when the action is allowed in the current state', async () => {
		// ScItem 1 ('Alpha') seeds in 'Draft'; submit is allowed from Draft and lands in Active.
		const result = await runQuery(
			`mutation { stonecropAction(doctype: "ScItem", action: "submit", args: [{ id: "1" }]) { success data error } }`
		)
		const action = (result as any).data?.stonecropAction
		expect(action?.success).toBe(true)
		expect(action?.data?.state).toBe('Active')
		expect(action?.error).toBeNull()
	})

	it('rejects the action when the current state is not in allowedStates', async () => {
		// ScItem 2 ('Beta') seeds in 'Active'; submit is only allowed from 'Draft', so the
		// server must refuse the transition — the guard is the security boundary, not the client.
		const result = await runQuery(
			`mutation { stonecropAction(doctype: "ScItem", action: "submit", args: [{ id: "2" }]) { success error } }`
		)
		const action = (result as any).data?.stonecropAction
		expect(action?.success).toBe(false)
		expect(action?.error).toContain('not allowed')
	})

	it('returns error for an unknown action', async () => {
		const result = await runQuery(
			`mutation { stonecropAction(doctype: "ScItem", action: "nonexistent") { success error } }`
		)
		const action = (result as any).data?.stonecropAction
		expect(action?.success).toBe(false)
		expect(typeof action?.error).toBe('string')
	})
})

// ===========================================================================
// stonecropMeta
// ===========================================================================

describe('stonecropMeta', { tags: ['integration', 'graphql'] }, () => {
	it('returns doctype metadata', async () => {
		const result = await runQuery(`query { stonecropMeta(doctype: "ScItem") { name slug } }`)
		const meta = (result as any).data?.stonecropMeta
		expect(meta?.name).toBe('ScItem')
	})

	it('returns null for unknown doctype', async () => {
		const result = await runQuery(`query { stonecropMeta(doctype: "DoesNotExist") { name } }`)
		expect((result as any).data?.stonecropMeta).toBeNull()
	})
})

// ===========================================================================
// Fieldset container fields
// ===========================================================================

describe('Fieldset container fields', { tags: ['integration', 'graphql'] }, () => {
	it('fetches records and returns fieldset child data', async () => {
		const result = await runQuery(`query { stonecropRecords(doctype: "ScWidget") { data } }`)
		const records = (result as any).data?.stonecropRecords
		expect((result as any).errors).toBeUndefined()
		expect(records?.data).toHaveLength(2)
		expect(records?.data[0].itemName).toBe('Widget A')
		expect(records?.data[0].itemColor).toBe('blue')
	})

	it('fetches a single record with fieldset children via stonecropRecord', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScWidget", id: "1") { data } }`)
		expect((result as any).errors).toBeUndefined()
		const data = (result as any).data?.stonecropRecord?.data
		expect(data?.itemName).toBe('Widget A')
		expect(data?.itemColor).toBe('blue')
	})

	it('filters records by a fieldset child field', async () => {
		const result = await runQuery(
			`query { stonecropRecords(doctype: "ScWidget", filters: { itemColor: "blue" }) { data } }`
		)
		expect((result as any).errors).toBeUndefined()
		const records = (result as any).data?.stonecropRecords
		expect(records?.data).toHaveLength(1)
		expect(records?.data[0].itemName).toBe('Widget A')
	})

	it('orders records by a fieldset child field', async () => {
		const result = await runQuery(`query { stonecropRecords(doctype: "ScWidget", orderBy: "itemName_DESC") { data } }`)
		expect((result as any).errors).toBeUndefined()
		const data = (result as any).data?.stonecropRecords?.data
		expect(data[0].itemName).toBe('Widget B')
		expect(data[1].itemName).toBe('Widget A')
	})

	it('excludes Link fields inside a fieldset from the SELECT column list', async () => {
		// ScGadget has a `parts` Link field nested inside a Fieldset.
		// If collectColumns incorrectly includes it, this query throws
		// "column parts does not exist" — it should return cleanly instead.
		const result = await runQuery(`query { stonecropRecords(doctype: "ScGadget") { data } }`)
		expect((result as any).errors).toBeUndefined()
		const records = (result as any).data?.stonecropRecords
		expect(records?.data[0].gadgetName).toBe('Gadget One')
		expect(records?.data[0].parts).toBeUndefined()
	})

	it('excludes Display fields inside a fieldset from the SELECT column list', async () => {
		// ScProduct has a `priceDisplay` Display field inside a Fieldset.
		// sc_product has no price_display column — if collectColumns includes Display fields,
		// this throws "column price_display does not exist".
		const result = await runQuery(`query { stonecropRecords(doctype: "ScProduct") { data } }`)
		expect((result as any).errors).toBeUndefined()
		const records = (result as any).data?.stonecropRecords
		expect(records?.data).toHaveLength(1)
		expect(records?.data[0].productName).toBe('Product A')
		expect(records?.data[0].price).toBe(100)
		expect(records?.data[0].priceDisplay).toBeUndefined()
	})

	it('rejects a filter by fieldset container name', async () => {
		// basicInfo_fieldset is a Fieldset container in ScWidget — it has no DB column.
		// knownFields must be built from flattenFields so container names are never
		// accepted as filter fields. Before the fix, this would attempt a WHERE clause
		// on a non-existent column.
		const result = await runQuery(
			`query { stonecropRecords(doctype: "ScWidget", filters: { basicInfo_fieldset: "anything" }) { data } }`
		)
		const errors = (result as any).errors
		expect(errors).toBeDefined()
		expect(errors[0].message).toContain('Unknown filter field')
	})
})
