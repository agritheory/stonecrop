import type { TableColumn, TableConfig, TableRow } from '@stonecrop/atable'
import type { ColumnSchema } from '@stonecrop/schema'

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

	/**
	 * Hide the field from the form UI while keeping it in the data model.
	 * Consumed by AForm — not passed down to field components.
	 * @public
	 */
	hidden?: boolean
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
	align?: CanvasTextAlign

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
	 * CSS width for the field's flex item in the AForm grid.
	 * Applied as `flex-basis` and `width` on the rendered component element.
	 * Use `"100%"` to make the field span the full form row.
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
 * Schema structure for defining tables inside AForm.
 *
 * Two mutually exclusive forms:
 * - **Columns-based** (no `kind`): caller provides `columns` directly
 * - **Schema-delegated** (`kind: 'table'`): caller provides `schema`; ATable runs
 *   `schemaToColumns` to derive columns at render time
 *
 * @public
 */
export type TableSchema = BaseSchema & {
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
} & (
		| {
				/** Explicit column definitions; `schema` and `kind` must not be set */
				columns?: TableColumn[]
				kind?: never
				schema?: never
		  }
		| {
				/** Marks this entry as schema-delegated; ATable derives columns from `schema` */
				kind: 'table'
				/** Child schema passed to ATable's `schema` prop */
				schema: ColumnSchema[]
				columns?: never
		  }
	)

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
	schema?: SchemaTypes[]

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

/**
 * The value shape for AFormLink — a linked document reference with optional display text
 * @public
 */
export interface AFormLinkValue {
	/** The FK/linked document ID. `id: 0` is a valid ID. */
	id: string | number
	/** Display text shown in the input. Falls back to `String(id)` if omitted. */
	displayText?: string
	[extra: string]: any
}

/**
 * Navigation contract for AFormLink. Provide via `provide('aformLinkNavigator', ...)` in the app plugin.
 * @public
 */
export interface AFormLinkNavigator {
	/** Navigate to the linked document. Implementation is app-defined. */
	navigate(doctype: string, id: string | number): void
}
