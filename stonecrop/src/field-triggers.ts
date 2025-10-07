/* eslint-disable no-new-func, no-eval */
import type { Map as ImmutableMap } from 'immutable'
import type {
	FieldActionFunction,
	FieldChangeContext,
	FieldTriggerExecutionResult,
	FieldTriggerOptions,
	ActionExecutionResult,
	ActionResult,
} from './types/field-triggers'

/**
 * Global field trigger engine instance
 */
let globalTriggerEngine: FieldTriggerEngine | undefined

/**
 * Get or create the global field trigger engine
 * @public
 */
export function getGlobalTriggerEngine(options?: FieldTriggerOptions): FieldTriggerEngine {
	if (!globalTriggerEngine) {
		globalTriggerEngine = new FieldTriggerEngine(options)
	}
	return globalTriggerEngine
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
 * Field trigger execution engine integrated with Registry
 * @internal
 */
export class FieldTriggerEngine {
	private options: FieldTriggerOptions & { defaultTimeout: number; debug: boolean }
	private doctypeActions = new Map<string, Map<string, string[]>>() // doctype -> action/field -> functions
	private globalActions = new Map<string, FieldActionFunction>() // action name -> function

	constructor(options: FieldTriggerOptions = {}) {
		this.options = {
			defaultTimeout: options.defaultTimeout ?? 5000,
			debug: options.debug ?? false,
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
		options: { timeout?: number } = {}
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
		const successfulActions: ActionExecutionResult[] = []
		let stoppedOnError = false
		let rolledBack = false
		let rollbackResults: Array<{ success: boolean; error?: Error; executionTime: number }> = []

		// Execute actions sequentially
		for (const actionName of triggers) {
			try {
				const actionResult = await this.executeAction(actionName, context, options.timeout)
				actionResults.push(actionResult)

				if (actionResult.success) {
					// Track successful actions that might need rollback
					successfulActions.push(actionResult)
				} else {
					stoppedOnError = true
					// Execute rollbacks for previously successful actions
					if (successfulActions.length > 0) {
						rollbackResults = await this.executeRollbacks(successfulActions)
						rolledBack = true
					}
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

				// Execute rollbacks for previously successful actions
				if (successfulActions.length > 0) {
					rollbackResults = await this.executeRollbacks(successfulActions)
					rolledBack = true
				}
				break
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
			rollbackResults: rollbackResults.length > 0 ? rollbackResults : undefined,
		}

		return result
	}

	/**
	 * Execute rollbacks for successful actions in reverse order
	 */
	private async executeRollbacks(
		successfulActions: ActionExecutionResult[]
	): Promise<Array<{ success: boolean; error?: Error; executionTime: number }>> {
		const rollbackResults: Array<{ success: boolean; error?: Error; executionTime: number }> = []

		// Execute rollbacks in reverse order (LIFO - Last In, First Out)
		for (let i = successfulActions.length - 1; i >= 0; i--) {
			const actionResult = successfulActions[i]

			if (actionResult.rollback) {
				const startTime = performance.now()
				try {
					await actionResult.rollback()
					const executionTime = performance.now() - startTime
					rollbackResults.push({ success: true, executionTime })
				} catch (error) {
					const executionTime = performance.now() - startTime
					const rollbackError = error instanceof Error ? error : new Error(String(error))
					rollbackResults.push({ success: false, error: rollbackError, executionTime })
					// Continue with other rollbacks even if one fails
				}
			}
		}

		return rollbackResults
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

			const result = await this.executeWithTimeout(actionFn, context, actionTimeout)
			const executionTime = performance.now() - startTime

			// Handle ActionResult return value
			if (result && typeof result === 'object' && ('rollback' in result || 'mutations' in result)) {
				const actionResult = result as ActionResult
				return {
					success: true,
					executionTime,
					action: actionName,
					rollback: actionResult.rollback,
					mutations: actionResult.mutations,
				}
			} else {
				return {
					success: true,
					executionTime,
					action: actionName,
				}
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
}
