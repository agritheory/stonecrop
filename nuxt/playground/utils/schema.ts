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
	Doctype: 'AForm', // Doctype renders as nested form (1:1) or table (1:many) based on cardinality
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

		// Special handling for Doctype fieldtype
		if (field.fieldtype === 'Doctype') {
			// For cardinality: 'many', derive columns and use ATable
			if (field.cardinality === 'noneOrMany' || cardinality === 'atLeastOne') {
				// Use columns if provided in the schema
				if (field.columns && Array.isArray(field.columns)) {
					hydratedField.columns = field.columns
				}
				hydratedField.component = 'ATable'
				// Will be populated from data via AForm's componentProps
				hydratedField.rows = []
			}
			// For cardinality: 'one' (default), embed schema for nested AForm
			if (field.schema && Array.isArray(field.schema)) {
				hydratedField.schema = field.schema
			}
		}

		return hydratedField
	})
}
