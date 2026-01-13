import { makeExtendSchemaPlugin, gql } from 'postgraphile/utils'
import { context, object } from 'postgraphile/grafast'

import { getMeta, getAllMeta, hasMeta } from '../registry/doctypes'
import { getHandler } from '../registry/actions'
import type { ActionContext, DoctypeMeta, GraphQLExecutor } from '../types'

export interface StonecropPluginOptions {
	executor: GraphQLExecutor
}

export const createStonecropPlugin = (options: StonecropPluginOptions) => {
	return makeExtendSchemaPlugin(() => {
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

			resolvers: {
				Query: {
					stonecropMeta(_parent, args: { doctype: string }) {
						return getMeta(args.doctype) ?? null
					},

					stonecropAllMeta() {
						return getAllMeta()
					},

					async stonecropRecord(_parent, args: { doctype: string; id: string }) {
						const meta = getMeta(args.doctype)
						if (!meta) {
							throw new Error(`Unknown doctype: ${args.doctype}`)
						}

						if (!meta.tableName) {
							throw new Error(`Doctype ${args.doctype} has no table mapping`)
						}

						const query = buildRecordQuery(meta)
						const result = await options.executor.query(query, { id: args.id })

						return {
							data: extractSingleResult(result, meta),
							doctype: args.doctype,
						}
					},

					async stonecropRecords(
						_parent,
						args: {
							doctype: string
							filters?: Record<string, unknown>
							orderBy?: string
							limit?: number
							offset?: number
						}
					) {
						const meta = getMeta(args.doctype)
						if (!meta) {
							throw new Error(`Unknown doctype: ${args.doctype}`)
						}

						if (!meta.tableName) {
							throw new Error(`Doctype ${args.doctype} has no table mapping`)
						}

						const query = buildListQuery(meta, args)
						const result = await options.executor.query(query, args)
						const data = extractListResult(result, meta)

						return {
							data,
							doctype: args.doctype,
							count: data.length,
						}
					},
				},

				Mutation: {
					async stonecropAction(_parent, args: { doctype: string; action: string; args?: unknown[] }) {
						const meta = getMeta(args.doctype)
						if (!meta) {
							return {
								success: false,
								data: null,
								error: `Unknown doctype: ${args.doctype}`,
							}
						}

						const actionDef = meta.workflow?.actions?.[args.action]
						if (!actionDef) {
							return {
								success: false,
								data: null,
								error: `Unknown action: ${args.action} on ${args.doctype}`,
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
							const result = await handler(args.args ?? [], actionContext)
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
