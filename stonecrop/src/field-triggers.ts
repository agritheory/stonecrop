/* eslint-disable no-new-func, no-eval */
import type { Map as ImmutableMap } from 'immutable'
import { useOperationLogStore } from './stores/operation-log'
import type {
	FieldActionFunction,
	FieldChangeContext,
	FieldTriggerExecutionResult,
	FieldTriggerOptions,
	ActionExecutionResult,
	TransitionChangeContext,
	TransitionActionFunction,
	TransitionExecutionResult,
} from './types/field-triggers'

/**
 * Field trigger execution engine integrated with Registry
 * Singleton pattern following Registry implementation
 * @public
 */
export class FieldTriggerEngine {
	/**
	 * The root FieldTriggerEngine instance
	 */
	static _root: FieldTriggerEngine

	private options: FieldTriggerOptions & { defaultTimeout: number; debug: boolean; enableRollback: boolean }
	private doctypeActions = new Map<string, Map<string, string[]>>() // doctype -> action/field -> functions
	private doctypeTransitions = new Map<string, Map<string, string[]>>() // doctype -> transition -> functions
	private fieldRollbackConfig = new Map<string, Map<string, boolean>>() // doctype -> field -> rollback enabled
	private globalActions = new Map<string, FieldActionFunction>() // action name -> function
	private globalTransitionActions = new Map<string, TransitionActionFunction>() // transition action name -> function

	/**
	 * Creates a new FieldTriggerEngine instance (singleton pattern)
	 * @param options - Configuration options for the field trigger engine
	 */
	constructor(options: FieldTriggerOptions = {}) {
		if (FieldTriggerEngine._root) {
			return FieldTriggerEngine._root
		}
		FieldTriggerEngine._root = this
		this.options = {
			defaultTimeout: options.defaultTimeout ?? 5000,
			debug: options.debug ?? false,
			enableRollback: options.enableRollback ?? true,
			errorHandler: options.errorHandler,
		}
	}

	/**
	 * Register a global action function
	 * @param name - The name of the action
	 * @param fn - The action function
	 */
	registerAction(name: string, fn: FieldActionFunction): void {
		this.globalActions.set(name, fn)
	}

	/**
	 * Register a global XState transition action function
	 * @param name - The name of the transition action
	 * @param fn - The transition action function
	 */
	registerTransitionAction(name: string, fn: TransitionActionFunction): void {
		this.globalTransitionActions.set(name, fn)
	}

	/**
	 * Configure rollback behavior for a specific field trigger
	 * @param doctype - The doctype name
	 * @param fieldname - The field name
	 * @param enableRollback - Whether to enable rollback
	 */
	setFieldRollback(doctype: string, fieldname: string, enableRollback: boolean): void {
		if (!this.fieldRollbackConfig.has(doctype)) {
			this.fieldRollbackConfig.set(doctype, new Map())
		}
		this.fieldRollbackConfig.get(doctype)!.set(fieldname, enableRollback)
	}

	/**
	 * Get rollback configuration for a specific field trigger
	 */
	private getFieldRollback(doctype: string, fieldname: string): boolean | undefined {
		return this.fieldRollbackConfig.get(doctype)?.get(fieldname)
	}

	/**
	 * Register actions from a doctype - both regular actions and field triggers
	 * Separates XState transitions (uppercase) from field triggers (lowercase)
	 * @param doctype - The doctype name
	 * @param actions - The actions to register (supports Immutable Map, Map, or plain object)
	 */
	registerDoctypeActions(
		doctype: string,
		actions: ImmutableMap<string, string[]> | Map<string, string[]> | Record<string, string[]> | undefined
	): void {
		if (!actions) return

		const actionMap = new Map<string, string[]>()
		const transitionMap = new Map<string, string[]>()

		// Convert from different Map types to regular Map
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (typeof (actions as any).entrySeq === 'function') {
			// Immutable Map
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			;(actions as any).entrySeq().forEach(([key, value]: [string, string[]]) => {
				this.categorizeAction(key, value, actionMap, transitionMap)
			})
		} else if (actions instanceof Map) {
			// Regular Map
			for (const [key, value] of actions) {
				this.categorizeAction(key, value, actionMap, transitionMap)
			}
		} else if (actions && typeof actions === 'object') {
			// Plain object
			Object.entries(actions).forEach(([key, value]) => {
				this.categorizeAction(key, value as string[], actionMap, transitionMap)
			})
		}

		// Always set the maps, even if empty
		this.doctypeActions.set(doctype, actionMap)
		this.doctypeTransitions.set(doctype, transitionMap)
	}

	/**
	 * Categorize an action as either a field trigger or XState transition
	 * Uses uppercase convention: UPPERCASE = transition, lowercase/mixed = field trigger
	 */
	private categorizeAction(
		key: string,
		value: string[],
		actionMap: Map<string, string[]>,
		transitionMap: Map<string, string[]>
	): void {
		// Check if the key is all uppercase (XState transition convention)
		if (this.isTransitionKey(key)) {
			transitionMap.set(key, value)
		} else {
			actionMap.set(key, value)
		}
	}

	/**
	 * Determine if a key represents an XState transition
	 * Transitions are identified by being all uppercase
	 */
	private isTransitionKey(key: string): boolean {
		// Must be all uppercase letters/numbers/underscores
		return /^[A-Z0-9_]+$/.test(key) && key.length > 0
	}

	/**
	 * Execute field triggers for a changed field
	 * @param context - The field change context
	 * @param options - Execution options (timeout and enableRollback)
	 */
	async executeFieldTriggers(
		context: FieldChangeContext,
		options: { timeout?: number; enableRollback?: boolean } = {}
	): Promise<FieldTriggerExecutionResult> {
		const { doctype, fieldname } = context
		const triggers = this.findFieldTriggers(doctype, fieldname)

		if (triggers.length === 0) {
			return {
				path: context.path,
				actionResults: [],
				totalExecutionTime: 0,
				allSucceeded: true,
				stoppedOnError: false,
				rolledBack: false,
			}
		}

		const startTime = performance.now()
		const actionResults: ActionExecutionResult[] = []
		let stoppedOnError = false
		let rolledBack = false
		let snapshot: any = undefined

		// Determine if rollback is enabled (priority: execution option > field config > global setting)
		const fieldRollbackConfig = this.getFieldRollback(doctype, fieldname)
		const rollbackEnabled = options.enableRollback ?? fieldRollbackConfig ?? this.options.enableRollback

		// Capture snapshot before executing actions if rollback is enabled
		if (rollbackEnabled && context.store) {
			snapshot = this.captureSnapshot(context)
		}

		// Execute actions sequentially
		for (const actionName of triggers) {
			try {
				const actionResult = await this.executeAction(actionName, context, options.timeout)
				actionResults.push(actionResult)

				if (!actionResult.success) {
					stoppedOnError = true
					break
				}
			} catch (error) {
				const actionError = error instanceof Error ? error : new Error(String(error))
				const errorResult: ActionExecutionResult = {
					success: false,
					error: actionError,
					executionTime: 0,
					action: actionName,
				}
				actionResults.push(errorResult)
				stoppedOnError = true
				break
			}
		}

		// Perform rollback if enabled, errors occurred, and we have a snapshot
		if (rollbackEnabled && stoppedOnError && snapshot && context.store) {
			try {
				this.restoreSnapshot(context, snapshot)
				rolledBack = true
			} catch (rollbackError) {
				// eslint-disable-next-line no-console
				console.error('[FieldTriggers] Rollback failed:', rollbackError)
			}
		}

		const totalExecutionTime = performance.now() - startTime

		// Call global error handler if configured and errors occurred
		const failedResults = actionResults.filter(r => !r.success)
		if (failedResults.length > 0 && this.options.errorHandler) {
			for (const failedResult of failedResults) {
				try {
					this.options.errorHandler(failedResult.error!, context, failedResult.action)
				} catch (handlerError) {
					// eslint-disable-next-line no-console
					console.error('[FieldTriggers] Error in global error handler:', handlerError)
				}
			}
		}

		const result: FieldTriggerExecutionResult = {
			path: context.path,
			actionResults,
			totalExecutionTime,
			allSucceeded: actionResults.every(r => r.success),
			stoppedOnError,
			rolledBack,
			snapshot: this.options.debug && rollbackEnabled ? snapshot : undefined, // Only include snapshot in debug mode if rollback is enabled
		}

		return result
	}

	/**
	 * Execute XState transition actions
	 * Similar to field triggers but specifically for FSM state transitions
	 * @param context - The transition change context
	 * @param options - Execution options (timeout)
	 */
	async executeTransitionActions(
		context: TransitionChangeContext,
		options: { timeout?: number } = {}
	): Promise<TransitionExecutionResult[]> {
		const { doctype, transition } = context
		const transitionActions = this.findTransitionActions(doctype, transition)

		if (transitionActions.length === 0) {
			return []
		}

		const results: TransitionExecutionResult[] = []

		// Execute transition actions sequentially
		for (const actionName of transitionActions) {
			try {
				const actionResult = await this.executeTransitionAction(actionName, context, options.timeout)
				results.push(actionResult)

				if (!actionResult.success) {
					// Stop on first error for transitions
					break
				}
			} catch (error) {
				const actionError = error instanceof Error ? error : new Error(String(error))
				const errorResult: TransitionExecutionResult = {
					success: false,
					error: actionError,
					executionTime: 0,
					action: actionName,
					transition,
				}
				results.push(errorResult)
				break
			}
		}

		// Call global error handler if configured and errors occurred
		const failedResults = results.filter(r => !r.success)
		if (failedResults.length > 0 && this.options.errorHandler) {
			for (const failedResult of failedResults) {
				try {
					// Call with FieldChangeContext (base context type)
					this.options.errorHandler(failedResult.error!, context, failedResult.action)
				} catch (handlerError) {
					// eslint-disable-next-line no-console
					console.error('[FieldTriggers] Error in global error handler:', handlerError)
				}
			}
		}

		return results
	}

	/**
	 * Find transition actions for a specific doctype and transition
	 */
	private findTransitionActions(doctype: string, transition: string): string[] {
		const doctypeTransitions = this.doctypeTransitions.get(doctype)
		if (!doctypeTransitions) return []

		return doctypeTransitions.get(transition) || []
	}

	/**
	 * Execute a single transition action by name
	 */
	private async executeTransitionAction(
		actionName: string,
		context: TransitionChangeContext,
		timeout?: number
	): Promise<TransitionExecutionResult> {
		const startTime = performance.now()
		const actionTimeout = timeout ?? this.options.defaultTimeout

		try {
			// Look up action in transition-specific registry first, then fall back to global
			let actionFn = this.globalTransitionActions.get(actionName)

			// If not found in transition registry, try regular action registry
			// This allows sharing actions between field triggers and transitions
			if (!actionFn) {
				const regularActionFn = this.globalActions.get(actionName)
				if (regularActionFn) {
					// Wrap regular action to accept TransitionChangeContext
					actionFn = regularActionFn as unknown as TransitionActionFunction
				}
			}

			if (!actionFn) {
				throw new Error(`Transition action "${actionName}" not found in registry`)
			}

			await this.executeWithTimeout(actionFn as FieldActionFunction, context, actionTimeout)
			const executionTime = performance.now() - startTime

			return {
				success: true,
				executionTime,
				action: actionName,
				transition: context.transition,
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			const actionError = error instanceof Error ? error : new Error(String(error))

			return {
				success: false,
				error: actionError,
				executionTime,
				action: actionName,
				transition: context.transition,
			}
		}
	}

	/**
	 * Find field triggers for a specific doctype and field
	 * Field triggers are identified by keys that look like field paths (contain dots or match field names)
	 */
	private findFieldTriggers(doctype: string, fieldname: string): string[] {
		const doctypeActions = this.doctypeActions.get(doctype)
		if (!doctypeActions) return []

		const triggers: string[] = []

		for (const [key, actionNames] of doctypeActions) {
			// Check if this key is a field trigger pattern
			if (this.isFieldTriggerKey(key, fieldname)) {
				triggers.push(...actionNames)
			}
		}

		return triggers
	}

	/**
	 * Determine if an action key represents a field trigger
	 * Field triggers can be:
	 * - Exact field name match: "emailAddress"
	 * - Wildcard patterns: "emailAddress.*", "*.is_primary"
	 * - Nested field paths: "address.street", "contact.email"
	 */
	private isFieldTriggerKey(key: string, fieldname: string): boolean {
		// Exact match
		if (key === fieldname) return true

		// Contains dots - likely a field path pattern
		if (key.includes('.')) {
			return this.matchFieldPattern(key, fieldname)
		}

		// Contains wildcards
		if (key.includes('*')) {
			return this.matchFieldPattern(key, fieldname)
		}

		return false
	}

	/**
	 * Match a field pattern against a field name
	 * Supports wildcards (*) for dynamic segments
	 */
	private matchFieldPattern(pattern: string, fieldname: string): boolean {
		const patternParts = pattern.split('.')
		const fieldParts = fieldname.split('.')

		if (patternParts.length !== fieldParts.length) {
			return false
		}

		for (let i = 0; i < patternParts.length; i++) {
			const patternPart = patternParts[i]
			const fieldPart = fieldParts[i]

			if (patternPart === '*') {
				// Wildcard matches any segment
				continue
			} else if (patternPart !== fieldPart) {
				// Exact match required
				return false
			}
		}

		return true
	}

	/**
	 * Execute a single action by name
	 */
	private async executeAction(
		actionName: string,
		context: FieldChangeContext,
		timeout?: number
	): Promise<ActionExecutionResult> {
		const startTime = performance.now()
		const actionTimeout = timeout ?? this.options.defaultTimeout

		try {
			// Look up action in global registry
			const actionFn = this.globalActions.get(actionName)
			if (!actionFn) {
				throw new Error(`Action "${actionName}" not found in registry`)
			}

			await this.executeWithTimeout(actionFn, context, actionTimeout)
			const executionTime = performance.now() - startTime

			return {
				success: true,
				executionTime,
				action: actionName,
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			const actionError = error instanceof Error ? error : new Error(String(error))

			return {
				success: false,
				error: actionError,
				executionTime,
				action: actionName,
			}
		}
	}

	/**
	 * Execute a function with timeout
	 */
	private async executeWithTimeout(
		fn: FieldActionFunction,
		context: FieldChangeContext,
		timeout: number
	): Promise<unknown> {
		return new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(new Error(`Action timeout after ${timeout}ms`))
			}, timeout)

			Promise.resolve(fn(context))
				.then(result => {
					clearTimeout(timeoutId)
					resolve(result)
				})
				.catch(error => {
					clearTimeout(timeoutId)
					reject(error)
				})
		})
	}

	/**
	 * Capture a snapshot of the record state before executing actions
	 * This creates a deep copy of the record data for potential rollback
	 */
	private captureSnapshot(context: FieldChangeContext): any {
		if (!context.store || !context.doctype || !context.recordId) {
			return undefined
		}

		try {
			// Get the record path (doctype.recordId)
			const recordPath = `${context.doctype}.${context.recordId}`

			// Get the current record data
			const recordData = context.store.get(recordPath)

			if (!recordData || typeof recordData !== 'object') {
				return undefined
			}

			// Create a deep copy to avoid reference issues
			return JSON.parse(JSON.stringify(recordData))
		} catch (error) {
			if (this.options.debug) {
				// eslint-disable-next-line no-console
				console.warn('[FieldTriggers] Failed to capture snapshot:', error)
			}
			return undefined
		}
	}

	/**
	 * Restore a previously captured snapshot
	 * This reverts the record to its state before actions were executed
	 */
	private restoreSnapshot(context: FieldChangeContext, snapshot: any): void {
		if (!context.store || !context.doctype || !context.recordId || !snapshot) {
			return
		}

		try {
			// Get the record path (doctype.recordId)
			const recordPath = `${context.doctype}.${context.recordId}`

			// Restore the entire record from snapshot
			context.store.set(recordPath, snapshot)

			if (this.options.debug) {
				// eslint-disable-next-line no-console
				console.log(`[FieldTriggers] Rolled back ${recordPath} to previous state`)
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('[FieldTriggers] Failed to restore snapshot:', error)
			throw error
		}
	}
}

/**
 * Get or create the global field trigger engine singleton
 * @param options - Optional configuration for the field trigger engine
 * @public
 */
export function getGlobalTriggerEngine(options?: FieldTriggerOptions): FieldTriggerEngine {
	return new FieldTriggerEngine(options)
}

/**
 * Register a global action function that can be used in field triggers
 * @param name - The name of the action to register
 * @param fn - The action function to execute when the trigger fires
 * @public
 */
export function registerGlobalAction(name: string, fn: FieldActionFunction): void {
	const engine = getGlobalTriggerEngine()
	engine.registerAction(name, fn)
}

/**
 * Register a global XState transition action function
 * @param name - The name of the transition action to register
 * @param fn - The transition action function to execute
 * @public
 */
export function registerTransitionAction(name: string, fn: TransitionActionFunction): void {
	const engine = getGlobalTriggerEngine()
	engine.registerTransitionAction(name, fn)
}

/**
 * Configure rollback behavior for a specific field trigger
 * @param doctype - The doctype name
 * @param fieldname - The field name
 * @param enableRollback - Whether to enable automatic rollback for this field
 * @public
 */
export function setFieldRollback(doctype: string, fieldname: string, enableRollback: boolean): void {
	const engine = getGlobalTriggerEngine()
	engine.setFieldRollback(doctype, fieldname, enableRollback)
}

/**
 * Manually trigger an XState transition for a specific doctype/record
 * This can be called directly when you need to execute transition actions programmatically
 * @param doctype - The doctype name
 * @param transition - The XState transition name to trigger
 * @param options - Optional configuration for the transition
 * @public
 */
export async function triggerTransition(
	doctype: string,
	transition: string,
	options?: {
		recordId?: string
		currentState?: string
		targetState?: string
		fsmContext?: Record<string, any>
		path?: string
	}
): Promise<any> {
	const engine = getGlobalTriggerEngine()

	const context: TransitionChangeContext = {
		path: options?.path || (options?.recordId ? `${doctype}.${options.recordId}` : doctype),
		fieldname: '',
		beforeValue: undefined,
		afterValue: undefined,
		operation: 'set',
		doctype,
		recordId: options?.recordId,
		timestamp: new Date(),
		transition,
		currentState: options?.currentState,
		targetState: options?.targetState,
		fsmContext: options?.fsmContext,
	}

	return await engine.executeTransitionActions(context)
}

/**
 * Mark a specific operation as irreversible.
 * Used to prevent undo of critical operations like publishing or deletion.
 * @param operationId - The ID of the operation to mark as irreversible
 * @param reason - Human-readable reason why the operation cannot be undone
 * @public
 */
export function markOperationIrreversible(operationId: string | undefined, reason: string): void {
	if (!operationId) return

	try {
		const store = useOperationLogStore()
		store.markIrreversible(operationId, reason)
	} catch {
		// Operation log is optional
	}
}
