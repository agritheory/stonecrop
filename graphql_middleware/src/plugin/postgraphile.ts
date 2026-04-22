import type { DoctypeMeta, LinkDeclaration, LazyFetch, SyncFetch } from '@stonecrop/schema'
import { snakeToCamel, toPascalCase } from '@stonecrop/schema'
import type { PgResource, WithPgClient } from 'postgraphile/@dataplan/pg'
import { context } from 'postgraphile/grafast'
import type { ExecutableStep, FieldArgs } from 'postgraphile/grafast'
import type { GraphileConfig } from 'postgraphile/graphile-build'
import { extendSchema, gql } from 'postgraphile/utils'
import pluralize from 'pluralize'

import { getHandler } from '../registry/actions'
import { getMeta, getAllMeta } from '../registry/doctypes'
import type {
	ActionContext,
	BuildListQueryArgs,
	BuildNestedSelectionsParams,
	BuildRecordQueryOptions,
	ExtractListResultParams,
	ExtractSingleResultParams,
	MergeNestedResultsParams,
	ReverseConnectionParams,
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
	/**
	 * Override inflection conventions for mapping table names to GraphQL field names.
	 * Defaults to PostGraphile Amber preset conventions.
	 */
	inflection?: StonecropInflectionConfig
}

type StonecropRecordSpec = {
	doctype: string
	id: string
	options: Record<string, unknown> | null
}

type StonecropRecordsSpec = {
	doctype: string
	filters: unknown
	orderBy: string | null
	limit: number | null
	offset: number | null
	options: unknown
}

type StonecropActionSpec = {
	doctype: string
	action: string
	actionArgs: unknown[] | null
	ctx: Grafast.Context & { withPgClient?: WithPgClient }
}

/**
 * Create a PostGraphile plugin that extends the GraphQL schema with Stonecrop functionality.
 * No arguments required — plan step wiring is entirely internal using pgResources from build.
 * @public
 */
export const createStonecropPlugin = (options?: StonecropPluginOptions): GraphileConfig.Plugin => {
	const recordFieldName = options?.inflection?.recordFieldName ?? defaultRecordFieldName
	const connectionFieldName = options?.inflection?.connectionFieldName ?? defaultConnectionFieldName
	const orderByTypeName = options?.inflection?.orderByTypeName ?? defaultOrderByTypeName
	const recordArgName = options?.inflection?.recordArgName ?? defaultRecordArgName
	const recordArgType = options?.inflection?.recordArgType ?? defaultRecordArgType
	const reverseConnectionName = options?.inflection?.reverseConnectionName ?? defaultReverseConnectionName

	return extendSchema(build => {
		const { pgResources, grafast } = build
		const { constant, lambda, object, sideEffect } = grafast

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
						options: JSON
					): StonecropRecordsResult
				}

				extend type Mutation {
					stonecropAction(doctype: String!, action: String!, args: JSON): StonecropActionResult!
				}
			`,

			objects: {
				Query: {
					plans: {
						stonecropMeta(_: ExecutableStep, { $doctype }: FieldArgs) {
							return lambda($doctype, (doctype: string) => {
								const meta = getMeta(doctype)
								return meta ?? null
							})
						},

						stonecropAllMeta() {
							return constant(getAllMeta())
						},

						stonecropRecord(_: ExecutableStep, { $doctype, $id, $options }: FieldArgs) {
							return lambda(object({ doctype: $doctype, id: $id, options: $options }), (spec: StonecropRecordSpec) => {
								const meta = getMeta(spec.doctype)
								if (!meta) {
									throw new Error(`Unknown doctype: ${spec.doctype}`)
								}
								if (!meta.tableName) {
									throw new Error(`Doctype ${spec.doctype} has no table mapping`)
								}

								const resource = (pgResources as Record<string, PgResource<string, any, any, any, any>>)[meta.tableName]
								if (!resource) {
									throw new Error(`No pgResource found for table: ${meta.tableName}`)
								}

								const recordOptions = (spec.options ?? {}) as StonecropRecordOptions
								const pkField = recordArgName(meta.tableName)

								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								const $record = resource.get({ [pkField]: spec.id } as any)
								const data = $record.record()

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
						},

						stonecropRecords(
							_: ExecutableStep,
							{ $doctype, $filters, $orderBy, $limit, $offset, $options }: FieldArgs
						) {
							return lambda(
								object({
									doctype: $doctype,
									filters: $filters,
									orderBy: $orderBy,
									limit: $limit,
									offset: $offset,
									options: $options,
								}),
								(spec: StonecropRecordsSpec) => {
									const meta = getMeta(spec.doctype)
									if (!meta) {
										throw new Error(`Unknown doctype: ${spec.doctype}`)
									}
									if (!meta.tableName) {
										throw new Error(`Doctype ${spec.doctype} has no table mapping`)
									}

									const resource = (pgResources as Record<string, PgResource<string, any, any, any, any>>)[
										meta.tableName
									]
									if (!resource) {
										throw new Error(`No pgResource found for table: ${meta.tableName}`)
									}

									const $select = resource.find()

									if (spec.limit) {
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										$select.setFirst(spec.limit as any)
									}
									if (spec.offset) {
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										$select.setOffset(spec.offset as any)
									}

									return {
										data: $select,
										doctype: spec.doctype,
										count: 0,
									}
								}
							)
						},
					},
				},

				Mutation: {
					plans: {
						stonecropAction(_: ExecutableStep, { $doctype, $action, $args: $actionArgs }: FieldArgs) {
							return sideEffect(
								object({
									doctype: $doctype,
									action: $action,
									actionArgs: $actionArgs,
									ctx: context(),
								}),
								async (spec: StonecropActionSpec) => {
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

									const handler = getHandler(actionDef.handler)
									if (!handler) {
										return {
											success: false,
											data: null,
											error: `Handler not registered: ${actionDef.handler}`,
										}
									}

									const actionContext: ActionContext = {
										doctype: meta,
										withPgClient: spec.ctx.withPgClient,
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
// @internal — removed in Phase 4 when inflection config is eliminated
// =============================================================================

/**
 * @internal
 */
function defaultRecordFieldName(tableName: string): string {
	const singular = pluralize.singular(tableName)
	return `${snakeToCamel(singular)}ById`
}

/**
 * @internal
 */
function defaultConnectionFieldName(tableName: string): string {
	return `all${toPascalCase(tableName)}`
}

/**
 * @internal
 */
function defaultOrderByTypeName(tableName: string): string {
	return `${toPascalCase(tableName)}OrderBy`
}

/**
 * @internal
 */
function defaultRecordArgName(_tableName: string): string {
	return 'id'
}

/**
 * @internal
 */
function defaultRecordArgType(_tableName: string): string {
	return 'UUID!'
}

/**
 * @internal
 */
function defaultReverseConnectionName(params: {
	doctype: string
	linkName: string
	backlink?: string
	target: string
}): string {
	const targetPlural = pluralize.plural(params.target.replace(/-/g, '_'))
	const targetCamel = snakeToCamel(targetPlural)
	const fkSource = params.backlink || params.doctype
	const fkPascal = fkSource.charAt(0).toUpperCase() + snakeToCamel(fkSource).slice(1)
	return `${targetCamel}By${fkPascal}Id`
}

function isManyCardinality(cardinality: string): boolean {
	return cardinality === 'noneOrMany' || cardinality === 'atLeastOne'
}

const DEFAULT_SYNC_LIMIT = 50

/**
 * Fieldtypes that map to GraphQL object/connection types and require sub-selections.
 * These fields are excluded from generated query field selections.
 * @public
 */
const RELATION_FIELDTYPES = new Set(['Link'])

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

function getEffectiveBlockWorkflows(link: LinkDeclaration): boolean {
	if (link.blockWorkflows !== undefined) {
		return link.blockWorkflows
	}
	const effectiveFetch = getEffectiveFetchStrategy(link)
	return effectiveFetch.method === 'sync'
}

// =============================================================================
// Query builders — for stonecropAction only (Phase 4 removes these)
// =============================================================================

/**
 * @internal — Phase 4: removed when inflection config eliminated
 */
function queryableFieldNames(meta: DoctypeMeta): string {
	return meta.fields
		.filter(f => f.fieldtype !== 'Link')
		.map(f => f.fieldname)
		.join('\n      ')
}

/**
 * @internal — Phase 4: removed when inflection config eliminated
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
		if (!alreadySeen) {
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
 * @internal — Phase 4: removed when inflection config eliminated
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
 * @internal — Phase 4: removed when inflection config eliminated
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
 * @internal — Phase 4: removed when inflection config eliminated
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
 * @internal — Phase 4: removed when inflection config eliminated
 */
function extractSingleResult(params: ExtractSingleResultParams): unknown {
	const { result, meta, recordFieldName } = params
	const queryName = recordFieldName(meta.tableName!)
	return (result as Record<string, unknown>)[queryName]
}

/**
 * @internal — Phase 4: removed when inflection config eliminated
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
