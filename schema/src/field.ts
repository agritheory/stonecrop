import { z } from 'zod'

import type { ColumnSchema } from './column-schema'
import { StonecropFieldType } from './fieldtype'
import type { InteractionMode } from './mode'
import { TableViewConfig } from './table'

/**
 * Field options - flexible bag for type-specific configuration.
 *
 * Usage by fieldtype:
 * - Link/Doctype: target doctype slug as string ("customer", "sales-order-item")
 * - Select: array of choices (["Draft", "Submitted", "Cancelled"])
 * - Decimal: config object (\{ precision: 10, scale: 2 \})
 * - Code: config object (\{ language: "python" \})
 *
 * @public
 */
export const FieldOptions = z
	.union([
		z.string(), // Link/Doctype target: "customer"
		z.array(z.string()), // Select choices: ["A", "B", "C"]
		z.record(z.string(), z.unknown()), // Config: \{ precision: 10, scale: 2 \}
	])
	.meta({
		title: 'FieldOptions',
		description: 'Field options - flexible bag for type-specific configuration',
	})

/**
 * Field options type inferred from Zod schema
 * @public
 */
export type FieldOptions = z.infer<typeof FieldOptions>

/**
 * Validation configuration for form fields
 * @public
 */
export const FieldValidation = z
	.looseObject({
		/** Error message to display when validation fails */
		errorMessage: z.string(),
	})
	.meta({
		title: 'FieldValidation',
		description: 'Validation configuration for form fields',
	})

/**
 * Field validation type inferred from Zod schema
 * @public
 */
export type FieldValidation = z.infer<typeof FieldValidation>

// ---------------------------------------------------------------------------
// DoctypeField — the discriminated union of authoring-time field variants
// ---------------------------------------------------------------------------

/**
 * A field that holds a scalar value, a link to another record, or a select choice.
 * The most common kind of field. `fieldtype` determines the default component and behavior.
 * @public
 */
export interface ValueField {
	/** Discriminator — identifies this as a value-holding field */
	kind: 'field'
	/** Unique identifier for this field within its doctype */
	fieldname: string
	/** Semantic field type — determines behavior and default rendering component */
	fieldtype: string
	/** Vue component to render this field. Derived from `fieldtype` when absent. */
	component?: string
	/** Human-readable label */
	label?: string
	/** CSS width (e.g. `"40ch"`, `"200px"`) */
	width?: string
	/** Text alignment */
	align?: 'left' | 'center' | 'right' | 'start' | 'end'
	/** Whether the field is editable in table cell context */
	edit?: boolean
	/** Input mask pattern or serialized function */
	mask?: string
	/** Per-field interaction mode override */
	mode?: InteractionMode
	/** Type-specific options: Link target slug, Select choices, Decimal precision config, etc. */
	options?: FieldOptions
	/** Whether the field is required */
	required?: boolean
	/** Whether the field is read-only */
	readOnly?: boolean
	/** Whether the field is hidden from the UI */
	hidden?: boolean
	/** Default value for new records */
	default?: unknown
	/** Validation configuration */
	validation?: FieldValidation
	/** Cardinality for Link fields — authoritative value on LinkDeclaration takes precedence */
	cardinality?: 'atMostOne' | 'one' | 'noneOrMany' | 'atLeastOne'
}

/**
 * A layout container that groups other fields. Resolves to a nested AForm.
 * @public
 */
export interface FieldsetField {
	/** Discriminator — identifies this as a fieldset container */
	kind: 'fieldset'
	/** Unique identifier for this fieldset within its doctype */
	fieldname: string
	/** Vue component to render this fieldset. Defaults to `'AFieldset'` in resolveSchema. */
	component?: string
	/** Human-readable label for the fieldset legend */
	label?: string
	/** Whether the fieldset can be collapsed */
	collapsible?: boolean
	/** Interaction mode for all children inside this fieldset */
	mode?: InteractionMode
	/** Nested field definitions — resolved recursively by resolveSchema */
	schema: DoctypeField[]
}

/**
 * An inline table whose columns are defined directly in the schema (no linked doctype).
 * Use when the table data does not warrant a separate doctype.
 * @public
 */
export interface TableField {
	/** Discriminator — identifies this as an inline table */
	kind: 'table'
	/** Unique identifier for this table within its doctype */
	fieldname: string
	/** Vue component to render this table. Defaults to `'ATable'` in resolveSchema. */
	component?: string
	/** Human-readable label */
	label?: string
	/** Column definitions — use ColumnSchema (fieldname key) from \@stonecrop/schema */
	columns: ColumnSchema[]
	/** View configuration — defaults to `{ view: 'list' }` in resolveSchema when absent */
	config?: TableViewConfig
	/** Interaction mode for all cells inside this table */
	mode?: InteractionMode
}

/**
 * Union of all authoring-time field variants.
 * Use `kind` to discriminate: `'field'` | `'fieldset'` | `'table'`.
 * @public
 */
export type DoctypeField = ValueField | FieldsetField | TableField

// ---------------------------------------------------------------------------
// Zod runtime validation schemas
// ---------------------------------------------------------------------------

function createDoctypeFieldSchemas() {
	const ValueFieldSchema = z
		.object({
			kind: z.literal('field'),
			fieldname: z.string().min(1),
			fieldtype: StonecropFieldType,
			component: z.string().optional(),
			label: z.string().optional(),
			width: z.string().optional(),
			align: z.enum(['left', 'center', 'right', 'start', 'end']).optional(),
			edit: z.boolean().optional(),
			mask: z.string().optional(),
			mode: z.enum(['edit', 'read', 'display']).optional(),
			options: FieldOptions.optional(),
			required: z.boolean().optional(),
			readOnly: z.boolean().optional(),
			hidden: z.boolean().optional(),
			default: z.unknown().optional(),
			validation: FieldValidation.optional(),
			cardinality: z.enum(['atMostOne', 'one', 'noneOrMany', 'atLeastOne']).optional(),
		})
		.meta({ title: 'ValueField' })

	const TableFieldSchema = z
		.object({
			kind: z.literal('table'),
			fieldname: z.string().min(1),
			component: z.string().optional(),
			label: z.string().optional(),
			// Validates that each column has fieldname; allows all other ColumnSchema properties
			columns: z.array(z.object({ fieldname: z.string().min(1) }).passthrough()),
			config: TableViewConfig.optional(),
			mode: z.enum(['edit', 'read', 'display']).optional(),
		})
		.meta({ title: 'TableField' })

	// DoctypeFieldSchema must be declared before FieldsetFieldSchema so the z.lazy
	// callback can close over it. The placeholder is overwritten below; the callback
	// only runs at parse time, after the real discriminated union is assigned.
	// See: https://zod.dev/api?id=discriminated-unions#discriminated-unions
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- required by Zod's recursive schema pattern; z.never() placeholder is overwritten before any parse call
	let DoctypeFieldSchema: z.ZodType<DoctypeField> = z.never() as unknown as z.ZodType<DoctypeField>

	// FieldsetFieldSchema stays as a plain ZodObject (not z.ZodType<T>) so that
	// z.discriminatedUnion can inspect its 'kind' discriminant property.
	const FieldsetFieldSchema = z
		.object({
			kind: z.literal('fieldset'),
			fieldname: z.string().min(1),
			component: z.string().optional(),
			label: z.string().optional(),
			collapsible: z.boolean().optional(),
			mode: z.enum(['edit', 'read', 'display']).optional(),
			schema: z.lazy(() => DoctypeFieldSchema.array()),
		})
		.meta({ title: 'FieldsetField' })

	DoctypeFieldSchema = z.discriminatedUnion('kind', [ValueFieldSchema, FieldsetFieldSchema, TableFieldSchema])

	return { ValueFieldSchema, TableFieldSchema, FieldsetFieldSchema, DoctypeFieldSchema }
}

const schemas = createDoctypeFieldSchemas()

/**
 * Zod runtime validation schema for ValueField.
 * @public
 */
export const ValueFieldSchema = schemas.ValueFieldSchema

/**
 * Zod runtime validation schema for FieldsetField.
 * Recursive — FieldsetField.schema is validated against DoctypeFieldSchema.
 * @public
 */
export const FieldsetFieldSchema = schemas.FieldsetFieldSchema

/**
 * Zod runtime validation schema for TableField.
 * @public
 */
export const TableFieldSchema = schemas.TableFieldSchema

/**
 * Zod runtime validation schema for the DoctypeField discriminated union.
 * Validates all three field variants: `'field'`, `'fieldset'`, `'table'`.
 * @public
 */
export const DoctypeFieldSchema = schemas.DoctypeFieldSchema
