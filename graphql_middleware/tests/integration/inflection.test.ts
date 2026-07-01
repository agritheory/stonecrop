import { parse } from 'graphql'
import type { GraphQLSchema } from 'graphql'
import type { GraphileConfig } from 'postgraphile/graphile-build'
import { Pool, type PoolClient } from 'pg'
import { makeSchema } from 'postgraphile'
import { execute, hookArgs } from 'postgraphile/grafast'
import { makePgService, makeWithPgClientViaPgClientAlreadyInTransaction } from 'postgraphile/adaptors/pg'
import { describe, it, expect, beforeAll, afterAll, inject } from 'vitest'

import { createStonecropPlugin, createStonecropPreset } from '../../src'
import { loadDoctypesFromObject, clearRegistry } from '../../src/registry/doctypes'

// ---------------------------------------------------------------------------
// Per-suite setup — same infrastructure as resolver.test.ts, but with
// StonecropFieldCasingPlugin (PascalCase) enabled in the preset.
// ---------------------------------------------------------------------------

let pool: Pool
let schema: GraphQLSchema
let resolvedPreset: GraphileConfig.ResolvedPreset
let releasePgService: (() => void | PromiseLike<void>) | undefined

beforeAll(async () => {
	const databaseUrl = inject('inflectionTestDatabaseUrl')

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
	})

	pool = new Pool({ connectionString: databaseUrl, max: 1 })

	const pgService = makePgService({ connectionString: databaseUrl })
	releasePgService = pgService.release
	const result = await makeSchema({
		extends: [createStonecropPreset({ fieldCasing: 'pascal' })],
		plugins: [createStonecropPlugin()],
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
// Phase B deferred test: non-default inflection with includeNested
// ===========================================================================

describe('stonecropRecord with pascalCase field inflection', { tags: ['integration', 'graphql'] }, () => {
	it('fetches a record by id through stonecropRecord regardless of PostGraphile schema naming', async () => {
		// PostGraphile exposes the field as 'Name' (PascalCase) in its own schema,
		// but stonecropRecord returns the raw DB column data directly.
		const result = await runQuery(`query { stonecropRecord(doctype: "ScItem", id: "1") { doctype data } }`)
		const record = (result as any).data?.stonecropRecord
		expect(record?.doctype).toBe('ScItem')
		// Raw DB column names are returned — not inflected GraphQL field names
		expect(record?.data?.name).toBe('Alpha')
	})

	it('includes sync-linked records correctly even with non-default inflection', async () => {
		const result = await runQuery(
			`query { stonecropRecord(doctype: "ScItem", id: "1", options: { includeNested: ["tags"] }) { data unknownLinks } }`
		)
		const record = (result as any).data?.stonecropRecord
		expect(Array.isArray(record?.data?.tags)).toBe(true)
		expect(record.data.tags.length).toBe(2)
		expect(record.data.tags[0].label).toBe('urgent')
		expect(record.unknownLinks).toBeNull()
	})

	it('returns unknownLinks for requested links not in doctype metadata', async () => {
		const result = await runQuery(
			`query { stonecropRecord(doctype: "ScItem", id: "1", options: { includeNested: ["missing"] }) { data unknownLinks } }`
		)
		const record = (result as any).data?.stonecropRecord
		expect(record?.unknownLinks).toContain('missing')
	})

	it('stonecropRecords returns correct data regardless of PostGraphile field casing', async () => {
		const result = await runQuery(`query { stonecropRecords(doctype: "ScItem") { count data } }`)
		const records = (result as any).data?.stonecropRecords
		expect(records?.count).toBe(3)
		expect(records?.data.length).toBe(3)
		// Raw DB data — not affected by PostGraphile external schema naming
		expect(records?.data[0].name).toBe('Alpha')
	})
})
