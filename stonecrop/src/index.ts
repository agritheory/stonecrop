export type { BaseSchema, FieldsetSchema, FormSchema, SchemaTypes, TableSchema } from '@stonecrop/aform'
export type {
	CellContext,
	ConnectionEvent,
	ConnectionHandle,
	ConnectionPath,
	GanttBarInfo,
	GanttDragEvent,
	GanttOptions,
	TableColumn,
	TableConfig,
	TableRow,
} from '@stonecrop/atable'

import { type StonecropReturn, useStonecrop } from './composable'
import DoctypeMeta from './doctype'
import plugin from './plugins'
import Registry from './registry'
import { Stonecrop } from './stonecrop'
import { HST, createHST, type HSTNode } from './stores/hst'

export type { ImmutableDoctype, MutableDoctype, Schema, InstallOptions } from './types'

export {
	DoctypeMeta,
	Registry,
	Stonecrop,
	StonecropReturn,
	useStonecrop,
	// HST exports for advanced usage
	HST,
	createHST,
	HSTNode,
}

// Default export is the Vue plugin
export default plugin
