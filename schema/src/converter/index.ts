import { parseDDL } from './parser'
import { mapColumnToField } from './type-map'
import { toPascalCase, toSlug } from './naming'
import type { DoctypeMeta } from '../doctype'
import type { ParsedTable, ConversionOptions, ConversionFieldMeta } from './postgres-types'

/**
 * Output of schema conversion - uses DoctypeMeta but with optional conversion metadata
 * @public
 */
export interface ConvertedDoctype extends Omit<DoctypeMeta, 'fields'> {
	fields: ConversionFieldMeta[]
}

/**
 * Convert PostgreSQL DDL to Stonecrop doctype schemas
 * @public
 */
export function convertSchema(
	sql: string,
	options: ConversionOptions = { inheritanceMode: 'flatten' }
): ConvertedDoctype[] {
	const tables = parseDDL(sql)
	const tableMap = new Map(tables.map(t => [t.name, t]))

	let result = tables

	// Filter by schema
	if (options.schema) {
		result = result.filter(t => t.schema === options.schema)
	}

	// Exclude tables
	if (options.exclude) {
		result = result.filter(t => !options.exclude!.includes(t.name))
	}

	return result.map(table => buildDoctype(table, tableMap, options))
}

/**
 * Build a DoctypeMeta from a ParsedTable
 */
function buildDoctype(
	table: ParsedTable,
	tableMap: Map<string, ParsedTable>,
	options: ConversionOptions
): ConvertedDoctype {
	const fieldMap = new Map<string, ConversionFieldMeta>()

	// Flatten inherited fields first
	if (options.inheritanceMode === 'flatten' && table.inherits) {
		for (const parentName of table.inherits) {
			const parent = tableMap.get(parentName)
			if (parent) {
				for (const col of parent.columns) {
					const field = mapColumnToField(col, tableMap, {
						includeUnmappedMeta: options.includeUnmappedMeta,
						useCamelCase: options.useCamelCase,
					})
					fieldMap.set(field.fieldname, field)
				}
			}
		}
	}

	// Add own columns (overriding inherited fields with same name)
	for (const col of table.columns) {
		const field = mapColumnToField(col, tableMap, {
			includeUnmappedMeta: options.includeUnmappedMeta,
			useCamelCase: options.useCamelCase,
		})
		fieldMap.set(field.fieldname, field)
	}

	let fields = Array.from(fieldMap.values())

	// Apply overrides
	if (options.typeOverrides) {
		fields = fields.map(field => {
			const override = options.typeOverrides![field.fieldname]
			return override ? { ...field, ...override } : field
		})
	}

	// Clean up undefined optional fields
	fields = fields.map(cleanField)

	// Use @doctype name from comment if available, otherwise derive from table name
	const doctypeName = table.doctypeName ?? toPascalCase(table.name)

	return {
		name: doctypeName,
		slug: toSlug(table.name),
		tableName: table.name,
		fields,
		inherits: table.inherits?.[0],
	}
}

/**
 * Remove undefined optional properties from a field
 */
function cleanField(field: ConversionFieldMeta): ConversionFieldMeta {
	const cleaned: ConversionFieldMeta = {
		fieldname: field.fieldname,
		component: field.component,
		fieldtype: field.fieldtype,
	}

	if (field.label !== undefined) cleaned.label = field.label
	if (field.required === true) cleaned.required = true
	if (field.default !== undefined) cleaned.default = field.default
	if (field.readOnly === true) cleaned.readOnly = true
	if (field.options !== undefined) cleaned.options = field.options
	if (field._pgType !== undefined) cleaned._pgType = field._pgType
	if (field._unmapped === true) cleaned._unmapped = true

	return cleaned
}

// Re-exports
export { parseDDL } from './parser'
export { normalizeType, mapColumnToField, PG_TYPE_MAP, TYPE_ALIASES } from './type-map'
export type { MapColumnOptions } from './type-map'
export type { ConversionFieldMeta, ParsedColumn, ParsedTable, ConversionOptions, PostgresType } from './postgres-types'

// Naming utilities
export {
	snakeToCamel,
	camelToSnake,
	snakeToLabel,
	camelToLabel,
	convertSQLName,
	convertSQLNames,
	createNameMapping,
	toPascalCase,
	toSlug,
} from './naming'
export type { NameConversion } from './naming'
