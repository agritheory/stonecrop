import { z } from 'zod'

import { FieldMeta } from './field'

/**
 * Action definition within a workflow
 * @public
 */
export const ActionDefinition = z.object({
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

/**
 * Action definition type inferred from Zod schema
 * @public
 */
export type ActionDefinition = z.infer<typeof ActionDefinition>

/**
 * Workflow metadata - states and actions for a doctype
 * @public
 */
export const WorkflowMeta = z.object({
	/** List of workflow states */
	states: z.array(z.string()).optional(),

	/** Actions available in this workflow */
	actions: z.record(z.string(), ActionDefinition).optional(),
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
export const DoctypeMeta = z.object({
	/** Display name of the doctype */
	name: z.string().min(1),

	/** URL-friendly slug (kebab-case) */
	slug: z.string().min(1).optional(),

	/** Database table name */
	tableName: z.string().optional(),

	/** Field definitions */
	fields: z.array(FieldMeta),

	/** Workflow configuration */
	workflow: WorkflowMeta.optional(),

	/** Parent doctype for inheritance */
	inherits: z.string().optional(),

	/** Doctype to use for list views */
	listDoctype: z.string().optional(),

	/** Parent doctype for child tables */
	parentDoctype: z.string().optional(),
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
	 * @param doctype - Doctype reference (name and optional slug)
	 * @param recordId - Record ID to fetch
	 * @returns Record data or null if not found
	 */
	getRecord(doctype: T, recordId: string): Promise<Record<string, unknown> | null>

	/**
	 * Fetch multiple records
	 * @param doctype - Doctype reference (name and optional slug)
	 * @param options - Optional filters, pagination, sorting
	 * @returns Array of record data
	 */
	getRecords(
		doctype: T,
		options?: {
			filters?: Record<string, unknown>
			orderBy?: string
			limit?: number
			offset?: number
		}
	): Promise<Record<string, unknown>[]>

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
