import type { DoctypeMeta, RouteContext, GraphQLExecutor } from '../types'

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
 * Client for interacting with Stonecrop GraphQL API
 * @public
 */
export class StonecropClient implements GraphQLExecutor {
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
	 * @param mutation - GraphQL mutation string
	 * @param variables - Mutation variables
	 */
	async mutate<T = unknown>(mutation: string, variables?: Record<string, unknown>): Promise<T> {
		return this.query<T>(mutation, variables)
	}

	/**
	 * Get doctype metadata
	 * @param context - Route context containing doctype name
	 */
	async getMeta(context: RouteContext): Promise<DoctypeMeta | null> {
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
						required
						readOnly
						options
						precision
						scale
					}
					workflow {
						states
						actions
					}
					inherits
					listDoctype
					parentDoctype
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
						required
						readOnly
						options
						precision
						scale
					}
					workflow {
						states
						actions
					}
					inherits
					listDoctype
					parentDoctype
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
	 * Get a single record by ID
	 * @param doctype - Doctype metadata
	 * @param recordId - Record ID to fetch
	 */
	async getRecord(doctype: DoctypeMeta, recordId: string): Promise<Record<string, unknown> | null> {
		const result = await this.query<{
			stonecropRecord: { data: Record<string, unknown> | null }
		}>(
			`
			query GetRecord($doctype: String!, $id: String!) {
				stonecropRecord(doctype: $doctype, id: $id) {
					data
				}
			}
			`,
			{ doctype: doctype.name, id: recordId }
		)

		return result.stonecropRecord.data
	}

	/**
	 * Get multiple records with optional filtering and pagination
	 * @param doctype - Doctype metadata
	 * @param options - Query options (filters, orderBy, limit, offset)
	 */
	async getRecords(
		doctype: DoctypeMeta,
		options?: {
			filters?: Record<string, unknown>
			orderBy?: string
			limit?: number
			offset?: number
		}
	): Promise<Record<string, unknown>[]> {
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
	 * @param doctype - Doctype metadata
	 * @param action - Action name to execute
	 * @param args - Action arguments
	 */
	async runAction(
		doctype: DoctypeMeta,
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
