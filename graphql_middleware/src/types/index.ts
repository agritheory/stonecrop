import { z } from 'zod'

// =============================================================================
// Field Types
// =============================================================================

/**
 * Stonecrop field types - the semantic type of the field
 */
export const StonecropFieldType = z.enum([
	'Data',
	'Text',
	'Int',
	'Float',
	'Decimal',
	'Check',
	'Date',
	'Time',
	'Datetime',
	'Duration',
	'DateRange',
	'JSON',
	'Table',
	'Link',
	'Attach',
	'Currency',
	'Quantity',
	'Code',
])

export type StonecropFieldType = z.infer<typeof StonecropFieldType>

/**
 * Field options - flexible to accommodate different field types
 *
 * - string: Link target doctype ("Customer")
 * - string[]: Select choices (["Draft", "Submitted", "Cancelled"])
 * - Record: Component-specific config ({ rows: 5, language: "python" })
 */
export const FieldOptions = z.union([z.string(), z.array(z.string()), z.record(z.string(), z.unknown())])

export type FieldOptions = z.infer<typeof FieldOptions>

/**
 * Field metadata - defines a single field in a doctype
 */
export const FieldMeta = z.object({
	fieldname: z.string().min(1),
	fieldtype: StonecropFieldType,
	component: z.string().min(1),
	label: z.string().optional(),
	required: z.boolean().optional(),
	readOnly: z.boolean().optional(),
	default: z.unknown().optional(),
	options: FieldOptions.optional(),
	precision: z.number().int().nonnegative().optional(),
	scale: z.number().int().nonnegative().optional(),
})

export type FieldMeta = z.infer<typeof FieldMeta>

// =============================================================================
// Workflow Types
// =============================================================================

/**
 * Action definition within a workflow
 */
export const ActionDefinition = z.object({
	label: z.string().min(1),
	handler: z.string().min(1),
	requiredFields: z.array(z.string()).optional(),
	allowedStates: z.array(z.string()).optional(),
	confirm: z.boolean().optional(),
	args: z.record(z.string(), z.unknown()).optional(),
})

export type ActionDefinition = z.infer<typeof ActionDefinition>

/**
 * Workflow metadata - states and actions for a doctype
 */
export const WorkflowMeta = z.object({
	states: z.array(z.string()).optional(),
	actions: z.record(z.string(), ActionDefinition).optional(),
})

export type WorkflowMeta = z.infer<typeof WorkflowMeta>

// =============================================================================
// Doctype Types
// =============================================================================

/**
 * Doctype metadata - complete definition of a doctype
 */
export const DoctypeMeta = z.object({
	name: z.string().min(1),
	slug: z.string().min(1).optional(),
	tableName: z.string().optional(),
	fields: z.array(FieldMeta),
	workflow: WorkflowMeta.optional(),
	inherits: z.string().optional(),
	listDoctype: z.string().optional(),
	parentDoctype: z.string().optional(),
})

export type DoctypeMeta = z.infer<typeof DoctypeMeta>

// =============================================================================
// Validation Helpers
// =============================================================================

export interface ValidationResult {
	success: boolean
	errors: ValidationError[]
}

export interface ValidationError {
	path: (string | number)[]
	message: string
}

/**
 * Validate a doctype definition
 */
export function validateDoctype(data: unknown): ValidationResult {
	const result = DoctypeMeta.safeParse(data)

	if (result.success) {
		return { success: true, errors: [] }
	}

	return {
		success: false,
		errors: result.error.issues.map(issue => ({
			path: issue.path,
			message: issue.message,
		})),
	}
}

/**
 * Validate a field definition
 */
export function validateField(data: unknown): ValidationResult {
	const result = FieldMeta.safeParse(data)

	if (result.success) {
		return { success: true, errors: [] }
	}

	return {
		success: false,
		errors: result.error.issues.map(issue => ({
			path: issue.path,
			message: issue.message,
		})),
	}
}

/**
 * Parse and validate a doctype, throwing on failure
 */
export function parseDoctype(data: unknown): DoctypeMeta {
	return DoctypeMeta.parse(data)
}

/**
 * Parse and validate a field, throwing on failure
 */
export function parseField(data: unknown): FieldMeta {
	return FieldMeta.parse(data)
}

// =============================================================================
// Context Types (runtime, not validated from JSON)
// =============================================================================

/**
 * Route context for identifying what doctype/record we're working with
 */
export interface RouteContext {
	doctype: string
	recordId?: string
	[key: string]: unknown
}

/**
 * Context passed to action handlers
 */
export interface ActionContext {
	doctype: DoctypeMeta
	executor: GraphQLExecutor
	[key: string]: unknown
}

/**
 * Action handler function signature
 */
export type ActionHandler = (args: unknown[], context: ActionContext) => Promise<unknown>

/**
 * GraphQL executor interface for running queries/mutations
 */
export interface GraphQLExecutor {
	query<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T>
	mutate<T = unknown>(mutation: string, variables?: Record<string, unknown>): Promise<T>
}

// =============================================================================
// PostgreSQL Conversion Types (for schema-tools integration)
// =============================================================================

/**
 * PostgreSQL types we handle during conversion
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
 */
export interface ParsedTable {
	name: string
	schema?: string
	columns: ParsedColumn[]
	inherits?: string[]
}

/**
 * Options for DDL to doctype conversion
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
}

/**
 * Extended field with conversion metadata (only used during schema-tools output)
 */
export interface ConversionFieldMeta extends FieldMeta {
	_pgType?: string
	_unmapped?: boolean
}
