import type { TableColumn, TableConfig, TableRow } from '@stonecrop/atable'

/**
 * Defined props for AForm components
 * @public
 */
export type ComponentProps = {
	label?: string
	mask?: string
	required?: boolean
	readonly?: boolean
	uuid?: string
	validation?: Record<string, any>
}

/**
 * Base schemda for AForm components
 * @beta
 */
export type BasicSchema = {
	component: string
	fieldname: string
	value: any
}

/**
 * Form schema
 * @beta
 */
export type FormSchema = BasicSchema & {
	align: string
	edit: boolean
	fieldtype: string
	label: string
	name: string
	width: string
	mask?: string
}

/**
 * Table schema
 * @beta
 */
export type TableSchema = BasicSchema & {
	columns: TableColumn[]
	config: TableConfig
	rows: TableRow[]
}

/**
 * Fieldset schema
 * @beta
 */
export type FieldsetSchema = BasicSchema & {
	label: string
	schema: (FormSchema | TableSchema)[]
	collapsible?: boolean
}

/**
 * Superset of schema types
 * @public
 */
export type SchemaTypes = FormSchema | TableSchema | FieldsetSchema
