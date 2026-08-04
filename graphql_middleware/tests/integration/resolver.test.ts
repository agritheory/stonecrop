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
import type { ActionHandler } from '../../src/plugin/postgraphile'
import { loadDoctypesFromObject, clearRegistry } from '../../src/registry/doctypes'

// ---------------------------------------------------------------------------
// Server-side effects, as a database author would register them
// ---------------------------------------------------------------------------
// Keyed [doctype name][action key]. Nothing in the doctypes below names any of these — the
// routing lives here, on the server, which is the whole point of the seam.

/** Records ids `ScItem.publish`'s effect ran against — its return value is empty by design. */
const publishCalls: string[] = []

const actionHandlers: Record<string, Record<string, ActionHandler>> = {
	ScItem: {
		// Real SQL through the request's client, so it runs inside the test's rolled-back
		// transaction like every other write in this file.
		async recalculate({ pgClient, recordId, data, currentState }) {
			const suffix = typeof data.suffix === 'string' ? data.suffix : ''
			const { rows } = await pgClient.query<{ id: number; name: string; status: string }>({
				text: `UPDATE sc_item SET name = upper(name) || $2 WHERE id::text = $1 RETURNING id, name, status`,
				values: [String(recordId), suffix],
			})
			// `seenState` proves the guard's read is handed down rather than re-queried.
			return { ...rows[0], seenState: currentState }
		},
		// Returns nothing on purpose: the assertion is that the doctype's own transition still
		// applies when an effect is present. Because the return is empty, the result payload
		// cannot show that this ran — `publishCalls` is the oracle for that half.
		async publish({ pgClient, recordId }) {
			await pgClient.query({
				text: `UPDATE sc_item SET name = name || ' (published)' WHERE id::text = $1`,
				values: [String(recordId)],
			})
			publishCalls.push(String(recordId))
			return undefined
		},
		explode() {
			return Promise.reject(new Error('handler blew up'))
		},
	},
	ScSignal: {
		// Touches no record and needs no primary key.
		async ping({ pgClient }) {
			const { rows } = await pgClient.query<{ n: number }>({ text: `SELECT count(*)::int AS n FROM sc_item` })
			return { itemCount: rows[0]?.n }
		},
	},
}

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
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'name', component: 'ATextInput', label: 'Name' },
				{ kind: 'field', fieldname: 'status', component: 'ATextInput', label: 'Status' },
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
					// Stateless commands: no nextState, no selfTransition. Only a registered
					// `actionHandlers` entry can make one of these do anything.
					recalculate: { label: 'Recalculate', stateless: true, allowedStates: ['Draft'] },
					unwired: { label: 'Unwired', stateless: true },
					explode: { label: 'Explode', stateless: true },
					// A transition that also carries an effect — the guard/effect split in one action.
					publish: { label: 'Publish', allowedStates: ['Draft'], nextState: 'Active' },
				},
			},
		},
		// No `primaryKey`, and no `sc_signal` table exists. A record-less command must reach its
		// handler anyway: nothing about it consults a key or a row.
		ScSignal: {
			name: 'ScSignal',
			fields: [{ kind: 'field', fieldname: 'label', component: 'ATextInput', label: 'Label' }],
			workflow: {
				actions: {
					ping: { label: 'Ping', stateless: true },
				},
			},
		},
		ScTag: {
			name: 'ScTag',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'label', component: 'ATextInput', label: 'Label' },
				{ kind: 'field', fieldname: 'item_id', component: 'ATextInput', label: 'Item ID' },
			],
		},
		ScNote: {
			name: 'ScNote',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'body', component: 'ATextInput', label: 'Body' },
				{ kind: 'field', fieldname: 'item_id', component: 'ATextInput', label: 'Item ID' },
			],
		},
		ScWidget: {
			name: 'ScWidget',
			fields: [
				{ fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{
					fieldname: 'basicInfo_fieldset',

					component: 'AFieldset',
					schema: [
						{ fieldname: 'itemName', component: 'ATextInput', label: 'Name' },
						{ fieldname: 'itemColor', component: 'ATextInput', label: 'Color' },
					],
				},
			],
		},
		ScPart: {
			name: 'ScPart',
			fields: [
				{ fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ fieldname: 'gadget_id', component: 'ATextInput', label: 'Gadget ID' },
				{ fieldname: 'partName', component: 'ATextInput', label: 'Part Name' },
			],
		},
		ScGadget: {
			name: 'ScGadget',
			fields: [
				{ fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{
					fieldname: 'info_fieldset',

					component: 'AFieldset',
					schema: [
						{ fieldname: 'gadgetName', component: 'ATextInput', label: 'Name' },
						// An expanding reverse relation (noneOrMany + backlink), not a forward FK:
						// there is no `parts` column on sc_gadget, so it must not reach the SELECT.
						{ fieldname: 'parts', component: 'ATable', doctype: 'ScPart' },
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
				{ fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{
					fieldname: 'info_fieldset',

					component: 'AFieldset',
					schema: [
						{ fieldname: 'productName', component: 'ATextInput', label: 'Name' },
						{ fieldname: 'price', component: 'ANumericInput', label: 'Price' },
						{ fieldname: 'priceDisplay', component: 'ATextInput', computed: true, label: 'Formatted Price' },
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
		// Handlers are inert for every action that does not name one, so the transition suites
		// above and below are unaffected by their presence.
		plugins: [createStonecropPlugin({ actionHandlers })],
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
// stonecropAction — server-side effects (actionHandlers)
// ===========================================================================

describe('stonecropAction with registered effects', { tags: ['integration', 'graphql'] }, () => {
	it('executes a stateless command through its registered handler', async () => {
		// `recalculate` declares no nextState and no selfTransition, so the doctype alone gives
		// it nothing to apply. It runs only because the adapter registered an effect for it.
		const result = await runQuery(
			`mutation { stonecropAction(doctype: "ScItem", action: "recalculate", args: [{ id: "1", data: { suffix: "!" } }]) { success data error } }`
		)
		const action = (result as any).data?.stonecropAction
		expect(action?.error).toBeNull()
		expect(action?.success).toBe(true)
		// The handler's SQL really ran against the row ('Alpha' -> 'ALPHA!'), and its return is
		// the payload the client writes back.
		expect(action?.data?.name).toBe('ALPHA!')
		// The record envelope reached the handler, and so did the state the guard had read.
		expect(action?.data?.seenState).toBe('Draft')
	})

	it('refuses the command from a disallowed state without running the handler', async () => {
		// ScItem 2 ('Beta') seeds 'Active'; recalculate is allowed only from 'Draft'. If the
		// handler had run, `name` would come back uppercased.
		const result = await runQuery(
			`mutation { stonecropAction(doctype: "ScItem", action: "recalculate", args: [{ id: "2" }]) { success data error } }`
		)
		const action = (result as any).data?.stonecropAction
		expect(action?.success).toBe(false)
		expect(action?.error).toContain('not allowed')
		expect(action?.data).toBeNull()

		const after = await runQuery(`query { stonecropRecord(doctype: "ScItem", id: "2") { data } }`)
		expect((after as any).data?.stonecropRecord?.data?.name).toBe('Beta')
	})

	it('applies the doctype transition as well when the action carries both', async () => {
		// `publish` has a nextState AND a handler, so both halves must be observed: the state
		// payload proves the transition was not displaced, and `publishCalls` proves the effect
		// ran (its empty return leaves no trace in the payload).
		publishCalls.length = 0
		const result = await runQuery(
			`mutation { stonecropAction(doctype: "ScItem", action: "publish", args: [{ id: "1" }]) { success data error } }`
		)
		const action = (result as any).data?.stonecropAction
		expect(action?.success).toBe(true)
		expect(action?.data?.state).toBe('Active')
		expect(publishCalls).toEqual(['1'])
	})

	it('reports a throwing handler as a failed action, naming it', async () => {
		const result = await runQuery(
			`mutation { stonecropAction(doctype: "ScItem", action: "explode", args: [{ id: "1" }]) { success data error } }`
		)
		const action = (result as any).data?.stonecropAction
		expect(action?.success).toBe(false)
		expect(action?.error).toContain('Explode')
		expect(action?.error).toContain('handler blew up')
	})

	it('still fails loudly for a command with no handler registered', async () => {
		// The control for the first case: same shape, no registration. The error names both
		// repairs because the two live with different authors.
		const result = await runQuery(
			`mutation { stonecropAction(doctype: "ScItem", action: "unwired", args: [{ id: "1" }]) { success error } }`
		)
		const action = (result as any).data?.stonecropAction
		expect(action?.success).toBe(false)
		expect(action?.error).toContain('nothing was executed')
		expect(action?.error).toContain('register a server-side handler')
	})

	it('runs a record-less command on a doctype with no primary key and no table', async () => {
		// ScSignal declares no `primaryKey` and `sc_signal` does not exist. Neither matters:
		// nothing about this action reads or writes a row, so nothing resolves a key column.
		const result = await runQuery(
			`mutation { stonecropAction(doctype: "ScSignal", action: "ping") { success data error } }`
		)
		const action = (result as any).data?.stonecropAction
		expect(action?.error).toBeNull()
		expect(action?.success).toBe(true)
		expect(action?.data?.itemCount).toBe(3)
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
