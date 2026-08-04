/**
 * @stonecrop/nuxt fullstack playground resolvers
 *
 * Uses grafast plan resolvers (synchronous functions that return Steps).
 * Structure matches the pattern in graphql_middleware/src/plugin/postgraphile.ts
 */

import { constant, lambda, loadOne, object } from 'grafast'
import { getMeta, getAllMeta, applyGuardedTransition } from '@stonecrop/graphql-middleware'
import { getPrimaryKeyField } from '@stonecrop/schema'
import type { DoctypeMeta } from '@stonecrop/schema'

import { actionHandlers } from './action-handlers'
import { mockExecutor } from './mock-executor'

// ============================================
// Mock response shapes
// ============================================
// The executor is generic and returns whatever the caller asks for, so these name what the
// mock actually sends back. Without them every access below degrades to `unknown` and the
// resolvers type-check only because nothing was checking them — see nuxt's `test:types`.

/** A PostGraphile-style connection, as returned by the mock's `all<Type>s` queries. */
interface MockConnection {
	nodes?: unknown[]
	totalCount?: number
}

/** A mutation payload. The mock nests the record under a camelCased type key. */
type MockMutationPayload = Record<string, unknown> & {
	deletedUserId?: string
	deletedOrderId?: string
}

// ============================================
// Type Helpers
// ============================================

function toQueryName(doctypeName: string, singular: boolean = true): string {
	// Remove spaces and convert to PascalCase
	const pascalName = doctypeName.replace(/\s+/g, '')
	const name = pascalName.charAt(0).toLowerCase() + pascalName.slice(1)
	return singular ? `${name}ById` : `all${pascalName}s`
}

/**
 * The field an incoming `stonecropRecord(id:)` argument is matched against.
 *
 * Part of the adapter contract — see test/adapter-conformance.test.ts, which runs the same
 * expectations against every host. A doctype that declares a `primaryKey` is keyed by that
 * field; the client resolves the same field via `@stonecrop/schema`'s `getRecordIdentity`,
 * so an adapter that ignores the declaration looks records up by a key the client never sent.
 *
 * The `id` fallback covers doctypes that declare no `primaryKey`. Every doctype in this repo now
 * declares one, enforced by test/doctype-fixtures.test.ts, so in-repo the fallback is inert.
 * It stays for consumer doctypes that have not adopted the rule: the Postgres adapter refuses
 * those outright (`data: null`), and this host stays permissive. The conformance suite records
 * that difference rather than asserting one answer.
 */
export function recordLookupField(meta: DoctypeMeta): string {
	return getPrimaryKeyField(meta.fields)?.fieldname ?? 'id'
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

export function formatDoctypeMeta(meta: DoctypeMeta) {
	// Fields and actions pass through verbatim — the SDL alone decides what is
	// selectable. Enumerating keys here silently drops any field the schema gains
	// later; the only computed addition is `name` (an action's key in the
	// WorkflowMeta.actions record, flattened into the list the SDL declares).
	const actions = meta.workflow?.actions
	const actionList = actions
		? Object.entries(actions as Record<string, Record<string, unknown>>).map(([name, action]) => ({
				name,
				...action,
			}))
		: []
	return {
		name: meta.name,
		slug: meta.slug ?? null,
		fields: meta.fields,
		workflow: meta.workflow
			? {
					states: meta.workflow.states ?? null,
					actions: actionList,
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
								const result = await mockExecutor.query(queryName, {
									id: spec.id,
									lookupField: recordLookupField(meta),
								})
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
									const result = await mockExecutor.query<Record<string, MockConnection | null>>(queryName, {
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

								// Record envelope: [{ id, data }] — the transition keys off the record id, and a
								// self-transition persists the edited field `data` in place.
								const argList = Array.isArray(spec.actionArgs) ? spec.actionArgs : []
								const recordId = argList[0]?.id
								const recordData: Record<string, unknown> = argList[0]?.data ?? {}
								const handler = actionHandlers[meta.name]?.[String(spec.action)]

								try {
									// The server owns the transition: read current state, guard against
									// allowedStates, write nextState. Reads/writes go through this app's
									// mock executor; a PostGraphile setup swaps in pgClient SQL instead.
									return await applyGuardedTransition(
										actionDef,
										{
											readState: async () => {
												if (recordId == null) return undefined
												const queryName = toQueryName(meta.name)
												const result = (await mockExecutor.query(queryName, { id: recordId })) as Record<
													string,
													{ status?: string | null } | undefined
												>
												const status = result[queryName]?.status
												return status == null ? undefined : String(status)
											},
											writeState: async (nextState: string) => {
												const mutationName = toMutationName(meta.name, 'update')
												await mockExecutor.mutate<Record<string, MockMutationPayload | undefined>>(mutationName, {
													id: recordId,
													patch: { status: nextState },
												})
											},
											// Self-transition data write: patch the record's field data (status untouched)
											// and return the full updated record for the client writeback. Verbatim patch
											// mirrors stonecropUpdate; column-whitelisting is the (deferred) PostGraphile concern.
											writeData: async (patch: Record<string, unknown>) => {
												const mutationName = toMutationName(meta.name, 'update')
												const result = await mockExecutor.mutate<Record<string, MockMutationPayload | undefined>>(
													mutationName,
													{ id: recordId, patch }
												)
												const mutationResult = result[mutationName] as Record<string, unknown> | undefined
												const recordKey = meta.name.charAt(0).toLowerCase() + meta.name.slice(1)
												return (mutationResult?.[recordKey] ?? mutationResult ?? {}) as Record<string, unknown>
											},
											// The server-owned effect, if this app registered one. Nothing in the
											// doctype names it: the lookup is by (doctype, action) and stays here.
											// See ./action-handlers.ts.
											runEffect: handler
												? (currentState: string | undefined) =>
														handler({
															doctype: String(spec.doctype),
															action: String(spec.action),
															meta,
															recordId,
															data: recordData,
															currentState,
														})
												: undefined,
										},
										recordData
									)
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
								const result = await mockExecutor.mutate<Record<string, MockMutationPayload | undefined>>(
									mutationName,
									{ input: spec.input }
								)
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
								const result = await mockExecutor.mutate<Record<string, MockMutationPayload | undefined>>(
									mutationName,
									{
										id: spec.id,
										patch: spec.patch,
									}
								)
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
								const result = await mockExecutor.mutate<Record<string, MockMutationPayload | undefined>>(
									mutationName,
									{ id: spec.id }
								)
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
