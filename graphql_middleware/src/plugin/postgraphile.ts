import type { DoctypeMeta } from '@stonecrop/schema'
import { loadOneWithPgClient } from '@dataplan/pg'
import type { PgClient, PgExecutor } from '@dataplan/pg'
import { constant, lambda, object, loadOne } from 'postgraphile/grafast'
import { GraphileConfig } from 'postgraphile/graphile-build'
import { extendSchema } from 'postgraphile/utils'

import { getHandler } from '../registry/actions'
import { getMeta, getAllMeta } from '../registry/doctypes'
import { typeDefs } from '../typeDefs'
import type { ActionContext } from '../types'

/**
 * Create a PostGraphile plugin that extends the GraphQL schema with Stonecrop functionality.
 *
 * `createStonecropPlugin()` takes no arguments. The `PgExecutor` is obtained automatically
 * from the first entry in `build.input.pgRegistry.pgResources` during schema construction,
 * so it does not need to be supplied by the caller.
 *
 * @returns A PostGraphile plugin
 * @public
 */
export const createStonecropPlugin = (): GraphileConfig.Plugin => {
	return extendSchema(build => {
		// Obtain the PgExecutor from pgExecutors — one entry exists per configured pgService.
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
								const meta = getMeta(doctype as string)
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
									// Group specs by doctype to batch SQL per table
									const byDoctype = new Map<string, number[]>()
									for (let i = 0; i < specs.length; i++) {
										const d = specs[i].doctype as string
										if (!byDoctype.has(d)) byDoctype.set(d, [])
										byDoctype.get(d)!.push(i)
									}

									const results: Array<{
										data: Record<string, unknown> | null
										doctype: string
									}> = new Array(specs.length)

									for (const [doctype, indices] of byDoctype) {
										const meta = getMeta(doctype)
										if (!meta?.tableName) {
											for (const i of indices) {
												results[i] = { data: null, doctype }
											}
											continue
										}

										const columns = getSqlColumns(meta)
										const ids = indices.map(i => specs[i].id as string)

										const { rows } = await pgClient.query<Record<string, unknown>>({
											text: `SELECT ${columns} FROM "${meta.tableName}" WHERE id = ANY($1::text[])`,
											values: [ids],
										})

										const rowById = new Map(rows.map(r => [r['id'] as string, r]))
										for (const i of indices) {
											results[i] = {
												data: rowById.get(specs[i].id as string) ?? null,
												doctype,
											}
										}
									}

									return results
								}
							)
						},

						stonecropRecords(_: any, { $doctype, $limit, $offset }: any) {
							return loadOneWithPgClient(
								executor,
								object({ doctype: $doctype, limit: $limit, offset: $offset }),
								async (pgClient: PgClient, specs) => {
									return await Promise.all(
										specs.map(async spec => {
											const meta = getMeta(spec.doctype as string)
											if (!meta?.tableName) {
												return { data: [], doctype: spec.doctype as string, count: 0 }
											}

											const columns = getSqlColumns(meta)
											const parts: string[] = [`SELECT ${columns} FROM "${meta.tableName}"`]
											const values: unknown[] = []

											if (spec.limit != null) {
												values.push(spec.limit)
												parts.push(`LIMIT $${values.length}`)
											}
											if (spec.offset != null) {
												values.push(spec.offset)
												parts.push(`OFFSET $${values.length}`)
											}

											const { rows } = await pgClient.query<Record<string, unknown>>({
												text: parts.join(' '),
												values,
											})

											return { data: rows, doctype: spec.doctype as string, count: rows.length }
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
// SQL column helper — produces a quoted comma-separated column list for SELECT
// =============================================================================

/**
 * Derive a quoted SQL column list from doctype field definitions.
 * Excludes Display fields (no backing DB column) and Link fields that have an
 * explicit `links` declaration (those are FK references, not scalar columns).
 * Always includes `"id"` as the first column for PK lookup and result mapping.
 */
function getSqlColumns(meta: DoctypeMeta): string {
	const linkedFieldnames = new Set<string>()
	if (meta.links) {
		for (const [key, link] of Object.entries(meta.links)) {
			linkedFieldnames.add((link as any).fieldname ?? key)
		}
	}

	const columns: string[] = []
	const hasId = meta.fields.some(f => f.fieldname === 'id')
	if (!hasId) {
		columns.push('"id"')
	}

	for (const f of meta.fields) {
		if (f.fieldtype === 'Display') continue
		if (f.fieldtype === 'Link' && linkedFieldnames.has(f.fieldname)) continue
		columns.push(`"${f.fieldname}"`)
	}

	return columns.join(', ')
}
