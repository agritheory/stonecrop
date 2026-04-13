/**
 * Map fieldtype to component name for AForm
 */
const fieldtypeToComponent: Record<string, string> = {
	Data: 'ATextInput',
	Text: 'ATextInput',
	Check: 'ACheckbox',
	Int: 'ANumericInput',
	Float: 'ANumericInput',
	Date: 'ADate',
	Datetime: 'ADate',
	Select: 'ADropdown',
	Link: 'AComboBox',
	JSON: 'ATextInput', // Default to text input for JSON
	// Add more mappings as needed
}

/**
 * Hydrate a schema with component properties based on fieldtype
 */
export function hydrateSchema(schema: any[]): any[] {
	return schema.map(field => {
		const component = field.component || fieldtypeToComponent[field.fieldtype] || 'ATextInput'
		const hydratedField: any = {
			...field,
			component,
		}

		// Handle resolved 1:many link entries (have cardinality + columns/rows)
		if (field.cardinality === 'noneOrMany' || field.cardinality === 'atLeastOne') {
			if (field.columns && Array.isArray(field.columns)) {
				hydratedField.columns = field.columns
			}
			hydratedField.component = 'ATable'
			hydratedField.rows = []
		}

		// Handle resolved 1:1 link entries (have schema + options)
		if (field.schema && Array.isArray(field.schema) && field.options) {
			hydratedField.schema = field.schema
		}

		return hydratedField
	})
}
