import type { TableColumn, TableConfig, TableRow } from '@stonecrop/atable'

/**
 * The rendering mode for AForm components
 * @public
 */
export type FormMode = 'edit' | 'read' | 'display'

/**
 * Defined props for AForm components
 * @public
 */
export type ComponentProps = {
	/**
	 * The schema object to pass to the component
	 * @public
	 */
	schema?: SchemaTypes

	/**
	 * The label to display in the component
	 * @public
	 */
	label?: string

	/**
	 * The mask to apply to inputs inside the component. Accepts either a plain
	 * mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that
	 * receives `locale` and returns a mask string
	 * (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`).
	 * @public
	 */
	mask?: string

	/**
	 * Indicate whether input is required for text and/or select elements inside the component
	 * @public
	 */
	required?: boolean

	/**
	 * The rendering mode for the component
	 * @public
	 */
	mode?: FormMode

	/**
	 * Set a unique identifier for elements inside the component
	 * @public
	 */
	uuid?: string

	/**
	 * Validation options for elements inside the component
	 * @public
	 */
	validation?: {
		/**
		 * The error message to display when validation fails
		 * @public
		 */
		errorMessage: string

		[key: string]: any
	}
}

/**
 * Basic field structure for AForm schemas
 * @public
 */
export type BaseSchema = {
	/**
	 * The fieldname for the schema field
	 * @public
	 */
	fieldname: string

	/**
	 * The component to render
	 *
	 * @remarks
	 * This must be a string that represents the component to render. The registration of the component
	 * should be done in the main application.
	 *
	 * @public
	 */
	component?: string

	/**
	 * Per-field rendering mode override; takes precedence over the AForm-level `mode` prop
	 * @public
	 */
	mode?: FormMode
}

/**
 * Schema structure for defining forms inside AForm
 * @public
 */
export type FormSchema = BaseSchema & {
	/**
	 * Align the field in the form
	 * @beta
	 */
	align?: string

	/**
	 * Indicate whether the field is editable
	 * @beta
	 */
	edit?: boolean

	/**
	 * The field type for the schema field
	 * @public
	 */
	fieldtype?: string

	/**
	 * The label to display in the form
	 * @public
	 */
	label?: string

	/**
	 * The unique identifier for the field
	 * @beta
	 */
	name?: string

	/**
	 * The width of the field element.
	 * @beta
	 */
	width?: string

	/**
	 * The mask to apply to the field. Accepts either a plain mask string
	 * (e.g. `"##/##/####"`) or a stringified arrow function that receives `locale`
	 * and returns a mask string
	 * (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`).
	 * @public
	 */
	mask?: string
}

/**
 * Schema structure for defining tables inside AForm
 * @public
 */
export type TableSchema = BaseSchema & {
	/**
	 * The columns to display in the table
	 * @public
	 */
	columns?: TableColumn[]

	/**
	 * The configuration for the table
	 * @public
	 */
	config?: TableConfig

	/**
	 * The rows to display in the table
	 * @public
	 */
	rows?: TableRow[]
}

/**
 * Schema structure for defining fieldsets inside AForm
 * @public
 */
export type FieldsetSchema = BaseSchema & {
	/**
	 * The label to display in the fieldset
	 * @public
	 */
	label?: string

	/**
	 * The schemas to be rendered inside the fieldset
	 * @public
	 */
	schema?: (FormSchema | TableSchema)[]

	/**
	 * Indicate whether the fieldset is collapsible
	 * @public
	 */
	collapsible?: boolean
}

/**
 * Schema structure for a 1:1 nested doctype field inside AForm
 *
 * @remarks
 * When a field has `fieldtype: 'Doctype'` without `cardinality: 'many'`, it represents
 * a 1:1 nested form. The `options` property contains the slug of the referenced doctype.
 * The `schema` property is populated by the framework's `registry.resolveSchema()` method
 * with the resolved child schema fields.
 *
 * Before resolution: `{ fieldname: 'address', fieldtype: 'Doctype', options: 'address' }`
 * After resolution: `{ fieldname: 'address', fieldtype: 'Doctype', options: 'address', schema: [...resolved fields...] }`
 *
 * Users can also manually provide the `schema` property without using the framework registry.
 *
 * @public
 */
export type DoctypeOneSchema = BaseSchema & {
	/**
	 * The field type - must be 'Doctype' for nested doctype fields
	 * @public
	 */
	fieldtype: 'Doctype'

	/**
	 * The slug of the referenced doctype in the registry
	 * @public
	 */
	options: string

	/**
	 * The label to display above the nested form section
	 * @public
	 */
	label?: string

	/**
	 * The cardinality of the relationship — `'one'` or omitted means 1:1 nested form
	 * @public
	 */
	cardinality?: 'one'

	/**
	 * The resolved child schema fields, populated by `registry.resolveSchema()`
	 * or provided manually for standalone usage
	 * @public
	 */
	schema?: SchemaTypes[]
}

/**
 * Schema structure for a 1:many child table field inside AForm
 *
 * @remarks
 * When a field has `fieldtype: 'Doctype'` with `cardinality: 'many'`, it represents
 * a 1:many child table. The `options` property contains the slug of the child doctype
 * whose records appear as table rows.
 *
 * `Registry.resolveSchema()` auto-derives `columns` from the child doctype's schema
 * fields and sets sensible defaults for `component` (`'ATable'`) and `config` (`{ view: 'list' }`).
 *
 * Users can override any auto-derived property by specifying it explicitly on the schema field.
 * Row data comes from the parent form's data model at `data[fieldname]` (an array).
 *
 * @public
 */
export type DoctypeManySchema = BaseSchema & {
	/**
	 * The field type - must be 'Doctype' for nested doctype fields
	 * @public
	 */
	fieldtype: 'Doctype'

	/**
	 * The slug of the child doctype in the registry
	 * @public
	 */
	options: string

	/**
	 * The label to display above the table section
	 * @public
	 */
	label?: string

	/**
	 * The cardinality of the relationship — `'many'` means 1:many child table
	 * @public
	 */
	cardinality: 'many'

	/**
	 * Table columns — auto-derived from child doctype schema if not provided
	 * @public
	 */
	columns?: TableColumn[]

	/**
	 * Table configuration — defaults to `{ view: 'list' }` if not provided
	 * @public
	 */
	config?: TableConfig

	/**
	 * Table rows — populated from the parent form's data model at `data[fieldname]`
	 * @public
	 */
	rows?: TableRow[]

	/**
	 * The component to render — defaults to `'ATable'` when resolved
	 * @public
	 */
	component?: string
}

/**
 * Discriminated union for Doctype fields — either 1:1 nested form or 1:many child table
 *
 * @remarks
 * Use `isDoctypeMany()` type guard to narrow to `DoctypeManySchema`.
 * When `cardinality` is `'many'` or omitted, the field is a 1:1 nested form.
 *
 * @public
 */
export type DoctypeSchema = DoctypeOneSchema | DoctypeManySchema

/**
 * Superset of all schema types for AForm
 * @public
 */
export type SchemaTypes = FormSchema | TableSchema | FieldsetSchema | DoctypeSchema
