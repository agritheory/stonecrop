// Re-export all schema types from @stonecrop/schema for backward compatibility
export {
	StonecropFieldType,
	FieldOptions,
	FieldMeta,
	ActionDefinition,
	WorkflowMeta,
	DoctypeMeta,
	validateDoctype,
	validateField,
	parseDoctype,
	parseField,
} from '@stonecrop/schema'

export type {
	ValidationResult,
	ValidationError,
	ConversionFieldMeta,
	ParsedColumn,
	ParsedTable,
	ConversionOptions,
	PostgresType,
} from '@stonecrop/schema'

// =============================================================================
// Runtime Context Types (unique to graphql_middleware)
// =============================================================================

import type { DoctypeMeta } from '@stonecrop/schema'

/**
 * Route context for identifying what doctype/record we're working with
 * @public
 */
export interface RouteContext {
	/** Doctype name (e.g., 'Task', 'Customer') */
	doctype: string
	/** Optional record ID for viewing/editing a specific record */
	recordId?: string
	/** Additional context properties */
	[key: string]: unknown
}

/**
 * GraphQL executor interface for running queries/mutations
 * @public
 */
export interface GraphQLExecutor {
	/** Execute a GraphQL query */
	query<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T>
	/** Execute a GraphQL mutation */
	mutate<T = unknown>(mutation: string, variables?: Record<string, unknown>): Promise<T>
}

/**
 * Context passed to action handlers
 * @public
 */
export interface ActionContext {
	/** Doctype metadata for the action being executed */
	doctype: DoctypeMeta
	/** GraphQL executor for running queries/mutations within the action */
	executor: GraphQLExecutor
	/** Additional context properties */
	[key: string]: unknown
}

/**
 * Action handler function signature
 * @public
 */
export type ActionHandler = (args: unknown[], context: ActionContext) => Promise<unknown>
