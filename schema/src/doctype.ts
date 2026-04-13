import { z } from 'zod'

import { FieldMeta } from './field'

/**
 * Cardinality for relationship links.
 * @public
 */
export const Cardinality = z.enum(['atMostOne', 'one', 'noneOrMany', 'atLeastOne']).meta({
	title: 'Cardinality',
	description: 'Cardinality for relationship links between doctypes',
})

/**
 * Cardinality type inferred from Zod schema
 * @public
 */
export type Cardinality = z.infer<typeof Cardinality>

/**
 * Serialized function type - a function serialized to a string.
 * Used for custom fetch handlers.
 * @public
 */
export type SerializedFunction = string

/**
 * Sync fetch strategy - data is fetched in the initial query.
 * @public
 */
export const SyncFetch = z
	.object({
		/** Fetch method type */
		method: z.literal('sync'),
		/** Optional limit on number of records to fetch */
		limit: z.number().int().positive().optional(),
	})
	.meta({
		title: 'SyncFetch',
		description: 'Sync fetch strategy - data is fetched in the initial query',
	})

/**
 * Sync fetch strategy type
 * @public
 */
export type SyncFetch = z.infer<typeof SyncFetch>

/**
 * Lazy fetch strategy - data is fetched on demand in a separate query.
 * @public
 */
export const LazyFetch = z
	.object({
		/** Fetch method type */
		method: z.literal('lazy'),
	})
	.meta({
		title: 'LazyFetch',
		description: 'Lazy fetch strategy - data is fetched on demand in a separate query',
	})

/**
 * Lazy fetch strategy type
 * @public
 */
export type LazyFetch = z.infer<typeof LazyFetch>

/**
 * Custom fetch strategy - uses a custom handler function.
 * @public
 */
export const CustomFetch = z
	.object({
		/** Fetch method type */
		method: z.literal('custom'),
		/** Serialized handler function to invoke */
		handler: z.string(),
	})
	.meta({
		title: 'CustomFetch',
		description: 'Custom fetch strategy - uses a custom handler function',
	})

/**
 * Custom fetch strategy type
 * @public
 */
export type CustomFetch = z.infer<typeof CustomFetch>

/**
 * Fetch strategy for link data loading.
 * - sync: fetched in the initial query
 * - lazy: fetched on demand in a separate query
 * - custom: uses a custom handler function
 * @public
 */
export const FetchStrategy = z.discriminatedUnion('method', [SyncFetch, LazyFetch, CustomFetch]).meta({
	title: 'FetchStrategy',
	description: 'Fetch strategy for link data loading',
})

/**
 * Fetch strategy type
 * @public
 */
export type FetchStrategy = z.infer<typeof FetchStrategy>

/**
 * Link declaration - describes a relationship from one doctype to another.
 * @public
 */
export const LinkDeclaration = z
	.object({
		/** Target doctype slug */
		target: z.string().min(1),

		/** Cardinality of the relationship */
		cardinality: Cardinality,

		/** Backlink fieldname on the target doctype that points back to this link */
		backlink: z.string().optional(),

		/** Override default rendering component (AForm for 1:1, ATable for 1:many) */
		component: z.string().optional(),

		/** Fieldname of the corresponding Link field in the fields array */
		fieldname: z.string().min(1).optional(),

		/** Fetch strategy for loading nested data */
		fetch: FetchStrategy.optional(),

		/** Whether to block workflow actions until nested data is loaded (default: true) */
		blockWorkflows: z.boolean().optional(),
	})
	.meta({
		title: 'LinkDeclaration',
		description: 'Declares a relationship from one doctype to another',
	})

/**
 * Link declaration type inferred from Zod schema
 * @public
 */
export type LinkDeclaration = z.infer<typeof LinkDeclaration>

/**
 * Action definition within a workflow
 * @public
 */
export const ActionDefinition = z
	.object({
		/** Display label for the action */
		label: z.string().min(1),

		/** Handler function name or path */
		handler: z.string().min(1),

		/** Fields that must have values before action can execute */
		requiredFields: z.array(z.string()).optional(),

		/** Workflow states where this action is available */
		allowedStates: z.array(z.string()).optional(),

		/** Whether to show a confirmation dialog */
		confirm: z.boolean().optional(),

		/** Additional arguments for the action */
		args: z.record(z.string(), z.unknown()).optional(),
	})
	.meta({
		title: 'ActionDefinition',
		description: 'Action definition within a workflow',
	})

/**
 * Action definition type inferred from Zod schema
 * @public
 */
export type ActionDefinition = z.infer<typeof ActionDefinition>

/**
 * Workflow metadata - states and actions for a doctype
 * @public
 */
export const WorkflowMeta = z
	.object({
		/** List of workflow states */
		states: z.array(z.string()).optional(),

		/** Actions available in this workflow */
		actions: z.record(z.string(), ActionDefinition).optional(),
	})
	.meta({
		title: 'WorkflowMeta',
		description: 'Workflow metadata - states and actions for a doctype',
	})

/**
 * Workflow metadata type inferred from Zod schema
 * @public
 */
export type WorkflowMeta = z.infer<typeof WorkflowMeta>

/**
 * Doctype metadata - complete definition of a doctype
 * @public
 */
export const DoctypeMeta = z
	.object({
		/** Display name of the doctype */
		name: z.string().min(1),

		/** URL-friendly slug (kebab-case) */
		slug: z.string().min(1).optional(),

		/** Database table name */
		tableName: z.string().optional(),

		/** Field definitions (including link fields with fieldtype: 'Link') */
		fields: z.array(FieldMeta),

		/** Relationship links to other doctypes */
		links: z.record(z.string(), LinkDeclaration).optional(),

		/** Workflow configuration */
		workflow: WorkflowMeta.optional(),

		/** Parent doctype for inheritance */
		inherits: z.string().optional(),
	})
	.meta({
		title: 'DoctypeMeta',
		description: 'Doctype metadata - complete definition of a doctype',
	})

/**
 * Doctype metadata type inferred from Zod schema
 * @public
 */
export type DoctypeMeta = z.infer<typeof DoctypeMeta>

/**
 * Context for identifying what doctype/record we're working with.
 * Used by graphql-middleware and graphql-client to resolve schema metadata.
 * @public
 */
export interface DoctypeContext {
	/** Doctype name (e.g., 'Task', 'Customer') */
	doctype: string
	/** Optional record ID for viewing/editing a specific record */
	recordId?: string
	/** Additional context properties */
	[key: string]: unknown
}

/**
 * Base interface for doctype metadata passed to DataClient methods.
 * Only requires properties needed for record fetching.
 * @public
 */
export interface DoctypeRef {
	/** Doctype name (e.g., 'Task', 'Customer') */
	name: string
	/** URL-friendly slug (e.g., 'task', 'customer') */
	slug?: string
}

/**
 * Options for fetching a single record
 * @public
 */
export interface GetRecordOptions {
	/**
	 * Include nested link sub-selections.
	 * - `true`: include all descendant links
	 * - `string[]`: include only named links
	 * - `false` / omitted: scalar fields only (default)
	 */
	includeNested?: boolean | string[]

	/**
	 * Maximum depth for recursive sub-selections.
	 * No default — unlimited when omitted.
	 */
	maxDepth?: number
}

/**
 * Options for fetching multiple records
 * @public
 */
export interface GetRecordsOptions {
	/** Filter expression (field-value pairs) */
	filters?: Record<string, unknown>
	/** Order by expression (e.g. 'NAME_ASC') */
	orderBy?: string
	/** Maximum number of records to return */
	limit?: number
	/** Number of records to skip */
	offset?: number
}

/**
 * Interface for data clients that fetch doctype metadata and records.
 * Implemented by \@stonecrop/graphql-client's StonecropClient.
 * Custom implementations can use any backend (REST, local storage, etc.).
 *
 * @typeParam T - Doctype reference type for record operations (defaults to DoctypeRef)
 * @typeParam M - Doctype metadata return type for getMeta (defaults to DoctypeMeta)
 * @public
 */
export interface DataClient<T extends DoctypeRef = DoctypeRef, M = DoctypeMeta> {
	/**
	 * Fetch doctype metadata
	 * @param context - Doctype context identifying the doctype
	 * @returns Doctype metadata or null if not found
	 */
	getMeta(context: DoctypeContext): Promise<M | null>

	/**
	 * Fetch a single record by ID
	 *
	 * When `includeNested` is set, builds a query with sub-selections for descendant
	 * links and returns ancestor + merged descendants. When omitted, returns flat scalar data.
	 *
	 * @param doctype - Doctype reference (name and optional slug)
	 * @param recordId - Record ID to fetch
	 * @param options - Query options
	 * @returns Record data or null if not found
	 */
	getRecord(doctype: T, recordId: string, options?: GetRecordOptions): Promise<Record<string, unknown> | null>

	/**
	 * Fetch multiple records
	 * @param doctype - Doctype reference (name and optional slug)
	 * @param options - Query options
	 * @returns Array of record data
	 */
	getRecords(doctype: T, options?: GetRecordsOptions): Promise<Record<string, unknown>[]>

	/**
	 * Execute a doctype action (e.g., SUBMIT, APPROVE, save).
	 * All state changes flow through this single mutation endpoint.
	 *
	 * @param doctype - Doctype reference (name and optional slug)
	 * @param action - Action name to execute (e.g., 'SUBMIT', 'APPROVE', 'save')
	 * @param args - Action arguments (typically record ID and/or form data)
	 * @returns Action result with success status, response data, and any error
	 */
	runAction(
		doctype: T,
		action: string,
		args?: unknown[]
	): Promise<{ success: boolean; data: unknown; error: string | null }>
}
