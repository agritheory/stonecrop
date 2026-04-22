/**
 * @stonecrop/nuxt fullstack playground resolvers
 *
 * Uses grafast plan resolvers (synchronous functions that return Steps).
 * Structure matches the pattern in graphql_middleware/src/plugin/postgraphile.ts
 */

import { constant, lambda, loadOne, object } from 'grafast'
import { getMeta, getAllMeta, getHandler, type ActionContext } from '@stonecrop/graphql-middleware'
import type { DoctypeMeta } from '@stonecrop/schema'

import { mockExecutor } from './mock-executor'

// ============================================
// Type Helpers
// ============================================

function toQueryName(doctypeName: string, singular: boolean = true): string {
	// Remove spaces and convert to PascalCase
	const pascalName = doctypeName.replace(/\s+/g, '')
	const name = pascalName.charAt(0).toLowerCase() + pascalName.slice(1)
	return singular ? `${name}ById` : `all${pascalName}s`
}

function toMutationName(doctypeName: string, operation: 'create' | 'update' | 'delete'): string {
	// Remove spaces and convert to PascalCase
	const pascalName = doctypeName.replace(/\s+/g, '')
	const name = pascalName.charAt(0).toLowerCase() + pascalName.slice(1)
	if (operation === 'create') {
		return `create${pascalName}`
	}
	return `${operation}${pascalName}ById`
}

function formatFieldMeta(field: { fieldname: string; fieldtype: string; [key: string]: unknown }) {
	return {
		fieldname: field.fieldname,
		fieldtype: field.fieldtype,
		label: field.label ?? null,
		required: field.required ?? false,
		readOnly: field.readOnly ?? false,
		options: field.options ?? null,
		default: field.default ?? null,
		width: field.width ?? null,
		validation: field.validation ?? null,
	}
}

function formatDoctypeMeta(meta: DoctypeMeta) {
	return {
		name: meta.name,
		slug: meta.slug ?? null,
		tableName: meta.tableName ?? null,
		fields: meta.fields.map(formatFieldMeta),
		workflow: meta.workflow
			? {
					states: meta.workflow.states ?? null,
					actions: meta.workflow.actions ?? null,
			  }
			: null,
		inherits: meta.inherits ?? null,
	}
}

// ============================================
// Resolvers (grafast plan format)
// ============================================

export default {
	Query: {
		plans: {
			getMeta(_: unknown, { $doctype }: any) {
				return lambda($doctype, (doctype: unknown) => {
					const meta = getMeta(doctype as string)
					return meta ? formatDoctypeMeta(meta) : null
				})
			},

			stonecropMeta(_: unknown, { $doctype }: any) {
				return lambda($doctype, (doctype: unknown) => {
					const meta = getMeta(doctype as string)
					return meta ? formatDoctypeMeta(meta) : null
				})
			},

			stonecropAllMeta() {
				return constant(getAllMeta().map(formatDoctypeMeta))
			},

			stonecropRecord(_: unknown, { $doctype, $id, $options }: any) {
				return loadOne(object({ doctype: $doctype, id: $id, options: $options }), async (specs: readonly any[]) => {
					return Promise.all(
						specs.map(async spec => {
							const meta = getMeta(spec.doctype)
							if (!meta) {
								throw new Error(`Unknown doctype: ${spec.doctype}`)
							}

							const queryName = toQueryName(meta.name)
							try {
								const result = await mockExecutor.query(queryName, { id: spec.id })
								return {
									data: result[queryName] ?? null,
									doctype: spec.doctype,
									unknownLinks: undefined,
								}
							} catch (error) {
								console.error(`[stonecropRecord] Error:`, error)
								return {
									data: null,
									doctype: spec.doctype,
									unknownLinks: undefined,
								}
							}
						})
					)
				})
			},

			stonecropRecords(_: unknown, { $doctype, $filters, $orderBy, $limit, $offset, $options }: any) {
				return loadOne(
					object({
						doctype: $doctype,
						filters: $filters,
						orderBy: $orderBy,
						limit: $limit,
						offset: $offset,
						options: $options,
					}),
					async (specs: readonly any[]) => {
						return Promise.all(
							specs.map(async spec => {
								const meta = getMeta(spec.doctype)
								if (!meta) {
									throw new Error(`Unknown doctype: ${spec.doctype}`)
								}

								const queryName = toQueryName(meta.name, false)
								try {
									const result = await mockExecutor.query(queryName, {
										first: spec.limit,
										offset: spec.offset,
										orderBy: spec.orderBy,
										...spec.filters,
									})
									const connection = result[queryName]
									const data = connection?.nodes ?? []
									return {
										data,
										doctype: spec.doctype,
										count: connection?.totalCount ?? data.length,
									}
								} catch (error) {
									console.error(`[stonecropRecords] Error:`, error)
									return {
										data: [],
										doctype: spec.doctype,
										count: 0,
									}
								}
							})
						)
					}
				)
			},

			healthCheck() {
				return constant({
					status: 'healthy',
					timestamp: new Date().toISOString(),
					version: '1.0.0',
				})
			},

			serverInfo() {
				return constant({
					name: 'Stonecrop Fullstack Playground',
					version: '1.0.0',
					environment: process.env.NODE_ENV || 'development',
					features: ['nuxt-grafserv', 'graphql-middleware', 'stonecrop-nuxt', 'mock-executor'],
				})
			},
		},
	},

	Mutation: {
		plans: {
			stonecropAction(_: unknown, { $doctype, $action, $args: $actionArgs }: any) {
				return loadOne(
					object({
						doctype: $doctype,
						action: $action,
						actionArgs: $actionArgs,
					}),
					async (specs: readonly any[]) => {
						return Promise.all(
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
									executor: mockExecutor,
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

			stonecropCreate(_: unknown, { $doctype, $input }: any) {
				return loadOne(object({ doctype: $doctype, input: $input }), async (specs: readonly any[]) => {
					return Promise.all(
						specs.map(async spec => {
							const meta = getMeta(spec.doctype)
							if (!meta) {
								throw new Error(`Unknown doctype: ${spec.doctype}`)
							}

							const mutationName = toMutationName(meta.name, 'create')
							try {
								const result = await mockExecutor.mutate(mutationName, { input: spec.input })
								const mutationResult = result[mutationName]
								const recordKey = meta.name.charAt(0).toLowerCase() + meta.name.slice(1)
								return {
									data: mutationResult?.[recordKey] ?? mutationResult,
									doctype: spec.doctype,
								}
							} catch (error) {
								console.error(`[stonecropCreate] Error:`, error)
								throw error
							}
						})
					)
				})
			},

			stonecropUpdate(_: unknown, { $doctype, $id, $patch }: any) {
				return loadOne(object({ doctype: $doctype, id: $id, patch: $patch }), async (specs: readonly any[]) => {
					return Promise.all(
						specs.map(async spec => {
							const meta = getMeta(spec.doctype)
							if (!meta) {
								throw new Error(`Unknown doctype: ${spec.doctype}`)
							}

							const mutationName = toMutationName(meta.name, 'update')
							try {
								const result = await mockExecutor.mutate(mutationName, {
									id: spec.id,
									patch: spec.patch,
								})
								const mutationResult = result[mutationName]
								if (!mutationResult) {
									return null
								}
								const recordKey = meta.name.charAt(0).toLowerCase() + meta.name.slice(1)
								return {
									data: mutationResult?.[recordKey] ?? mutationResult,
									doctype: spec.doctype,
								}
							} catch (error) {
								console.error(`[stonecropUpdate] Error:`, error)
								throw error
							}
						})
					)
				})
			},

			stonecropDelete(_: unknown, { $doctype, $id }: any) {
				return loadOne(object({ doctype: $doctype, id: $id }), async (specs: readonly any[]) => {
					return Promise.all(
						specs.map(async spec => {
							const meta = getMeta(spec.doctype)
							if (!meta) {
								return {
									success: false,
									data: null,
									error: `Unknown doctype: ${spec.doctype}`,
								}
							}

							const mutationName = toMutationName(meta.name, 'delete')
							try {
								const result = await mockExecutor.mutate(mutationName, { id: spec.id })
								const mutationResult = result[mutationName]
								const deleted = mutationResult?.deletedUserId || mutationResult?.deletedOrderId

								return {
									success: !!deleted,
									data: { id: deleted },
									error: deleted ? null : 'Record not found',
								}
							} catch (error) {
								return {
									success: false,
									data: null,
									error: error instanceof Error ? error.message : String(error),
								}
							}
						})
					)
				})
			},
		},
	},
}
