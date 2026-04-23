import { useMagicKeys, whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { getCurrentInstance, inject } from 'vue'

import type { HSTNode } from '../types/hst'
import { useOperationLogStore } from '../stores/operation-log'
import type { OperationLogConfig } from '../types/operation-log'

/**
 * Composable for operation log management
 * Provides easy access to undo/redo functionality and operation history
 *
 * @param config - Optional configuration for the operation log
 * @returns Operation log interface
 *
 * @example
 * ```typescript
 * const { undo, redo, canUndo, canRedo, operations, configure } = useOperationLog()
 *
 * // Configure the log
 * configure({
 *   maxOperations: 50,
 *   enableCrossTabSync: true,
 *   enablePersistence: true
 * })
 *
 * // Undo/redo
 * await undo(hstStore)
 * await redo(hstStore)
 * ```
 *
 * @public
 */
export function useOperationLog(config?: Partial<OperationLogConfig>) {
	// inject() is only valid inside a component setup() context. When this
	// composable is called outside one (e.g. directly in test bodies or plain
	// scripts) skip the injection entirely and fall back to the Pinia store.
	const injectedStore = getCurrentInstance()
		? inject<ReturnType<typeof useOperationLogStore> | undefined>('$operationLogStore', undefined)
		: undefined
	const store = injectedStore || useOperationLogStore()

	// Apply configuration if provided
	if (config) {
		store.configure(config)
	}

	// Extract reactive state
	const { operations, currentIndex, undoRedoState, canUndo, canRedo, undoCount, redoCount } = storeToRefs(store)

	/**
	 * Undo the last operation
	 */
	function undo(hstStore: HSTNode): boolean {
		return store.undo(hstStore)
	}

	/**
	 * Redo the next operation
	 */
	function redo(hstStore: HSTNode): boolean {
		return store.redo(hstStore)
	}

	/**
	 * Start a batch operation
	 */
	function startBatch() {
		store.startBatch()
	}

	/**
	 * Commit the current batch
	 */
	function commitBatch(description?: string): string | null {
		return store.commitBatch(description)
	}

	/**
	 * Cancel the current batch
	 */
	function cancelBatch() {
		store.cancelBatch()
	}

	/**
	 * Clear all operations
	 */
	function clear() {
		store.clear()
	}

	/**
	 * Get operations for a specific doctype/record
	 */
	function getOperationsFor(doctype: string, recordId?: string) {
		return store.getOperationsFor(doctype, recordId)
	}

	/**
	 * Get a snapshot of the operation log
	 */
	function getSnapshot() {
		return store.getSnapshot()
	}

	/**
	 * Mark an operation as irreversible
	 * @param operationId - The ID of the operation to mark
	 * @param reason - The reason why the operation is irreversible
	 */
	function markIrreversible(operationId: string, reason: string) {
		store.markIrreversible(operationId, reason)
	}

	/**
	 * Log an action execution (stateless actions like print, email, etc.)
	 * @param doctype - The doctype the action was executed on
	 * @param actionName - The name of the action that was executed
	 * @param recordIds - Optional array of record IDs the action was executed on
	 * @param result - The result of the action execution
	 * @param error - Optional error message if action failed
	 * @returns The operation ID
	 */
	function logAction(
		doctype: string,
		actionName: string,
		recordIds?: string[],
		result: 'success' | 'failure' | 'pending' = 'success',
		error?: string
	): string {
		return store.logAction(doctype, actionName, recordIds, result, error)
	}

	/**
	 * Update configuration
	 * @param options - Configuration options to update
	 */
	function configure(options: Partial<OperationLogConfig>) {
		store.configure(options)
	}

	return {
		// State
		operations,
		currentIndex,
		undoRedoState,
		canUndo,
		canRedo,
		undoCount,
		redoCount,

		// Methods
		undo,
		redo,
		startBatch,
		commitBatch,
		cancelBatch,
		clear,
		getOperationsFor,
		getSnapshot,
		markIrreversible,
		logAction,
		configure,
	}
}

/**
 * Keyboard shortcut handler for undo/redo
 * Automatically binds Ctrl+Z (undo) and Ctrl+Shift+Z/Ctrl+Y (redo) using VueUse
 *
 * @param hstStore - The HST store to operate on
 * @param enabled - Whether shortcuts are enabled (default: true)
 *
 * @example
 * ```typescript
 * import { onMounted } from 'vue'
 *
 * const stonecrop = useStonecrop({ doctype, recordId })
 * useUndoRedoShortcuts(stonecrop.hstStore)
 * ```
 *
 * @public
 */
export function useUndoRedoShortcuts(hstStore: HSTNode, enabled = true) {
	if (!enabled) return

	const { undo, redo, canUndo, canRedo } = useOperationLog()
	const keys = useMagicKeys()

	// Undo shortcuts: Ctrl+Z or Cmd+Z (Mac)
	whenever(keys['Ctrl+Z'], () => {
		if (canUndo.value) {
			undo(hstStore)
		}
	})

	whenever(keys['Meta+Z'], () => {
		if (canUndo.value) {
			undo(hstStore)
		}
	})

	// Redo shortcuts: Ctrl+Shift+Z, Cmd+Shift+Z (Mac), or Ctrl+Y
	whenever(keys['Ctrl+Shift+Z'], () => {
		if (canRedo.value) {
			redo(hstStore)
		}
	})

	whenever(keys['Meta+Shift+Z'], () => {
		if (canRedo.value) {
			redo(hstStore)
		}
	})

	whenever(keys['Ctrl+Y'], () => {
		if (canRedo.value) {
			redo(hstStore)
		}
	})
}

/**
 * Batch operation helper
 * Wraps a function execution in a batch operation
 *
 * @param fn - The function to execute within a batch
 * @param description - Optional description for the batch
 * @returns The batch operation ID
 *
 * @example
 * ```typescript
 * const { withBatch } = useOperationLog()
 *
 * const batchId = await withBatch(() => {
 *   hstStore.set('task.123.title', 'New Title')
 *   hstStore.set('task.123.status', 'active')
 *   hstStore.set('task.123.priority', 'high')
 * }, 'Update task details')
 * ```
 *
 * @public
 */
export async function withBatch<T>(fn: () => T | Promise<T>, description?: string): Promise<string | null> {
	const { startBatch, commitBatch, cancelBatch } = useOperationLog()

	startBatch()

	try {
		await fn()
		return commitBatch(description)
	} catch (error) {
		cancelBatch()
		throw error
	}
}
