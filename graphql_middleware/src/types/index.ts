// =============================================================================
// Runtime Context Types (unique to graphql_middleware)
// =============================================================================

import type { DoctypeMeta } from '@stonecrop/schema'

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

// Query builder types
export type {
	ReverseConnectionParams,
	BuildRecordQueryOptions,
	BuildRecordQueryParams,
	BuildNestedSelectionsParams,
	BuildListQueryArgs,
	BuildListQueryParams,
	MergeNestedResultsParams,
	ExtractSingleResultParams,
	ExtractListResultParams,
} from './query'
