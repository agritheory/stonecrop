import type { DoctypeMeta, LinkDeclaration, LazyFetch, SyncFetch } from '@stonecrop/schema'
import { snakeToCamel, toPascalCase } from '@stonecrop/schema'
import { loadOneWithPgClient } from '@dataplan/pg'
import type { PgClient, PgExecutor } from '@dataplan/pg'
import { constant, lambda, object, loadOne } from 'postgraphile/grafast'
import { GraphileConfig } from 'postgraphile/graphile-build'
import { extendSchema } from 'postgraphile/utils'
import pluralize from 'pluralize'

import { getHandler } from '../registry/actions'
import { getMeta, getAllMeta } from '../registry/doctypes'
import { typeDefs } from '../typeDefs'
import type {
	ActionContext,
	ReverseConnectionParams,
	BuildRecordQueryOptions,
	BuildNestedSelectionsParams,
	BuildListQueryArgs,
	MergeNestedResultsParams,
	ExtractSingleResultParams,
	ExtractListResultParams,
} from '../types'

/**
 * Inflection callbacks for mapping table names to GraphQL query field names.
 * Override these when using a non-Amber inflection preset (e.g., V4, SimplifyInflection).
 *
 * Defaults match the PostGraphile Amber preset conventions.
 *
 * @deprecated `StonecropInflectionConfig` is no longer used. The self-query pattern that
 *   required it has been replaced by direct SQL via `loadOneWithPgClient`. No migration action
 *   is required for existing code that passes inflection options — they are silently ignored.
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
 * Options for creating a Stonecrop PostGraphile plugin.
 * @public
 */
export interface StonecropPluginOptions {}

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
		const executor = pgExecutors ? (Object.values(pgExecutors)[0] as PgExecutor) : undefined
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
		if (RELATION_FIELDTYPES.has(f.fieldtype)) continue
		if (f.fieldtype === 'Link' && linkedFieldnames.has(f.fieldname)) continue
		columns.push(`"${f.fieldname}"`)
	}

	return columns.join(', ')
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
 * Default reverse connection name: derives PostGraphile's connection field convention.
 * PostGraphile convention: `{targetPlural}By{FkColumnPascal}Id`
 * - When backlink is defined: FK column is derived from the backlink field name
 * - When backlink is absent: FK column is derived from the parent doctype's table name
 * @public
 */
function defaultReverseConnectionName(params: {
	doctype: string
	linkName: string
	backlink?: string
	target: string
}): string {
	const targetPlural = pluralize.plural(params.target.replace(/-/g, '_'))
	// Use camelCase for target (matches PostGraphile Amber convention: recipeTasksByRecipeId)
	const targetCamel = snakeToCamel(targetPlural)
	// Use backlink if provided, otherwise derive from parent table name
	const fkSource = params.backlink || params.doctype
	// FK column name: uppercase first char, preserve rest of camelCase
	const fkPascal = fkSource.charAt(0).toUpperCase() + snakeToCamel(fkSource).slice(1)
	return `${targetCamel}By${fkPascal}Id`
}

/**
 * Check if a cardinality represents a "many" relationship
 */
function isManyCardinality(cardinality: string): boolean {
	return cardinality === 'noneOrMany' || cardinality === 'atLeastOne'
}

// =============================================================================
// Query builders — generate GraphQL queries to send to the underlying schema
// =============================================================================

const DEFAULT_SYNC_LIMIT = 50

/**
 * Fieldtypes unconditionally excluded from the generated scalar query selection set.
 * - `'Display'`: display-only composite component with no backing DB column
 *
 * Note: `'Link'` fields are NOT blanket-excluded here. Scalar FK UUID columns use
 * `fieldtype: 'Link'` and ARE queryable. Only Link fields that also appear in the
 * doctype's `links` declaration (i.e. those that resolve to a sub-object or connection)
 * are excluded — that logic lives in `queryableFieldNames`.
 * @public
 */
const RELATION_FIELDTYPES = new Set(['Display'])

/**
 * Filter fields to only those directly queryable as scalars.
 * Excludes Display fields (no backing DB column) and Link fields that have an
 * explicit `links` declaration (those require sub-selection, not scalar reads).
 * Link fields without a `links` declaration are scalar FK UUID columns and ARE included.
 * @public
 */
function queryableFieldNames(meta: DoctypeMeta): string {
	const linkedFieldnames = new Set<string>()
	if (meta.links) {
		for (const [key, link] of Object.entries(meta.links)) {
			linkedFieldnames.add((link as any).fieldname ?? key)
		}
	}
	return meta.fields
		.filter(f => {
			if (RELATION_FIELDTYPES.has(f.fieldtype)) return false
			if (f.fieldtype === 'Link' && linkedFieldnames.has(f.fieldname)) return false
			return true
		})
		.map(f => f.fieldname)
		.join('\n      ')
}

/**
 * Get the effective fetch strategy for a link, applying cardinality-based defaults.
 */
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

/**
 * Get the effective blockWorkflows value for a link.
 */
function getEffectiveBlockWorkflows(link: LinkDeclaration): boolean {
	if (link.blockWorkflows !== undefined) {
		return link.blockWorkflows
	}
	const effectiveFetch = getEffectiveFetchStrategy(link)
	return effectiveFetch.method === 'sync'
}

/**
 * Build nested sub-selections for descendant links
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
 * Build a GraphQL query to fetch a single record by ID.
 * When includeNested is set, recursively includes descendant link sub-selections.
 * @public
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
 * Build a GraphQL connection query to fetch a list of records.
 * Only declares variables ($limit, $offset, $orderBy) that are actually used in the query,
 * avoiding GraphQL spec §5.8.3 violations from unused variable declarations.
 * Excludes Link relation fields and Display fields from the selection set.
 * @public
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
 * Merge nested connection results into flat arrays.
 * For `noneOrMany`/`atLeastOne` links, the query returns `{ nodes: [...] }`.
 * This flattens them to just `[]` for easier consumption.
 * @public
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
 * Extract a single record from a PostGraphile query result using the record field name.
 * @public
 */
function extractSingleResult(params: ExtractSingleResultParams): unknown {
	const { result, meta, recordFieldName } = params
	const queryName = recordFieldName(meta.tableName!)
	return (result as Record<string, unknown>)[queryName]
}

/**
 * Extract the list of nodes from a PostGraphile connection query result.
 * Returns an empty array if the connection field is absent.
 * @public
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
