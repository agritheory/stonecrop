/**
 * Cross-adapter conformance — the same GraphQL documents, two independent adapters, diffed.
 *
 * Stonecrop's portability claim is that swapping the database means swapping the adapter behind
 * the GraphQL API. `nuxt/test/adapter-conformance.test.ts` pins the *rule* each adapter follows
 * (which field a record is keyed by) by calling pure helpers. It cannot pin the *result*, because
 * that package's vitest stubs grafast so no plan resolver can execute.
 *
 * This closes that gap from the other side. Both hosts here are really executed:
 *
 *   Host A — the shipped Postgres adapter: `createStonecropPlugin` over PostGraphile, against a
 *            live PGlite database seeded from seed.sql.
 *   Host B — an in-memory adapter shaped like the one `nuxt/templates/resolvers.ts` scaffolds into
 *            consumer apps: plan resolvers over plain Maps.
 *
 * Host B is built from the middleware's own exported `typeDefs`, not a copy of it, so the two
 * hosts cannot drift in surface — only in behaviour, which is what is being measured.
 *
 * The fixture is deliberately NATURAL-keyed (`sc_code`, no `id` column). Every other table in
 * seed.sql is surrogate-keyed, where "look up by the declared primary key" and "look up by `id`"
 * agree by coincidence and a disagreement is invisible.
 *
 * Reading a failure: a diff here is a real portability defect — the same query, the same data,
 * two different answers. Fix the adapter that is wrong; do not tune Host B until it matches.
 */
import { parse, print, type DocumentNode } from 'graphql'
import type { GraphQLSchema } from 'graphql'
import type { GraphileConfig } from 'postgraphile/graphile-build'
import { Pool, type PoolClient } from 'pg'
import { makeSchema } from 'postgraphile'
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { execute, hookArgs, makeGrafastSchema, constant, lambda, loadOne, object } from 'postgraphile/grafast'
import { makePgService, makeWithPgClientViaPgClientAlreadyInTransaction } from 'postgraphile/adaptors/pg'
import { describe, it, expect, beforeAll, afterAll, inject } from 'vitest'

import { createStonecropPlugin } from '../../src/plugin/postgraphile'
import { loadDoctypesFromObject, clearRegistry, getMeta, getAllMeta } from '../../src/registry/doctypes'
import { typeDefs } from '../../src/typeDefs'

// ---------------------------------------------------------------------------
// Shared fixture — one doctype set, one logical dataset, two storage backends
// ---------------------------------------------------------------------------

const DOCTYPES = {
	// Natural key: `code` is the primary key and there is no `id` column at all.
	ScCode: {
		name: 'ScCode',
		slug: 'sc-code',
		fields: [
			{ kind: 'field' as const, fieldname: 'code', component: 'ATextInput', primaryKey: true, label: 'Code' },
			{ kind: 'field' as const, fieldname: 'name', component: 'ATextInput', label: 'Name' },
			{ kind: 'field' as const, fieldname: 'status', component: 'ATextInput', label: 'Status' },
		],
		workflow: {
			states: ['Draft', 'Active'],
			actions: { submit: { label: 'Submit', allowedStates: ['Draft'], nextState: 'Active' } },
		},
	},
	// Surrogate key, as a control: both hosts must agree here too, and did before this test existed.
	ScItem: {
		name: 'ScItem',
		slug: 'sc-item',
		fields: [
			{ kind: 'field' as const, fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
			{ kind: 'field' as const, fieldname: 'name', component: 'ATextInput', label: 'Name' },
			{ kind: 'field' as const, fieldname: 'status', component: 'ATextInput', label: 'Status' },
		],
	},
}

/** Mirrors seed.sql exactly. Host B reads these; Host A reads the same rows from PGlite. */
const IN_MEMORY: Record<string, Map<string, Record<string, unknown>>> = {
	ScCode: new Map([
		['ALPHA', { code: 'ALPHA', name: 'Alpha Region', status: 'Draft' }],
		['BETA', { code: 'BETA', name: 'Beta Region', status: 'Active' }],
		['GAMMA', { code: 'GAMMA', name: 'Gamma Region', status: 'Draft' }],
	]),
	ScItem: new Map([
		['1', { id: 1, name: 'Alpha', status: 'Draft' }],
		['2', { id: 2, name: 'Beta', status: 'Active' }],
		['3', { id: 3, name: 'Gamma', status: 'Draft' }],
	]),
}

// ---------------------------------------------------------------------------
// Host B — in-memory, shaped like the scaffolded template
// ---------------------------------------------------------------------------

/** The rule under test, stated once. Host B applies it; Host A is measured against it. */
function lookupField(doctypeName: string): string {
	const meta = getMeta(doctypeName)
	const pk = meta?.fields.find(f => (f as { primaryKey?: boolean }).primaryKey)
	return (pk as { fieldname?: string } | undefined)?.fieldname ?? 'id'
}

function findRecord(doctypeName: string, id: unknown): Record<string, unknown> | null {
	const store = IN_MEMORY[doctypeName]
	if (!store) return null
	const field = lookupField(doctypeName)
	const wanted = String(id)
	for (const record of store.values()) {
		if (String(record[field]) === wanted) return record
	}
	return null
}

function formatMeta(meta: ReturnType<typeof getMeta>) {
	if (!meta) return null
	const actions = meta.workflow?.actions as Record<string, Record<string, unknown>> | undefined
	return {
		name: meta.name,
		slug: meta.slug ?? null,
		route: meta.route ?? null,
		view: meta.view ?? null,
		fields: meta.fields,
		workflow: meta.workflow ? { states: meta.workflow.states ?? null, actions: Object.values(actions ?? {}) } : null,
		inherits: meta.inherits ?? null,
	}
}

/**
 * `typeDefs` declares `extend type Query`, which PostGraphile merges into its generated schema.
 * A standalone host has nothing to extend, so the base types and the JSON scalar (also supplied
 * by PostGraphile) are added here. The Stonecrop field definitions themselves are reused verbatim
 * — that is the point: Host B cannot silently declare a different surface.
 */
/** Grafast passes plan arguments as Steps keyed by `$name`; their precise types are irrelevant here. */
type PlanArgs = Record<`$${string}`, never>

function buildInMemorySchema(): GraphQLSchema {
	// `typeDefs` is a graphql-js DocumentNode (postgraphile's `gql` tag), so it is printed back to
	// SDL rather than stringified — String() on it yields "[object Object]" and parses to nothing.
	const sdl = `scalar JSON\n${print(typeDefs as unknown as DocumentNode).replace(/extend type (Query|Mutation)/g, 'type $1')}`
	return makeGrafastSchema({
		typeDefs: sdl,
		plans: {
			Query: {
				stonecropMeta(_: unknown, { $doctype }: PlanArgs) {
					return lambda($doctype, (doctype: unknown) => formatMeta(getMeta(String(doctype))))
				},
				stonecropAllMeta() {
					return constant(getAllMeta().map(formatMeta))
				},
				stonecropRecord(_: unknown, { $doctype, $id }: PlanArgs) {
					return loadOne(object({ doctype: $doctype, id: $id }), async (specs: readonly Record<string, unknown>[]) =>
						specs.map(spec => ({
							data: findRecord(String(spec.doctype), spec.id),
							doctype: String(spec.doctype),
							unknownLinks: undefined,
						}))
					)
				},
				stonecropRecords(_: unknown, { $doctype, $filters, $orderBy, $limit, $offset, $includeTotal }: PlanArgs) {
					return loadOne(
						object({
							doctype: $doctype,
							filters: $filters,
							orderBy: $orderBy,
							limit: $limit,
							offset: $offset,
							includeTotal: $includeTotal,
						}),
						async (specs: readonly Record<string, unknown>[]) =>
							specs.map(spec => {
								const doctype = String(spec.doctype)
								let rows = [...(IN_MEMORY[doctype]?.values() ?? [])]
								const filters = spec.filters as Record<string, unknown> | null | undefined
								if (filters) {
									rows = rows.filter(r => Object.entries(filters).every(([k, v]) => String(r[k]) === String(v)))
								}
								const total = rows.length
								// `FIELD_ASC` / `FIELD_DESC`, split on the LAST underscore so camelCase field
								// names survive. Mirrors the Postgres adapter, which rejects anything else —
								// an earlier version of this host invented a "code DESC" form and accepted it
								// silently, which is exactly the drift this test exists to catch.
								if (spec.orderBy != null) {
									if (typeof spec.orderBy !== 'string') throw new Error('Invalid orderBy: expected string')
									const lastUnder = spec.orderBy.lastIndexOf('_')
									if (lastUnder <= 0) {
										throw new Error(`Invalid orderBy format: "${spec.orderBy}". Expected FIELD_ASC or FIELD_DESC`)
									}
									const dir = spec.orderBy.slice(lastUnder + 1).toUpperCase()
									if (dir !== 'ASC' && dir !== 'DESC') {
										throw new Error(`Invalid orderBy direction: "${dir}". Must be ASC or DESC`)
									}
									const col = spec.orderBy.slice(0, lastUnder)
									rows = rows.toSorted((a, b) => String(a[col]).localeCompare(String(b[col])))
									if (dir === 'DESC') rows.reverse()
								}
								const offset = typeof spec.offset === 'number' ? spec.offset : 0
								const limit = typeof spec.limit === 'number' ? spec.limit : rows.length
								const page = rows.slice(offset, offset + limit)
								return {
									data: page,
									doctype,
									hasMore: offset + page.length < total,
									// Opt-in, matching the Postgres adapter. Counting is free here, which is
									// exactly why this host would drift toward always answering it.
									count: spec.includeTotal === true ? total : null,
								}
							})
					)
				},
			},
			Mutation: {
				stonecropAction() {
					// Not diffed: Host A's dispatch writes through pg. Out of scope for a read comparison.
					return constant({ success: false, data: null, error: 'not implemented in the in-memory host' })
				},
			},
		},
	})
}

// ---------------------------------------------------------------------------
// Harness
// ---------------------------------------------------------------------------

let pool: Pool
let pgSchema: GraphQLSchema
let memSchema: GraphQLSchema
let resolvedPreset: GraphileConfig.ResolvedPreset
let releasePgService: (() => void | PromiseLike<void>) | undefined

beforeAll(async () => {
	const databaseUrl = inject('conformanceTestDatabaseUrl')
	loadDoctypesFromObject(DOCTYPES)

	pool = new Pool({ connectionString: databaseUrl, max: 1 })
	const pgService = makePgService({ connectionString: databaseUrl })
	releasePgService = pgService.release
	const built = await makeSchema({
		extends: [PostGraphileAmberPreset],
		plugins: [createStonecropPlugin()],
		pgServices: [pgService],
	})
	pgSchema = built.schema
	resolvedPreset = built.resolvedPreset

	memSchema = buildInMemorySchema()
}, 60_000)

afterAll(async () => {
	clearRegistry()
	await pool?.end()
	await releasePgService?.()
})

/** Host A: executed inside a rolled-back transaction so the fixture is never mutated. */
async function runPg(document: DocumentNode, variables: Record<string, unknown>) {
	const client: PoolClient = await pool.connect()
	await client.query('BEGIN')
	try {
		const withPgClient = makeWithPgClientViaPgClientAlreadyInTransaction(client, true)
		const args = await hookArgs({
			schema: pgSchema,
			document,
			variableValues: variables,
			contextValue: Object.create(null) as Record<string, unknown>,
			resolvedPreset,
			requestContext: {},
		})
		const ctx = args.contextValue as { withPgClient?: unknown }
		ctx.withPgClient = withPgClient
		return await execute(args)
	} finally {
		await client.query('ROLLBACK')
		client.release()
	}
}

/** Host B: no database, no transaction. */
async function runMem(document: DocumentNode, variables: Record<string, unknown>) {
	return await execute({ schema: memSchema, document, variableValues: variables })
}

/**
 * Normalises away differences that are storage artifacts rather than contract violations:
 * Postgres returns a serial PK as a number where the in-memory store may hold a string, and
 * `undefined` vs an absent key is not observable through GraphQL.
 */
function normalise(value: unknown): unknown {
	return JSON.parse(JSON.stringify(value ?? null), (_k, v) => (typeof v === 'number' ? String(v) : v)) as unknown
}

// ---------------------------------------------------------------------------
// The documents, run against both hosts
// ---------------------------------------------------------------------------

const RECORD = parse(`
	query R($doctype: String!, $id: String!) {
		stonecropRecord(doctype: $doctype, id: $id) { data doctype }
	}
`)

const RECORDS = parse(`
	query Rs($doctype: String!, $filters: JSON, $orderBy: String, $limit: Int, $offset: Int) {
		stonecropRecords(
			doctype: $doctype
			filters: $filters
			orderBy: $orderBy
			limit: $limit
			offset: $offset
			includeTotal: true
		) {
			data
			doctype
			hasMore
			count
		}
	}
`)

/**
 * `nonEmpty` guards against a vacuous pass. Two adapters that both return `null` agree perfectly
 * and prove nothing, so every case that should find data says so explicitly.
 */
const CASES: Array<{
	label: string
	document: DocumentNode
	variables: Record<string, unknown>
	nonEmpty: boolean
}> = [
	{
		label: 'record by NATURAL key',
		nonEmpty: true,
		document: RECORD,
		variables: { doctype: 'ScCode', id: 'BETA' },
	},
	{
		label: 'record by natural key that does not exist',
		nonEmpty: false,
		document: RECORD,
		variables: { doctype: 'ScCode', id: 'NOPE' },
	},
	{
		label: 'record by surrogate key (control)',
		nonEmpty: true,
		document: RECORD,
		variables: { doctype: 'ScItem', id: '2' },
	},
	{
		label: 'records, unfiltered',
		nonEmpty: true,
		document: RECORDS,
		variables: { doctype: 'ScCode' },
	},
	{
		label: 'records, filtered by a non-key column',
		nonEmpty: true,
		document: RECORDS,
		variables: { doctype: 'ScCode', filters: { status: 'Draft' } },
	},
	{
		label: 'records, ordered and paged',
		nonEmpty: true,
		document: RECORDS,
		variables: { doctype: 'ScCode', orderBy: 'code_DESC', limit: 2, offset: 1 },
	},
	{
		label: 'records for an unknown doctype',
		nonEmpty: false,
		document: RECORDS,
		variables: { doctype: 'NoSuchDoctype' },
	},
]

describe('cross-adapter conformance', { tags: ['integration', 'graphql'] }, () => {
	it.each(CASES)('$label — Postgres and in-memory agree', async ({ document, variables, nonEmpty }) => {
		const [pg, mem] = await Promise.all([runPg(document, variables), runMem(document, variables)])

		// An adapter that errors instead of answering is a divergence in itself, so surface it
		// before comparing payloads — otherwise both sides read as `data: null` and "agree".
		expect(pg.errors?.map(e => e.message) ?? [], `Postgres host errored on ${print(document)}`).toEqual([])
		expect(mem.errors?.map(e => e.message) ?? [], `in-memory host errored on ${print(document)}`).toEqual([])

		// Read the payload off whichever root field this document selected. Asserted in both
		// directions: a case expecting data that finds none would make the diff below vacuous,
		// and a case expecting a miss that finds something is testing the wrong row.
		const root = Object.values((pg.data ?? {}) as Record<string, { data?: unknown }>)[0]
		const payload = root?.data
		const found = Array.isArray(payload) ? payload.length > 0 : payload != null
		expect(found, 'payload emptiness must match the case: an empty "nonEmpty" case makes the diff vacuous').toBe(
			nonEmpty
		)

		expect(normalise(mem.data)).toEqual(normalise(pg.data))
	})
})
