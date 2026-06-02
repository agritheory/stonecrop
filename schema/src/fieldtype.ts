import { z } from 'zod'

/**
 * The complete list of field types built into Stonecrop.
 * User apps can use any string as a fieldtype; this const is the exhaustive set of types
 * that Stonecrop provides default components for.
 * @public
 */
export const BUILTIN_FIELD_TYPES = [
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
	'PrimaryKey', // Primary key field — used by the middleware to identify the record's PK column
] as const

/**
 * Union of all builtin fieldtype string literals.
 * @public
 */
export type BuiltinFieldType = (typeof BUILTIN_FIELD_TYPES)[number]

/**
 * Stonecrop field type — any non-empty string is valid; Stonecrop provides default components
 * for the builtin types listed in {@link BUILTIN_FIELD_TYPES}. Custom fieldtypes are supported
 * by supplying an explicit `component` on the field definition.
 * @public
 */
export const StonecropFieldType = z.string().min(1).meta({
	title: 'StonecropFieldType',
	description: 'Semantic field types for Stonecrop doctypes, consistent across forms and tables',
})

/**
 * Returns `true` when `fieldtype` is one of the builtin types Stonecrop ships with.
 * @public
 */
export function isBuiltinFieldType(fieldtype: string): fieldtype is BuiltinFieldType {
	return (BUILTIN_FIELD_TYPES as readonly string[]).includes(fieldtype)
}

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
	fieldtype: BuiltinFieldType
}

/**
 * Mapping from builtin fieldtypes to their default Vue component.
 * Components can be overridden in the field definition.
 * @public
 */
export const TYPE_MAP: Record<BuiltinFieldType, FieldTemplate> = {
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

	// Identity — PK fields are typically hidden; no interactive component is needed
	PrimaryKey: { component: 'ATextInput', fieldtype: 'PrimaryKey' },
}

/**
 * Get the default component for a builtin field type.
 * For an open-string fieldtype that may be custom, use {@link resolveComponent} instead.
 * @param fieldtype - A builtin field type
 * @returns The default component name
 * @public
 */
export function getDefaultComponent(fieldtype: BuiltinFieldType): string {
	return TYPE_MAP[fieldtype]?.component ?? 'ATextInput'
}

/**
 * Resolve the component name for any fieldtype string, falling back to `'ATextInput'`
 * for unknown custom types.
 * @param fieldtype - Any fieldtype string (builtin or custom)
 * @returns The component name to use for rendering
 * @public
 */
export function resolveComponent(fieldtype: string): string {
	return isBuiltinFieldType(fieldtype) ? getDefaultComponent(fieldtype) : 'ATextInput'
}
