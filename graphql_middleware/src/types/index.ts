export interface FieldMeta {
	fieldname: string
	fieldtype: string
	label?: string
	required?: boolean
	options?: Record<string, unknown>
}

export interface ActionDefinition {
	label: string
	handler: string // Name of registered handler
	requiredFields?: string[]
	allowedStates?: string[]
	confirm?: boolean
	args?: Record<string, unknown>
}

export interface WorkflowMeta {
	states?: string[]
	actions?: Record<string, ActionDefinition>
}

export interface DoctypeMeta {
	name: string
	tableName?: string // Null for virtual/computed doctypes
	fields: FieldMeta[]
	workflow?: WorkflowMeta
	listDoctype?: string // For detail views, reference to list doctype
	parentDoctype?: string // For child tables
}

export interface RouteContext {
	doctype: string
	recordId?: string
	[key: string]: unknown
}

export interface ActionContext {
	doctype: DoctypeMeta
	executor: GraphQLExecutor
	[key: string]: unknown
}

export type ActionHandler = (args: unknown[], context: ActionContext) => Promise<unknown>

export interface GraphQLExecutor {
	query<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T>
	mutate<T = unknown>(mutation: string, variables?: Record<string, unknown>): Promise<T>
}
