import type { DoctypeMeta } from '@stonecrop/schema'
import { snakeToCamel, toPascalCase } from '@stonecrop/schema'
import { constant, lambda, object, loadOne } from 'postgraphile/grafast'
import { GraphileConfig } from 'postgraphile/graphile-build'
import { extendSchema, gql } from 'postgraphile/utils'
import pluralize from 'pluralize'

import { getHandler, registerHandler } from '../registry/actions'
import { getMeta, getAllMeta } from '../registry/doctypes'
import type { ActionContext, GraphQLExecutor } from '../types'

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
	 * Given a table name, return the GraphQL mutation field name for creating a record.
	 * @example Amber default: "resources" → "createResource"
	 * @example snake_case: "sales_orders" → "createSalesOrder"
	 */
	createMutationName?: (tableName: string) => string

	/**
	 * Given a table name, return the GraphQL mutation field name for updating a record.
	 * @example Amber default: "resources" → "updateResourceById"
	 * @example row_id variant: "resources" → "updateResourceByRowId"
	 */
	updateMutationName?: (tableName: string) => string

	/**
	 * Given a table name, return the GraphQL mutation field name for deleting a record.
	 * @example Amber default: "resources" → "deleteResourceById"
	 * @example row_id variant: "resources" → "deleteResourceByRowId"
	 */
	deleteMutationName?: (tableName: string) => string

	/**
	 * Given a table name, return the camelCase type name used in mutation result payloads.
	 * PostGraphile nests the returned record under this key inside the mutation result.
	 * @example Amber default: "resources" → "resource", "sales_orders" → "salesOrder"
	 */
	recordTypeName?: (tableName: string) => string
}

/**
 * Action names that map to built-in write operations when no workflow action
 * definition is found. Requires `registerWriteHandlers()` to have been called.
 * @public
 */
const BUILTIN_WRITE_ACTIONS = new Set(['create', 'update', 'delete'])

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
						stonecropMeta(_: any, { $doctype }: any) {
							return lambda($doctype, (doctype: unknown) => {
								const meta = getMeta(doctype as string)
								return meta ?? null
							})
						},

						stonecropAllMeta() {
							return constant(getAllMeta())
						},

						stonecropRecord(_: any, { $doctype, $id }: any) {
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

										const query = buildRecordQuery(meta, recordFieldName, recordArgName, recordArgType)
										const result = await options.executor.query(query, {
											[recordArgName(meta.tableName!)]: spec.id,
										})

										return {
											data: extractSingleResult(result, meta, recordFieldName),
											doctype: spec.doctype,
										}
									})
								)
							})
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
											let handlerName: string
											if (actionDef) {
												handlerName = actionDef.handler
											} else if (meta.tableName && BUILTIN_WRITE_ACTIONS.has(spec.action)) {
												// Fall back to built-in write handler when no explicit workflow action is defined.
												// Requires registerWriteHandlers() to have been called at app startup.
												handlerName = spec.action
											} else {
												return {
													success: false,
													data: null,
													error: `Unknown action: ${spec.action} on ${spec.doctype}`,
												}
											}

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
 * Amber default: resources → createResource, sales_orders → createSalesOrder
 * @public
 */
function defaultCreateMutationName(tableName: string): string {
	const singular = pluralize.singular(tableName)
	return `create${toPascalCase(singular)}`
}

/**
 * Amber default: resources → updateResourceById, sales_orders → updateSalesOrderById
 * @public
 */
function defaultUpdateMutationName(tableName: string): string {
	const singular = pluralize.singular(tableName)
	return `update${toPascalCase(singular)}ById`
}

/**
 * Amber default: resources → deleteResourceById, sales_orders → deleteSalesOrderById
 * @public
 */
function defaultDeleteMutationName(tableName: string): string {
	const singular = pluralize.singular(tableName)
	return `delete${toPascalCase(singular)}ById`
}

/**
 * Amber default: resources → resource, sales_orders → salesOrder
 * Returns the camelCase type name that PostGraphile nests the record under inside
 * mutation result payloads (e.g. `createResource.resource`, `updateResourceById.resource`).
 * @public
 */
function defaultRecordTypeName(tableName: string): string {
	return snakeToCamel(pluralize.singular(tableName))
}

// =============================================================================
// Query builders — generate GraphQL queries to send to the underlying schema
// =============================================================================

/**
 * Fieldtypes that map to GraphQL object/connection types and require sub-selections.
 * These fields are excluded from generated query field selections.
 * @public
 */
const RELATION_FIELDTYPES = new Set(['Link', 'Doctype'])

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
 * Build a GraphQL query to fetch a single record by ID.
 * Excludes Link and Doctype relation fields from the selection set.
 * The PK argument name and type are configurable via `StonecropInflectionConfig.recordArgName`
 * and `StonecropInflectionConfig.recordArgType` to match the target schema's conventions
 * (e.g. `rowId: UUID!` for PostGraphile Amber with row_id columns).
 * @public
 */
function buildRecordQuery(
	meta: DoctypeMeta,
	recordFieldName: (t: string) => string,
	recordArgName: (t: string) => string,
	recordArgType: (t: string) => string
): string {
	const fieldNames = queryableFieldNames(meta)
	const queryName = recordFieldName(meta.tableName!)
	const argName = recordArgName(meta.tableName!)
	const argType = recordArgType(meta.tableName!)

	return `
		query GetRecord($${argName}: ${argType}) {
			${queryName}(${argName}: $${argName}) {
				${fieldNames}
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
	args: { limit?: number; offset?: number; orderBy?: string },
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
 * Extract a single record from a PostGraphile query result using the record field name.
 * @internal
 */
function extractSingleResult(result: unknown, meta: DoctypeMeta, recordFieldName: (t: string) => string): unknown {
	const queryName = recordFieldName(meta.tableName!)
	return (result as Record<string, unknown>)[queryName]
}

/**
 * Extract the list of nodes from a PostGraphile connection query result.
 * Returns an empty array if the connection field is absent.
 * @internal
 */
function extractListResult(result: unknown, meta: DoctypeMeta, connectionFieldName: (t: string) => string): unknown[] {
	const connectionName = connectionFieldName(meta.tableName!)
	const connection = (result as Record<string, unknown>)[connectionName] as {
		nodes: unknown[]
	}
	return connection?.nodes ?? []
}

// =============================================================================
// Mutation builders — generate GraphQL mutations to send to the underlying schema
// =============================================================================

/**
 * Derive the typed input object name from a mutation field name.
 * e.g. createResource → CreateResourceInput, updateResourceById → UpdateResourceByIdInput
 * @internal
 */
function mutationInputTypeName(mutationName: string): string {
	return mutationName.charAt(0).toUpperCase() + mutationName.slice(1) + 'Input'
}

/**
 * Build a GraphQL mutation to create a new record.
 * Uses the PostGraphile Amber convention of nesting the input under the type name:
 * `createResource(input: { resource: { ...fields } })`.
 * The selection set uses scalar fields only (same exclusion rules as query builders).
 * @public
 */
function buildCreateMutation(
	meta: DoctypeMeta,
	createMutationName: (t: string) => string,
	recordTypeName: (t: string) => string
): string {
	const mutationName = createMutationName(meta.tableName!)
	const inputType = mutationInputTypeName(mutationName)
	const typeName = recordTypeName(meta.tableName!)
	const fieldNames = queryableFieldNames(meta)

	return `
		mutation CreateRecord($input: ${inputType}!) {
			${mutationName}(input: $input) {
				${typeName} {
					${fieldNames}
				}
			}
		}
	`
}

/**
 * Build a GraphQL mutation to update an existing record by its PK.
 * Uses the PostGraphile Amber convention: `updateResourceById(input: { id, patch: { ...fields } })`.
 * The selection set uses scalar fields only.
 * @public
 */
function buildUpdateMutation(
	meta: DoctypeMeta,
	updateMutationName: (t: string) => string,
	recordTypeName: (t: string) => string
): string {
	const mutationName = updateMutationName(meta.tableName!)
	const inputType = mutationInputTypeName(mutationName)
	const typeName = recordTypeName(meta.tableName!)
	const fieldNames = queryableFieldNames(meta)

	return `
		mutation UpdateRecord($input: ${inputType}!) {
			${mutationName}(input: $input) {
				${typeName} {
					${fieldNames}
				}
			}
		}
	`
}

/**
 * Build a GraphQL mutation to delete a record by its PK.
 * Uses the PostGraphile Amber convention: `deleteResourceById(input: { id })`.
 * The selection set uses scalar fields only (the deleted record is returned).
 * @public
 */
function buildDeleteMutation(
	meta: DoctypeMeta,
	deleteMutationName: (t: string) => string,
	recordTypeName: (t: string) => string
): string {
	const mutationName = deleteMutationName(meta.tableName!)
	const inputType = mutationInputTypeName(mutationName)
	const typeName = recordTypeName(meta.tableName!)
	const fieldNames = queryableFieldNames(meta)

	return `
		mutation DeleteRecord($input: ${inputType}!) {
			${mutationName}(input: $input) {
				${typeName} {
					${fieldNames}
				}
			}
		}
	`
}

/**
 * Extract the record from a PostGraphile mutation result.
 * PostGraphile nests the returned record under the type name inside the mutation field,
 * e.g. `result.createResource.resource`, `result.updateResourceById.resource`.
 * @public
 */
function extractMutationResult(result: unknown, mutationFieldName: string, recordTypeName: string): unknown {
	const mutationResult = (result as Record<string, unknown>)[mutationFieldName] as Record<string, unknown>
	return mutationResult?.[recordTypeName]
}

// =============================================================================
// Write action handlers — register built-in create/update/delete handlers
// =============================================================================

/**
 * Register built-in write action handlers for `create`, `update`, and `delete`.
 *
 * Each handler receives standard args:
 * - `create`:  `args[0]` = record data (`Record<string, unknown>`)
 * - `update`:  `args[0]` = record id (`string`), `args[1]` = patch (`Record<string, unknown>`)
 * - `delete`:  `args[0]` = record id (`string`)
 *
 * The handlers translate these into PostGraphile mutations via the configured inflection.
 * Call this at app startup, before the first `stonecropAction` request arrives.
 *
 * @param inflection - Optional inflection overrides. Defaults match PostGraphile Amber conventions.
 * @public
 */
export function registerWriteHandlers(inflection?: StonecropInflectionConfig): void {
	const createMutName = inflection?.createMutationName ?? defaultCreateMutationName
	const updateMutName = inflection?.updateMutationName ?? defaultUpdateMutationName
	const deleteMutName = inflection?.deleteMutationName ?? defaultDeleteMutationName
	const recTypeName = inflection?.recordTypeName ?? defaultRecordTypeName
	const recArgName = inflection?.recordArgName ?? defaultRecordArgName

	registerHandler('create', async (args, context) => {
		const [data] = args as [Record<string, unknown>]
		const { doctype, executor } = context
		const typeName = recTypeName(doctype.tableName!)
		const mutation = buildCreateMutation(doctype, createMutName, recTypeName)
		const result = await executor.mutate(mutation, { input: { [typeName]: data } })
		return extractMutationResult(result, createMutName(doctype.tableName!), typeName)
	})

	registerHandler('update', async (args, context) => {
		const [id, patch] = args as [string, Record<string, unknown>]
		const { doctype, executor } = context
		const typeName = recTypeName(doctype.tableName!)
		const pkArgName = recArgName(doctype.tableName!)
		const mutation = buildUpdateMutation(doctype, updateMutName, recTypeName)
		const result = await executor.mutate(mutation, { input: { [pkArgName]: id, patch } })
		return extractMutationResult(result, updateMutName(doctype.tableName!), typeName)
	})

	registerHandler('delete', async (args, context) => {
		const [id] = args as [string]
		const { doctype, executor } = context
		const typeName = recTypeName(doctype.tableName!)
		const pkArgName = recArgName(doctype.tableName!)
		const mutation = buildDeleteMutation(doctype, deleteMutName, recTypeName)
		const result = await executor.mutate(mutation, { input: { [pkArgName]: id } })
		return extractMutationResult(result, deleteMutName(doctype.tableName!), typeName)
	})
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
	defaultCreateMutationName,
	defaultUpdateMutationName,
	defaultDeleteMutationName,
	defaultRecordTypeName,
	buildRecordQuery,
	buildListQuery,
	buildCreateMutation,
	buildUpdateMutation,
	buildDeleteMutation,
	queryableFieldNames,
	RELATION_FIELDTYPES,
	BUILTIN_WRITE_ACTIONS,
	extractSingleResult,
	extractListResult,
	extractMutationResult,
}
