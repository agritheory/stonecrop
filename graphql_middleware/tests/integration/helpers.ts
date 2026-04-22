import { Pool } from 'pg'
import type { PostGraphileInstance } from 'postgraphile'
import { postgraphile } from 'postgraphile'
import { execute, hookArgs } from 'postgraphile/grafast'
import { parse, validate } from 'graphql'
import type { ExecutionResult, GraphQLSchema } from 'graphql'
import type { PoolClient } from 'pg'
import type { GraphileConfig } from 'postgraphile/graphile-build'
import type { PromiseOrDirect } from 'grafast'

import { makeWithPgClientViaPgClientAlreadyInTransaction } from 'postgraphile/@dataplan/pg/adaptors/pg'
import { withRootDb, type TEST_DATABASE_URL } from './setup'

export type { TEST_DATABASE_URL }
export { withRootDb }
export type { PoolClient }

interface TestContext {
	pgl: PostGraphileInstance
	schema: GraphQLSchema
	resolvedPreset: GraphileConfig.ResolvedPreset
	pgPool: Pool
}

let ctx: TestContext | null = null

export async function setupPostGraphile(preset: GraphileConfig.Preset): Promise<void> {
	if (!process.env.TEST_DATABASE_URL) {
		throw new Error('Cannot run integration tests without TEST_DATABASE_URL')
	}
	const pgl = postgraphile(preset)
	const { schema, resolvedPreset } = await pgl.getSchemaResult()
	const pgPool = new Pool({
		connectionString: process.env.TEST_DATABASE_URL,
	})
	pgPool.on('error', () => {})
	pgPool.on('connect', client => client.on('error', () => {}))
	ctx = { pgl, schema, resolvedPreset, pgPool }
}

export async function teardownPostGraphile(): Promise<void> {
	if (ctx == null) return
	const { pgl, pgPool } = ctx
	ctx = null
	await pgl.release()
	await pgPool.end()
}

interface GraphQLQueryContext {
	contextValue: Record<string, unknown>
	pgClient: PoolClient | null
}

export async function runGraphQLQuery(args: {
	query: string
	variableValues?: Record<string, unknown>
	reqOptions?: Record<string, unknown>
	checker?: (result: ExecutionResult, context: GraphQLQueryContext) => PromiseOrDirect<void | ExecutionResult>
}): Promise<ExecutionResult> {
	const { query, variableValues = {}, reqOptions, checker = () => {} } = args
	if (!ctx) throw new Error('No ctx! Call setupPostGraphile first.')

	const { schema, resolvedPreset, pgPool } = ctx
	const document = parse(query)
	const validationErrors = validate(schema, document)
	if (validationErrors.length > 0) {
		throw validationErrors[0]
	}

	const mockReq = {
		url: resolvedPreset.grafserv?.graphqlPath ?? '/graphql',
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		...reqOptions,
	}
	const mockRes: any = { req: mockReq }
	;(mockReq as any).res = mockRes

	const contextValue: Record<string, unknown> = {
		__TESTING: true,
	}

	const args_ = await hookArgs({
		schema,
		document,
		variableValues,
		contextValue,
		resolvedPreset,
		requestContext: {
			node: { req: mockReq, res: mockRes },
			expressv4: { req: mockReq, res: mockRes },
		},
	})

	let pgClient: PoolClient | null = null
	const queryContext: GraphQLQueryContext = { contextValue, pgClient: null }

	try {
		pgClient = await pgPool.connect()
		await pgClient.query('begin')
		const withPgClient = makeWithPgClientViaPgClientAlreadyInTransaction(pgClient, true)
		args_.contextValue.withPgClient = withPgClient
		queryContext.pgClient = pgClient
		const result = await execute(args_)
		await checker(result as ExecutionResult, queryContext)
		return result as ExecutionResult
	} finally {
		if (pgClient) {
			try {
				await pgClient.query('rollback')
			} finally {
				pgClient.release()
			}
		}
	}
}

// =============================================================================
// Snapshot sanitization — masks variable values for stable comparisons
// =============================================================================

interface SanitizeCache {
	counter: number
	values: Map<unknown, string>
}

const sanitizeCache: Record<string, SanitizeCache> = {}

function mask(value: unknown, type: string): string {
	if (!sanitizeCache[type]) {
		sanitizeCache[type] = { counter: 0, values: new Map() }
	}
	const cache = sanitizeCache[type]
	if (!cache.values.has(value)) {
		cache.values.set(value, `[${type}-${++cache.counter}]`)
	}
	return cache.values.get(value)!
}

export function sanitize(json: unknown): unknown {
	if (Array.isArray(json)) {
		return json.map(sanitize)
	} else if (json && typeof json === 'object') {
		const result: Record<string, unknown> = { ...(json as Record<string, unknown>) }
		for (const k in result) {
			const v = result[k]
			if (k === 'nodeId' && typeof v === 'string') {
				result[k] = mask(v, 'nodeId')
			} else if (
				k === 'id' ||
				k === 'uuid' ||
				(k.endsWith('Id') && (typeof v === 'number' || typeof v === 'string')) ||
				(k.endsWith('Uuid') && typeof k === 'string')
			) {
				result[k] = mask(v, 'id')
			} else if ((k.endsWith('At') || k === 'datetime') && typeof v === 'string') {
				result[k] = mask(v, 'timestamp')
			} else if (k.match(/^deleted[A-Za-z0-9]+Id$/) && typeof v === 'string') {
				result[k] = mask(v, 'nodeId')
			} else if (k === 'email' && typeof v === 'string') {
				result[k] = mask(v, 'email')
			} else if (k === 'username' && typeof v === 'string') {
				result[k] = mask(v, 'username')
			} else {
				result[k] = sanitize(v)
			}
		}
		return result
	}
	return json
}

beforeEach(() => {
	for (const key of Object.keys(sanitizeCache)) {
		delete sanitizeCache[key]
	}
})

// =============================================================================
// Role switching helpers
// =============================================================================

export async function asRoot<T>(client: PoolClient, fn: (client: PoolClient) => Promise<T>): Promise<T> {
	const {
		rows: [{ role }],
	} = await client.query<{ role: string }>("select current_setting('role') as role")
	await client.query('reset role')
	try {
		return await fn(client)
	} finally {
		try {
			await client.query('select set_config($1, $2, true)', ['role', role])
		} catch {
			// Transaction was probably aborted, don't clobber the error
		}
	}
}

export const becomeRoot = (client: PoolClient): Promise<void> => client.query('reset role').then(() => undefined)

export async function becomeUser(
	client: PoolClient,
	userId: string | null,
	extraSettings?: Record<string, string | undefined>
): Promise<void> {
	await becomeRoot(client)
	const settings: Record<string, string | undefined> = {
		role: process.env.DATABASE_VISITOR,
		'jwt.claims.session_id': userId ?? '',
		...(extraSettings ?? {}),
	}
	const pairs = Object.entries(settings)
	await client.query(
		`select ${pairs.map((_, i) => `set_config($${i + 1}, $${i + 2}, true)`).join(', ')}`,
		pairs.flatMap(([k, v]) => [k, v ?? ''])
	)
}
