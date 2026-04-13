import { z } from 'zod'

/**
 * Stonecrop field types - the semantic type of the field.
 * These are consistent across forms and tables.
 * @public
 */
export const StonecropFieldType = z
	.enum([
		'Data', // Short text, varchar
		'Text', // Long text
		'Int', // Integer
		'Float', // Floating point (IEEE 754)
		'Decimal', // Arbitrary precision decimal
		'Check', // Boolean/checkbox
		'Date', // Date only
		'Time', // Time only
		'Datetime', // Date and time
		'Duration', // Time interval
		'DateRange', // Date range
		'JSON', // JSON data
		'Code', // Code/source (with syntax highlighting)
		'Link', // Reference to another doctype
		'Attach', // File attachment
		'Currency', // Currency value
		'Quantity', // Quantity with unit
		'Select', // Dropdown selection
	])
	.meta({
		title: 'StonecropFieldType',
		description: 'Semantic field types for Stonecrop doctypes, consistent across forms and tables',
	})

/**
 * Stonecrop field type enum inferred from Zod schema
 * @public
 */
export type StonecropFieldType = z.infer<typeof StonecropFieldType>

/**
 * Field template for TYPE_MAP entries.
 * Defines the default component and semantic field type for a field.
 * @public
 */
export interface FieldTemplate {
	/**
	 * The Vue component name to render this field (e.g., 'ATextInput', 'ADropdown')
	 */
	component: string
	/**
	 * The semantic field type (e.g., 'Data', 'Int', 'Select')
	 */
	fieldtype: StonecropFieldType
}

/**
 * Mapping from StonecropFieldType to default Vue component.
 * Components can be overridden in the field definition.
 * @public
 */
export const TYPE_MAP: Record<StonecropFieldType, FieldTemplate> = {
	// Text
	Data: { component: 'ATextInput', fieldtype: 'Data' },
	Text: { component: 'ATextInput', fieldtype: 'Text' },

	// Numeric
	Int: { component: 'ANumericInput', fieldtype: 'Int' },
	Float: { component: 'ANumericInput', fieldtype: 'Float' },
	Decimal: { component: 'ADecimalInput', fieldtype: 'Decimal' },

	// Boolean
	Check: { component: 'ACheckbox', fieldtype: 'Check' },

	// Date/Time
	Date: { component: 'ADate', fieldtype: 'Date' },
	Time: { component: 'ATimeInput', fieldtype: 'Time' },
	Datetime: { component: 'ADatetimePicker', fieldtype: 'Datetime' },
	Duration: { component: 'ADurationInput', fieldtype: 'Duration' },
	DateRange: { component: 'ADateRangePicker', fieldtype: 'DateRange' },

	// Structured
	JSON: { component: 'ACodeEditor', fieldtype: 'JSON' },
	Code: { component: 'ACodeEditor', fieldtype: 'Code' },

	// Relational
	Link: { component: 'ALink', fieldtype: 'Link' },

	// Files
	Attach: { component: 'AFileAttach', fieldtype: 'Attach' },

	// Specialized
	Currency: { component: 'ACurrencyInput', fieldtype: 'Currency' },
	Quantity: { component: 'AQuantityInput', fieldtype: 'Quantity' },
	Select: { component: 'ADropdown', fieldtype: 'Select' },
}

/**
 * Get the default component for a field type
 * @param fieldtype - The semantic field type
 * @returns The default component name
 * @public
 */
export function getDefaultComponent(fieldtype: StonecropFieldType): string {
	return TYPE_MAP[fieldtype]?.component ?? 'ATextInput'
}
