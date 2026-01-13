import { extendSchema, gql } from 'postgraphile/utils'
import { constant, lambda, object, loadOne } from 'postgraphile/grafast'
import { GraphileConfig } from 'postgraphile/graphile-build'

import { getHandler } from '../registry/actions'
import { getMeta, getAllMeta } from '../registry/doctypes'
import type { ActionContext, DoctypeMeta, GraphQLExecutor } from '../types'

/**
 * Options for creating a Stonecrop PostGraphile plugin
 * @public
 */
export interface StonecropPluginOptions {
	executor: GraphQLExecutor
}

/**
 * Create a PostGraphile plugin that extends the GraphQL schema with Stonecrop functionality
 * @param options - Plugin configuration options
 * @returns A PostGraphile plugin
 * @public
 */
export const createStonecropPlugin = (options: StonecropPluginOptions): GraphileConfig.Plugin => {
	return extendSchema(() => {
		return {
			typeDefs: gql`
				scalar JSON

				type FieldMeta {
					fieldname: String!
					fieldtype: String!
					label: String
					required: Boolean
					options: JSON
				}

				type ActionDefinition {
					label: String!
					handler: String!
					requiredFields: [String!]
					allowedStates: [String!]
					confirm: Boolean
					args: JSON
				}

				type WorkflowMeta {
					states: [String!]
					actions: JSON
				}

				type DoctypeMeta {
					name: String!
					tableName: String
					fields: [FieldMeta!]!
					workflow: WorkflowMeta
					listDoctype: String
					parentDoctype: String
				}

				type RecordResult {
					data: JSON
					doctype: String!
				}

				type RecordsResult {
					data: [JSON!]!
					doctype: String!
					count: Int!
				}

				type ActionResult {
					success: Boolean!
					data: JSON
					error: String
				}

				type Query {
					stonecropMeta(doctype: String!): DoctypeMeta
					stonecropAllMeta: [DoctypeMeta!]!
					stonecropRecord(doctype: String!, id: String!): RecordResult
					stonecropRecords(doctype: String!, filters: JSON, orderBy: String, limit: Int, offset: Int): RecordsResult
				}

				type Mutation {
					stonecropAction(doctype: String!, action: String!, args: JSON): ActionResult!
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

										const query = buildRecordQuery(meta)
										const result = await options.executor.query(query, { id: spec.id })

										return {
											data: extractSingleResult(result, meta),
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

											const query = buildListQuery(meta, {
												limit: spec.limit,
												offset: spec.offset,
												orderBy: spec.orderBy,
											})
											const result = await options.executor.query(query, {
												limit: spec.limit,
												offset: spec.offset,
												orderBy: spec.orderBy,
											})
											const data = extractListResult(result, meta)

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

// Query builders - these generate GraphQL queries to send to the underlying schema

function toCamelCase(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function toConnectionName(tableName: string): string {
	// sales_orders -> allSalesOrders
	const camel = toCamelCase(tableName)
	return `all${camel.charAt(0).toUpperCase()}${camel.slice(1)}`
}

function toSingularName(tableName: string): string {
	// sales_orders -> salesOrder (remove trailing 's' and camelCase)
	const singular = tableName.replace(/s$/, '')
	return toCamelCase(singular)
}

function buildRecordQuery(meta: DoctypeMeta): string {
	const fieldNames = meta.fields.map(f => f.fieldname).join('\n      ')
	const queryName = `${toSingularName(meta.tableName!)}ById`

	return `
		query GetRecord($id: UUID!) {
			${queryName}(id: $id) {
				${fieldNames}
			}
		}
	`
}

function buildListQuery(meta: DoctypeMeta, args: { limit?: number; offset?: number; orderBy?: string }): string {
	const fieldNames = meta.fields.map(f => f.fieldname).join('\n          ')
	const connectionName = toConnectionName(meta.tableName!)

	const queryArgs: string[] = []
	if (args.limit) queryArgs.push(`first: $limit`)
	if (args.offset) queryArgs.push(`offset: $offset`)
	if (args.orderBy) queryArgs.push(`orderBy: $orderBy`)

	const argsStr = queryArgs.length > 0 ? `(${queryArgs.join(', ')})` : ''

	return `
		query GetRecords($limit: Int, $offset: Int, $orderBy: [${toCamelCase(meta.tableName!)}OrderBy!]) {
			${connectionName}${argsStr} {
				nodes {
				${fieldNames}
				}
			}
		}
	`
}

function extractSingleResult(result: unknown, meta: DoctypeMeta): unknown {
	const queryName = `${toSingularName(meta.tableName!)}ById`
	return (result as Record<string, unknown>)[queryName]
}

function extractListResult(result: unknown, meta: DoctypeMeta): unknown[] {
	const connectionName = toConnectionName(meta.tableName!)
	const connection = (result as Record<string, unknown>)[connectionName] as {
		nodes: unknown[]
	}
	return connection?.nodes ?? []
}
