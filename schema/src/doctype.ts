import { z } from 'zod'

import { DoctypeFieldSchema, flattenFields, getDisplayField } from './field'

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

		/** Fields that must have values before action can execute */
		requiredFields: z.array(z.string()).optional(),

		/** Workflow states where this action is available */
		allowedStates: z.array(z.string()).optional(),

		/** The state the record transitions to after this action executes */
		nextState: z.string().optional(),

		/** True for stateless command actions with no workflow effect at all (print, email, etc.) */
		stateless: z.boolean().optional(),

		/**
		 * True for an internal self-transition: the action runs within the current state without
		 * advancing the workflow (e.g. `save`, which mutates record data but stays put). Scoped by
		 * `allowedStates`, rendered as a self-loop in the graph, and has no `nextState`. Distinct from
		 * `stateless` (which has no workflow presence at all): a self-transition is graph-owned and,
		 * unlike a stateless command, persists record data on dispatch.
		 */
		selfTransition: z.boolean().optional(),

		/** JS function body stored as a string; executed client-side via AsyncFunction with injected API surface */
		clientHandler: z.string().optional(),
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
 * Reactive field-validation trigger — advisory, client-side only.
 *
 * A Trigger is a docbuilder-authored validator: when any field in `on` is edited, its
 * `clientHandler` runs (client-side, no rollback) and may flag a field inline to block save
 * in the UI. It is deliberately a **sibling** to {@link (ActionDefinition:type)}, not a member of it —
 * a reactive validator is not a user-invoked action, so it lives in the `triggers` map on
 * {@link (WorkflowMeta:type)} and never appears to action readers (transition/command dropdowns, the FSM graph).
 *
 * The two bindings are independent: `on` is the fire-set (which fields' edits run it), while the
 * `setError(field, msg)` call inside `clientHandler` chooses which field displays the error.
 * @public
 */
export const TriggerDefinition = z
	.object({
		/** Optional display label; the map key is the trigger's identity */
		label: z.string().optional(),

		/** Fieldnames whose edits fire this trigger (fires when any listed field changes) */
		on: z.array(z.string()),

		/** JS function body stored as a string; run client-side with `{ record, value, setError }`. Advisory. */
		clientHandler: z.string(),
	})
	.meta({
		title: 'TriggerDefinition',
		description: 'Reactive field-validation trigger — advisory client-side',
	})

/**
 * Trigger definition type inferred from Zod schema
 * @public
 */
export type TriggerDefinition = z.infer<typeof TriggerDefinition>

/**
 * Whether a workflow action may run from `currentState`.
 *
 * Single source of truth for the "is this action available here" rule, shared by
 * the frontend (`getAvailableTransitions`) and the server-side dispatch guard so
 * the two can never disagree. Empty or absent `allowedStates` means the action is
 * available in ALL states — a plain `allowedStates.includes(currentState)` would
 * wrongly block such actions everywhere.
 *
 * @public
 */
export function isActionAllowedInState(action: { allowedStates?: string[] | null }, currentState: string): boolean {
	const allowedStates = action.allowedStates
	if (!allowedStates || allowedStates.length === 0) return true
	return allowedStates.includes(currentState)
}

/**
 * DocBuilder graph layout — node positions for the workflow-state graph, keyed by state name.
 * Pure authoring view-state: persisted in the doctype JSON so an author's manual arrangement
 * survives reloads, but — exactly like {@link (WorkflowMeta:type)}'s `triggers` — it is client-only
 * and never mirrored into the runtime GraphQL SDL (see the WorkflowMeta type in the host SDLs, which
 * expose only `states`/`actions`). The shape mirrors VueFlow's node fields; `position` is the node's
 * canvas coordinate and `targetPosition`/`sourcePosition` are the handle sides.
 * @public
 */
export const WorkflowLayout = z.record(
	z.string(),
	z.object({
		position: z.object({ x: z.number(), y: z.number() }).optional(),
		targetPosition: z.enum(['left', 'top', 'right', 'bottom']).optional(),
		sourcePosition: z.enum(['left', 'top', 'right', 'bottom']).optional(),
	})
)

/**
 * Workflow layout type inferred from Zod schema
 * @public
 */
export type WorkflowLayout = z.infer<typeof WorkflowLayout>

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

		/** Reactive field-validation triggers (advisory, client-side), keyed by trigger name */
		triggers: z.record(z.string(), TriggerDefinition).optional(),

		/**
		 * DocBuilder node positions keyed by state name — authoring view-state. Persisted here so a
		 * doctype author's manual graph arrangement survives reloads; like `triggers`, it is client-only
		 * and never enters the runtime GraphQL SDL. See {@link (WorkflowLayout:variable)}.
		 */
		layout: WorkflowLayout.optional(),
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

		/**
		 * Field on this doctype used when displaying a reference to one of its records.
		 * When a record elsewhere holds an inline foreign key to this doctype, the middleware
		 * returns that field as `{ id, displayText }`, reading `displayText` from this field.
		 */
		displayField: z.string().min(1).optional(),

		/** Field definitions (a link field is one carrying `doctype`) */
		fields: z.array(DoctypeFieldSchema),

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
	.superRefine((doctype, ctx) => {
		// A record is identified by exactly one field here, and that is the design rather than a
		// limitation awaiting composite support. A doctype describes the **API surface** a client
		// interacts with, not the table behind it; how a composite database key maps onto a single
		// identity on that surface is the server's business, and the client neither sees nor
		// encodes the parts. So there is nothing for a doctype-level composite key to express.
		//
		// Declaring several is therefore malformed, and silently so: `getPrimaryKeyField` takes the
		// first match and the rest are ignored, leaving an adapter to key records on a column that
		// need not be unique — `stonecropRecord`'s row map then keeps whichever row comes last.
		// Refusing at the gate is what makes it say so.
		//
		// Counts the flattened set, because that is the set `getPrimaryKeyField` resolves over. The
		// two asked different questions while this scanned top level only: a doctype with one key
		// declared at each level passed the gate and then had one of them silently dropped.
		//
		// Zero keys stays legal and is not an omission: a surrogate-key doctype declares none and
		// resolves through `getRecordIdField`'s documented `id` fallback.
		const declared = flattenFields(doctype.fields).filter(f => f.kind === 'field' && f.primaryKey)
		if (declared.length > 1) {
			ctx.addIssue({
				code: 'custom',
				path: ['fields'],
				message: `Doctype declares ${declared.length} primaryKey fields (${declared
					.map(f => (f.kind === 'field' ? f.fieldname : ''))
					.join(
						', '
					)}); a record is identified by exactly one field. A composite database key is mapped to a single identity by the adapter, so a doctype never declares its parts`,
			})
		}

		// Through `getDisplayField` rather than a scan written here, because the adapter builds its
		// SELECT from that same call. The two hand-rolled versions disagreed in both directions at
		// once: this gate scanned top-level only, so it rejected a fieldset-nested field that would
		// have worked, while neither side excluded `computed` fields, so a nomination naming one
		// passed the gate and then failed as a missing column at query time.
		if (doctype.displayField && !getDisplayField(doctype.fields, doctype.displayField)) {
			const named = flattenFields(doctype.fields).find(f => f.fieldname === doctype.displayField)
			ctx.addIssue({
				code: 'custom',
				path: ['displayField'],
				message: named
					? `displayField "${doctype.displayField}" names a computed field, which has no column to read a display value from`
					: `displayField "${doctype.displayField}" is not declared on this doctype`,
			})
		}
	})

/**
 * Doctype metadata type inferred from Zod schema
 * @public
 */
export type DoctypeMeta = z.infer<typeof DoctypeMeta>

/**
 * Suffix appended to a link fieldname for its pre-resolved display text in record payloads.
 *
 * @deprecated The `__display` suffix pattern is no longer used. Inline link fields are enriched
 * server-side by `@stonecrop/graphql-middleware` as `{ id, displayText }` objects on the link
 * field itself.
 * @public
 */
export const LINK_DISPLAY_SUFFIX = '__display'

/**
 * Build the payload key for a link field's display text (e.g. `customerId__display`).
 *
 * @deprecated The `__display` suffix pattern is no longer used. Inline link fields are enriched
 * server-side by `@stonecrop/graphql-middleware` as `{ id, displayText }` objects on the link
 * field itself.
 * @public
 */
export function linkDisplayFieldname(fieldname: string): string {
	return `${fieldname}${LINK_DISPLAY_SUFFIX}`
}

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
	/**
	 * Ask the backend for the total matching the filters as well as the page.
	 *
	 * Off by default because it costs a second query — a full scan on Postgres — and knowing
	 * *whether* more exist (`hasMore`) is what a list view actually needs. Turn it on for a
	 * "showing 20 of 4,312" style display.
	 */
	includeTotal?: boolean
}

/**
 * Result from getRecord - includes the record data
 * @public
 */
export interface GetRecordResult {
	/** The record data, or null if not found */
	record: Record<string, unknown> | null
}

/**
 * Result from getRecords — a page of records, and enough to tell that it is one.
 *
 * A bare array used to be returned here, which claimed to be the whole collection. It is not:
 * a limit always applies, so a caller could not distinguish a complete list from a truncated
 * one. That is the entire reason this type exists.
 *
 * @public
 */
export interface GetRecordsResult {
	/** The records in this page */
	data: Record<string, unknown>[]
	/** Whether the backend holds further records beyond this page */
	hasMore: boolean
	/**
	 * Total records matching the filters, ignoring limit/offset. Present only when the caller
	 * asked for it via {@link GetRecordsOptions.includeTotal} — counting is a full scan on most
	 * backends, so it is never computed speculatively.
	 */
	count?: number
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
	 * @returns Record data wrapped in GetRecordResult
	 */
	getRecord(doctype: T, recordId: string, options?: GetRecordOptions): Promise<GetRecordResult>

	/**
	 * Fetch a page of records
	 * @param doctype - Doctype reference (name and optional slug)
	 * @param options - Query options
	 * @returns The page, plus whether more exist and (on request) the total
	 */
	getRecords(doctype: T, options?: GetRecordsOptions): Promise<GetRecordsResult>

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
