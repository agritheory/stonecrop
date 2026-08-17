import type {
	DataClient,
	DoctypeMeta,
	DoctypeContext,
	DoctypeRef,
	GetRecordOptions,
	GetRecordsOptions,
	GetRecordsResult,
} from '@stonecrop/schema'
import type { GetRecordResult } from './types'
import { GET_META_QUERY, GET_ALL_META_QUERY, RUN_ACTION_MUTATION } from './queries'
import {
	buildSingleRecordQuery,
	buildListRecordQuery,
	transformNativeRecord,
	doctypeToSingleQuery,
	doctypeToListQuery,
} from './query-builder'

export type { DoctypeContext, DoctypeRef }
export type { GetRecordResult, GetRecordsResult }

/**
 * Options for creating a Stonecrop client
 * @public
 */
export interface StonecropClientOptions {
	/** GraphQL endpoint URL */
	endpoint: string
	/** Additional HTTP headers to include in requests */
	headers?: Record<string, string>
}

/**
 * Client for interacting with Stonecrop GraphQL API.
 *
 * Acts as a transport layer for stonecropRecord/stonecropRecords/stonecropAction, and
 * builds native PostGraphile queries for getNativeRecord/getNativeRecords.
 *
 * @public
 */
export class StonecropClient implements DataClient {
	private endpoint: string
	private headers: Record<string, string>
	private metaCache: Map<string, DoctypeMeta> = new Map()

	constructor(options: StonecropClientOptions) {
		this.endpoint = options.endpoint
		this.headers = {
			'Content-Type': 'application/json',
			...options.headers,
		}
	}

	/**
	 * Execute a GraphQL query against the configured endpoint.
	 *
	 * @param query - GraphQL query string
	 * @param variables - Query variables
	 * @throws Error if the GraphQL response contains errors
	 */
	async query<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T> {
		const response = await fetch(this.endpoint, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify({ query, variables }),
		})

		const json: { data?: T; errors?: Array<{ message: string }> } = await response.json()

		if (json.errors?.length) {
			throw new Error(json.errors[0].message)
		}

		if (json.data === undefined) {
			throw new Error('GraphQL response missing data field')
		}

		return json.data
	}

	/**
	 * Execute a GraphQL mutation. Delegates to query() since both use POST.
	 *
	 * @param mutation - GraphQL mutation string
	 * @param variables - Mutation variables
	 */
	async mutate<T = unknown>(mutation: string, variables?: Record<string, unknown>): Promise<T> {
		return this.query<T>(mutation, variables)
	}

	/**
	 * Get doctype metadata
	 * @param context - Doctype context containing doctype name
	 */
	async getMeta(context: DoctypeContext): Promise<DoctypeMeta | null> {
		const cached = this.metaCache.get(context.doctype)
		if (cached) return cached

		const result = await this.query<{ stonecropMeta: DoctypeMeta | null }>(GET_META_QUERY, {
			doctype: context.doctype,
		})

		if (result.stonecropMeta) {
			this.metaCache.set(context.doctype, result.stonecropMeta)
		}

		return result.stonecropMeta
	}

	/**
	 * Get all doctype metadata
	 */
	async getAllMeta(): Promise<DoctypeMeta[]> {
		const result = await this.query<{ stonecropAllMeta: DoctypeMeta[] }>(GET_ALL_META_QUERY)

		for (const meta of result.stonecropAllMeta) {
			this.metaCache.set(meta.name, meta)
		}

		return result.stonecropAllMeta
	}

	/**
	 * Get a single record by ID.
	 *
	 * Routes through the stonecropRecord resolver which handles nested data
	 * fetching based on the includeNested option.
	 *
	 * @param doctype - Doctype reference (name and optional slug)
	 * @param recordId - Record ID to fetch
	 * @param options - Query options (includeNested, maxDepth)
	 */
	async getRecord(doctype: DoctypeRef, recordId: string, options?: GetRecordOptions): Promise<GetRecordResult> {
		const result = await this.query<{
			stonecropRecord: { data: Record<string, unknown> | null; unknownLinks?: string[] }
		}>(
			`query GetRecord($doctype: String!, $id: String!, $options: JSON) {
				stonecropRecord(doctype: $doctype, id: $id, options: $options) {
					data
					unknownLinks
				}
			}`,
			{
				doctype: doctype.name,
				id: recordId,
				options: options?.includeNested
					? {
							includeNested: options.includeNested,
							maxDepth: options.maxDepth,
						}
					: undefined,
			}
		)

		return {
			record: result.stonecropRecord?.data ?? null,
			unknownLinks: result.stonecropRecord?.unknownLinks,
		}
	}

	/**
	 * Get multiple records with optional filtering and pagination.
	 *
	 * Returns flat arrays — the middleware merges connection format (\{ nodes: [...] \})
	 * into plain arrays before returning.
	 *
	 * @param doctype - Doctype reference (name and optional slug)
	 * @param options - Query options (filters, orderBy, limit, offset)
	 */
	async getRecords(doctype: DoctypeRef, options?: GetRecordsOptions): Promise<GetRecordsResult> {
		const result = await this.query<{
			stonecropRecords: { data: Record<string, unknown>[]; hasMore: boolean; count: number | null }
		}>(
			`
			query GetRecords(
				$doctype: String!
				$filters: JSON
				$orderBy: String
				$limit: Int
				$offset: Int
				$includeTotal: Boolean
			) {
				stonecropRecords(
					doctype: $doctype
					filters: $filters
					orderBy: $orderBy
					limit: $limit
					offset: $offset
					includeTotal: $includeTotal
				) {
					data
					hasMore
					count
				}
			}
			`,
			{
				doctype: doctype.name,
				...options,
			}
		)

		const { data, hasMore, count } = result.stonecropRecords
		// `count` is null unless includeTotal was set. Omitting the key rather than passing null
		// through keeps "not asked for" and "asked for, and it is zero" distinguishable.
		return count == null ? { data, hasMore } : { data, hasMore, count }
	}

	/**
	 * Get a single record by ID using PostGraphile's native query with relationship expansion.
	 *
	 * Unlike `getRecord()` which uses the `stonecropRecord` resolver returning a JSON blob,
	 * this method builds a native PostGraphile query that leverages the ORM's relationship
	 * resolution for efficient single-query fetches with JOINs.
	 *
	 * Link fields are returned as `{ id, displayText }` objects where `displayText` is
	 * resolved from the target doctype's `displayField`.
	 *
	 * @param doctype - Doctype reference (name and optional slug)
	 * @param recordId - Record ID to fetch
	 */
	async getNativeRecord(doctype: DoctypeRef, recordId: string): Promise<GetRecordResult> {
		const allMeta = await this.getAllMeta()
		const meta = allMeta.find(m => m.name === doctype.name || m.slug === doctype.name)

		if (!meta) {
			return { record: null }
		}

		const { query, linkFields } = buildSingleRecordQuery(meta, { allMeta })
		const queryName = doctypeToSingleQuery(meta.name)

		const result = await this.query<Record<string, Record<string, unknown> | null>>(query, { id: recordId })

		const rawRecord = result[queryName]
		if (!rawRecord) {
			return { record: null }
		}

		const record = transformNativeRecord(rawRecord, linkFields, meta, allMeta)
		return { record }
	}

	/**
	 * Get multiple records using PostGraphile's native query with relationship expansion.
	 *
	 * Unlike `getRecords()` which uses the `stonecropRecords` resolver returning JSON blobs,
	 * this method builds a native PostGraphile query that leverages the ORM's relationship
	 * resolution for efficient single-query fetches with JOINs.
	 *
	 * Link fields are returned as `{ id, displayText }` objects where `displayText` is
	 * resolved from the target doctype's `displayField`.
	 *
	 * @param doctype - Doctype reference (name and optional slug)
	 * @param options - Query options (limit, offset)
	 */
	async getNativeRecords(
		doctype: DoctypeRef,
		options?: { limit?: number; offset?: number }
	): Promise<GetRecordsResult> {
		const allMeta = await this.getAllMeta()
		const meta = allMeta.find(m => m.name === doctype.name || m.slug === doctype.name)

		if (!meta) {
			return { data: [], hasMore: false }
		}

		const { query, linkFields } = buildListRecordQuery(meta, {
			allMeta,
			first: options?.limit,
			offset: options?.offset,
		})
		const queryName = doctypeToListQuery(meta.name)

		const variables: Record<string, unknown> = {}
		if (options?.limit !== undefined) variables.first = options.limit
		if (options?.offset !== undefined) variables.offset = options.offset

		const result = await this.query<Record<string, { nodes: Record<string, unknown>[] }>>(query, variables)

		const nodes = result[queryName]?.nodes ?? []
		const data = nodes.map(node => transformNativeRecord(node, linkFields, meta, allMeta))

		return {
			data,
			hasMore: nodes.length === options?.limit,
		}
	}

	/**
	 * Execute a doctype action
	 * @param doctype - Doctype reference (name and optional slug)
	 * @param action - Action name to execute
	 * @param args - Action arguments
	 */
	async runAction(
		doctype: DoctypeRef,
		action: string,
		args?: unknown[]
	): Promise<{ success: boolean; data: unknown; error: string | null }> {
		const result = await this.query<{
			stonecropAction: { success: boolean; data: unknown; error: string | null }
		}>(RUN_ACTION_MUTATION, {
			doctype: doctype.name,
			action,
			args,
		})

		return result.stonecropAction
	}

	/**
	 * Clear the cached doctype metadata.
	 *
	 * Call this if the server-side doctype schema has changed and you need
	 * to fetch fresh metadata (e.g., after adding a new field).
	 */
	clearMetaCache(): void {
		this.metaCache.clear()
	}
}
