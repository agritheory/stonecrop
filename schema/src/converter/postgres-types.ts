import { z } from 'zod'

import type { FieldMeta } from '../field'

/**
 * PostgreSQL types we handle during conversion
 * @public
 */
export const PostgresType = z.enum([
	// Text
	'text',
	'varchar',
	'char',
	'citext',

	// Integer
	'smallint',
	'integer',
	'bigint',
	'serial',
	'bigserial',
	'smallserial',

	// Arbitrary Precision Decimal
	'numeric',
	'decimal',

	// Floating Point (IEEE 754)
	'real',
	'double precision',

	// Monetary (maps to Decimal)
	'money',

	// Boolean
	'boolean',

	// Date/Time
	'date',
	'time',
	'timetz',
	'timestamp',
	'timestamptz',
	'interval',

	// Range
	'int4range',
	'int8range',
	'numrange',
	'daterange',
	'tsrange',
	'tstzrange',

	// Binary
	'bytea',

	// UUID
	'uuid',

	// JSON
	'json',
	'jsonb',

	// Bit
	'bit',
	'varbit',

	// XML
	'xml',

	// Extensions
	'unit',
	'cube',

	// Fallback
	'unknown',
])

export type PostgresType = z.infer<typeof PostgresType>

/**
 * Intermediate representation of a parsed column (from DDL)
 * @public
 */
export interface ParsedColumn {
	name: string
	dataType: string
	normalizedType: PostgresType
	nullable: boolean
	isGenerated: boolean
	defaultValue?: string
	arrayDimensions: number
	reference?: {
		schema?: string
		table: string
		column: string
		onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
	}
	precision?: number
	scale?: number
	length?: number
}

/**
 * Intermediate representation of a parsed table (from DDL)
 * @public
 */
export interface ParsedTable {
	name: string
	schema?: string
	columns: ParsedColumn[]
	inherits?: string[]
	/** Table comment from COMMENT ON TABLE statement */
	comment?: string
	/** Doctype name extracted from comment (if using @doctype convention) */
	doctypeName?: string
}

/**
 * Options for DDL to doctype conversion
 * @public
 */
export interface ConversionOptions {
	/** Schema to filter tables by */
	schema?: string
	/** Tables to exclude */
	exclude?: string[]
	/** Override type mappings */
	typeOverrides?: Record<string, Partial<FieldMeta>>
	/** How to handle inherited fields */
	inheritanceMode: 'flatten' | 'reference'
	/** Include unmapped type metadata in output */
	includeUnmappedMeta?: boolean
	/** Use camelCase for field names (default: false, keeps snake_case) */
	useCamelCase?: boolean
}

/**
 * Extended field with conversion metadata (only used during schema-tools output)
 * @public
 */
export interface ConversionFieldMeta extends FieldMeta {
	_pgType?: string
	_unmapped?: boolean
}
