/**
 * Adapter conformance — the expectations every Stonecrop backend must satisfy.
 *
 * Stonecrop's portability claim is that an app talks to a GraphQL API and never to a database,
 * so the database can be swapped by swapping the adapter behind that API. That claim only holds
 * if "the API" is specified independently of any one adapter. Today it is not: the contract is
 * restated in three places that drift apart independently —
 *
 *   1. graphql_middleware/src/typeDefs.ts   — the Postgres adapter (the shipped one)
 *   2. nuxt/templates/schema.graphql        — the scaffold the CLI writes into a new app
 *   3. nuxt/fullstack/server/schema.graphql — the playground adapter over an in-memory store
 *
 * This file is the missing specification. Each expectation is written once and run against every
 * host, so a host that disagrees fails by name rather than at a consumer's runtime.
 *
 * The contract's source of truth is what `@stonecrop/graphql-client` actually sends: five root
 * operations (`GetMeta`, `GetAllMeta`, `GetRecord`, `GetRecords`, `RunAction`). Anything else a
 * host publishes is an extension, not contract — pinned below so additions stay deliberate.
 *
 * Why this reads SDL as text rather than importing it: importing @stonecrop/graphql-middleware
 * boots postgraphile + pg, a server-only chain that breaks vitest's node interop (the same reason
 * meta-contract.test.ts stubs the module). All three hosts are therefore treated symmetrically as
 * SDL artifacts. Behavioural expectations run against pure helpers the resolver modules export —
 * plan resolvers never execute here, since vitest.config.ts aliases grafast to a throwing stub.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { parse, Kind, print, type DocumentNode, type FieldDefinitionNode } from 'graphql'
import { describe, it, expect, vi } from 'vitest'

import type { DoctypeMeta } from '@stonecrop/schema'

// The resolver modules below import the middleware at top level. vitest hoists this mock above
// those imports, so the stub is registered before they load; the pure helpers under test never
// call it. getMeta is given a real implementation because the record resolvers consult it — but
// nothing in this file executes a plan resolver, so it stays a throwing stub like the rest.
vi.mock('@stonecrop/graphql-middleware', () => {
	const notExecutable = (name: string) => () => {
		throw new Error(`graphql-middleware stub: ${name}() must not execute in unit tests`)
	}
	return {
		getMeta: notExecutable('getMeta'),
		getAllMeta: notExecutable('getAllMeta'),
		applyGuardedTransition: notExecutable('applyGuardedTransition'),
		loadDoctypes: notExecutable('loadDoctypes'),
	}
})

import { recordLookupField as templatesLookupField } from '../templates/resolvers'
import { recordLookupField as fullstackLookupField } from '../fullstack/server/resolvers'

// ---------------------------------------------------------------------------
// The contract: what the client sends, and therefore what every host must serve
// ---------------------------------------------------------------------------

/** Root fields `@stonecrop/graphql-client` selects. Adding one here is a contract change. */
const CONTRACT_QUERY_FIELDS = ['stonecropMeta', 'stonecropAllMeta', 'stonecropRecord', 'stonecropRecords'] as const
const CONTRACT_MUTATION_FIELDS = ['stonecropAction'] as const

// ---------------------------------------------------------------------------
// Hosts
// ---------------------------------------------------------------------------

function readSdl(relPath: string): string {
	return readFileSync(fileURLToPath(new URL(relPath, import.meta.url)), 'utf-8')
}

/**
 * The middleware states its SDL as a `gql` template literal rather than a .graphql file.
 * Extracted as text for the reason given in the file header. Throws rather than returning an
 * empty document if the shape ever changes — a silently-empty SDL would pass every check below.
 */
function readMiddlewareSdl(): string {
	const source = readSdl('../../graphql_middleware/src/typeDefs.ts')
	const match = source.match(/export const typeDefs = gql`([\s\S]*?)`\s*$/)
	if (!match?.[1]?.includes('stonecropRecord')) {
		throw new Error(
			'Could not extract the typeDefs template from graphql_middleware/src/typeDefs.ts — ' +
				'the export shape changed and this conformance suite is no longer reading the real SDL.'
		)
	}
	return match[1]
}

interface Host {
	name: string
	sdl: string
	/**
	 * Root fields this host publishes beyond the contract, recorded so adding one is deliberate.
	 *
	 * None of these are called by @stonecrop/graphql-client and none exist in the Postgres
	 * adapter, so an app that uses them is not portable. `getMeta` duplicates `stonecropMeta`;
	 * the three CRUD mutations have no counterpart in the shipped adapter at all.
	 */
	extensions: { query: string[]; mutation: string[] }
	/** Pure helper: which field an incoming `stonecropRecord(id:)` is matched against. */
	lookupField?: (meta: DoctypeMeta) => string
}

const HOSTS: Host[] = [
	{ name: 'middleware', sdl: readMiddlewareSdl(), extensions: { query: [], mutation: [] } },
	{
		name: 'templates',
		sdl: readSdl('../templates/schema.graphql'),
		extensions: {
			query: ['healthCheck', 'getMeta'],
			mutation: ['stonecropCreate', 'stonecropUpdate', 'stonecropDelete'],
		},
		lookupField: templatesLookupField,
	},
	{
		name: 'fullstack',
		sdl: readSdl('../fullstack/server/schema.graphql'),
		extensions: {
			query: ['getMeta', 'healthCheck', 'serverInfo'],
			mutation: ['stonecropCreate', 'stonecropUpdate', 'stonecropDelete'],
		},
		lookupField: fullstackLookupField,
	},
]

function rootFields(doc: DocumentNode, typeName: string): Map<string, FieldDefinitionNode> {
	const defs = doc.definitions.filter(
		d => (d.kind === Kind.OBJECT_TYPE_DEFINITION || d.kind === Kind.OBJECT_TYPE_EXTENSION) && d.name.value === typeName
	)
	const out = new Map<string, FieldDefinitionNode>()
	for (const def of defs) {
		if (def.kind !== Kind.OBJECT_TYPE_DEFINITION && def.kind !== Kind.OBJECT_TYPE_EXTENSION) continue
		for (const f of def.fields ?? []) out.set(f.name.value, f)
	}
	return out
}

/** `doctype: String!, id: String!, options: JSON` — argument name and type, order-independent. */
function argSignature(field: FieldDefinitionNode): string[] {
	return (field.arguments ?? []).map(a => `${a.name.value}: ${print(a.type)}`).toSorted()
}

// ---------------------------------------------------------------------------
// Layer 1 — surface conformance
// ---------------------------------------------------------------------------

describe.each(HOSTS)('$name — contract surface', { tags: ['unit', 'graphql'] }, ({ name, sdl, extensions }) => {
	const doc = parse(sdl)
	const queries = rootFields(doc, 'Query')
	const mutations = rootFields(doc, 'Mutation')

	it.each(CONTRACT_QUERY_FIELDS)('serves Query.%s', fieldName => {
		expect(queries.has(fieldName), `${name} does not serve Query.${fieldName}`).toBe(true)
	})

	it.each(CONTRACT_MUTATION_FIELDS)('serves Mutation.%s', fieldName => {
		expect(mutations.has(fieldName), `${name} does not serve Mutation.${fieldName}`).toBe(true)
	})

	it('publishes no root field beyond the contract without declaring it an extension', () => {
		// A host may extend the API; it may not do so silently. An unlisted field here is either
		// a new extension (add it to KNOWN_EXTENSIONS) or an accidental divergence.
		const expectedQuery = [...CONTRACT_QUERY_FIELDS, ...extensions.query].toSorted()
		const expectedMutation = [...CONTRACT_MUTATION_FIELDS, ...extensions.mutation].toSorted()
		expect([...queries.keys()].toSorted()).toEqual(expectedQuery)
		expect([...mutations.keys()].toSorted()).toEqual(expectedMutation)
	})
})

describe('contract argument signatures agree across hosts', { tags: ['unit', 'graphql'] }, () => {
	// The middleware is the reference: it is the adapter that actually ships. A host whose
	// argument names or types differ cannot serve the client's documents even though it declares
	// a field of the same name — the failure would surface as a GraphQL validation error at
	// runtime, in the consumer's app, not here.
	const reference = HOSTS.find(h => h.name === 'middleware')!
	const refDoc = parse(reference.sdl)
	const refQueries = rootFields(refDoc, 'Query')
	const refMutations = rootFields(refDoc, 'Mutation')

	const others = HOSTS.filter(h => h.name !== 'middleware')

	it.each(others)('$name matches the reference argument signatures', ({ sdl, name }) => {
		const doc = parse(sdl)
		const queries = rootFields(doc, 'Query')
		const mutations = rootFields(doc, 'Mutation')

		for (const fieldName of CONTRACT_QUERY_FIELDS) {
			const field = queries.get(fieldName)
			expect(field, `${name} does not serve Query.${fieldName}`).toBeDefined()
			expect(argSignature(field!), `Query.${fieldName} arguments differ on ${name}`).toEqual(
				argSignature(refQueries.get(fieldName)!)
			)
		}
		for (const fieldName of CONTRACT_MUTATION_FIELDS) {
			const field = mutations.get(fieldName)
			expect(field, `${name} does not serve Mutation.${fieldName}`).toBeDefined()
			expect(argSignature(field!), `Mutation.${fieldName} arguments differ on ${name}`).toEqual(
				argSignature(refMutations.get(fieldName)!)
			)
		}
	})
})

// ---------------------------------------------------------------------------
// Layer 2 — record identity
// ---------------------------------------------------------------------------

/** Minimal doctype metas exercising each branch of the identity rule. */
const field = (fieldname: string, extra: Record<string, unknown> = {}) => ({
	kind: 'field' as const,
	fieldname,
	component: 'ATextInput',
	...extra,
})

const IDENTITY_CASES: Array<{ label: string; meta: DoctypeMeta; expected: string }> = [
	{
		label: 'a declared natural key is used, not `id`',
		meta: {
			name: 'Uom',
			fields: [field('id'), field('uomName', { primaryKey: true })],
		} as unknown as DoctypeMeta,
		expected: 'uomName',
	},
	{
		label: 'a declared `id` primary key resolves to `id`',
		meta: { name: 'Account', fields: [field('id', { primaryKey: true }), field('name')] } as unknown as DoctypeMeta,
		expected: 'id',
	},
	{
		label: 'the first declared primary key wins when several are marked',
		meta: {
			name: 'Ambiguous',
			fields: [field('code', { primaryKey: true }), field('altCode', { primaryKey: true })],
		} as unknown as DoctypeMeta,
		expected: 'code',
	},
	{
		label: 'a primary key nested inside a fieldset is not a record key',
		// getPrimaryKeyField matches only top-level `kind: 'field'` entries. A fieldset child is
		// presentation structure; treating it as identity would key records by a nested column.
		meta: {
			name: 'Nested',
			fields: [
				field('id'),
				{
					kind: 'fieldset',
					fieldname: 'details_fieldset',
					component: 'AFieldset',
					schema: [field('innerCode', { primaryKey: true })],
				},
			],
		} as unknown as DoctypeMeta,
		expected: 'id',
	},
]

describe.each(HOSTS.filter(h => h.lookupField))(
	'$name — record identity',
	{ tags: ['unit', 'graphql'] },
	({ lookupField }) => {
		it.each(IDENTITY_CASES)('$label', ({ meta, expected }) => {
			expect(lookupField!(meta)).toBe(expected)
		})
	}
)

describe('record identity — unresolved divergence', { tags: ['unit', 'graphql'] }, () => {
	/**
	 * What should an adapter do for a doctype that declares NO `primaryKey`?
	 *
	 * The two shipped answers disagree, and neither is obviously wrong:
	 *
	 *   - The Postgres adapter treats the declaration as required. With no `primaryKey` it
	 *     returns `data: null` from `stonecropRecord` (plugin/postgraphile.ts, the `!pkMeta`
	 *     branch) and a loud `No primary key for doctype:` error from `stonecropAction`. Note it
	 *     is already inconsistent with itself: the same condition fails silently in one operation
	 *     and loudly in the other.
	 *   - Both nuxt hosts fall back to `id`, which is what `@stonecrop/schema`'s
	 *     `getRecordIdentity` documents as correct: "surrogate-key doctypes carry an `id` column
	 *     and never mark a primary key".
	 *
	 * Half-resolved. The repo took the strict side for its own data: every doctype now declares a
	 * key, enforced by `doctype-fixtures.test.ts` (the one exemption, `assignment`, is a junction
	 * doctype with a composite identity the schema cannot express). That removes the practical
	 * breakage — previously no fixture could fetch a record under the Postgres adapter.
	 *
	 * What is still open is the rule for **consumer** doctypes that declare nothing. The nuxt hosts
	 * stay permissive, the Postgres adapter refuses, and the middleware remains inconsistent with
	 * itself (silent in `stonecropRecord`, loud in `stonecropAction`). Deciding that changes
	 * shipped behaviour, so this records both rather than asserting one. Fold it into the shared
	 * cases above once settled — and fix the middleware's own silent/loud split either way.
	 */
	const noPk = { name: 'Surrogate', fields: [field('id'), field('label')] } as unknown as DoctypeMeta

	it('both nuxt hosts fall back to `id`', () => {
		expect(templatesLookupField(noPk)).toBe('id')
		expect(fullstackLookupField(noPk)).toBe('id')
	})

	it('the Postgres adapter has no such fallback — documented, not asserted as correct', () => {
		// Pinned as prose against the source so this stays visible if the branch is ever removed.
		const src = readSdl('../../graphql_middleware/src/plugin/postgraphile.ts')
		expect(src).toContain('No primary key for doctype:')
	})
})
