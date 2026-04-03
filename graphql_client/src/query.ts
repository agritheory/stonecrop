import type { DoctypeMeta, GetRecordOptions, GetRecordsOptions, LinkDeclaration } from '@stonecrop/schema'
import { toPascalCase } from '@stonecrop/schema'
import pluralize from 'pluralize'

/**
 * Field types that are not scalar queryable fields.
 * Link and Doctype fields are handled separately via the links object.
 */
const RELATION_FIELDTYPES = new Set(['Link', 'Doctype'])

/**
 * Build a GraphQL connection query to fetch a list of records.
 *
 * Only declares variables ($limit, $offset, $orderBy) that are actually used,
 * avoiding GraphQL spec violations from unused variable declarations.
 *
 * @param meta - Doctype metadata
 * @param connectionFieldName - Function to derive the connection field name from a table name
 * @param orderByTypeName - Function to derive the order-by type name from a table name
 * @param options - Query options (limit, offset, orderBy)
 * @returns GraphQL query string
 *
 * @public
 */
export function buildListQuery(
	meta: DoctypeMeta,
	connectionFieldName: (t: string) => string,
	orderByTypeName: (t: string) => string,
	options?: GetRecordsOptions
): string {
	const fieldNames = queryableFieldNames(meta)
	const connectionName = connectionFieldName(meta.tableName!)
	const orderByType = orderByTypeName(meta.tableName!)

	const varDecls: string[] = []
	const queryArgs: string[] = []
	if (options?.limit) {
		varDecls.push('$limit: Int')
		queryArgs.push(`first: $limit`)
	}
	if (options?.offset) {
		varDecls.push('$offset: Int')
		queryArgs.push(`offset: $offset`)
	}
	if (options?.orderBy) {
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
 * Build a GraphQL query string from doctype metadata.
 *
 * Generates scalar field selections. When `includeNested` is set,
 * recursively includes descendant link sub-selections derived from
 * the doctype's `links` object.
 *
 * @param meta - Doctype metadata to build the query from
 * @param recordFieldName - Function to derive the query field name from a table name
 * @param recordArgName - Function to derive the argument name from a table name
 * @param recordArgType - Function to derive the argument type from a table name
 * @param registry - Doctype registry for resolving link targets. Required when includeNested is set.
 * @param options - Query options (includeNested, maxDepth)
 * @returns GraphQL query string
 *
 * @public
 */
export function buildRecordQuery(
	meta: DoctypeMeta,
	recordFieldName: (t: string) => string,
	recordArgName: (t: string) => string,
	recordArgType: (t: string) => string,
	registry?: Map<string, DoctypeMeta>,
	options?: GetRecordOptions
): string {
	const queryName = recordFieldName(meta.tableName!)
	const argName = recordArgName(meta.tableName!)
	const argType = recordArgType(meta.tableName!)

	const seen = new Set<string>([meta.slug || meta.name])

	let selection = queryableFieldNames(meta)

	if (options?.includeNested && meta.links && registry) {
		const includeSet = Array.isArray(options.includeNested) ? new Set(options.includeNested) : null

		const nestedSelections = buildNestedSelections(
			meta.links,
			meta.tableName!,
			includeSet,
			registry,
			seen,
			0,
			options.maxDepth
		)

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
 * Build nested sub-selections for descendant links
 * @internal
 */
function buildNestedSelections(
	links: Record<string, LinkDeclaration>,
	parentTableName: string,
	includeSet: Set<string> | null,
	registry: Map<string, DoctypeMeta>,
	seen: Set<string>,
	depth: number,
	maxDepth?: number
): string {
	if (maxDepth !== undefined && depth >= maxDepth) return ''

	const selections: string[] = []

	for (const [fieldname, link] of Object.entries(links)) {
		if (includeSet && !includeSet.has(fieldname)) continue
		if (maxDepth !== undefined && depth >= maxDepth) break

		const targetMeta = registry.get(link.target)
		if (!targetMeta) continue

		const alreadySeen = seen.has(link.target)
		if (alreadySeen) {
			// Self-referential: include scalar fields only, don't modify seen
		} else {
			seen.add(link.target)
		}
		const scalarFields = queryableFieldNames(targetMeta)

		let nestedLinks = ''
		if (!alreadySeen && targetMeta.links && targetMeta.tableName && (maxDepth === undefined || depth + 1 < maxDepth)) {
			const innerSelections = buildNestedSelections(
				targetMeta.links,
				targetMeta.tableName,
				null,
				registry,
				seen,
				depth + 1,
				maxDepth
			)
			if (innerSelections) {
				nestedLinks = '\n          ' + innerSelections
			}
			seen.delete(link.target)
		}

		const fullSelection = scalarFields + nestedLinks

		if (isManyCardinality(link.cardinality)) {
			const connectionField = getConnectionFieldName(targetMeta, parentTableName)
			selections.push(`
			${connectionField} {
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
 * Get scalar field names for a doctype, excluding Link and Doctype fields
 * @internal
 */
function queryableFieldNames(meta: DoctypeMeta): string {
	return meta.fields
		.filter(f => !RELATION_FIELDTYPES.has(f.fieldtype))
		.map(f => f.fieldname)
		.join('\n      ')
}

/**
 * Check if a cardinality value represents a 1:many relationship
 * @internal
 */
function isManyCardinality(cardinality: string): boolean {
	return cardinality === 'noneOrMany' || cardinality === 'atLeastOne'
}

/**
 * Derive a PostGraphile connection field name from a target doctype and parent table name.
 *
 * PostGraphile convention: `{targetPlural}By{ParentTablePascal}Id`
 * Example: recipe_task with parent recipe → `recipeTasksByRecipeId`
 *
 * @internal
 */
function getConnectionFieldName(targetMeta: DoctypeMeta, parentTableName: string): string {
	const targetPlural = pluralize.plural(targetMeta.tableName!)
	const targetPascal = toPascalCase(targetPlural)
	const fkPascal = toPascalCase(parentTableName) + 'Id'
	return `${targetPascal}By${fkPascal}`
}
