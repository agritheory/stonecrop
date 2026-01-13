import type { StonecropFieldType, FieldTemplate as BaseFieldTemplate } from '../fieldtype'
import type { PostgresType, ParsedColumn, ParsedTable, ConversionFieldMeta } from './postgres-types'
import { convertSQLName, toSlug } from './naming'

interface FieldTemplate extends BaseFieldTemplate {
	_unmapped?: boolean
}

/**
 * Mapping from PostgreSQL types to Stonecrop field types
 * @public
 */
export const PG_TYPE_MAP: Record<PostgresType, FieldTemplate> = {
	// ═══════════════════════════════════════════════════════════════
	// TEXT
	// ═══════════════════════════════════════════════════════════════
	text: { component: 'ATextInput', fieldtype: 'Text' },
	varchar: { component: 'ATextInput', fieldtype: 'Data' },
	char: { component: 'ATextInput', fieldtype: 'Data' },
	citext: { component: 'ATextInput', fieldtype: 'Data' },

	// ═══════════════════════════════════════════════════════════════
	// INTEGER
	// ═══════════════════════════════════════════════════════════════
	smallint: { component: 'ANumericInput', fieldtype: 'Int' },
	integer: { component: 'ANumericInput', fieldtype: 'Int' },
	bigint: { component: 'ANumericInput', fieldtype: 'Int' },
	serial: { component: 'ANumericInput', fieldtype: 'Int' },
	bigserial: { component: 'ANumericInput', fieldtype: 'Int' },
	smallserial: { component: 'ANumericInput', fieldtype: 'Int' },

	// ═══════════════════════════════════════════════════════════════
	// ARBITRARY PRECISION DECIMAL
	// Use for currency, financial calculations, anything requiring
	// exact decimal representation (like Python's Decimal)
	// ═══════════════════════════════════════════════════════════════
	numeric: { component: 'ADecimalInput', fieldtype: 'Decimal', _unmapped: true },
	decimal: { component: 'ADecimalInput', fieldtype: 'Decimal', _unmapped: true },
	money: { component: 'ADecimalInput', fieldtype: 'Decimal', _unmapped: true },

	// ═══════════════════════════════════════════════════════════════
	// FLOATING POINT (IEEE 754)
	// Only use for scientific/approximate values, never for money
	// ═══════════════════════════════════════════════════════════════
	real: { component: 'ANumericInput', fieldtype: 'Float' },
	'double precision': { component: 'ANumericInput', fieldtype: 'Float' },

	// ═══════════════════════════════════════════════════════════════
	// BOOLEAN
	// ═══════════════════════════════════════════════════════════════
	boolean: { component: 'ACheckbox', fieldtype: 'Check' },

	// ═══════════════════════════════════════════════════════════════
	// DATE / TIME
	// ═══════════════════════════════════════════════════════════════
	date: { component: 'ADatePicker', fieldtype: 'Date' },
	time: { component: 'ATimeInput', fieldtype: 'Time', _unmapped: true },
	timetz: { component: 'ATimeInput', fieldtype: 'Time', _unmapped: true },
	timestamp: { component: 'ADatetimePicker', fieldtype: 'Datetime', _unmapped: true },
	timestamptz: { component: 'ADatetimePicker', fieldtype: 'Datetime', _unmapped: true },
	interval: { component: 'ADurationInput', fieldtype: 'Duration', _unmapped: true },

	// ═══════════════════════════════════════════════════════════════
	// RANGE
	// ═══════════════════════════════════════════════════════════════
	int4range: { component: 'ATextInput', fieldtype: 'Data', _unmapped: true },
	int8range: { component: 'ATextInput', fieldtype: 'Data', _unmapped: true },
	numrange: { component: 'ATextInput', fieldtype: 'Data', _unmapped: true },
	daterange: { component: 'ADateRangePicker', fieldtype: 'DateRange', _unmapped: true },
	tsrange: { component: 'ADateRangePicker', fieldtype: 'DateRange', _unmapped: true },
	tstzrange: { component: 'ADateRangePicker', fieldtype: 'DateRange', _unmapped: true },

	// ═══════════════════════════════════════════════════════════════
	// BINARY
	// Default to Data - use typeOverrides for actual file attachments
	// ═══════════════════════════════════════════════════════════════
	bytea: { component: 'ATextInput', fieldtype: 'Data' },

	// ═══════════════════════════════════════════════════════════════
	// UUID
	// ═══════════════════════════════════════════════════════════════
	uuid: { component: 'ATextInput', fieldtype: 'Data' },

	// ═══════════════════════════════════════════════════════════════
	// JSON
	// ═══════════════════════════════════════════════════════════════
	json: { component: 'ACodeEditor', fieldtype: 'JSON', _unmapped: true },
	jsonb: { component: 'ACodeEditor', fieldtype: 'JSON', _unmapped: true },

	// ═══════════════════════════════════════════════════════════════
	// BIT
	// ═══════════════════════════════════════════════════════════════
	bit: { component: 'ATextInput', fieldtype: 'Data' },
	varbit: { component: 'ATextInput', fieldtype: 'Data' },

	// ═══════════════════════════════════════════════════════════════
	// XML
	// ═══════════════════════════════════════════════════════════════
	xml: { component: 'ACodeEditor', fieldtype: 'Code', _unmapped: true },

	// ═══════════════════════════════════════════════════════════════
	// EXTENSIONS
	// ═══════════════════════════════════════════════════════════════
	unit: { component: 'AQuantityInput', fieldtype: 'Quantity', _unmapped: true },
	cube: { component: 'ATextInput', fieldtype: 'JSON', _unmapped: true },

	// ═══════════════════════════════════════════════════════════════
	// FALLBACK
	// ═══════════════════════════════════════════════════════════════
	unknown: { component: 'ATextInput', fieldtype: 'Data', _unmapped: true },
}

/**
 * PostgreSQL type aliases to canonical types
 * @public
 */
export const TYPE_ALIASES: Record<string, PostgresType> = {
	// Integer
	int: 'integer',
	int2: 'smallint',
	int4: 'integer',
	int8: 'bigint',
	serial4: 'serial',
	serial8: 'bigserial',
	serial2: 'smallserial',

	// Float
	float: 'real',
	float4: 'real',
	float8: 'double precision',

	// Boolean
	bool: 'boolean',

	// Character
	character: 'char',
	'character varying': 'varchar',

	// Timestamp
	'timestamp without time zone': 'timestamp',
	'timestamp with time zone': 'timestamptz',
	'time without time zone': 'time',
	'time with time zone': 'timetz',

	// Bit
	'bit varying': 'varbit',
}

/**
 * Normalize raw PostgreSQL type string to canonical PostgresType
 * @public
 */
export function normalizeType(rawType: string): PostgresType {
	const lower = rawType.toLowerCase().trim()

	// Direct match
	if (lower in PG_TYPE_MAP) {
		return lower as PostgresType
	}

	// Alias match
	if (lower in TYPE_ALIASES) {
		return TYPE_ALIASES[lower]
	}

	// Strip type parameters: varchar(255) → varchar
	const baseType = lower.replace(/\([^)]*\)/, '').trim()
	if (baseType in PG_TYPE_MAP) {
		return baseType as PostgresType
	}
	if (baseType in TYPE_ALIASES) {
		return TYPE_ALIASES[baseType]
	}

	return 'unknown'
}

/**
 * Options for column to field mapping
 * @public
 */
export interface MapColumnOptions {
	/** Include unmapped type metadata in output */
	includeUnmappedMeta?: boolean
	/** Use camelCase for field names (default: false, keeps snake_case) */
	useCamelCase?: boolean
}

/**
 * Map a parsed column to a Stonecrop field definition
 * @public
 */
export function mapColumnToField(
	column: ParsedColumn,
	_tableRegistry: Map<string, ParsedTable>,
	options: MapColumnOptions = {}
): ConversionFieldMeta {
	// Get fieldname and label using naming conventions
	const { fieldname, label } = options.useCamelCase
		? convertSQLName(column.name)
		: { fieldname: column.name, label: toLabel(column.name) }

	// Foreign key → Link
	if (column.reference) {
		return {
			fieldname,
			label,
			component: 'ALink',
			fieldtype: 'Link',
			options: toSlug(column.reference.table),
			required: !column.nullable,
		}
	}

	// Array → Doctype (child table)
	if (column.arrayDimensions > 0) {
		const field: ConversionFieldMeta = {
			fieldname,
			label,
			component: 'ATable',
			fieldtype: 'Doctype',
			required: !column.nullable,
		}
		if (options.includeUnmappedMeta) {
			field._pgType = `${column.dataType}[]`.repeat(column.arrayDimensions)
		}
		return field
	}

	const template = PG_TYPE_MAP[column.normalizedType] ?? PG_TYPE_MAP.unknown

	const field: ConversionFieldMeta = {
		fieldname,
		label,
		component: template.component,
		fieldtype: template.fieldtype,
		required: !column.nullable && !column.isGenerated,
		readOnly: column.isGenerated,
		default: parseDefault(column.defaultValue, column.normalizedType),
	}

	// Include precision/scale for decimal types via options
	if (column.precision !== undefined) {
		field.options = { precision: column.precision }
		if (column.scale !== undefined) {
			;(field.options as Record<string, unknown>).scale = column.scale
		}
	}

	// Mark unmapped types
	if (options.includeUnmappedMeta && template._unmapped) {
		field._unmapped = true
		field._pgType = column.dataType
	}

	return field
}

/**
 * Convert snake_case to Title Case label (for non-camelCase mode)
 */
function toLabel(fieldname: string): string {
	return fieldname
		.replace(/_/g, ' ')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Parse default value based on type
 */
function parseDefault(value: string | undefined, dataType: PostgresType): unknown {
	if (!value) return undefined

	// Skip function/expression defaults
	if (value.includes('(') || value.includes('::')) return undefined

	switch (dataType) {
		case 'boolean':
			return value.toLowerCase() === 'true'

		case 'smallint':
		case 'integer':
		case 'bigint':
		case 'serial':
		case 'bigserial':
		case 'smallserial': {
			const intVal = parseInt(value, 10)
			return isNaN(intVal) ? undefined : intVal
		}

		case 'real':
		case 'double precision': {
			const floatVal = parseFloat(value)
			return isNaN(floatVal) ? undefined : floatVal
		}

		case 'numeric':
		case 'decimal':
		case 'money':
			// Return as string to preserve precision
			return value.replace(/^'|'$/g, '')

		default:
			// Strip quotes from string literals
			if (value.startsWith("'") && value.endsWith("'")) {
				return value.slice(1, -1)
			}
			return undefined
	}
}
