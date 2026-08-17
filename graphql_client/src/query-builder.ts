/**
 * Query builder for constructing PostGraphile native queries with nested link selections.
 *
 * Instead of using the `stonecropRecord`/`stonecropRecords` resolvers which return JSON blobs,
 * this module builds native PostGraphile queries that leverage the ORM's relationship resolution
 * for efficient single-query fetches with JOINs.
 *
 * @example
 * ```ts
 * // Instead of:
 * // stonecropRecord(doctype: "SalesOrder", id: "...") { data }
 * // Which returns { customerId: "uuid" }
 *
 * // We generate:
 * // salesOrderById(id: "...") { id, customerId, partyByCustomerId { id, partyName } }
 * // Which returns { customerId: "uuid", partyByCustomerId: { id: "uuid", partyName: "Acme" } }
 * ```
 *
 * @public
 */

import type { DoctypeMeta, ValueField } from '@stonecrop/schema'
import { flattenFields, componentLinkExpansion } from '@stonecrop/schema'

/**
 * Options for building queries
 * @public
 */
export interface QueryBuilderOptions {
	/**
	 * All available doctype metadata. Used to resolve target doctypes for link fields.
	 */
	allMeta: DoctypeMeta[]

	/**
	 * Maximum depth for nested link resolution. Defaults to 1 (immediate links only).
	 * Set to 0 to disable link expansion.
	 */
	maxDepth?: number
}

/**
 * Result of building a native query
 * @public
 */
export interface BuiltQuery {
	/**
	 * The GraphQL query string
	 */
	query: string

	/**
	 * Field names that are link fields with nested selections.
	 * The consumer can use this to know which fields will have relationship data.
	 */
	linkFields: string[]
}

/**
 * Convert a PascalCase doctype name to the camelCase query name PostGraphile uses.
 *
 * @example
 * doctypeToQueryName('SalesOrder') // 'salesOrder'
 * doctypeToQueryName('Party') // 'party'
 * @public
 */
export function doctypeToQueryName(doctypeName: string): string {
	return doctypeName[0].toLowerCase() + doctypeName.slice(1)
}

/**
 * Convert a PascalCase doctype name to the PostGraphile single-record query name.
 *
 * @example
 * doctypeToSingleQuery('SalesOrder') // 'salesOrderById'
 * @public
 */
export function doctypeToSingleQuery(doctypeName: string): string {
	return doctypeToQueryName(doctypeName) + 'ById'
}

/**
 * Convert a PascalCase doctype name to the PostGraphile list query name.
 *
 * @example
 * doctypeToListQuery('SalesOrder') // 'allSalesOrders'
 * doctypeToListQuery('Party') // 'allParties'
 * @public
 */
export function doctypeToListQuery(doctypeName: string): string {
	const name = doctypeName
	if (name.endsWith('y')) {
		return 'all' + name.slice(0, -1) + 'ies'
	}
	return 'all' + name + 's'
}

/**
 * Build the PostGraphile relationship field name for a foreign key.
 *
 * PostGraphile names relationships as `targetTypeByFkField` in camelCase.
 *
 * @example
 * buildRelationshipName('Party', 'customerId') // 'partyByCustomerId'
 * buildRelationshipName('Company', 'companyId') // 'companyByCompanyId'
 * @public
 */
export function buildRelationshipName(targetDoctypeName: string, fkFieldname: string): string {
	const prefix = doctypeToQueryName(targetDoctypeName)
	const suffix = fkFieldname[0].toUpperCase() + fkFieldname.slice(1)
	return prefix + 'By' + suffix
}

/**
 * Resolve a doctype slug to its metadata.
 */
function resolveDoctype(slug: string, allMeta: DoctypeMeta[]): DoctypeMeta | undefined {
	return allMeta.find(m => m.slug === slug || m.name === slug)
}

function valueFieldNamed(fields: DoctypeMeta['fields'], fieldname: string): ValueField | undefined {
	for (const field of flattenFields(fields)) {
		if (field.kind === 'field' && field.fieldname === fieldname) {
			return field
		}
	}
	return undefined
}

/**
 * Build the field selection for a doctype, including nested selections for link fields.
 */
function buildFieldSelection(
	meta: DoctypeMeta,
	allMeta: DoctypeMeta[],
	depth: number,
	maxDepth: number,
	linkFieldsOut: string[]
): string {
	const flatFields = flattenFields(meta.fields)
	const selections: string[] = []

	for (const field of flatFields) {
		if (field.kind !== 'field') continue

		const isLinkField = field.doctype && componentLinkExpansion(field.component) === 'inline'

		if (isLinkField && depth < maxDepth) {
			const targetMeta = resolveDoctype(field.doctype!, allMeta)
			if (targetMeta) {
				const relationshipName = buildRelationshipName(targetMeta.name, field.fieldname)
				const displayField = targetMeta.displayField

				if (displayField) {
					selections.push(field.fieldname)
					selections.push(`${relationshipName} { id ${displayField} }`)
					linkFieldsOut.push(field.fieldname)
				} else {
					selections.push(field.fieldname)
				}
			} else {
				selections.push(field.fieldname)
			}
		} else {
			selections.push(field.fieldname)
		}
	}

	return selections.join(' ')
}

/**
 * Build a native PostGraphile query for fetching a single record by ID.
 * @public
 */
export function buildSingleRecordQuery(meta: DoctypeMeta, options: QueryBuilderOptions): BuiltQuery {
	const maxDepth = options.maxDepth ?? 1
	const linkFields: string[] = []

	const fieldSelection = buildFieldSelection(meta, options.allMeta, 0, maxDepth, linkFields)
	const queryName = doctypeToSingleQuery(meta.name)

	const query = `query($id: UUID!) { ${queryName}(id: $id) { ${fieldSelection} } }`

	return { query, linkFields }
}

/**
 * Build a native PostGraphile query for fetching multiple records.
 * @public
 */
export function buildListRecordQuery(
	meta: DoctypeMeta,
	options: QueryBuilderOptions & {
		first?: number
		offset?: number
		orderBy?: string
		condition?: Record<string, unknown>
	}
): BuiltQuery {
	const maxDepth = options.maxDepth ?? 1
	const linkFields: string[] = []

	const fieldSelection = buildFieldSelection(meta, options.allMeta, 0, maxDepth, linkFields)
	const queryName = doctypeToListQuery(meta.name)

	const params: string[] = []
	const args: string[] = []

	if (options.first !== undefined) {
		params.push('$first: Int')
		args.push('first: $first')
	}
	if (options.offset !== undefined) {
		params.push('$offset: Int')
		args.push('offset: $offset')
	}
	if (options.orderBy) {
		params.push('$orderBy: [SalesOrdersOrderBy!]')
		args.push('orderBy: $orderBy')
	}
	if (options.condition) {
		params.push('$condition: SalesOrderCondition')
		args.push('condition: $condition')
	}

	const paramStr = params.length > 0 ? `(${params.join(', ')})` : ''
	const argStr = args.length > 0 ? `(${args.join(', ')})` : ''

	const query = `query${paramStr} { ${queryName}${argStr} { nodes { ${fieldSelection} } } }`

	return { query, linkFields }
}

/**
 * Transform a record fetched via native PostGraphile query to the flat format
 * expected by the Stonecrop client. Link fields become objects with `id` and `displayText`.
 * @public
 */
export function transformNativeRecord(
	record: Record<string, unknown>,
	linkFields: string[],
	meta: DoctypeMeta,
	allMeta: DoctypeMeta[]
): Record<string, unknown> {
	const result: Record<string, unknown> = {}

	for (const [key, value] of Object.entries(record)) {
		if (key.includes('By')) {
			continue
		}

		if (linkFields.includes(key)) {
			const linkField = valueFieldNamed(meta.fields, key)
			if (linkField?.doctype) {
				const targetMeta = resolveDoctype(linkField.doctype, allMeta)
				if (targetMeta?.displayField) {
					const relationshipName = buildRelationshipName(targetMeta.name, key)
					const nestedRaw = record[relationshipName]
					const displayText =
						nestedRaw !== null && nestedRaw !== undefined && typeof nestedRaw === 'object'
							? Reflect.get(nestedRaw, targetMeta.displayField)
							: undefined

					if (displayText !== undefined && displayText !== null && displayText !== '') {
						result[key] = {
							id: value,
							displayText,
						}
						continue
					}
				}
			}
		}

		result[key] = value
	}

	return result
}
