import type { DoctypeMeta, GetRecordsOptions } from '@stonecrop/schema'

/**
 * Field types that are not scalar queryable fields.
 * Link fields are handled separately via sub-selections; relationship fields live in `links`.
 */
const RELATION_FIELDTYPES = new Set(['Link'])

/**
 * Get scalar field names for a doctype, excluding Link and Doctype fields
 */
function queryableFieldNames(meta: DoctypeMeta): string {
	return meta.fields
		.filter(f => !RELATION_FIELDTYPES.has(f.fieldtype))
		.map(f => f.fieldname)
		.join('\n      ')
}

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
