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
		// Writes first, then fails. The write is the oracle for rollback: without a transaction
		// around the action it stays committed even though the action reports failure.
		async writeThenExplode({ pgClient, recordId }) {
			await pgClient.query({
				text: `UPDATE sc_item SET name = 'SHOULD NOT SURVIVE' WHERE id::text = $1`,
				values: [String(recordId)],
			})
			throw new Error('blew up after writing')
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
let cappedSchema: GraphQLSchema
let cappedResolvedPreset: GraphileConfig.ResolvedPreset
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
					// The self-transition: persists field data in place, and creates the record
					// when there is none. No `allowedStates` — a save is allowed from any state,
					// and a record being created is in none.
					save: { label: 'Save', selfTransition: true },
					// Stateless commands: no nextState, no selfTransition. Only a registered
					// `actionHandlers` entry can make one of these do anything.
					recalculate: { label: 'Recalculate', stateless: true, allowedStates: ['Draft'] },
					unwired: { label: 'Unwired', stateless: true },
					explode: { label: 'Explode', stateless: true },
					writeThenExplode: { label: 'Write Then Explode', stateless: true },
					// A transition that also carries an effect — the guard/effect split in one action.
					publish: { label: 'Publish', allowedStates: ['Draft'], nextState: 'Active' },
				},
			},
		},
		// Backed by sc_draft, whose single row has `status` NULL. `start` declares no
		// `allowedStates`, so it is allowed from any state — including none at all. That makes it
		// the control against a missing record, which must be refused despite the same absent guard.
		ScDraft: {
			name: 'ScDraft',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'name', component: 'ATextInput', label: 'Name' },
				{ kind: 'field', fieldname: 'status', component: 'ATextInput', label: 'Status' },
			],
			workflow: {
				states: ['Draft', 'Active'],
				actions: {
					start: { label: 'Start', nextState: 'Active' },
				},
			},
		},
		// Declares no `primaryKey` but carries an `id` field, which is what a surrogate-keyed
		// doctype looks like — the shape `getRecordIdField`'s `id` fallback exists for. Backed by
		// sc_draft through the `tables` override so it can be read without a second table.
		ScSurrogate: {
			name: 'ScSurrogate',
			// The only fixture here with a slug, so it is what exercises the handler-registration
			// check's slug branch: `getMeta` matches a slug, but dispatch looks handlers up by name.
			slug: 'sc-surrogate',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', label: 'ID' },
				{ kind: 'field', fieldname: 'name', component: 'ATextInput', label: 'Name' },
				{ kind: 'field', fieldname: 'status', component: 'ATextInput', label: 'Status' },
			],
		},
		// Declares `item_id` as its identity over sc_note, where two rows share item_id = 1. The
		// column is a plain FK with no unique constraint, which is what a mis-declared natural key
		// looks like in practice — nothing in the schema refuses it, and a lookup silently returns
		// whichever of the two rows came last.
		ScAmbiguous: {
			name: 'ScAmbiguous',
			fields: [
				{ kind: 'field', fieldname: 'item_id', component: 'ATextInput', primaryKey: true, label: 'Item ID' },
				{ kind: 'field', fieldname: 'body', component: 'ATextInput', label: 'Body' },
			],
		},
		// No `primaryKey`, no `id` field, and no `sc_signal` table exists. A record-less command
		// must reach its handler anyway: nothing about it consults a key or a row. It doubles as
		// the doctype whose identity genuinely cannot be resolved — see stonecropRecord below.
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
		// One-side link fixtures. Both map onto sc_tag (id, label, item_id -> sc_item.id), which
		// differ only in render mode — the axis the expansion loop has to respect.
		ScLinkExpand: {
			name: 'ScLinkExpand',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'label', component: 'ATextInput', label: 'Label' },
				{ kind: 'field', fieldname: 'itemId', component: 'ATextInput', label: 'Item' },
			],
			links: {
				// `component: AForm` makes this expand, so `getSqlColumns` omits item_id from the
				// payload SELECT — and the expansion still has to find the value somewhere.
				itemId: {
					target: 'ScItem',
					cardinality: 'one' as const,
					component: 'AForm',
					fetch: { method: 'sync' as const },
				},
			},
			// Present so the write path can be pointed at an expanding link, whose read value is a
			// nested record while its column holds a scalar foreign key.
			workflow: { actions: { save: { label: 'Save', selfTransition: true } } },
		},
		ScLinkInline: {
			name: 'ScLinkInline',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'label', component: 'ATextInput', label: 'Label' },
				// AFormLink is a picker: the field keeps its own id and must survive the read.
				{ kind: 'field', fieldname: 'itemId', component: 'AFormLink', label: 'Item' },
			],
			links: {
				itemId: { target: 'ScItem', cardinality: 'one' as const, fetch: { method: 'sync' as const } },
			},
		},
		// The declaration names its own `fieldname`, so the map key and the bound field differ —
		// the one shape where `link.fieldname ?? key` is not a tautology.
		ScLinkAliased: {
			name: 'ScLinkAliased',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'label', component: 'ATextInput', label: 'Label' },
				{ kind: 'field', fieldname: 'itemId', component: 'ATextInput', label: 'Item' },
			],
			links: {
				item: {
					target: 'ScItem',
					cardinality: 'one' as const,
					component: 'AForm',
					fieldname: 'itemId',
					fetch: { method: 'sync' as const },
				},
			},
		},
		// No `fetch`, so a one-side link defaults to `lazy` — the only shape that can tell the two
		// forms of `includeNested` apart.
		ScLinkLazy: {
			name: 'ScLinkLazy',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'label', component: 'ATextInput', label: 'Label' },
				{ kind: 'field', fieldname: 'itemId', component: 'ATextInput', label: 'Item' },
			],
			links: {
				itemId: { target: 'ScItem', cardinality: 'one' as const, component: 'AForm' },
			},
		},
		// Row-cap fixtures. Three doctypes over the one 64-child table, differing only in how the
		// link declares its fetch — which is the axis the cap used to key off by accident.
		ScBulkChild: {
			name: 'ScBulkChild',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'label', component: 'ATextInput', label: 'Label' },
				{ kind: 'field', fieldname: 'bulk_id', component: 'ATextInput', label: 'Bulk ID' },
			],
		},
		// Declares no `fetch` at all. A many-side link defaults to `sync`, so this and ScBulkSync
		// below resolve to the same strategy and must read the same rows.
		ScBulk: {
			name: 'ScBulk',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'name', component: 'ATextInput', label: 'Name' },
			],
			links: {
				children: { target: 'ScBulkChild', cardinality: 'noneOrMany' as const, backlink: 'bulk_id' },
			},
		},
		ScBulkSync: {
			name: 'ScBulkSync',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'name', component: 'ATextInput', label: 'Name' },
			],
			links: {
				children: {
					target: 'ScBulkChild',
					cardinality: 'noneOrMany' as const,
					backlink: 'bulk_id',
					fetch: { method: 'sync' as const },
				},
			},
		},
		// An author-declared cap, under a key that differs from the field it binds — so what the
		// truncation report names is unambiguous rather than accidentally identical.
		ScBulkCapped: {
			name: 'ScBulkCapped',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'name', component: 'ATextInput', label: 'Name' },
			],
			links: {
				kids: {
					target: 'ScBulkChild',
					cardinality: 'noneOrMany' as const,
					backlink: 'bulk_id',
					fieldname: 'children',
					fetch: { method: 'sync' as const, limit: 10 },
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
		ScParty: {
			name: 'ScParty',
			slug: 'sc-party',
			displayField: 'partyName',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'partyName', component: 'ATextInput', label: 'Party Name' },
			],
		},
		ScOrder: {
			name: 'ScOrder',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{
					kind: 'field',
					fieldname: 'customerId',
					component: 'AFormLink',
					doctype: 'sc-party',
					label: 'Customer',
				},
				{ kind: 'field', fieldname: 'title', component: 'ATextInput', label: 'Title' },
			],
			// Present so the read shape and the write shape can be compared on one doctype that
			// carries an inline link.
			workflow: { actions: { save: { label: 'Save', selfTransition: true } } },
		},
		// Reads sc_party, expanding its orders. The expanded ScOrder rows carry `customerId`,
		// an inline link — so a nested record is a place enrichment has to reach as well.
		ScPartyWithOrders: {
			name: 'ScPartyWithOrders',
			displayField: 'partyName',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
				{ kind: 'field', fieldname: 'partyName', component: 'ATextInput', label: 'Party Name' },
			],
			links: {
				orders: {
					target: 'ScOrder',
					cardinality: 'noneOrMany' as const,
					backlink: 'customerId',
					component: 'ATable',
					fetch: { method: 'sync' as const },
				},
			},
		},
	})

	pool = new Pool({ connectionString: databaseUrl, max: 1 })

	const pgService = makePgService({ connectionString: databaseUrl })
	releasePgService = pgService.release
	const result = await makeSchema({
		extends: [PostGraphileAmberPreset],
		// Handlers are inert for every action that does not name one, so the transition suites
		// above and below are unaffected by their presence.
		plugins: [
			createStonecropPlugin({
				actionHandlers,
				tables: {
					ScSurrogate: 'sc_draft',
					ScAmbiguous: 'sc_note',
					ScLinkExpand: 'sc_tag',
					ScLinkInline: 'sc_tag',
					ScLinkAliased: 'sc_tag',
					ScLinkLazy: 'sc_tag',
					ScBulkSync: 'sc_bulk',
					ScBulkCapped: 'sc_bulk',
					ScPartyWithOrders: 'sc_party',
				},
			}),
		],
		pgServices: [pgService],
	})
	schema = result.schema
	resolvedPreset = result.resolvedPreset

	// A second schema whose only difference is a deliberately tiny default row cap. Building it
	// here rather than in its own file keeps the single PGlite instance this file already owns.
	const cappedResult = await makeSchema({
		extends: [PostGraphileAmberPreset],
		plugins: [createStonecropPlugin({ actionHandlers, defaultRecordLimit: 1 })],
		pgServices: [pgService],
	})
	cappedSchema = cappedResult.schema
	cappedResolvedPreset = cappedResult.resolvedPreset
}, 60_000)

afterAll(async () => {
	clearRegistry()
	await pool?.end()
	await releasePgService?.()
})

// ---------------------------------------------------------------------------
// Helper: run a GraphQL query inside a rolled-back transaction
// ---------------------------------------------------------------------------

/**
 * Run several documents against ONE connection inside a single rolled-back transaction, so a
 * later read can observe what an earlier mutation wrote. `runQuery` opens and discards its own
 * transaction per call, which makes a write invisible to the next call by construction.
 */
/**
 * Like `runSequence`, but also records every SQL statement the middleware issues on the
 * connection. PGlite is single-connection, so a genuine two-transaction lock test would block
 * forever rather than fail; reading the statements the dispatcher emits is the strongest oracle
 * available here for transaction and locking behaviour.
 */
async function runSequenceCapturingSql(
	queries: string[]
): Promise<{ results: Record<string, unknown>[]; sql: string[] }> {
	const sql: string[] = []
	const client: PoolClient = await pool.connect()
	const originalQuery = client.query.bind(client)
	;(client as any).query = (config: any, ...rest: any[]) => {
		sql.push(typeof config === 'string' ? config : String(config?.text ?? ''))
		return (originalQuery as any)(config, ...rest)
	}
	await client.query('BEGIN')
	const results: Record<string, unknown>[] = []
	try {
		const withPgClient = makeWithPgClientViaPgClientAlreadyInTransaction(client, true)
		for (const query of queries) {
			const args = await hookArgs({
				schema,
				document: parse(query),
				variableValues: {},
				contextValue: Object.create(null) as Record<string, unknown>,
				resolvedPreset,
				requestContext: {},
			})
			args.contextValue.withPgClient = withPgClient
			results.push((await execute(args)) as Record<string, unknown>)
		}
	} finally {
		try {
			await client.query('ROLLBACK')
		} catch {
			client.release(new Error('rollback failed'))
		}
		client.release()
	}
	return { results, sql }
}

async function runSequence(queries: string[]): Promise<Record<string, unknown>[]> {
	const client: PoolClient = await pool.connect()
	await client.query('BEGIN')
	const results: Record<string, unknown>[] = []
	try {
		const withPgClient = makeWithPgClientViaPgClientAlreadyInTransaction(client, true)
		for (const query of queries) {
			const args = await hookArgs({
				schema,
				document: parse(query),
				variableValues: {},
				contextValue: Object.create(null) as Record<string, unknown>,
				resolvedPreset,
				requestContext: {},
			})
			args.contextValue.withPgClient = withPgClient
			results.push((await execute(args)) as Record<string, unknown>)
		}
	} finally {
		try {
			await client.query('ROLLBACK')
		} catch {
			client.release(new Error('rollback failed'))
		}
		client.release()
	}
	return results
}

async function runQuery(
	query: string,
	variables?: Record<string, unknown>,
	against?: { schema: GraphQLSchema; resolvedPreset: GraphileConfig.ResolvedPreset }
): Promise<Record<string, unknown>> {
	const client: PoolClient = await pool.connect()
	await client.query('BEGIN')
	let queryResult: Record<string, unknown> = {}
	try {
		const withPgClient = makeWithPgClientViaPgClientAlreadyInTransaction(client, true)
		const args = await hookArgs({
			schema: against?.schema ?? schema,
			document: parse(query),
			variableValues: variables ?? {},
			contextValue: Object.create(null) as Record<string, unknown>,
			resolvedPreset: against?.resolvedPreset ?? resolvedPreset,
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

	// A doctype that declares no `primaryKey` used to be unfetchable here: the adapter resolved the
	// key field with no `id` fallback and answered `data: null`, while the client resolved the same
	// doctype's identity to `id` and keyed records by it. Both sides silent, and disagreeing.
	it('fetches a record from a doctype that declares no primaryKey, via the id fallback', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScSurrogate", id: "1") { doctype data } }`)
		const record = (result as any).data?.stonecropRecord
		expect(record?.doctype).toBe('ScSurrogate')
		expect(record?.data?.name).toBe('Stateless Row')
	})

	// A declared key the database does not enforce as unique used to return an arbitrary row —
	// `rowByPk` keeps whichever of the matching rows came last, with nothing to say a choice was
	// made. Two rows of sc_note share item_id = 1, so this is that case exactly.
	it('refuses to answer when the declared identity matches more than one row', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScAmbiguous", id: "1") { doctype data } }`)
		expect((result as any).data?.stonecropRecord).toBeNull()
		const message = String((result as any).errors?.[0]?.message ?? '')
		expect(message).toContain('ScAmbiguous')
		expect(message).toContain('item_id')
		expect(message).toContain('not unique')
	})

	// The control for the case above: a genuinely unique declared key must not trip the check, and
	// an id matching exactly one row still resolves normally.
	it('answers normally when the declared identity matches one row', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScAmbiguous", id: "2") { doctype data } }`)
		expect((result as any).errors).toBeUndefined()
		expect((result as any).data?.stonecropRecord?.data?.body).toBe('Third note')
	})

	// The fallback is not unconditional: with neither a declared key nor an `id` field there is no
	// column to match against, and answering `data: null` would report a misconfigured doctype as
	// an absent record. The error has to name the doctype and both repairs.
	it('errors, rather than reporting not-found, when no identity field can be resolved', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScSignal", id: "1") { doctype data } }`)
		expect((result as any).data?.stonecropRecord).toBeNull()
		const message = String((result as any).errors?.[0]?.message ?? '')
		expect(message).toContain('ScSignal')
		expect(message).toContain('primaryKey')
		expect(message).toContain('`id`')
	})
})

// ===========================================================================
// stonecropRecords
// ===========================================================================

describe('stonecropRecords', { tags: ['integration', 'graphql'] }, () => {
	it('returns all records when no filters given', async () => {
		const result = await runQuery(`query { stonecropRecords(doctype: "ScItem") { hasMore data } }`)
		const records = (result as any).data?.stonecropRecords
		expect(records?.data.length).toBe(3)
		expect(records?.hasMore).toBe(false)
	})

	it('filters by a field value', async () => {
		const result = await runQuery(
			`query { stonecropRecords(doctype: "ScItem", filters: { status: "Active" }) { hasMore data } }`
		)
		const records = (result as any).data?.stonecropRecords
		expect(records?.data.length).toBe(1)
		expect(records?.data[0].name).toBe('Beta')
		expect(records?.hasMore).toBe(false)
	})

	it('respects limit and offset, and reports that more remain', async () => {
		const result = await runQuery(`query { stonecropRecords(doctype: "ScItem", limit: 1, offset: 1) { hasMore data } }`)
		const records = (result as any).data?.stonecropRecords
		expect(records?.data.length).toBe(1)
		// 3 rows, skip 1, take 1 — so one remains behind this page and the extra probe row finds it.
		expect(records?.hasMore).toBe(true)
	})

	it('withholds the total unless the query asks for it', async () => {
		// The count is a second query and a full scan on Postgres. It used to run on every list
		// read and be discarded by the client, which paid for it on the wire and dropped it.
		const withoutTotal = await runQuery(`query { stonecropRecords(doctype: "ScItem", limit: 1) { count data } }`)
		expect((withoutTotal as any).data?.stonecropRecords?.count).toBeNull()

		const withTotal = await runQuery(
			`query { stonecropRecords(doctype: "ScItem", limit: 1, includeTotal: true) { count data } }`
		)
		const records = (withTotal as any).data?.stonecropRecords
		// The total is of the whole filtered set, not of the page.
		expect(records?.data.length).toBe(1)
		expect(records?.count).toBe(3)
	})

	it('counts the filtered set, not the table, when a total is requested', async () => {
		const result = await runQuery(
			`query { stonecropRecords(doctype: "ScItem", filters: { status: "Active" }, includeTotal: true) { count data } }`
		)
		expect((result as any).data?.stonecropRecords?.count).toBe(1)
	})

	it('caps an unqualified list at the configured default and says the list is partial', async () => {
		// Omitting `limit` used to emit no LIMIT at all, so an unqualified list query returned the
		// whole table. The only guard against that lived in the scaffold's fetch helper — the wrong
		// layer, and absent from any host that wrote its own.
		const capped = await runQuery(`query { stonecropRecords(doctype: "ScItem") { hasMore data } }`, undefined, {
			schema: cappedSchema,
			resolvedPreset: cappedResolvedPreset,
		})
		const cappedRecords = (capped as any).data?.stonecropRecords
		expect(cappedRecords?.data.length).toBe(1)

		// The uncapped schema is the control: same query, same data, no truncation. Without it a
		// broken query returning one row would read as a working cap.
		const full = await runQuery(`query { stonecropRecords(doctype: "ScItem") { hasMore data } }`)
		const fullRecords = (full as any).data?.stonecropRecords
		expect(fullRecords?.data.length).toBeGreaterThan(1)

		// The pair is the whole point: a capped page and a complete one must not look alike.
		// Asserting both directions is what makes this fail if hasMore were hardcoded either way.
		expect(cappedRecords?.hasMore).toBe(true)
		expect(fullRecords?.hasMore).toBe(false)
	})

	it('lets an explicit limit override the default cap', async () => {
		const result = await runQuery(`query { stonecropRecords(doctype: "ScItem", limit: 2) { data } }`, undefined, {
			schema: cappedSchema,
			resolvedPreset: cappedResolvedPreset,
		})
		expect((result as any).data?.stonecropRecords?.data.length).toBe(2)
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
			`query { stonecropRecords(doctype: "ScNote", filters: { item_id: "1" }, includeTotal: true) { count data } }`
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
// Saving and creating — the self-transition write path
// ===========================================================================

describe('self-transition data write', { tags: ['integration', 'graphql'] }, () => {
	// The adapter supplied `readState`/`writeState`/`runEffect` and no `writeData` at all, which
	// `GuardedTransitionIO` documents as how a backend *declines* to write. So the reference
	// Postgres backend was indistinguishable from a read-only one, and every save answered
	// "which this backend does not support" — loud, but a lie.
	it('persists field data for a save against an existing record', async () => {
		const [action, read] = await runSequence([
			`mutation { stonecropAction(doctype: "ScItem", action: "save", args: [{ id: "1", data: { name: "Renamed" } }]) { success error data } }`,
			`query { stonecropRecord(doctype: "ScItem", id: "1") { data } }`,
		])
		expect((action as any).data?.stonecropAction?.error).toBeNull()
		expect((action as any).data?.stonecropAction?.success).toBe(true)
		// The row itself, not just the echoed payload — the result could be right while nothing landed.
		expect((read as any).data?.stonecropRecord?.data?.name).toBe('Renamed')
	})

	// Creating is the same request with no id. There is no create action and no create mutation:
	// `save` upserts, and the absence of an id is the whole signal.
	it('creates the record when no id is dispatched', async () => {
		const [action, list] = await runSequence([
			`mutation { stonecropAction(doctype: "ScItem", action: "save", args: [{ data: { name: "Minted" } }]) { success error data } }`,
			`query { stonecropRecords(doctype: "ScItem", filters: { name: "Minted" }) { data } }`,
		])
		expect((action as any).data?.stonecropAction?.error).toBeNull()
		const created = (action as any).data?.stonecropAction?.data
		expect(created?.name).toBe('Minted')
		// Identity must come back, or the client files the record nowhere and the create is lost.
		expect(created?.id).toBeDefined()
		expect((list as any).data?.stonecropRecords?.data.length).toBe(1)
	})

	// The client's contract is that an id means update and its absence means create
	// (`client-action.ts`: `...(isDraft ? {} : { id: recordId })`). The guard's read collapses
	// "no id dispatched" and "id dispatched, no such row" into the same `null`, so a save against
	// a record someone else deleted lands on the create branch — minting a *new* row under a new
	// identity and reporting success. The client then follows the settled id and nobody learns the
	// original is gone. Silent, and wrong.
	it('refuses to create when an id was dispatched but matched no row', async () => {
		const [action, list] = await runSequence([
			`mutation { stonecropAction(doctype: "ScItem", action: "save", args: [{ id: "9999", data: { name: "Ghost" } }]) { success error } }`,
			`query { stonecropRecords(doctype: "ScItem", filters: { name: "Ghost" }) { data } }`,
		])
		const result = (action as any).data?.stonecropAction
		expect(result?.success).toBe(false)
		// Naming the id is the difference between a usable report and "something went wrong".
		expect(String(result?.error)).toContain('9999')
		// The oracle that matters: the envelope could say failure while a row was still written.
		expect((list as any).data?.stonecropRecords?.data.length).toBe(0)
	})

	// The doctype owns state everywhere except creation, where `transition.ts` says the initial
	// state is the backend's to set. The column default is the backend setting it — nothing reads
	// `workflow.states`, which is an unordered array with no initial marker to read.
	it('takes the initial state from the column default, never from the doctype', async () => {
		const [action] = await runSequence([
			`mutation { stonecropAction(doctype: "ScItem", action: "save", args: [{ data: { name: "Defaulted" } }]) { data } }`,
		])
		expect((action as any).data?.stonecropAction?.data?.status).toBe('Draft')
	})

	// A save is a self-transition: it stays in the current state by definition. Letting a patch
	// carry `status` would let any client bypass `allowedStates` entirely by writing the column
	// the guard reads.
	it('refuses to move the workflow state through the data patch', async () => {
		const [, read] = await runSequence([
			`mutation { stonecropAction(doctype: "ScItem", action: "save", args: [{ id: "1", data: { name: "Still Draft", status: "Active" } }]) { success droppedFields } }`,
			`query { stonecropRecord(doctype: "ScItem", id: "1") { data } }`,
		])
		const record = (read as any).data?.stonecropRecord?.data
		expect(record?.name).toBe('Still Draft')
		expect(record?.status).toBe('Draft')
	})

	// Column identifiers come from the doctype, never from the request — which is what makes the
	// patch untrusted input safe to build SQL from. A key naming no column has nowhere to go.
	it('drops a key that names no column, and says which', async () => {
		const [action] = await runSequence([
			`mutation { stonecropAction(doctype: "ScItem", action: "save", args: [{ id: "1", data: { name: "Kept", bogus: "x" } }]) { success droppedFields data } }`,
		])
		const result = (action as any).data?.stonecropAction
		expect(result?.success).toBe(true)
		expect(result?.data?.name).toBe('Kept')
		// Silence here is data loss the user is told was saved.
		expect(result?.droppedFields).toContain('bogus')
	})

	// The read returns an expanding link as a nested record; the column under it holds a scalar
	// foreign key. A client that reads, edits and writes back sends the nested form straight into
	// a uuid column — so the shape is checked, not just the name.
	it('drops an expanded relation payload but writes the scalar foreign key', async () => {
		const [expanded, scalar] = await runSequence([
			`mutation { stonecropAction(doctype: "ScLinkExpand", action: "save", args: [{ id: "1", data: { itemId: { id: 2, name: "Beta" } } }]) { success droppedFields } }`,
			`mutation { stonecropAction(doctype: "ScLinkExpand", action: "save", args: [{ id: "1", data: { itemId: "2" } }]) { success droppedFields } }`,
		])
		expect((expanded as any).data?.stonecropAction?.droppedFields).toContain('itemId')
		expect((scalar as any).data?.stonecropAction?.success).toBe(true)
		expect((scalar as any).data?.stonecropAction?.droppedFields).toBeNull()
	})
})

// ===========================================================================
// Link fields via stonecropRecord/stonecropRecords ({ id, displayText } enrichment)
// ===========================================================================

describe('link fields ({ id, displayText })', { tags: ['integration', 'graphql'] }, () => {
	it('returns customerId as { id, displayText } on stonecropRecord', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScOrder", id: "1") { data } }`)
		const data = (result as any).data?.stonecropRecord?.data
		expect(data.customerId).toEqual({ id: 1, displayText: 'Acme Corp' })
	})

	it('returns customerId as { id, displayText } on each stonecropRecords row', async () => {
		const result = await runQuery(`query { stonecropRecords(doctype: "ScOrder") { data } }`)
		const rows = (result as any).data?.stonecropRecords?.data as Array<Record<string, unknown>>
		expect(rows[0]?.customerId).toEqual({ id: 1, displayText: 'Acme Corp' })
		expect(rows[1]?.customerId).toEqual({ id: 2, displayText: 'Globex' })
	})

	// A save is a self-transition — a read of the same record through the same doctype — and the
	// client files its result straight into the store (`Stonecrop.dispatchAction`). So the field it
	// returns has to have the shape the read path returns, or every write silently reverts the
	// record to the pre-enrichment shape and the next render pays the per-link client round trip
	// this enrichment exists to remove.
	it('returns customerId in the shape a read returns it, after a save', async () => {
		const [action, read] = await runSequence([
			`mutation { stonecropAction(doctype: "ScOrder", action: "save", args: [{ id: "1", data: { title: "Renamed" } }]) { success error data } }`,
			`query { stonecropRecord(doctype: "ScOrder", id: "1") { data } }`,
		])
		expect((action as any).data?.stonecropAction?.error).toBeNull()
		const written = (action as any).data?.stonecropAction?.data
		const readBack = (read as any).data?.stonecropRecord?.data
		// The read path is the oracle, asserted separately so a regression there cannot make this
		// test pass by making both sides equally wrong.
		expect(readBack.customerId).toEqual({ id: 1, displayText: 'Acme Corp' })
		expect(written.customerId).toEqual(readBack.customerId)
	})

	// The create branch is a separate statement with its own RETURNING, so a fix applied only to
	// the update path leaves this one answering the old shape.
	it('returns customerId in the shape a read returns it, after a create', async () => {
		const [action] = await runSequence([
			`mutation { stonecropAction(doctype: "ScOrder", action: "save", args: [{ data: { customerId: "1", title: "Minted" } }]) { success error data } }`,
		])
		expect((action as any).data?.stonecropAction?.error).toBeNull()
		expect((action as any).data?.stonecropAction?.data?.customerId).toEqual({ id: 1, displayText: 'Acme Corp' })
	})

	// Enrichment runs over the parent rows a doctype-group read collected, and an expanded child is
	// not one of them. So a nested record's own link fields come back as bare ids while the very
	// same doctype, read at the top level, returns them enriched — one payload, two shapes for one
	// field, decided by nesting depth.
	it('enriches link fields on expanded child records too', async () => {
		const result = await runQuery(
			`query { stonecropRecord(doctype: "ScPartyWithOrders", id: "1", options: { includeNested: true }) { data } }`
		)
		const orders = (result as any).data?.stonecropRecord?.data?.orders as Array<Record<string, unknown>>
		expect(orders?.length).toBeGreaterThan(0)
		expect(orders[0]?.customerId).toEqual({ id: 1, displayText: 'Acme Corp' })
	})
})

// ===========================================================================
// Many-side link row cap
// ===========================================================================

describe('many-side link row cap', { tags: ['integration', 'graphql'] }, () => {
	// The bug this suite exists for: the cap was `fetch?.method === 'sync' ? fetch.limit : isMany ? 50
	// : undefined`, where `method === 'sync'` is a *type narrowing* (only SyncFetch carries `limit`)
	// that someone also hung a default off. Writing the word `sync` — the very method a many-side
	// link already defaults to — therefore removed the cap.
	it('reads the same rows whether or not the link declares the method it already defaults to', async () => {
		const [implicit, explicit] = await Promise.all([
			runQuery(`query { stonecropRecord(doctype: "ScBulk", id: "1") { data } }`),
			runQuery(`query { stonecropRecord(doctype: "ScBulkSync", id: "1") { data } }`),
		])
		const implicitChildren = (implicit as any).data?.stonecropRecord?.data?.children
		const explicitChildren = (explicit as any).data?.stonecropRecord?.data?.children
		// Asserted against the fixture's own size, not against each other: two reads that agree on
		// the wrong number would pass an equality check.
		expect(implicitChildren?.length).toBe(64)
		expect(explicitChildren?.length).toBe(64)
	})

	it('applies the server default row cap to a link and says the link is partial', async () => {
		const capped = await runQuery(
			`query { stonecropRecord(doctype: "ScBulk", id: "1") { data truncatedLinks } }`,
			undefined,
			{
				schema: cappedSchema,
				resolvedPreset: cappedResolvedPreset,
			}
		)
		const record = (capped as any).data?.stonecropRecord
		expect(record?.data?.children.length).toBe(1)
		expect(record?.truncatedLinks).toContain('children')
	})

	// The control. Without it a link that returned everything and reported truncation anyway would
	// look identical to a working cap from the test above.
	it('reports no truncation when the whole relation fits under the cap', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScBulk", id: "1") { data truncatedLinks } }`)
		const record = (result as any).data?.stonecropRecord
		expect(record?.data?.children.length).toBe(64)
		expect(record?.truncatedLinks).toBeNull()
	})

	// An author-declared limit truncates just as silently as the old hard-coded one did, so it is
	// reported the same way. The key is `kids` and the bound field is `children`: the report names
	// the field, because that is the key the client reads the rows off and guards on.
	it('reports an author-declared limit that truncates, naming the bound field', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScBulkCapped", id: "1") { data truncatedLinks } }`)
		const record = (result as any).data?.stonecropRecord
		expect(record?.data?.children.length).toBe(10)
		expect(record?.truncatedLinks).toEqual(['children'])
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

	it('reports a missing record as missing, not as a state violation', async () => {
		// sc_item holds ids 1-3. Before the backend could answer "no such row", this read a state
		// of '' and failed the `allowedStates: ['Draft']` guard, blaming the workflow for what is
		// actually a bad id.
		const result = await runQuery(
			`mutation { stonecropAction(doctype: "ScItem", action: "submit", args: [{ id: "999" }]) { success data error } }`
		)
		const action = (result as any).data?.stonecropAction
		expect(action?.success).toBe(false)
		expect(action?.error).toContain('does not exist')
		expect(action?.error).not.toContain('not allowed')
	})

	it('still transitions a row that exists with a NULL status', async () => {
		// The control for the case above, and the reason absence needed its own answer rather than
		// a tighter falsy check. sc_draft row 1 exists with `status` NULL; `start` declares no
		// allowedStates. Same guard, same empty state — opposite outcome, decided only by whether
		// the row is there.
		const result = await runQuery(
			`mutation { stonecropAction(doctype: "ScDraft", action: "start", args: [{ id: "1" }]) { success data error } }`
		)
		const action = (result as any).data?.stonecropAction
		expect(action?.error).toBeNull()
		expect(action?.success).toBe(true)
		expect(action?.data?.state).toBe('Active')
	})

	it('refuses the same unguarded action on a row that is not there', async () => {
		// Identical action and identical (absent) guard as the test above — only the row differs.
		const result = await runQuery(
			`mutation { stonecropAction(doctype: "ScDraft", action: "start", args: [{ id: "999" }]) { success error } }`
		)
		const action = (result as any).data?.stonecropAction
		expect(action?.success).toBe(false)
		expect(action?.error).toContain('does not exist')
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

	it("rolls back a failed handler's own writes, not just the state change", async () => {
		// The action is atomic or it is not. Before the dispatcher opened a transaction, the guard
		// read, the handler and the state write were three autocommit statements: a handler that
		// wrote and then threw kept its write while the action reported failure.
		const [mutation, readBack] = await runSequence([
			`mutation { stonecropAction(doctype: "ScItem", action: "writeThenExplode", args: [{ id: "1" }]) { success error } }`,
			`query { stonecropRecord(doctype: "ScItem", id: "1") { data } }`,
		])
		expect((mutation as any).data?.stonecropAction?.success).toBe(false)
		expect((readBack as any).data?.stonecropRecord?.data?.name).not.toBe('SHOULD NOT SURVIVE')
	})

	it("commits a successful handler's writes, so the rollback test is not vacuous", async () => {
		// The control. Without it, a read-back that simply cannot see handler writes would make the
		// rollback assertion above pass no matter what the transaction did.
		const [mutation, readBack] = await runSequence([
			`mutation { stonecropAction(doctype: "ScItem", action: "recalculate", args: [{ id: "1", data: { suffix: "-OK" } }]) { success error } }`,
			`query { stonecropRecord(doctype: "ScItem", id: "1") { data } }`,
		])
		expect((mutation as any).data?.stonecropAction?.success).toBe(true)
		expect((readBack as any).data?.stonecropRecord?.data?.name).toContain('-OK')
	})

	it('locks the guarded row FOR UPDATE inside a transaction that wraps the whole action', async () => {
		// The check-then-act race this closes: two concurrent approvals both read PENDING, both pass
		// the guard, and both write. FOR UPDATE makes the second wait for the first to finish.
		//
		// Asserted on the statements the dispatcher actually issued, not on the source.
		const { sql } = await runSequenceCapturingSql([
			`mutation { stonecropAction(doctype: "ScItem", action: "submit", args: [{ id: "1" }]) { success error } }`,
		])
		const guardRead = sql.find(t => t.includes('SELECT "status"'))
		expect(guardRead).toBeDefined()
		expect(guardRead).toContain('FOR UPDATE')

		// A lock is only worth anything if something holds it open past the read. These tests run
		// inside their own transaction, so the dispatcher nests via savepoint rather than BEGIN.
		expect(sql.some(t => /savepoint/i.test(t))).toBe(true)
	})

	it('undoes the action with a rollback when it fails, rather than committing it', async () => {
		const { sql } = await runSequenceCapturingSql([
			`mutation { stonecropAction(doctype: "ScItem", action: "writeThenExplode", args: [{ id: "1" }]) { success error } }`,
		])
		expect(sql.some(t => /rollback to savepoint/i.test(t))).toBe(true)
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

// ===========================================================================
// actionHandlers registration — verified at schema build
// ===========================================================================

describe('actionHandlers registration', { tags: ['integration', 'graphql'] }, () => {
	// Each case builds its own schema, because the check runs during schema construction. The
	// doctypes registered in beforeAll are what it validates against.
	const buildWith = async (handlers: Record<string, Record<string, ActionHandler>>) => {
		const pgService = makePgService({ connectionString: inject('testDatabaseUrl') })
		try {
			await makeSchema({
				extends: [PostGraphileAmberPreset],
				plugins: [createStonecropPlugin({ actionHandlers: handlers })],
				pgServices: [pgService],
			})
		} finally {
			await pgService.release?.()
		}
	}

	const noop: ActionHandler = () => Promise.resolve(undefined)

	it('accepts a handler naming a real doctype and a real action', async () => {
		await expect(buildWith({ ScItem: { recalculate: noop } })).resolves.toBeUndefined()
	})

	it('refuses a handler for a doctype nothing registers', async () => {
		// The rename case: the doctype was renamed and its handlers were left behind. At dispatch
		// this is invisible — an action with a nextState still transitions and still reports
		// success, with the effect silently skipped.
		await expect(buildWith({ ScRenamed: { submit: noop } })).rejects.toThrow(
			/"ScRenamed": no doctype by that name is registered/
		)
	})

	it('refuses a handler for an action the doctype does not declare', async () => {
		await expect(buildWith({ ScItem: { recalculte: noop } })).rejects.toThrow(
			/"ScItem\.recalculte": the doctype declares no action by that key/
		)
	})

	it('refuses a slug-keyed registration, which resolves but could never fire', async () => {
		// `getMeta` falls back to matching a slug, so this names a real doctype — but dispatch reads
		// `actionHandlers[meta.name]`, so it would never be found. Reported as its own case because
		// the repair is to re-key it, not to add the doctype.
		await expect(buildWith({ 'sc-surrogate': { anything: noop } })).rejects.toThrow(
			/matches the doctype named "ScSurrogate" by slug/
		)
	})

	it('reports every offender at once', async () => {
		// A consumer with a rename to repair should see the whole list, not fix one and rebuild.
		await expect(buildWith({ ScGone: { a: noop }, ScItem: { b: noop, c: noop } })).rejects.toThrow(
			/3 registered action handlers cannot be reached/
		)
	})
})

// ===========================================================================
// Cross-doctype references — verified at schema build
// ===========================================================================

// ===========================================================================
// One-side link expansion — render mode decides whether a link expands at all.
//
// `resolveLinkRenderMode` is the single definition of that, consumed by the client resolver and
// by the SELECT column builder. The expansion loop used to not consult it, which broke both
// render modes in opposite directions: the expanding one could never resolve (its FK column is
// deliberately absent from the payload SELECT, so the read found `undefined`), and the inline one
// was expanded when it should not be, replacing a picker's id with the whole target record.
//
// sc_tag row 1 is ('urgent', item_id 1) and sc_item row 1 is 'Alpha'.
// ===========================================================================

describe('one-side link expansion', { tags: ['integration', 'graphql'] }, () => {
	it('expands a record-mode link whose FK column the payload SELECT omits', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScLinkExpand", id: "1") { data } }`)
		expect((result as any).errors).toBeUndefined()
		const data = (result as any).data?.stonecropRecord?.data
		// Not `null`: the relation exists and item_id is 1. Before the render-mode fix this was
		// null for every record of every doctype declaring an expanding one-side link.
		expect(data.itemId).toMatchObject({ id: 1, name: 'Alpha' })
	})

	it('leaves an inline link as the scalar id the picker needs', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScLinkInline", id: "1") { data } }`)
		expect((result as any).errors).toBeUndefined()
		const data = (result as any).data?.stonecropRecord?.data
		// An object here means the picker was handed a record where it expects an id to resolve
		// display text from.
		expect(data.itemId).toBe(1)
	})

	it('binds and returns an aliased link under its declared fieldname, not the map key', async () => {
		// ScLinkAliased keys the declaration `item` but binds field `itemId`. Both halves of the
		// one rule are load-bearing here: the FK is read via `fieldname ?? key`, and the result is
		// written under that same resolved name — which is where the client looks for it.
		const result = await runQuery(`query { stonecropRecord(doctype: "ScLinkAliased", id: "1") { data } }`)
		expect((result as any).errors).toBeUndefined()
		const data = (result as any).data?.stonecropRecord?.data
		expect(data.itemId).toMatchObject({ id: 1, name: 'Alpha' })
		// The map key must not become a payload field of its own.
		expect(data.item).toBeUndefined()
	})

	it('keeps the internal FK alias out of the payload', async () => {
		const result = await runQuery(`query { stonecropRecord(doctype: "ScLinkExpand", id: "1") { data } }`)
		const data = (result as any).data?.stonecropRecord?.data
		expect(Object.keys(data).filter(k => k.startsWith('__stonecropLinkFk_'))).toEqual([])
	})
})

// ===========================================================================
// includeNested — the boolean and the name list must mean the same thing.
//
// `includeNested: true` is the documented form and the one `DataClient` describes, but a lazy link
// was admitted by the `shouldInclude` gate and then dropped again a few lines later by a second
// test that only ever consulted the name list — `null` for the boolean form. The result was a
// partial record with nothing to say so.
//
// The three cases below are the whole truth table of that gate.
// ===========================================================================

describe('includeNested', { tags: ['integration', 'graphql'] }, () => {
	it('expands a lazy link when asked with the boolean', async () => {
		const result = await runQuery(
			`query { stonecropRecord(doctype: "ScLinkLazy", id: "1", options: { includeNested: true }) { data } }`
		)
		expect((result as any).errors).toBeUndefined()
		const data = (result as any).data?.stonecropRecord?.data
		expect(data.itemId).toMatchObject({ id: 1, name: 'Alpha' })
	})

	it('expands a lazy link when asked by name', async () => {
		// The control: this form always worked, which is what made the boolean's silence look like
		// "there is nothing there" rather than "the request was dropped".
		const result = await runQuery(
			`query { stonecropRecord(doctype: "ScLinkLazy", id: "1", options: { includeNested: ["itemId"] }) { data } }`
		)
		expect((result as any).errors).toBeUndefined()
		const data = (result as any).data?.stonecropRecord?.data
		expect(data.itemId).toMatchObject({ id: 1, name: 'Alpha' })
	})

	it('leaves a lazy link alone when nothing asked for it', async () => {
		// The half that must not change: `lazy` means "not in the initial query". Removing the
		// second guard must widen what an explicit request reaches, not make every link eager.
		const result = await runQuery(`query { stonecropRecord(doctype: "ScLinkLazy", id: "1") { data } }`)
		expect((result as any).errors).toBeUndefined()
		const data = (result as any).data?.stonecropRecord?.data
		expect(data.itemId).toBeUndefined()
	})
})

/** ScColumnless with its link bound to a field that either has a column or, when computed, does not. */
const columnless = (computed: boolean) => ({
	ScColumnless: {
		slug: 'sc-columnless',
		fields: [
			{ kind: 'field' as const, fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
			{
				kind: 'field' as const,
				fieldname: 'virtualRef',
				component: 'ATextInput',
				label: 'Virtual',
				...(computed ? { computed: true } : {}),
			},
		],
		links: { virtualRef: { target: 'ScItem', cardinality: 'one' as const } },
	},
})

describe('doctype reference resolution', { tags: ['integration', 'graphql'] }, () => {
	const build = async () => {
		const pgService = makePgService({ connectionString: inject('testDatabaseUrl') })
		try {
			await makeSchema({
				extends: [PostGraphileAmberPreset],
				plugins: [createStonecropPlugin({})],
				pgServices: [pgService],
			})
		} finally {
			await pgService.release?.()
		}
	}

	it('accepts the registered doctypes, whose links all resolve', async () => {
		await expect(build()).resolves.toBeUndefined()
	})

	it('refuses a link whose target nothing registers, then accepts it once repaired', async () => {
		// The harm is silent without this: the link read is `getMeta(link.target)` followed by
		// `if (!targetMeta) continue`, so a typo drops the relation from the response and reads on
		// the wire as a record that legitimately has none.
		loadDoctypesFromObject({
			ScDangling: {
				slug: 'sc-dangling',
				fields: [],
				links: { orphan: { target: 'sc-nonesuch', cardinality: 'noneOrMany', backlink: 'danglingId' } },
			},
		})
		await expect(build()).rejects.toThrow(
			/ScDangling\.links\.orphan\.target: Link references unknown doctype: sc-nonesuch/
		)

		// Registering the target repairs it. This is the positive control — the same registry that
		// just failed now builds — and it is also how this case cleans up after itself, since the
		// registry is shared across the file and there is no removeDoctype.
		loadDoctypesFromObject({ ScNonesuch: { slug: 'sc-nonesuch', fields: [] } })
		await expect(build()).resolves.toBeUndefined()
	})

	it('refuses a link bound to a field with no column, before any read can fail on it', async () => {
		// Observed directly before this check existed: the read answered `column "virtual_ref" does
		// not exist` and returned null for the *whole record*, not merely the link — one malformed
		// declaration took down every read of the doctype, at runtime, with no mention of the link.
		loadDoctypesFromObject(columnless(true))
		await expect(build()).rejects.toThrow(/ScColumnless\.links\.virtualRef: .*no database column/)

		// Same name, same link, but the field now has a column — repairs it and cleans up.
		loadDoctypesFromObject(columnless(false))
		await expect(build()).resolves.toBeUndefined()
	})
})
