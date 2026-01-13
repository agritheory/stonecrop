import { z } from 'zod'

import { StonecropFieldType } from './fieldtype'

/**
 * Field options - flexible bag for type-specific configuration.
 *
 * Usage by fieldtype:
 * - Link/Doctype: target doctype slug as string ("customer", "sales-order-item")
 * - Select: array of choices (["Draft", "Submitted", "Cancelled"])
 * - Decimal: config object ({ precision: 10, scale: 2 })
 * - Code: config object ({ language: "python" })
 *
 * @public
 */
export const FieldOptions = z.union([
	z.string(), // Link/Doctype target: "customer"
	z.array(z.string()), // Select choices: ["A", "B", "C"]
	z.record(z.string(), z.unknown()), // Config: { precision: 10, scale: 2 }
])

export type FieldOptions = z.infer<typeof FieldOptions>

/**
 * Validation configuration for form fields
 * @public
 */
export const FieldValidation = z
	.object({
		/** Error message to display when validation fails */
		errorMessage: z.string(),
	})
	.passthrough()

export type FieldValidation = z.infer<typeof FieldValidation>

/**
 * Unified field metadata - the single source of truth for field definitions.
 * Works for both forms (AForm) and tables (ATable).
 *
 * Core principle: "Text" is "Text" regardless of rendering context.
 *
 * @public
 */
export const FieldMeta = z.object({
	// === CORE (required) ===

	/** Unique identifier for the field within its doctype */
	fieldname: z.string().min(1),

	/** Semantic field type - determines behavior and default component */
	fieldtype: StonecropFieldType,

	// === COMPONENT (optional - derived from fieldtype when not specified) ===

	/** Vue component to render this field. If not specified, derived from TYPE_MAP */
	component: z.string().optional(),

	// === DISPLAY ===

	/** Human-readable label for the field */
	label: z.string().optional(),

	/** Width of the field (CSS value, e.g., "40ch", "200px") */
	width: z.string().optional(),

	/** Text alignment within the field */
	align: z.enum(['left', 'center', 'right', 'start', 'end']).optional(),

	// === BEHAVIOR ===

	/** Whether the field is required */
	required: z.boolean().optional(),

	/** Whether the field is read-only */
	readOnly: z.boolean().optional(),

	/** Whether the field is editable (for table cells) */
	edit: z.boolean().optional(),

	/** Whether the field is hidden from the UI */
	hidden: z.boolean().optional(),

	// === VALUE ===

	/** Current value of the field */
	value: z.unknown().optional(),

	/** Default value for new records */
	default: z.unknown().optional(),

	// === TYPE-SPECIFIC ===

	/**
	 * Type-specific options:
	 * - Link: target doctype slug ("customer")
	 * - Doctype: child doctype slug ("sales-order-item")
	 * - Select: choices array (["Draft", "Submitted"])
	 * - Decimal: { precision, scale }
	 * - Code: { language }
	 */
	options: FieldOptions.optional(),

	/** Input mask pattern (e.g., "##/##/####" for dates) */
	mask: z.string().optional(),

	// === VALIDATION ===

	/** Validation configuration */
	validation: FieldValidation.optional(),
})

export type FieldMeta = z.infer<typeof FieldMeta>
