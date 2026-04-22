// =============================================================================
// Query Builder Types
// =============================================================================

import type { DoctypeMeta, LinkDeclaration } from '@stonecrop/schema'

/**
 * Parameters for reverse connection name inflection
 * @public
 */
export interface ReverseConnectionParams {
	/** Parent doctype slug */
	doctype: string
	/** Link key on the parent */
	linkName: string
	/** Link field on the target that points back to the parent (optional) */
	backlink?: string
	/** Target doctype slug */
	target: string
}

/**
 * Options for buildRecordQuery nested selection building
 * @public
 */
export interface BuildRecordQueryOptions {
	/** Include nested/related records */
	includeNested?: boolean | string[]
	/** Maximum nesting depth */
	maxDepth?: number
}

/**
 * Parameters for buildRecordQuery
 * @public
 */
export interface BuildRecordQueryParams {
	/** Doctype metadata */
	meta: DoctypeMeta
	/** Function to derive the record field name from a table name */
	recordFieldName: (tableName: string) => string
	/** Function to derive the record argument name from a table name */
	recordArgName: (tableName: string) => string
	/** Function to derive the record argument type from a table name */
	recordArgType: (tableName: string) => string
	/** Lookup function to get doctype metadata by slug */
	getMeta: (slug: string) => DoctypeMeta | undefined
	/** Options for nested query building */
	options?: BuildRecordQueryOptions
	/** Function to derive reverse connection field names */
	reverseConnectionNameFn?: (params: ReverseConnectionParams) => string
}

/**
 * Parameters for buildNestedSelections
 * @public
 */
export interface BuildNestedSelectionsParams {
	/** Link declarations from the parent doctype */
	links: Record<string, LinkDeclaration>
	/** Parent doctype metadata */
	meta: DoctypeMeta
	/** Set of link names to include, or null for all */
	includeSet: Set<string> | null
	/** Lookup function to get doctype metadata by slug */
	getMeta: (slug: string) => DoctypeMeta | undefined
	/** Set of already-seen doctype slugs to prevent circular references */
	seen: Set<string>
	/** Current recursion depth */
	depth: number
	/** Maximum recursion depth */
	maxDepth?: number
	/** Function to derive reverse connection field names */
	reverseConnectionNameFn?: (params: ReverseConnectionParams) => string
}

/**
 * Arguments for buildListQuery
 * @public
 */
export interface BuildListQueryArgs {
	/** Maximum number of records to return */
	limit?: number
	/** Number of records to skip */
	offset?: number
	/** OrderBy specification */
	orderBy?: string
	/** Query options (e.g., includeNested) */
	options?: Record<string, unknown>
}

/**
 * Parameters for buildListQuery
 * @public
 */
export interface BuildListQueryParams {
	/** Doctype metadata */
	meta: DoctypeMeta
	/** Query arguments */
	args: BuildListQueryArgs
	/** Function to derive the connection field name from a table name */
	connectionFieldName: (tableName: string) => string
	/** Function to derive the OrderBy type name from a table name */
	orderByTypeName: (tableName: string) => string
}

/**
 * Parameters for mergeNestedResults
 * @public
 */
export interface MergeNestedResultsParams {
	/** The record object with nested connection data */
	record: Record<string, unknown>
	/** Doctype metadata */
	meta: DoctypeMeta
	/** Lookup function to get doctype metadata by slug */
	getMeta: (slug: string) => DoctypeMeta | undefined
	/** Function to derive the reverse connection field name from link params */
	reverseConnectionNameFn?: (params: ReverseConnectionParams) => string
}

/**
 * Parameters for extractSingleResult
 * @public
 */
export interface ExtractSingleResultParams {
	/** The raw query result */
	result: unknown
	/** Doctype metadata */
	meta: DoctypeMeta
	/** Function to derive the record field name from a table name */
	recordFieldName: (tableName: string) => string
}

/**
 * Parameters for extractListResult
 * @public
 */
export interface ExtractListResultParams {
	/** The raw query result */
	result: unknown
	/** Doctype metadata */
	meta: DoctypeMeta
	/** Function to derive the connection field name from a table name */
	connectionFieldName: (tableName: string) => string
}
