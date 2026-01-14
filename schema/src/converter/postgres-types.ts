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

/**
 * PostgreSQL type enum inferred from Zod schema
 * @public
 */
export type PostgresType = z.infer<typeof PostgresType>

/**
 * Intermediate representation of a parsed column (from DDL)
 * @public
 */
export interface ParsedColumn {
	/** Column name (from SQL definition) */
	name: string
	/** Raw PostgreSQL data type string */
	dataType: string
	/** Normalized PostgreSQL type (mapped to standard types) */
	normalizedType: PostgresType
	/** Whether the column allows NULL values */
	nullable: boolean
	/** Whether the column is auto-generated (GENERATED ALWAYS) */
	isGenerated: boolean
	/** Default value expression (if specified) */
	defaultValue?: string
	/** Number of array dimensions (0 for non-array types) */
	arrayDimensions: number
	/** Foreign key reference information (if column references another table) */
	reference?: {
		/** Referenced schema name */
		schema?: string
		/** Referenced table name */
		table: string
		/** Referenced column name */
		column: string
		/** Foreign key ON DELETE action */
		onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
	}
	/** Numeric precision (for NUMERIC/DECIMAL types) */
	precision?: number
	/** Numeric scale (for NUMERIC/DECIMAL types) */
	scale?: number
	/** Character/binary length constraint (for VARCHAR, CHAR, BIT types) */
	length?: number
}

/**
 * Intermediate representation of a parsed table (from DDL)
 * @public
 */
export interface ParsedTable {
	/** Table name (from CREATE TABLE statement) */
	name: string
	/** Schema name (if specified, defaults to 'public') */
	schema?: string
	/** Column definitions parsed from the table */
	columns: ParsedColumn[]
	/** Parent table names (for PostgreSQL table inheritance) */
	inherits?: string[]
	/** Table comment from COMMENT ON TABLE statement */
	comment?: string
	/** Doctype name extracted from comment (if using \@doctype convention) */
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
	/** Original PostgreSQL type (for debugging/reference) */
	_pgType?: string
	/** Marks fields that couldn't be automatically mapped */
	_unmapped?: boolean
}
