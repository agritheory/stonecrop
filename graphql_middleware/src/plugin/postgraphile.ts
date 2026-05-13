import type { DoctypeMeta, LinkDeclaration, LazyFetch, SyncFetch } from '@stonecrop/schema'
import { snakeToCamel, toPascalCase } from '@stonecrop/schema'
import { constant, lambda, object, loadOne } from 'postgraphile/grafast'
import { GraphileConfig } from 'postgraphile/graphile-build'
import { extendSchema, gql } from 'postgraphile/utils'
import pluralize from 'pluralize'

import { getHandler, registerHandler } from '../registry/actions'
import { getMeta, getAllMeta } from '../registry/doctypes'
import type {
	ActionContext,
	GraphQLExecutor,
	ReverseConnectionParams,
	BuildRecordQueryOptions,
	BuildNestedSelectionsParams,
	BuildListQueryArgs,
	MergeNestedResultsParams,
	ExtractSingleResultParams,
	ExtractListResultParams,
} from '../types'

/**
 * Inflection callbacks for mapping table names to GraphQL query field names.
 * Override these when using a non-Amber inflection preset (e.g., V4, SimplifyInflection).
 *
 * Defaults match the PostGraphile Amber preset conventions.
 * @public
 */
export interface StonecropInflectionConfig {
	/**
	 * Given a table name, return the GraphQL field name for fetching a single record by ID.
	 * @example Amber default: "sales_orders" → "salesOrderById"
	 * @example V4 preset: "sales_orders" → "salesOrderByRowId"
	 */
	recordFieldName?: (tableName: string) => string

	/**
	 * Given a table name, return the GraphQL field name for fetching a list/connection.
	 * @example Amber default: "sales_orders" → "allSalesOrders"
	 * @example SimplifyInflection: "sales_orders" → "salesOrders"
	 */
	connectionFieldName?: (tableName: string) => string

	/**
	 * Given a table name, return the GraphQL OrderBy enum type name.
	 * @example Amber default: "sales_orders" → "SalesOrdersOrderBy"
	 */
	orderByTypeName?: (tableName: string) => string

	/**
	 * Given a table name, return the GraphQL argument name used to look up a record by PK.
	 * @example Amber default (Relay Global ID): "sales_orders" → "id"
	 * @example row_id PK: "sales_orders" → "rowId"
	 */
	recordArgName?: (tableName: string) => string

	/**
	 * Given a table name, return the GraphQL variable type for the PK argument.
	 * @example Default UUID PK: "sales_orders" → "UUID!"
	 * @example Integer PK: "sales_orders" → "Int!"
	 */
	recordArgType?: (tableName: string) => string

	/**
	 * Derive the GraphQL connection field name for a reverse-FK link.
	 * PostGraphile convention: `{targetPlural}By{FkColumnPascal}Id`
	 * - When backlink is provided: FK column is derived from the backlink field
	 * - When backlink is absent: FK column is derived from the parent doctype
	 * @example Recipe → RecipeTasksByRecipeId
	 */
	reverseConnectionName?: (params: {
		/** Parent doctype slug */
		doctype: string
		/** Link key on the parent */
		linkName: string
		/** Link field on the target that points back to the parent (optional) */
		backlink?: string
		/** Target doctype slug */
		target: string
	}) => string
}

/**
 * Options for stonecropRecord queries
 * @public
 */
export interface StonecropRecordOptions {
	/** Include nested/related records */
	includeNested?: boolean | string[]
	/** Maximum nesting depth */
	maxDepth?: number
}

/**
 * Options for creating a Stonecrop PostGraphile plugin
 * @public
 */
export interface StonecropPluginOptions {
	/** GraphQL executor for running queries/mutations */
	executor: GraphQLExecutor

	/**
	 * Override inflection conventions for mapping table names to GraphQL field names.
	 * Defaults to PostGraphile Amber preset conventions.
	 */
	inflection?: StonecropInflectionConfig
}

/**
 * Create a PostGraphile plugin that extends the GraphQL schema with Stonecrop functionality
 * @param options - Plugin configuration options
 * @returns A PostGraphile plugin
 * @public
 */
export const createStonecropPlugin = (options: StonecropPluginOptions): GraphileConfig.Plugin => {
	// Resolve inflection callbacks with Amber defaults
	const recordFieldName = options.inflection?.recordFieldName ?? defaultRecordFieldName
	const connectionFieldName = options.inflection?.connectionFieldName ?? defaultConnectionFieldName
	const orderByTypeName = options.inflection?.orderByTypeName ?? defaultOrderByTypeName
	const recordArgName = options.inflection?.recordArgName ?? defaultRecordArgName
	const recordArgType = options.inflection?.recordArgType ?? defaultRecordArgType
	const reverseConnectionName = options.inflection?.reverseConnectionName ?? defaultReverseConnectionName

	return extendSchema(() => {
		return {
			typeDefs: gql`
				type StonecropFieldMeta {
					fieldname: String!
					fieldtype: String!
					component: String
					label: String
					width: String
					align: String
					required: Boolean
					readOnly: Boolean
					edit: Boolean
					hidden: Boolean
					default: JSON
					options: JSON
					mask: String
					precision: Int
					scale: Int
					mode: String
					validation: JSON
				}

				type StonecropWorkflowAction {
					label: String!
					handler: String!
					requiredFields: [String!]
					allowedStates: [String!]
					confirm: Boolean
					args: JSON
				}

				type StonecropWorkflowMeta {
					states: [String!]
					actions: [StonecropWorkflowAction!]
				}

				type StonecropDoctypeMeta {
					name: String!
					slug: String
					tableName: String
					fields: [StonecropFieldMeta!]!
					workflow: StonecropWorkflowMeta
					inherits: String
				}

				type StonecropRecordResult {
					data: JSON
					doctype: String!
					unknownLinks: [String!]
				}

				type StonecropRecordsResult {
					data: [JSON!]!
					doctype: String!
					count: Int!
				}

				type StonecropActionResult {
					success: Boolean!
					data: JSON
					error: String
				}

				extend type Query {
					stonecropMeta(doctype: String!): StonecropDoctypeMeta
					stonecropAllMeta: [StonecropDoctypeMeta!]!
					stonecropRecord(doctype: String!, id: String!, options: JSON): StonecropRecordResult
					stonecropRecords(
						doctype: String!
						filters: JSON
						orderBy: String
						limit: Int
						offset: Int
					): StonecropRecordsResult
				}

				extend type Mutation {
					stonecropAction(doctype: String!, action: String!, args: JSON): StonecropActionResult!
				}
			`,

			objects: {
				Query: {
					plans: {
						stonecropMeta(_: any, { $doctype }: any) {
							return lambda($doctype, (doctype: unknown) => {
								const meta = getMeta(doctype as string)
								return meta ?? null
							})
						},

						stonecropAllMeta() {
							return constant(getAllMeta())
						},

						stonecropRecord(_: any, { $doctype, $id, $options }: any) {
							return loadOne(
								object({ doctype: $doctype, id: $id, options: $options }),
								async (specs: readonly any[]) => {
									return await Promise.all(
										specs.map(async spec => {
											const meta = getMeta(spec.doctype)
											if (!meta) {
												throw new Error(`Unknown doctype: ${spec.doctype}`)
											}

											if (!meta.tableName) {
												throw new Error(`Doctype ${spec.doctype} has no table mapping`)
											}

											const recordOptions = spec.options ?? {}

											const query = buildRecordQuery(
												meta,
												recordFieldName,
												recordArgName,
												recordArgType,
												getMeta,
												recordOptions.includeNested
													? {
															includeNested: recordOptions.includeNested,
															maxDepth: recordOptions.maxDepth,
														}
													: undefined,
												reverseConnectionName
											)
											const result = await options.executor.query(query, {
												[recordArgName(meta.tableName!)]: spec.id,
											})

											let data = extractSingleResult({ result, meta, recordFieldName })

											if (recordOptions.includeNested && data && meta.links) {
												data = mergeNestedResults({
													record: data as Record<string, unknown>,
													meta,
													getMeta,
													reverseConnectionNameFn: reverseConnectionName,
												})
											}

											const unknownLinks =
												Array.isArray(recordOptions.includeNested) && meta.links
													? recordOptions.includeNested.filter((name: string) => !(name in meta.links!))
													: undefined

											return {
												data,
												doctype: spec.doctype,
												...(unknownLinks ? { unknownLinks } : {}),
											}
										})
									)
								}
							)
						},

						stonecropRecords(_: any, { $doctype, $filters, $orderBy, $limit, $offset }: any) {
							return loadOne(
								object({
									doctype: $doctype,
									filters: $filters,
									orderBy: $orderBy,
									limit: $limit,
									offset: $offset,
								}),
								async (specs: readonly any[]) => {
									return await Promise.all(
										specs.map(async spec => {
											const meta = getMeta(spec.doctype)
											if (!meta) {
												throw new Error(`Unknown doctype: ${spec.doctype}`)
											}

											if (!meta.tableName) {
												throw new Error(`Doctype ${spec.doctype} has no table mapping`)
											}

											const query = buildListQuery(
												meta,
												{
													limit: spec.limit,
													offset: spec.offset,
													orderBy: spec.orderBy,
												},
												connectionFieldName,
												orderByTypeName
											)
											const result = await options.executor.query(query, {
												limit: spec.limit,
												offset: spec.offset,
												orderBy: spec.orderBy,
											})
											const data = extractListResult({ result, meta, connectionFieldName })

											return {
												data,
												doctype: spec.doctype,
												count: data.length,
											}
										})
									)
								}
							)
						},
					},
				},

				Mutation: {
					plans: {
						stonecropAction(_: any, { $doctype, $action, $args: $actionArgs }: any) {
							return loadOne(
								object({
									doctype: $doctype,
									action: $action,
									actionArgs: $actionArgs,
								}),
								async (specs: readonly any[]) => {
									return await Promise.all(
										specs.map(async spec => {
											const meta = getMeta(spec.doctype)
											if (!meta) {
												return {
													success: false,
													data: null,
													error: `Unknown doctype: ${spec.doctype}`,
												}
											}

											const actionDef = meta.workflow?.actions?.[spec.action]
											if (!actionDef) {
												return {
													success: false,
													data: null,
													error: `Unknown action: ${spec.action} on ${spec.doctype}`,
												}
											}
											const handlerName = actionDef.handler
											const handler = getHandler(handlerName)
											if (!handler) {
												return {
													success: false,
													data: null,
													error: `Handler not registered: ${handlerName}`,
												}
											}

											const actionContext: ActionContext = {
												doctype: meta,
												executor: options.executor,
											}

											try {
												const result = await handler(spec.actionArgs ?? [], actionContext)
												return {
													success: true,
													data: result,
													error: null,
												}
											} catch (err) {
												return {
													success: false,
													data: null,
													error: err instanceof Error ? err.message : String(err),
												}
											}
										})
									)
								}
							)
						},
					},
				},
			},
		}
	})
}

// =============================================================================
// Inflection helpers — default to PostGraphile Amber preset conventions
// Uses `pluralize` for proper English singularization (handles irregular
// plurals like statuses→status, categories→category, addresses→address).
// snakeToCamel / toPascalCase are imported from @stonecrop/schema.
// =============================================================================

/**
 * Amber default: sales_orders → salesOrderById
 * Uses `pluralize` for proper singularization of irregular plurals.
 * Override via `StonecropInflectionConfig.recordFieldName` for non-standard PK columns.
 * @public
 */
function defaultRecordFieldName(tableName: string): string {
	const singular = pluralize.singular(tableName)
	return `${snakeToCamel(singular)}ById`
}

/**
 * Amber default: sales_orders → allSalesOrders
 * @public
 */
function defaultConnectionFieldName(tableName: string): string {
	return `all${toPascalCase(tableName)}`
}

/**
 * Amber default: sales_orders → SalesOrdersOrderBy
 * @public
 */
function defaultOrderByTypeName(tableName: string): string {
	return `${toPascalCase(tableName)}OrderBy`
}

/**
 * Default PK argument name: 'id' (standard Relay Global ID pattern).
 * Override via `StonecropInflectionConfig.recordArgName` when using row_id columns;
 * PostGraphile Amber generates `rowId: UUID!` for those fields.
 * @public
 */
function defaultRecordArgName(_tableName: string): string {
	return 'id'
}

/**
 * Default PK argument type: 'UUID!' (PostGraphile Amber default for UUID PKs).
 * Override via `StonecropInflectionConfig.recordArgType` when using non-UUID PKs
 * such as integer serials or Relay Global IDs ('ID!').
 * @public
 */
function defaultRecordArgType(_tableName: string): string {
	return 'UUID!'
}

/**
 * Default reverse connection name: derives PostGraphile's connection field convention.
 * PostGraphile convention: `{targetPlural}By{FkColumnPascal}Id`
 * - When backlink is defined: FK column is derived from the backlink field name
 * - When backlink is absent: FK column is derived from the parent doctype's table name
 * @public
 */
function defaultReverseConnectionName(params: {
	doctype: string
	linkName: string
	backlink?: string
	target: string
}): string {
	const targetPlural = pluralize.plural(params.target.replace(/-/g, '_'))
	// Use camelCase for target (matches PostGraphile Amber convention: recipeTasksByRecipeId)
	const targetCamel = snakeToCamel(targetPlural)
	// Use backlink if provided, otherwise derive from parent table name
	const fkSource = params.backlink || params.doctype
	// FK column name: uppercase first char, preserve rest of camelCase
	const fkPascal = fkSource.charAt(0).toUpperCase() + snakeToCamel(fkSource).slice(1)
	return `${targetCamel}By${fkPascal}Id`
}

/**
 * Check if a cardinality represents a "many" relationship
 */
function isManyCardinality(cardinality: string): boolean {
	return cardinality === 'noneOrMany' || cardinality === 'atLeastOne'
}

// =============================================================================
// Query builders — generate GraphQL queries to send to the underlying schema
// =============================================================================

const DEFAULT_SYNC_LIMIT = 50

/**
 * Fieldtypes that map to GraphQL object/connection types and require sub-selections.
 * These fields are excluded from generated query field selections.
 * @public
 */
const RELATION_FIELDTYPES = new Set(['Link'])

/**
 * Filter fields to only those directly queryable as scalars, excluding Link and Doctype
 * relation fields that require GraphQL sub-selections.
 * @public
 */
function queryableFieldNames(meta: DoctypeMeta): string {
	return meta.fields
		.filter(f => !RELATION_FIELDTYPES.has(f.fieldtype))
		.map(f => f.fieldname)
		.join('\n      ')
}

/**
 * Get the effective fetch strategy for a link, applying cardinality-based defaults.
 */
function getEffectiveFetchStrategy(link: LinkDeclaration): SyncFetch | LazyFetch {
	if (link.fetch !== undefined) {
		return link.fetch as SyncFetch | LazyFetch
	}

	if (isManyCardinality(link.cardinality)) {
		return { method: 'sync', limit: DEFAULT_SYNC_LIMIT }
	} else {
		return { method: 'lazy' }
	}
}

/**
 * Get the effective blockWorkflows value for a link.
 */
function getEffectiveBlockWorkflows(link: LinkDeclaration): boolean {
	if (link.blockWorkflows !== undefined) {
		return link.blockWorkflows
	}
	const effectiveFetch = getEffectiveFetchStrategy(link)
	return effectiveFetch.method === 'sync'
}

/**
 * Build nested sub-selections for descendant links
 */
function buildNestedSelections(params: BuildNestedSelectionsParams): string {
	const { links, meta, includeSet, getMeta, seen, depth, maxDepth, reverseConnectionNameFn } = params

	if (maxDepth !== undefined && depth >= maxDepth) return ''

	const selections: string[] = []

	for (const [fieldname, link] of Object.entries(links)) {
		if (maxDepth !== undefined && depth >= maxDepth) break

		const effectiveBlockWorkflows = getEffectiveBlockWorkflows(link)
		const linkBlockWorkflowsExplicitTrue = link.blockWorkflows === true

		if (includeSet && !includeSet.has(fieldname) && !linkBlockWorkflowsExplicitTrue) {
			continue
		}

		const effectiveFetch = getEffectiveFetchStrategy(link)
		const shouldSkip =
			effectiveBlockWorkflows === false || (effectiveFetch.method !== 'sync' && !linkBlockWorkflowsExplicitTrue)
		if (shouldSkip) {
			continue
		}

		const targetMeta = getMeta(link.target)
		if (!targetMeta) continue

		const alreadySeen = seen.has(link.target)
		if (alreadySeen) {
		} else {
			seen.add(link.target)
		}
		const scalarFields = queryableFieldNames(targetMeta)

		let nestedLinks = ''
		if (!alreadySeen && targetMeta.links && targetMeta.tableName && (maxDepth === undefined || depth + 1 < maxDepth)) {
			const innerSelections = buildNestedSelections({
				links: targetMeta.links,
				meta: targetMeta,
				includeSet: null,
				getMeta,
				seen,
				depth: depth + 1,
				maxDepth,
				reverseConnectionNameFn,
			})
			if (innerSelections) {
				nestedLinks = '\n          ' + innerSelections
			}
			seen.delete(link.target)
		}

		const fullSelection = scalarFields + nestedLinks

		if (isManyCardinality(link.cardinality)) {
			const reverseParams: ReverseConnectionParams = {
				doctype: meta.slug || meta.name,
				linkName: fieldname,
				backlink: link.backlink,
				target: link.target,
			}
			const connectionField = reverseConnectionNameFn
				? reverseConnectionNameFn(reverseParams)
				: defaultReverseConnectionName(reverseParams)
			const limitArg =
				effectiveFetch.method === 'sync' && effectiveFetch.limit !== undefined
					? `first: ${effectiveFetch.limit}`
					: effectiveFetch.method === 'sync'
						? `first: ${DEFAULT_SYNC_LIMIT}`
						: ''
			selections.push(`
			${connectionField}${limitArg ? `(${limitArg})` : ''} {
				nodes {
					${fullSelection}
				}
			}`)
		} else {
			selections.push(`
			${fieldname} {
				${fullSelection}
			}`)
		}
	}

	return selections.join('')
}

/**
 * Build a GraphQL query to fetch a single record by ID.
 * When includeNested is set, recursively includes descendant link sub-selections.
 * @public
 */
function buildRecordQuery(
	meta: DoctypeMeta,
	recordFieldName: (t: string) => string,
	recordArgName: (t: string) => string,
	recordArgType: (t: string) => string,
	getMeta: (slug: string) => DoctypeMeta | undefined,
	options?: BuildRecordQueryOptions,
	reverseConnectionNameFn?: (params: ReverseConnectionParams) => string
): string {
	const queryName = recordFieldName(meta.tableName!)
	const argName = recordArgName(meta.tableName!)
	const argType = recordArgType(meta.tableName!)

	const seen = new Set<string>([meta.slug || meta.name])

	let selection = queryableFieldNames(meta)

	if (options?.includeNested && meta.links) {
		const includeSet = Array.isArray(options.includeNested) ? new Set(options.includeNested) : null

		const nestedSelections = buildNestedSelections({
			links: meta.links,
			meta,
			includeSet,
			getMeta,
			seen,
			depth: 0,
			maxDepth: options.maxDepth,
			reverseConnectionNameFn,
		})

		if (nestedSelections) {
			selection += '\n      ' + nestedSelections
		}
	}

	return `
		query GetRecord($${argName}: ${argType}) {
			${queryName}(${argName}: $${argName}) {
				${selection}
			}
		}
	`
}

/**
 * Build a GraphQL connection query to fetch a list of records.
 * Only declares variables ($limit, $offset, $orderBy) that are actually used in the query,
 * avoiding GraphQL spec §5.8.3 violations from unused variable declarations.
 * Excludes Link and Doctype relation fields from the selection set.
 * @public
 */
function buildListQuery(
	meta: DoctypeMeta,
	args: BuildListQueryArgs,
	connectionFieldName: (t: string) => string,
	orderByTypeName: (t: string) => string
): string {
	const fieldNames = queryableFieldNames(meta)
	const connectionName = connectionFieldName(meta.tableName!)
	const orderByType = orderByTypeName(meta.tableName!)

	const varDecls: string[] = []
	const queryArgs: string[] = []
	if (args.limit) {
		varDecls.push('$limit: Int')
		queryArgs.push(`first: $limit`)
	}
	if (args.offset) {
		varDecls.push('$offset: Int')
		queryArgs.push(`offset: $offset`)
	}
	if (args.orderBy) {
		varDecls.push(`$orderBy: [${orderByType}!]`)
		queryArgs.push(`orderBy: $orderBy`)
	}

	const varStr = varDecls.length > 0 ? `(${varDecls.join(', ')})` : ''
	const argsStr = queryArgs.length > 0 ? `(${queryArgs.join(', ')})` : ''

	return `
		query GetRecords${varStr} {
			${connectionName}${argsStr} {
				nodes {
				${fieldNames}
				}
			}
		}
	`
}

/**
 * Merge nested connection results into flat arrays.
 * For `noneOrMany`/`atLeastOne` links, the query returns `{ nodes: [...] }`.
 * This flattens them to just `[]` for easier consumption.
 * @public
 */
function mergeNestedResults(params: MergeNestedResultsParams): Record<string, unknown> {
	const { record, meta, getMeta, reverseConnectionNameFn } = params
	if (!meta.links) return record

	const merged = { ...record }

	for (const [fieldname, link] of Object.entries(meta.links)) {
		const isMany = isManyCardinality(link.cardinality)

		if (isMany) {
			const targetMeta = getMeta(link.target)
			if (!targetMeta) continue

			const reverseParams: ReverseConnectionParams = {
				doctype: meta.slug || meta.name,
				linkName: fieldname,
				backlink: link.backlink || fieldname,
				target: link.target,
			}
			const connectionField = reverseConnectionNameFn
				? reverseConnectionNameFn(reverseParams)
				: defaultReverseConnectionName(reverseParams)
			const connectionResult = merged[connectionField] as { nodes?: unknown[] } | undefined
			if (connectionResult?.nodes) {
				merged[fieldname] = connectionResult.nodes
				delete merged[connectionField]
			} else {
				merged[fieldname] = []
				delete merged[connectionField]
			}
		}
	}

	return merged
}

/**
 * Extract a single record from a PostGraphile query result using the record field name.
 * @public
 */
function extractSingleResult(params: ExtractSingleResultParams): unknown {
	const { result, meta, recordFieldName } = params
	const queryName = recordFieldName(meta.tableName!)
	return (result as Record<string, unknown>)[queryName]
}

/**
 * Extract the list of nodes from a PostGraphile connection query result.
 * Returns an empty array if the connection field is absent.
 * @public
 */
function extractListResult(params: ExtractListResultParams): unknown[] {
	const { result, meta, connectionFieldName } = params
	const connectionName = connectionFieldName(meta.tableName!)
	const connection = (result as Record<string, unknown>)[connectionName] as {
		nodes: unknown[]
	}
	return connection?.nodes ?? []
}

// =============================================================================
// Exported for testing and advanced usage
// =============================================================================

export {
	defaultRecordFieldName,
	defaultConnectionFieldName,
	defaultOrderByTypeName,
	defaultRecordArgName,
	defaultRecordArgType,
	defaultReverseConnectionName,
	buildRecordQuery,
	buildListQuery,
	queryableFieldNames,
	RELATION_FIELDTYPES,
	extractSingleResult,
	extractListResult,
	mergeNestedResults,
}
