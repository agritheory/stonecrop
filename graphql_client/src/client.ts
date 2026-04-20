import type {
	DataClient,
	DoctypeMeta,
	DoctypeContext,
	DoctypeRef,
	GetRecordOptions,
	GetRecordsOptions,
} from '@stonecrop/schema'
import type { GetRecordResult } from './types'

export type { DoctypeContext, DoctypeRef }
export type { GetRecordResult }

/**
 * Options for creating a Stonecrop client
 * @public
 */
export interface StonecropClientOptions {
	/** GraphQL endpoint URL */
	endpoint: string
	/** Additional HTTP headers to include in requests */
	headers?: Record<string, string>
	/** Doctype registry for nested query building */
	registry?: Map<string, DoctypeMeta>
}

/**
 * Client for interacting with Stonecrop GraphQL API
 * @public
 */
export class StonecropClient implements DataClient {
	private endpoint: string
	private headers: Record<string, string>
	private metaCache: Map<string, DoctypeMeta> = new Map()
	private registry?: Map<string, DoctypeMeta>

	constructor(options: StonecropClientOptions) {
		this.endpoint = options.endpoint
		this.headers = {
			'Content-Type': 'application/json',
			...options.headers,
		}
		this.registry = options.registry
	}

	/**
	 * Execute a GraphQL query
	 * @param query - GraphQL query string
	 * @param variables - Query variables
	 */
	async query<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T> {
		const response = await fetch(this.endpoint, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify({ query, variables }),
		})

		const json = (await response.json()) as {
			data?: T
			errors?: Array<{ message: string }>
		}

		if (json.errors?.length) {
			throw new Error(json.errors[0].message)
		}

		return json.data as T
	}

	/**
	 * Execute a GraphQL mutation
	 * @param mutation - GraphQL query string
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

		const result = await this.query<{ stonecropMeta: DoctypeMeta | null }>(
			`
			query GetMeta($doctype: String!) {
				stonecropMeta(doctype: $doctype) {
					name
					slug
					tableName
					fields {
						fieldname
						fieldtype
						component
						label
						width
						align
						required
						readOnly
						edit
						hidden
						default
						options
						mask
						precision
						scale
						mode
						validation
					}
					workflow {
						states
						actions {
							label
							handler
							requiredFields
							allowedStates
							confirm
							args
						}
					}
					inherits
				}
			}
			`,
			{ doctype: context.doctype }
		)

		if (result.stonecropMeta) {
			this.metaCache.set(context.doctype, result.stonecropMeta)
		}

		return result.stonecropMeta
	}

	/**
	 * Get all doctype metadata
	 */
	async getAllMeta(): Promise<DoctypeMeta[]> {
		const result = await this.query<{ stonecropAllMeta: DoctypeMeta[] }>(
			`
			query GetAllMeta {
				stonecropAllMeta {
					name
					slug
					tableName
					fields {
						fieldname
						fieldtype
						component
						label
						width
						align
						required
						readOnly
						edit
						hidden
						default
						options
						mask
						precision
						scale
						mode
						validation
					}
					workflow {
						states
						actions {
							label
							handler
							requiredFields
							allowedStates
							confirm
							args
						}
					}
					inherits
				}
			}
			`
		)

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
	 * Get multiple records with optional filtering and pagination
	 * @param doctype - Doctype reference (name and optional slug)
	 * @param options - Query options (filters, orderBy, limit, offset)
	 */
	async getRecords(doctype: DoctypeRef, options?: GetRecordsOptions): Promise<Record<string, unknown>[]> {
		const result = await this.query<{
			stonecropRecords: { data: Record<string, unknown>[] }
		}>(
			`
			query GetRecords(
				$doctype: String!
				$filters: JSON
				$orderBy: String
				$limit: Int
				$offset: Int
			) {
				stonecropRecords(
					doctype: $doctype
					filters: $filters
					orderBy: $orderBy
					limit: $limit
					offset: $offset
				) {
					data
					count
				}
			}
			`,
			{
				doctype: doctype.name,
				...options,
			}
		)

		return result.stonecropRecords.data
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
		}>(
			`
			mutation RunAction($doctype: String!, $action: String!, $args: JSON) {
				stonecropAction(doctype: $doctype, action: $action, args: $args) {
					success
					data
					error
				}
			}
			`,
			{
				doctype: doctype.name,
				action,
				args,
			}
		)

		return result.stonecropAction
	}

	/**
	 * Clear the cached doctype metadata
	 */
	clearMetaCache(): void {
		this.metaCache.clear()
	}
}
