import type { PgResource, WithPgClient } from 'postgraphile/@dataplan/pg'
import { context } from 'postgraphile/grafast'
import type { ExecutableStep, FieldArgs } from 'postgraphile/grafast'
import type { GraphileConfig } from 'postgraphile/graphile-build'
import { extendSchema, gql } from 'postgraphile/utils'

import { getHandler } from '../registry/actions'
import { getMeta, getAllMeta } from '../registry/doctypes'
import type { ActionContext } from '../types'

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
export const createStonecropPlugin = (): GraphileConfig.Plugin => {
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

								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								const $record = resource.get({ id: spec.id } as any)
								const data = $record.record()

								return {
									data,
									doctype: spec.doctype,
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
