import { extendSchema, gql } from 'postgraphile/utils'
import { constant, lambda, object, loadOne } from 'postgraphile/grafast'
import { GraphileConfig } from 'postgraphile/graphile-build'

import { getHandler } from '../registry/actions'
import { getMeta, getAllMeta } from '../registry/doctypes'
import type { ActionContext, DoctypeMeta, GraphQLExecutor } from '../types'

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

	return extendSchema(() => {
		return {
			typeDefs: gql`
				type StonecropFieldMeta {
					fieldname: String!
					fieldtype: String!
					label: String
					required: Boolean
					options: JSON
				}

				type StonecropActionDefinition {
					label: String!
					handler: String!
					requiredFields: [String!]
					allowedStates: [String!]
					confirm: Boolean
					args: JSON
				}

				type StonecropWorkflowMeta {
					states: [String!]
					actions: JSON
				}

				type StonecropDoctypeMeta {
					name: String!
					tableName: String
					fields: [StonecropFieldMeta!]!
					workflow: StonecropWorkflowMeta
					listDoctype: String
					parentDoctype: String
				}

				type StonecropRecordResult {
					data: JSON
					doctype: String!
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
					stonecropRecord(doctype: String!, id: String!): StonecropRecordResult
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
						stonecropMeta(_plan: any, fieldArgs: any) {
							const $doctype = fieldArgs.getRaw().doctype
							return lambda($doctype, doctype => {
								const meta = getMeta(doctype as string)
								return meta ?? null
							})
						},

						stonecropAllMeta() {
							return constant(getAllMeta())
						},

						stonecropRecord(_plan: any, fieldArgs: any) {
							const $doctype = fieldArgs.getRaw().doctype
							const $id = fieldArgs.getRaw().id

							return loadOne(object({ doctype: $doctype, id: $id }), async (specs: readonly any[]) => {
								return await Promise.all(
									specs.map(async spec => {
										const meta = getMeta(spec.doctype)
										if (!meta) {
											throw new Error(`Unknown doctype: ${spec.doctype}`)
										}

										if (!meta.tableName) {
											throw new Error(`Doctype ${spec.doctype} has no table mapping`)
										}

										const query = buildRecordQuery(meta, recordFieldName)
										const result = await options.executor.query(query, { id: spec.id })

										return {
											data: extractSingleResult(result, meta, recordFieldName),
											doctype: spec.doctype,
										}
									})
								)
							})
						},

						stonecropRecords(_plan: any, fieldArgs: any) {
							const $args = fieldArgs.getRaw()
							const $doctype = $args.doctype
							const $filters = $args.filters
							const $orderBy = $args.orderBy
							const $limit = $args.limit
							const $offset = $args.offset

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
											const data = extractListResult(result, meta, connectionFieldName)

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
						stonecropAction(_plan: any, fieldArgs: any) {
							const $args = fieldArgs.getRaw()
							const $doctype = $args.doctype
							const $action = $args.action
							const $actionArgs = $args.args

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
// =============================================================================

function toCamelCase(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function toPascalCase(str: string): string {
	const camel = toCamelCase(str)
	return camel.charAt(0).toUpperCase() + camel.slice(1)
}

/** Amber default: sales_orders → salesOrderById */
function defaultRecordFieldName(tableName: string): string {
	// sales_orders -> salesOrder (remove trailing 's' and camelCase) + ById
	const singular = tableName.replace(/s$/, '')
	return `${toCamelCase(singular)}ById`
}

/** Amber default: sales_orders → allSalesOrders */
function defaultConnectionFieldName(tableName: string): string {
	return `all${toPascalCase(tableName)}`
}

/** Amber default: sales_orders → SalesOrdersOrderBy */
function defaultOrderByTypeName(tableName: string): string {
	return `${toPascalCase(tableName)}OrderBy`
}

// =============================================================================
// Query builders — generate GraphQL queries to send to the underlying schema
// =============================================================================

function buildRecordQuery(meta: DoctypeMeta, recordFieldName: (t: string) => string): string {
	const fieldNames = meta.fields.map(f => f.fieldname).join('\n      ')
	const queryName = recordFieldName(meta.tableName!)

	return `
		query GetRecord($id: UUID!) {
			${queryName}(id: $id) {
				${fieldNames}
			}
		}
	`
}

function buildListQuery(
	meta: DoctypeMeta,
	args: { limit?: number; offset?: number; orderBy?: string },
	connectionFieldName: (t: string) => string,
	orderByTypeName: (t: string) => string
): string {
	const fieldNames = meta.fields.map(f => f.fieldname).join('\n          ')
	const connectionName = connectionFieldName(meta.tableName!)
	const orderByType = orderByTypeName(meta.tableName!)

	const queryArgs: string[] = []
	if (args.limit) queryArgs.push(`first: $limit`)
	if (args.offset) queryArgs.push(`offset: $offset`)
	if (args.orderBy) queryArgs.push(`orderBy: $orderBy`)

	const argsStr = queryArgs.length > 0 ? `(${queryArgs.join(', ')})` : ''

	return `
		query GetRecords($limit: Int, $offset: Int, $orderBy: [${orderByType}!]) {
			${connectionName}${argsStr} {
				nodes {
				${fieldNames}
				}
			}
		}
	`
}

function extractSingleResult(result: unknown, meta: DoctypeMeta, recordFieldName: (t: string) => string): unknown {
	const queryName = recordFieldName(meta.tableName!)
	return (result as Record<string, unknown>)[queryName]
}

function extractListResult(result: unknown, meta: DoctypeMeta, connectionFieldName: (t: string) => string): unknown[] {
	const connectionName = connectionFieldName(meta.tableName!)
	const connection = (result as Record<string, unknown>)[connectionName] as {
		nodes: unknown[]
	}
	return connection?.nodes ?? []
}
