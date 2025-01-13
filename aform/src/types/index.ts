import type { TableColumn, TableConfig, TableRow } from '@stonecrop/atable'

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
	 * The masking string to apply to inputs inside the component
	 * @public
	 */
	mask?: string

	/**
	 * Indicate whether input is required for text and/or select elements inside the component
	 * @public
	 */
	required?: boolean

	/**
	 * Indicate whether elements inside the component are read-only
	 * @public
	 */
	readonly?: boolean

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
	 * A placeholder value for the field
	 * @beta
	 */
	value?: any
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
	 *
	 * @remarks
	 * This must be a string that represents the field type. A mask string will be automatically
	 * applied for the following field types:
	 * - Date ('##/##/####')
	 * - Datetime ('####/##/## ##:##')
	 * - Time ('##:##')
	 * - Fulltime ('##:##:##')
	 * - Phone ('(###) ### - ####')
	 * - Card ('#### #### #### ####')
	 *
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
	 * The mask string for the field
	 * @beta
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
 * Superset of all schema types for AForm
 * @public
 */
export type SchemaTypes = FormSchema | TableSchema | FieldsetSchema
