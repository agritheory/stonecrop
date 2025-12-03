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
	Table: 'ATable',
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

		// Special handling for Table fieldtype
		if (field.fieldtype === 'Table' && field.options && Array.isArray(field.options)) {
			// Hydrate nested schema for table columns
			hydratedField.columns = field.options.map((col: any) => ({
				name: col.fieldname,
				label: col.label,
				fieldtype: col.fieldtype || 'Data',
			}))
			// Initialize empty rows array
			hydratedField.rows = []
		}

		return hydratedField
	})
}
