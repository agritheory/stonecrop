import type {
	DataClient,
	DoctypeMeta,
	DoctypeContext,
	DoctypeRef,
	GetRecordOptions,
	GetRecordsOptions,
} from '@stonecrop/schema'
import { snakeToCamel, toPascalCase } from '@stonecrop/schema'
import pluralize from 'pluralize'

import { buildRecordQuery } from './query'

export type { DoctypeContext, DoctypeRef }

/**
 * Default inflection functions for PostGraphile Amber preset conventions.
 * These match the middleware's default inflection so the client builds
 * queries the server can execute.
 * @internal
 */
const defaultRecordFieldName = (tableName: string): string => {
	const singularName = pluralize.singular(tableName)
	return `${snakeToCamel(singularName)}ById`
}
const defaultRecordArgName = (_tableName: string): string => 'id'
const defaultRecordArgType = (_tableName: string): string => 'UUID!'

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
	}

	/**
	 * Set the doctype registry for nested query building.
	 * @param registry - Map of doctype slug to doctype metadata
	 */
	setRegistry(registry: Map<string, DoctypeMeta>): void {
		this.registry = registry
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
	 * Get a single record by ID.
	 *
	 * When `includeNested` is set, builds a query with sub-selections for descendant
	 * links and returns parent + merged children. When omitted, returns flat scalar data.
	 *
	 * @param doctype - Doctype reference (name and optional slug)
	 * @param recordId - Record ID to fetch
	 * @param options - Query options (includeNested, maxDepth)
	 */
	async getRecord(
		doctype: DoctypeRef,
		recordId: string,
		options?: GetRecordOptions
	): Promise<Record<string, unknown> | null> {
		// Nested path: build query with sub-selections
		if (options?.includeNested) {
			const meta = await this.getMeta({ doctype: doctype.name })
			if (!meta) return null

			const query = buildRecordQuery(
				meta,
				defaultRecordFieldName,
				defaultRecordArgName,
				defaultRecordArgType,
				this.registry,
				options
			)

			const result = await this.query<Record<string, unknown>>(query, { id: recordId })

			const queryName = defaultRecordFieldName(meta.tableName || doctype.name)
			const record = result[queryName] as Record<string, unknown> | undefined

			if (!record) return null

			if (meta.links && this.registry) {
				return mergeNestedResults(record, meta, this.registry)
			}

			return record
		}

		// Flat path: original query
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

/**
 * Merge nested connection results into flat arrays.
 *
 * For `noneOrMany`/`atLeastOne` links, the query returns `{ nodes: [...] }`.
 * This flattens them to just `[]` for easier consumption.
 *
 * For `one`/`atMostOne` links, the result is already flat.
 *
 * @internal
 */
function mergeNestedResults(
	record: Record<string, unknown>,
	meta: DoctypeMeta,
	registry: Map<string, DoctypeMeta>
): Record<string, unknown> {
	if (!meta.links) return record

	const merged = { ...record }

	for (const [fieldname, link] of Object.entries(meta.links)) {
		const isMany = link.cardinality === 'noneOrMany' || link.cardinality === 'atLeastOne'

		if (isMany) {
			// Connection result: { nodes: [...] } → flatten to []
			const targetMeta = registry.get(link.target)
			if (!targetMeta) continue

			const connectionField = getConnectionFieldFromTarget(targetMeta, meta.tableName || '')
			const connectionResult = merged[connectionField] as { nodes?: unknown[] } | undefined
			if (connectionResult?.nodes) {
				merged[fieldname] = connectionResult.nodes
				delete merged[connectionField]
			} else {
				merged[fieldname] = []
				delete merged[connectionField]
			}
		}
		// 'one'/'atMostOne' links are already at the right fieldname
	}

	return merged
}

/**
 * Derive the connection field name matching the query builder's convention.
 * @internal
 */
function getConnectionFieldFromTarget(targetMeta: DoctypeMeta, parentTableName: string): string {
	const targetPlural = pluralize.plural(targetMeta.tableName || '')
	const targetPascal = toPascalCase(targetPlural)
	const fkPascal = toPascalCase(parentTableName) + 'Id'
	return `${targetPascal}By${fkPascal}`
}
