// TODO: (typing) figure out a way to import other monorepo package types
import { TableColumn, TableConfig, TableRow } from '@agritheory/atable/types'

export type BasicSchema = {
	component: string
}

export type FormSchema = BasicSchema & {
	fieldname: string
	fieldtype: string
	label: string
	mask?: string
}

export type TableSchema = BasicSchema & {
	columns: TableColumn[]
	config: TableConfig
	rows: TableRow[]
}

export type FieldsetSchema = BasicSchema & {
	label: string
	schema: (FormSchema | TableSchema)[]
	collapsible?: boolean
}

export type SchemaTypes = FormSchema | TableSchema | FieldsetSchema
