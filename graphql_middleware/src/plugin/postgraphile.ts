import type {
	DoctypeField,
	DoctypeMeta,
	LinkDeclaration,
	TableField,
	ValueField,
	GetRecordOptions,
} from '@stonecrop/schema'
import { camelToSnake, getPrimaryKeyField, pascalToSnake, resolveLinkRenderMode } from '@stonecrop/schema'
import { loadOneWithPgClient, sideEffectWithPgClient } from '@dataplan/pg'
import type { PgClient, PgExecutor } from '@dataplan/pg'
import { constant, lambda, object } from 'postgraphile/grafast'
import { GraphileConfig } from 'postgraphile/graphile-build'
import { extendSchema } from 'postgraphile/utils'

import { getFetchHandler } from '../registry/fetchHandlers'
import { getMeta, getAllMeta } from '../registry/doctypes'
import { applyGuardedTransition } from '../dispatch/transition'
import { typeDefs } from '../typeDefs'

/**
 * Everything a server-side action handler is given when `stonecropAction` dispatches to it.
 *
 * A context object rather than positional parameters so the set can grow without breaking
 * registered handlers — the adapters that supply these live in consumer repositories.
 * @public
 */
export interface ActionHandlerContext {
	/**
	 * Active database client for the current request. **It is not inside a transaction.**
	 *
	 * The dispatcher uses `sideEffectWithPgClient`, not `sideEffectWithPgClientTransaction`, so the
	 * guard read, this handler, and the state write are three separate autocommit statements. A
	 * handler that throws still rejects the action and stops the state write — but its own writes
	 * are already committed and are **not** rolled back. A handler that needs atomicity must open
	 * its own transaction (`BEGIN`/`COMMIT`/`ROLLBACK`) around its statements.
	 *
	 * Rows from a raw `pgClient.query()` carry snake_case **column** names, while the middleware's
	 * own read paths alias them to camelCase fieldnames at the SQL layer (ADR 0004). A handler that
	 * returns raw rows therefore leaks snake_case keys to the client. Alias in SQL
	 * (`"display_name" AS "displayName"`) or convert with `snakeToCamel` from `@stonecrop/schema`.
	 */
	pgClient: PgClient
	/** The doctype the action was dispatched against, as the client sent it. */
	doctype: string
	/** The action's key in `workflow.actions` — the same string the handler was registered under. */
	action: string
	/** The resolved doctype metadata, for field names, the primary key, and the workflow. */
	meta: DoctypeMeta
	/** The target record's identity, taken from the first argument envelope. Absent for a record-less command. */
	recordId?: string | number
	/**
	 * The record field data the client sent (`args[0].data`).
	 *
	 * Unvalidated: `args` is an opaque `JSON` scalar, so this is browser-supplied input that has
	 * passed through no schema. Treat it as untrusted — parameterize it into SQL and whitelist
	 * the fields the action is allowed to touch.
	 */
	data: Record<string, unknown>
	/** The full argument envelope, for the actions that need more than the first record. */
	args: unknown[]
	/** The state the guard read, or `undefined` when nothing about the action required reading it. */
	currentState?: string
}

/**
 * A server-side effect for one doctype action, supplied by whoever owns the database.
 *
 * Throwing rejects the action and no state is written. Returning the updated record makes it the
 * client writeback payload; returning `undefined` leaves the doctype's own outcome to decide.
 *
 * The return value is passed through verbatim as `StonecropActionResult.data`, so it must be
 * API-layer data — camelCase fieldname keys, not raw snake_case columns. See `pgClient` above and
 * ADR 0007.
 * @public
 */
export type ActionHandler = (context: ActionHandlerContext) => Promise<unknown>

/**
 * Options for creating a Stonecrop PostGraphile plugin.
 * @public
 */
export interface StonecropPluginOptions {
	/**
	 * When `true`, SQL queries executed inside `loadOneWithPgClient` callbacks
	 * are logged to `console.log` with `[@stonecrop/graphql-middleware]` prefix. Defaults to `false`.
	 */
	debug?: boolean
	/**
	 * Override the PostgreSQL FROM clause target for specific doctypes, keyed by doctype name.
	 * Values may be a bare table name (`'plan'`) or a schema-qualified name (`'orpin.plan'`).
	 * SQL fragments and subqueries are not supported.
	 * When absent for a doctype, the table name is derived as `camelToSnake(doctype.name)`.
	 */
	tables?: Record<string, string>
	/**
	 * Server-side effects for workflow actions, keyed `[doctype name][action key]`.
	 *
	 * This is the seam that makes a stateless Command executable. `applyGuardedTransition` can
	 * apply a doctype's own outcome — a `nextState` transition, or a `selfTransition` data write —
	 * but an action that is neither has nothing to apply and fails loudly. Registering a handler
	 * here supplies the missing half.
	 *
	 * **The doctype never names a handler, and a handler never overrides the guard.** The two are
	 * authored by different people: a doctype is runtime data edited in DocBuilder by whoever
	 * models the workflow, while these run behind the GraphQL surface and belong to whoever owns
	 * the database. So the doctype keeps `allowedStates` (may this run) and `nextState` (what state
	 * results), and this keeps the effect (what actually happens). Routing between them is
	 * resolved here, on the server, and is never published to the client.
	 *
	 * Handlers are looked up by `meta.name` — the doctype's canonical name, not its slug. An
	 * unregistered action is not an error in itself: a transition needs no handler. It fails only
	 * when the doctype gave the action no outcome either, and the error then names the action and
	 * both ways to fix it, so a typo'd key reports as a missing effect rather than a silent no-op.
	 *
	 * @example
	 * ```ts
	 * createStonecropPlugin({
	 *   actionHandlers: {
	 *     Order: {
	 *       async recalculateTotal({ pgClient, recordId }) {
	 *         const { rows } = await pgClient.query({
	 *           text: 'UPDATE "order" SET total = (SELECT COALESCE(SUM(amount), 0) FROM order_item WHERE order_id = $1) WHERE id = $1 RETURNING *',
	 *           values: [recordId],
	 *         })
	 *         return rows[0]
	 *       },
	 *     },
	 *   },
	 * })
	 * ```
	 */
	actionHandlers?: Record<string, Record<string, ActionHandler>>
}

/**
 * Create a PostGraphile plugin that extends the GraphQL schema with Stonecrop functionality.
 *
 * The `PgExecutor` is obtained automatically from `build.input.pgRegistry.pgExecutors`
 * during schema construction — it does not need to be supplied by the caller.
 *
 * @param options - Optional plugin configuration
 * @returns A PostGraphile plugin
 * @public
 */
export const createStonecropPlugin = (options: StonecropPluginOptions = {}): GraphileConfig.Plugin => {
	/**
	 * SQL debug helper — mirrors PostGraphile's `@dataplan/pg:PgExecutor` logging
	 * for queries that run inside custom loadOneWithPgClient callbacks, which
	 * bypass the executor's native instrumentation.
	 */
	const debugSql = options.debug
		? <T>(pgClient: PgClient, query: { text: string; values?: unknown[] }) => {
				// oxlint-disable-next-line no-console
				console.log(`[@stonecrop/graphql-middleware] ${query.text}`, query.values ?? [])
				return pgClient.query<T>(query)
			}
		: <T>(pgClient: PgClient, query: { text: string; values?: unknown[] }) => pgClient.query<T>(query)

	return extendSchema(build => {
		// Obtain the PgExecutor from pgExecutors — one entry exists per configured pgService.
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- build.input.pgRegistry is a PostGraphile internal not in the public Build type
		const pgExecutors = (build as any).input?.pgRegistry?.pgExecutors as Record<string, PgExecutor> | undefined
		const executor = pgExecutors ? Object.values(pgExecutors)[0] : undefined
		if (!executor) {
			throw new Error('StonecropPlugin: no pgExecutors found — ensure pgServices is configured')
		}

		return {
			typeDefs,

			objects: {
				Query: {
					plans: {
						stonecropMeta(_: any, { $doctype }: any) {
							return lambda($doctype, (doctype: unknown) => {
								const meta = getMeta(String(doctype))
								return meta ?? null
							})
						},

						stonecropAllMeta() {
							return constant(getAllMeta())
						},

						stonecropRecord(_: any, { $doctype, $id, $options }: any) {
							return loadOneWithPgClient(
								executor,
								object({ doctype: $doctype, id: $id, options: $options }),
								async (pgClient: PgClient, specs) => {
									// Group specs by doctype to batch the main SELECT per table
									const byDoctype = new Map<string, number[]>()
									for (let i = 0; i < specs.length; i++) {
										const d = String(specs[i].doctype)
										if (!byDoctype.has(d)) byDoctype.set(d, [])
										byDoctype.get(d)!.push(i)
									}

									const results: Array<{
										data: Record<string, unknown> | null
										doctype: string
										unknownLinks?: string[]
									}> = Array.from({ length: specs.length })

									for (const [doctype, indices] of byDoctype) {
										const meta = getMeta(doctype)
										if (!meta) {
											for (const i of indices) results[i] = { data: null, doctype }
											continue
										}

										const pkMeta = getPkMeta(meta)
										if (!pkMeta) {
											for (const i of indices) results[i] = { data: null, doctype }
											continue
										}
										const pkColumn = camelToSnake(pkMeta.fieldname)
										const columns = getSqlColumns(meta)
										const ids = indices.map(i => String(specs[i].id))

										// TODO(perf): queries per doctype group could be parallelized with Promise.all across doctype groups;
										// requires refactoring the grouped-by-doctype loop to collect promises before resolving results
										// oxlint-disable-next-line eslint/no-await-in-loop -- sequential per-doctype SQL; see TODO above
										const { rows } = await debugSql<Record<string, unknown>>(pgClient, {
											text: `SELECT ${columns} FROM ${resolveTableName(meta.name, options.tables)} WHERE "${pkColumn}"::text = ANY($1::text[])`,
											values: [ids],
										})

										// Use String() so integer PKs (e.g. serial) match the string ids from GraphQL
										const rowByPk = new Map(rows.map(r => [String(r[pkMeta.fieldname]), r]))

										for (const i of indices) {
											const specId = String(specs[i].id)
											const row = rowByPk.get(specId)

											if (!row) {
												results[i] = { data: null, doctype }
												continue
											}

											const rowData: Record<string, unknown> = { ...row }
											const recordOptions = (specs[i].options ?? {}) as GetRecordOptions
											const includeAll = recordOptions.includeNested === true
											const includeSet = Array.isArray(recordOptions.includeNested)
												? new Set(recordOptions.includeNested)
												: null

											// FetchStrategy dispatch over link declarations
											if (meta.links) {
												for (const [linkName, link] of Object.entries(meta.links)) {
													const fetch = link.fetch
													const isMany = link.cardinality === 'noneOrMany' || link.cardinality === 'atLeastOne'
													const effectiveMethod = fetch?.method ?? (isMany ? 'sync' : 'lazy')
													const effectiveLimit = fetch?.method === 'sync' ? fetch.limit : isMany ? 50 : undefined

													const shouldInclude =
														includeAll || (includeSet ? includeSet.has(linkName) : effectiveMethod === 'sync')

													if (!shouldInclude) continue

													if (effectiveMethod === 'custom' && fetch?.method === 'custom') {
														const handlerName = fetch.handler
														const handler = getFetchHandler(handlerName)
														if (handler) {
															// TODO(perf): custom link handlers per-row could run in parallel; needs collecting all custom handlers before await
															// oxlint-disable-next-line eslint/no-await-in-loop -- custom handler per link; see TODO above
															rowData[linkName] = await handler(pgClient, rowData, link)
														}
														continue
													}

													if (effectiveMethod !== 'sync' && !includeSet?.has(linkName)) continue

													const targetMeta = getMeta(link.target)
													if (!targetMeta) continue

													const targetColumns = getSqlColumns(targetMeta)

													if (isMany) {
														if (!link.backlink) continue
														const backlinkCol = camelToSnake(link.backlink)
														let sql = `SELECT ${targetColumns} FROM ${resolveTableName(targetMeta.name, options.tables)} WHERE "${backlinkCol}"::text = $1`
														const linkValues: unknown[] = [specId]
														if (effectiveLimit != null) {
															sql += ` LIMIT $2`
															linkValues.push(effectiveLimit)
														}
														// TODO(perf): many-side link queries per row could be parallelized; needs collecting across links before await
														// oxlint-disable-next-line eslint/no-await-in-loop -- one SQL per backlink per row; see TODO above
														const { rows: linked } = await debugSql<Record<string, unknown>>(pgClient, {
															text: sql,
															values: linkValues,
														})
														rowData[linkName] = linked
													} else {
														if (!link.fieldname) continue
														const fkValue = rowData[link.fieldname]
														if (fkValue == null) {
															rowData[linkName] = null
															continue
														}
														const targetPkMeta = getPkMeta(targetMeta)
														if (!targetPkMeta) continue
														const targetPkColumn = camelToSnake(targetPkMeta.fieldname)
														// TODO(perf): one-side link FK lookups per row could be parallelized; needs collecting across links before await
														// oxlint-disable-next-line eslint/no-await-in-loop -- one FK lookup per link per row; see TODO above
														const { rows: linked } = await debugSql<Record<string, unknown>>(pgClient, {
															text: `SELECT ${targetColumns} FROM ${resolveTableName(targetMeta.name, options.tables)} WHERE "${targetPkColumn}" = $1`,
															values: [fkValue],
														})
														rowData[linkName] = linked[0] ?? null
													}
												}
											}

											// Names in includeNested that don't correspond to any link
											const unknownLinks =
												includeSet && meta.links ? [...includeSet].filter(name => !(name in meta.links!)) : undefined

											results[i] = {
												data: rowData,
												doctype,
												unknownLinks: unknownLinks?.length ? unknownLinks : undefined,
											}
										}
									}

									return results
								}
							)
						},

						stonecropRecords(_: any, { $doctype, $filters, $orderBy, $limit, $offset }: any) {
							return loadOneWithPgClient(
								executor,
								object({
									doctype: $doctype,
									filters: $filters,
									orderBy: $orderBy,
									limit: $limit,
									offset: $offset,
								}),
								async (pgClient: PgClient, specs) => {
									return await Promise.all(
										specs.map(async spec => {
											const doctype = String(spec.doctype)
											const meta = getMeta(doctype)
											if (!meta) {
												return { data: [], doctype, count: 0 }
											}

											const knownFields = new Set(flattenFields(meta.fields).map(f => f.fieldname))
											const columns = getSqlColumns(meta)
											const values: unknown[] = []

											// WHERE from filters (parameterised — safe against SQL injection)
											const whereClauses: string[] = []
											if (spec.filters != null) {
												// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- spec.filters is a Grafast runtime value; shape guaranteed by GraphQL schema
												for (const [field, value] of Object.entries(spec.filters as Record<string, unknown>)) {
													if (!knownFields.has(field)) {
														throw new Error(`Unknown filter field: ${field} for doctype ${meta.name}`)
													}
													values.push(value)
													whereClauses.push(`"${camelToSnake(field)}" = $${values.length}`)
												}
											}
											const whereClause = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : ''

											// ORDER BY (field name whitelisted — column names cannot be parameterised)
											let orderByClause = ''
											if (spec.orderBy != null) {
												if (typeof spec.orderBy !== 'string')
													throw new Error(`Invalid orderBy: expected string, got ${typeof spec.orderBy}`)
												const orderByStr = spec.orderBy
												const lastUnder = orderByStr.lastIndexOf('_')
												if (lastUnder <= 0) {
													throw new Error(`Invalid orderBy format: "${orderByStr}". Expected FIELD_ASC or FIELD_DESC`)
												}
												const dir = orderByStr.slice(lastUnder + 1).toUpperCase()
												if (dir !== 'ASC' && dir !== 'DESC') {
													throw new Error(`Invalid orderBy direction: "${dir}". Must be ASC or DESC`)
												}
												const fieldName = orderByStr.slice(0, lastUnder)
												if (!knownFields.has(fieldName)) {
													throw new Error(`Unknown orderBy field: "${fieldName}" for doctype ${meta.name}`)
												}
												orderByClause = ` ORDER BY "${camelToSnake(fieldName)}" ${dir}`
											}

											// LIMIT / OFFSET
											let pagingClause = ''
											if (spec.limit != null) {
												values.push(spec.limit)
												pagingClause += ` LIMIT $${values.length}`
											}
											if (spec.offset != null) {
												values.push(spec.offset)
												pagingClause += ` OFFSET $${values.length}`
											}

											const { rows } = await debugSql<Record<string, unknown>>(pgClient, {
												text: `SELECT ${columns} FROM ${resolveTableName(meta.name, options.tables)}${whereClause}${orderByClause}${pagingClause}`,
												values,
											})

											// Total count matching filters (independent of LIMIT/OFFSET)
											let count = rows.length
											if (spec.limit != null || spec.offset != null) {
												const countValues: unknown[] = []
												const countWhere: string[] = []
												if (spec.filters != null) {
													// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- spec.filters is a Grafast runtime value; shape guaranteed by GraphQL schema
													for (const [field, value] of Object.entries(spec.filters as Record<string, unknown>)) {
														if (!knownFields.has(field)) continue
														countValues.push(value)
														countWhere.push(`"${camelToSnake(field)}" = $${countValues.length}`)
													}
												}
												const countWhereClause = countWhere.length > 0 ? ` WHERE ${countWhere.join(' AND ')}` : ''
												const { rows: countRows } = await debugSql<{ row_count: string }>(pgClient, {
													text: `SELECT COUNT(*) AS row_count FROM ${resolveTableName(meta.name, options.tables)}${countWhereClause}`,
													values: countValues,
												})
												count = parseInt(countRows[0]?.row_count ?? '0', 10)
											}

											return { data: rows, doctype, count }
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
							return sideEffectWithPgClient(
								executor,
								object({ doctype: $doctype, action: $action, actionArgs: $actionArgs }),
								async (pgClient: PgClient, spec: any) => {
									const meta = getMeta(String(spec.doctype))
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

									const table = resolveTableName(meta.name, options.tables)
									// Resolved lazily: only a state read or write needs the key column. A
									// record-less command reaches its handler on a doctype that declares no
									// primary key, which an eager check would refuse for no reason.
									const pkColumn = () => {
										const pkMeta = getPkMeta(meta)
										if (!pkMeta) throw new Error(`No primary key for doctype: ${spec.doctype}`)
										return camelToSnake(pkMeta.fieldname)
									}
									// Record envelope: [{ id, data }] — the transition keys off the record id.
									// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- spec.actionArgs is a Grafast runtime value; record envelope shape is the dispatch contract
									const argList = (Array.isArray(spec.actionArgs) ? spec.actionArgs : []) as Array<{
										id?: string | number
										data?: Record<string, unknown>
									}>
									const recordId = argList[0]?.id
									const recordData = argList[0]?.data ?? {}

									// The database author's effect for this action, if one is registered. Keyed
									// by the doctype's canonical name so a slug-resolved lookup above cannot
									// silently miss it.
									const handler = options.actionHandlers?.[meta.name]?.[String(spec.action)]

									try {
										return await applyGuardedTransition(actionDef, {
											readState: async () => {
												// No id in the envelope means no record was targeted at all, which is
												// the same answer as a lookup that misses: `null`, not `undefined`.
												if (recordId == null) return null
												const { rows } = await debugSql<{ status: string | null }>(pgClient, {
													text: `SELECT "status" FROM ${table} WHERE "${pkColumn()}"::text = $1`,
													values: [String(recordId)],
												})
												// No row at all vs. a row whose `status` is NULL — see GuardedTransitionIO.
												if (rows.length === 0) return null
												return rows[0].status ?? undefined
											},
											writeState: async (nextState: string) => {
												await debugSql(pgClient, {
													text: `UPDATE ${table} SET "status" = $1 WHERE "${pkColumn()}"::text = $2`,
													values: [nextState, String(recordId)],
												})
											},
											runEffect: handler
												? (currentState: string | undefined) =>
														handler({
															pgClient,
															doctype: String(spec.doctype),
															action: String(spec.action),
															meta,
															recordId,
															data: recordData,
															args: argList,
															currentState,
														})
												: undefined,
										})
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

// ===========================================================================
// SQL column helpers
// ===========================================================================

/**
 * Recursively flatten Fieldset containers into a flat array of non-container fields.
 * Fieldset entries are replaced by their children; all other fields pass through.
 * Used by getSqlColumns (for SELECT) and knownFields (for filter/orderBy validation).
 */
function flattenFields(fields: DoctypeField[]): (ValueField | TableField)[] {
	const result: (ValueField | TableField)[] = []
	for (const f of fields) {
		if (f.kind === 'fieldset') {
			result.push(...flattenFields(f.schema))
		} else {
			result.push(f)
		}
	}
	return result
}

/**
 * Derive quoted SQL column entries from a flat field array.
 * Skips non-scalar fields (kind !== 'field'), `computed` fields
 * (no backing DB column), and *expanding* links
 * (relations fetched separately, not scalar columns on this table).
 */
function collectColumns(fields: DoctypeField[], links: Map<string, LinkDeclaration>): string[] {
	const columns: string[] = []
	for (const f of flattenFields(fields)) {
		if (f.kind !== 'field') continue
		// A computed field has no backing DB column.
		if (f.computed) continue
		// Only an *expanding* link is a relation rather than a column. An inline link (a picker)
		// keeps its FK on this table and must still be selected — `resolveLinkRenderMode` is the
		// shared rule, also used by the client resolver; never re-derive it here.
		const link = links.get(f.fieldname)
		if (link && resolveLinkRenderMode(link, f.component) !== 'inline') continue
		const col = camelToSnake(f.fieldname)
		columns.push(col !== f.fieldname ? `"${col}" AS "${f.fieldname}"` : `"${f.fieldname}"`)
	}
	return columns
}

/**
 * Derive a quoted SQL column list from doctype field definitions.
 * Applies camelToSnake to each fieldname to get the DB column name, then
 * aliases it back to the fieldname so result rows carry API-layer keys.
 * Excludes `computed` fields (no backing DB column), Fieldset
 * containers (recursing into their children instead), and *expanding* links
 * (relations fetched separately). An inline link keeps its FK column here.
 *
 * Exported for unit testing (not re-exported from the package index).
 */
export function getSqlColumns(meta: DoctypeMeta): string {
	const links = new Map<string, LinkDeclaration>()
	if (meta.links) {
		for (const [key, link] of Object.entries(meta.links)) {
			links.set(link.fieldname ?? key, link)
		}
	}
	return collectColumns(meta.fields, links).join(', ')
}

/**
 * Find the field marked `primaryKey` in the doctype.
 * Returns undefined when none is marked (PK-less doctypes).
 *
 * Delegates to `@stonecrop/schema` so the server's identity predicate and the client's record
 * keying resolve the same field — this used to be a private re-implementation of that rule.
 */
function getPkMeta(meta: DoctypeMeta): ValueField | undefined {
	return getPrimaryKeyField(meta.fields)
}

/**
 * Resolve the PostgreSQL FROM clause target for a doctype.
 * Uses the `tables` override map first; falls back to camelToSnake(name).
 * Schema-qualified names (e.g. "orpin.plan") are emitted as "schema"."table".
 * Values must be bare identifiers or schema.table pairs — not SQL fragments.
 */
function resolveTableName(name: string, tables?: Record<string, string>): string {
	const target = tables?.[name] ?? pascalToSnake(name)
	const dotIndex = target.indexOf('.')
	if (dotIndex > 0) {
		return `"${target.slice(0, dotIndex)}"."${target.slice(dotIndex + 1)}"`
	}
	return `"${target}"`
}
