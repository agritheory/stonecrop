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
	doctype: string
	recordId?: string
	[key: string]: unknown
}

/**
 * GraphQL executor interface for running queries/mutations
 * @public
 */
export interface GraphQLExecutor {
	query<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T>
	mutate<T = unknown>(mutation: string, variables?: Record<string, unknown>): Promise<T>
}

/**
 * Context passed to action handlers
 * @public
 */
export interface ActionContext {
	doctype: DoctypeMeta
	executor: GraphQLExecutor
	[key: string]: unknown
}

/**
 * Action handler function signature
 * @public
 */
export type ActionHandler = (args: unknown[], context: ActionContext) => Promise<unknown>
