/* eslint-disable no-new-func, no-eval */
import type { Map as ImmutableMap } from 'immutable'
import type {
	FieldActionFunction,
	FieldChangeContext,
	FieldTriggerExecutionResult,
	FieldTriggerOptions,
	ActionExecutionResult,
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
	private fieldRollbackConfig = new Map<string, Map<string, boolean>>() // doctype -> field -> rollback enabled
	private globalActions = new Map<string, FieldActionFunction>() // action name -> function

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
	 */
	registerAction(name: string, fn: FieldActionFunction): void {
		this.globalActions.set(name, fn)
	}

	/**
	 * Configure rollback behavior for a specific field trigger
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
	 */
	registerDoctypeActions(
		doctype: string,
		actions: ImmutableMap<string, string[]> | Map<string, string[]> | Record<string, string[]> | undefined
	): void {
		if (!actions) return

		const actionMap = new Map<string, string[]>()

		// Convert from different Map types to regular Map
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (typeof (actions as any).entrySeq === 'function') {
			// Immutable Map
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			;(actions as any).entrySeq().forEach(([key, value]: [string, string[]]) => {
				actionMap.set(key, value)
			})
		} else if (actions instanceof Map) {
			// Regular Map
			for (const [key, value] of actions) {
				actionMap.set(key, value)
			}
		} else if (actions && typeof actions === 'object') {
			// Plain object
			Object.entries(actions).forEach(([key, value]) => {
				actionMap.set(key, value as string[])
			})
		}

		this.doctypeActions.set(doctype, actionMap)
	}

	/**
	 * Execute field triggers for a changed field
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
 * @public
 */
export function getGlobalTriggerEngine(options?: FieldTriggerOptions): FieldTriggerEngine {
	return new FieldTriggerEngine(options)
}

/**
 * Register a global action function that can be used in field triggers
 * @public
 */
export function registerGlobalAction(name: string, fn: FieldActionFunction): void {
	const engine = getGlobalTriggerEngine()
	engine.registerAction(name, fn)
}

/**
 * Configure rollback behavior for a specific field trigger
 * @public
 */
export function setFieldRollback(doctype: string, fieldname: string, enableRollback: boolean): void {
	const engine = getGlobalTriggerEngine()
	engine.setFieldRollback(doctype, fieldname, enableRollback)
}
