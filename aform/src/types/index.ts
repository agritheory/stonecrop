import ATable from '@stonecrop/atable'

export type BasicSchema = {
	component: string
	fieldname: string
	value: any
}

export type FormSchema = BasicSchema & {
	align: string
	edit: boolean
	fieldtype: string
	label: string
	name: string
	width: string
	mask?: string
}

export type TableSchema = BasicSchema & {
	columns: ATable.TableColumn[]
	config: ATable.TableConfig
	rows: ATable.TableRow[]
}

export type FieldsetSchema = BasicSchema & {
	label: string
	schema: (FormSchema | TableSchema)[]
	collapsible?: boolean
}

export type SchemaTypes = FormSchema | TableSchema | FieldsetSchema
