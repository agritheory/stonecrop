/**
 * Field-level action trigger system types
 * @public
 */

/**
 * Context provided to action functions when field changes occur
 * @public
 */
export interface FieldChangeContext {
	/** The HST path that was changed */
	path: string
	/** The field name (last segment of path) */
	fieldname: string
	/** Value before the change */
	beforeValue: any
	/** Value after the change */
	afterValue: any
	/** The operation type */
	operation: 'set' | 'delete' | 'patch'
	/** The doctype of the record being changed */
	doctype: string
	/** The record ID if applicable */
	recordId?: string
	/** Timestamp of the change */
	timestamp: Date
}

/**
 * Rollback function that can undo the effects of an action
 * @public
 */
export type RollbackFunction = () => void | Promise<void>

/**
 * Action execution result with optional rollback capability
 * @public
 */
export interface ActionResult {
	/** Optional rollback function to undo this action */
	rollback?: RollbackFunction
	/** Any data that was mutated/created that can be tracked for assertions */
	mutations?: Record<string, any>
}

/**
 * Action function that can be triggered by field changes
 * Can optionally return rollback information
 * @public
 */
export type FieldActionFunction = (
	context: FieldChangeContext
) => void | Promise<void> | ActionResult | Promise<ActionResult>

/**
 * String reference to a globally registered action function or inline function
 * @public
 */
export type FieldActionString = string

/**
 * Supported action types for field triggers
 * @public
 */
export type FieldAction = FieldActionFunction | FieldActionString

/**
 * Configuration for a single field trigger
 * @public
 */
export interface FieldTriggerConfig {
	/** Array of actions to execute when this field changes */
	actions: FieldAction[]
	/** Optional condition function to determine if actions should run */
	condition?: (context: FieldChangeContext) => boolean | Promise<boolean>
	/** Whether to run actions before or after the value is set (default: 'after') */
	timing?: 'before' | 'after'
	/** Whether to stop execution on first error (default: true) */
	stopOnError?: boolean
	/** Maximum execution time in milliseconds before timeout */
	timeout?: number
}

/**
 * Map of field paths to trigger configurations
 * Supports wildcard patterns like 'emailAddress.*.is_primary'
 * @public
 */
export type FieldTriggerMap = Record<string, FieldTriggerConfig | FieldAction[]>

/**
 * Registry for storing global action functions
 * @public
 */
export interface ActionRegistry {
	/** Register a global action function */
	register(name: string, fn: FieldActionFunction): void
	/** Get a registered action function */
	get(name: string): FieldActionFunction | undefined
	/** Check if an action is registered */
	has(name: string): boolean
	/** Unregister an action function */
	unregister(name: string): void
	/** Get all registered action names */
	list(): string[]
}

/**
 * Result of executing a field action
 * @public
 */
export interface ActionExecutionResult {
	/** Whether the action executed successfully */
	success: boolean
	/** Error if execution failed */
	error?: Error
	/** Execution time in milliseconds */
	executionTime: number
	/** The action that was executed */
	action: FieldAction
	/** Rollback function if the action supports rollback */
	rollback?: RollbackFunction
	/** Mutations made by this action for tracking/assertions */
	mutations?: Record<string, any>
}

/**
 * Result of executing all actions for a field change
 * @public
 */
export interface FieldTriggerExecutionResult {
	/** The path that triggered the actions */
	path: string
	/** Results for each action that was executed */
	actionResults: ActionExecutionResult[]
	/** Total execution time for all actions */
	totalExecutionTime: number
	/** Whether all actions succeeded */
	allSucceeded: boolean
	/** Whether execution was stopped due to an error */
	stoppedOnError: boolean
	/** Whether rollbacks were executed due to failures */
	rolledBack: boolean
	/** Results of rollback operations if any were performed */
	rollbackResults?: Array<{ success: boolean; error?: Error; executionTime: number }>
}

/**
 * Options for the field trigger system
 * @public
 */
export interface FieldTriggerOptions {
	/** Default timeout for action execution in milliseconds */
	defaultTimeout?: number
	/** Whether to log trigger executions for debugging */
	debug?: boolean
	/** Custom error handler for action failures */
	errorHandler?: (error: Error, context: FieldChangeContext, action: FieldAction) => void
}

/**
 * Pattern matching result for wildcard paths
 * @internal
 */
export interface PathMatchResult {
	/** Whether the path matches the pattern */
	matches: boolean
	/** Captured wildcard values */
	captures: Record<string, string>
}
