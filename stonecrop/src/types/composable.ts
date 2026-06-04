import type { SchemaTypes } from '@stonecrop/aform'
import type { Ref, ComputedRef } from 'vue'

import type Doctype from '../doctype'
import type { HSTNode } from './hst'
import type { HSTOperation, OperationLogConfig, OperationLogSnapshot } from './operation-log'

/**
 * Operation Log API - nested object containing all operation log functionality
 * @public
 */
export type OperationLogAPI = {
	/**
	 * List of all recorded operations in the log.
	 * Each operation represents a state change that can be undone/redone.
	 */
	operations: Ref<HSTOperation[]>
	/**
	 * Current position in the operation log.
	 * -1 means no operations, 0 means at first operation, etc.
	 */
	currentIndex: Ref<number>
	/**
	 * Computed snapshot of undo/redo state.
	 * Use this for UI indicators (buttons, menu state).
	 */
	undoRedoState: ComputedRef<{
		canUndo: boolean
		canRedo: boolean
		undoCount: number
		redoCount: number
		currentIndex: number
	}>
	/**
	 * Whether undo is currently available.
	 * True when there are operations that can be undone.
	 */
	canUndo: ComputedRef<boolean>
	/**
	 * Whether redo is currently available.
	 * True when there are undone operations that can be redone.
	 */
	canRedo: ComputedRef<boolean>
	/**
	 * Number of operations available to undo.
	 */
	undoCount: ComputedRef<number>
	/**
	 * Number of operations available to redo.
	 */
	redoCount: ComputedRef<number>
	/**
	 * Undo the last operation.
	 * @param hstStore - The HST node to apply the inverse operation to
	 * @returns True if undo succeeded, false if nothing to undo
	 */
	undo: (hstStore: HSTNode) => boolean
	/**
	 * Redo the last undone operation.
	 * @param hstStore - The HST node to apply the operation to
	 * @returns True if redo succeeded, false if nothing to redo
	 */
	redo: (hstStore: HSTNode) => boolean
	/**
	 * Start batching multiple operations together.
	 * Call before a series of changes that should be undone/redone as a unit.
	 */
	startBatch: () => void
	/**
	 * Commit the current batch of operations.
	 * @param description - Optional description for the batch
	 * @returns The batch operation ID, or null if no batch in progress
	 */
	commitBatch: (description?: string) => string | null
	/**
	 * Cancel the current batch without committing.
	 * Discards all operations added since startBatch().
	 */
	cancelBatch: () => void
	/**
	 * Clear all operations from the log.
	 * Resets the log to its initial empty state.
	 */
	clear: () => void
	/**
	 * Get all operations for a specific doctype.
	 * @param doctype - The doctype name to filter by
	 * @param recordId - Optional record ID to further filter
	 * @returns Array of matching operations
	 */
	getOperationsFor: (doctype: string, recordId?: string) => HSTOperation[]
	/**
	 * Get a serializable snapshot of the operation log.
	 * Use for debugging, logging, or state persistence.
	 * @returns Snapshot containing operations and current index
	 */
	getSnapshot: () => OperationLogSnapshot
	/**
	 * Mark an operation as irreversible.
	 * Irreversible operations cannot be undone.
	 * @param operationId - The operation ID to mark
	 * @param reason - Human-readable reason why it cannot be undone
	 */
	markIrreversible: (operationId: string, reason: string) => void
	/**
	 * Log a custom action (non-HST operation).
	 * Use for tracking server calls, external side effects, etc.
	 * @param doctype - The doctype this action relates to
	 * @param actionName - Name of the action (e.g., 'save', 'submit')
	 * @param recordIds - Optional array of affected record IDs
	 * @param result - Optional result status
	 * @param error - Optional error message if result is 'failure'
	 * @returns The logged operation ID
	 */
	logAction: (
		doctype: string,
		actionName: string,
		recordIds?: string[],
		result?: 'success' | 'failure' | 'pending',
		error?: string
	) => string
	/**
	 * Configure operation log options.
	 * @param options - Partial configuration to merge with existing settings
	 */
	configure: (options: Partial<OperationLogConfig>) => void
}

/**
 * Base Stonecrop composable return type - includes operation log functionality
 * @public
 */
export type BaseStonecropReturn = {
	/**
	 * Reactive reference to the Stonecrop singleton instance.
	 * Use this to access class methods like `getRecord()`, `addRecord()`, `runAction()`.
	 */
	stonecrop: Ref<Stonecrop | undefined>
	/**
	 * Operation log API for undo/redo functionality.
	 * Use `operationLog.undo()` and `operationLog.redo()` for user-triggered operations.
	 * Use `operationLog.startBatch()` / `operationLog.commitBatch()` for grouping operations.
	 */
	operationLog: OperationLogAPI
}

/**
 * HST-enabled Stonecrop composable return type
 * @public
 */
export type HSTStonecropReturn = BaseStonecropReturn & {
	/**
	 * Generates a fully-qualified HST path for a field.
	 * Use this in nested components to create paths like "customer.123.address".
	 * @param fieldname - The field name to append to the path
	 * @param recordId - Optional record ID (defaults to current record)
	 * @returns The full HST path string
	 */
	provideHSTPath: (fieldname: string, recordId?: string) => string
	/**
	 * Handles a field value change and updates HST.
	 * Call this from form input handlers to persist changes to the store.
	 * @param changeData - Object containing path, value, fieldname, and optional recordId
	 */
	handleHSTChange: (changeData: HSTChangeData) => void
	/**
	 * Reactive reference to the HST node for this doctype/record.
	 * Use this to read current form state or subscribe to changes.
	 */
	hstStore: Ref<HSTNode | undefined>
	/**
	 * Reactive form data bound to HST.
	 * Use this as the v-model target for form inputs. Changes sync to hstStore.
	 */
	formData: Ref<Record<string, any>>
	/**
	 * Resolved schema with nested Doctype fields expanded.
	 * Use this to iterate over fields for rendering, excluding nested doctypes handled separately.
	 */
	resolvedSchema: Ref<SchemaTypes[]>
	/**
	 * Scaffold empty descendant records from defaults for all descendant links.
	 * @param path - The HST path where initialized data should be stored
	 * @param doctype - The doctype to initialize
	 */
	initializeNestedData: (path: string, doctype: Doctype) => void

	/**
	 * Fetch a record and its nested data from the server.
	 * Stores each field at its own HST path per the field-level convention.
	 * @param path - The HST path (e.g., "recipe.r1")
	 * @param doctype - The doctype to fetch
	 * @param recordId - Record ID to fetch
	 * @param options - Query options (includeNested to control which links are fetched)
	 * @throws Error with code "CLIENT_REQUIRED" if no data client is configured
	 * @throws Error with code "RECORD_NOT_FOUND" if the server returns null
	 */
	fetchNestedData: (
		path: string,
		doctype: Doctype,
		recordId: string,
		options?: { includeNested?: boolean | string[] }
	) => Promise<void>
	/**
	 * Collects a complete record payload with all nested data from HST.
	 * Use this before submitting to an API. Recursively includes 1:1 and 1:many nested records.
	 * @param doctype - The doctype metadata
	 * @param recordId - The record ID to collect
	 * @returns The complete record payload ready for API submission
	 */
	collectRecordPayload: (doctype: Doctype, recordId: string) => Record<string, any>
	/**
	 * Creates a nested context for a descendant doctype component.
	 * Use this in parent components to pass scoped handlers to child components.
	 * @param basePath - The parent HST path prefix
	 * @param descendantDoctype - The descendant doctype metadata
	 * @returns Scoped provideHSTPath and handleHSTChange functions
	 */
	createNestedContext: (
		basePath: string,
		descendantDoctype: Doctype
	) => {
		provideHSTPath: (fieldname: string) => string
		handleHSTChange: (changeData: HSTChangeData) => void
	}
	/**
	 * Loading state for async doctype resolution.
	 * True while fetching doctype by slug string from registry.
	 */
	isLoading: Ref<boolean>
	/**
	 * Error state for doctype resolution failures.
	 * Set when doctype slug lookup fails.
	 */
	error: Ref<Error | null>
	/**
	 * Resolved doctype instance.
	 * Available immediately if Doctype instance passed, after async resolution if slug string passed.
	 */
	resolvedDoctype: Ref<Doctype | undefined>
	/**
	 * Computed ref indicating whether workflow actions are ready to run.
	 * True when all links with blockWorkflows are loaded in HST.
	 * Use with v-bind:disabled="!isWorkflowReady" on action buttons.
	 */
	isWorkflowReady: ComputedRef<boolean>
	/**
	 * List of link fieldnames that are blocking workflow execution.
	 * Empty array when isWorkflowReady is true.
	 */
	blockedLinks: ComputedRef<string[]>
}

// Import Stonecrop class for the BaseStonecropReturn type (circular reference handled via import)
import type { Stonecrop } from '../stonecrop'

/**
 * HST Change data structure
 * @public
 */
export type HSTChangeData = {
	/** Full HST path to the changed field */
	path: string
	/** New value for the field */
	value: any
	/** Field name that changed */
	fieldname: string
	/** Optional record ID */
	recordId?: string
}

/**
 * Lazy link state for a single link field.
 * Provides reactive state and reload capability for lazy-loaded links.
 * @public
 */
export type LazyLink = {
	/** True while fetching data */
	loading: Ref<boolean>
	/** True after successful fetch (permanent until reload) */
	loaded: Ref<boolean>
	/** Error state, if any */
	error: Ref<Error | null>
	/** Explicitly trigger a fetch for this link */
	reload: () => Promise<void>
	/** The loaded data from HST, or undefined if not loaded */
	data: ComputedRef
}
