import { useMagicKeys, whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { inject } from 'vue'

import type { HSTNode } from '../stores/hst'
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
	// Try to use the injected store from the Stonecrop plugin first
	// This ensures we use the same Pinia instance as the app
	const injectedStore = inject<ReturnType<typeof useOperationLogStore> | undefined>('$operationLogStore', undefined)
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
	 */
	function markIrreversible(operationId: string, reason: string) {
		store.markIrreversible(operationId, reason)
	}

	/**
	 * Update configuration
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
