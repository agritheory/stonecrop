import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'

import type { HSTNode } from './hst'
import type {
	CrossTabMessage,
	HSTOperation,
	HSTOperationInput,
	OperationLogConfig,
	OperationLogSnapshot,
	OperationSource,
	UndoRedoState,
} from '../types/operation-log'

/**
 * Generate a UUID using crypto API or fallback
 */
function generateId(): string {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID()
	}
	// Fallback for environments without crypto.randomUUID
	return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Serialize a message for BroadcastChannel
 * Converts Date objects to ISO strings for structured clone compatibility
 */
type SerializedOperation = Omit<HSTOperation, 'timestamp'> & { timestamp: string }
type SerializedCrossTabMessage = Omit<CrossTabMessage, 'timestamp' | 'operation' | 'operations'> & {
	timestamp: string
	operation?: SerializedOperation
	operations?: SerializedOperation[]
}

function serializeForBroadcast(message: CrossTabMessage): SerializedCrossTabMessage {
	const serialized: SerializedCrossTabMessage = {
		type: message.type,
		clientId: message.clientId,
		timestamp: message.timestamp.toISOString(),
	}

	if (message.operation) {
		serialized.operation = {
			...message.operation,
			timestamp: message.operation.timestamp.toISOString(),
		}
	}

	if (message.operations) {
		serialized.operations = message.operations.map(op => ({
			...op,
			timestamp: op.timestamp.toISOString(),
		}))
	}

	return serialized
}

/**
 * Deserialize a message from BroadcastChannel
 * Converts ISO strings back to Date objects
 */
function deserializeFromBroadcast(serialized: SerializedCrossTabMessage): CrossTabMessage {
	const message: CrossTabMessage = {
		type: serialized.type,
		clientId: serialized.clientId,
		timestamp: new Date(serialized.timestamp),
	}

	if (serialized.operation) {
		message.operation = {
			...serialized.operation,
			timestamp: new Date(serialized.operation.timestamp),
		}
	}

	if (serialized.operations) {
		message.operations = serialized.operations.map(op => ({
			...op,
			timestamp: new Date(op.timestamp),
		}))
	}

	return message
}

/**
 * Revert an operation (apply beforeValue)
 */
function revertOperation(operation: HSTOperation, store: HSTNode) {
	if ((operation.type === 'set' || operation.type === 'delete') && store && typeof store.set === 'function') {
		store.set(operation.path, operation.beforeValue, 'undo')
	}
}

/**
 * Apply an operation (apply afterValue)
 */
function applyOperation(operation: HSTOperation, store: HSTNode) {
	if ((operation.type === 'set' || operation.type === 'delete') && store && typeof store.set === 'function') {
		store.set(operation.path, operation.afterValue, 'redo')
	}
}

/**
 * Global HST Operation Log Store
 * Tracks all mutations with full metadata for undo/redo, sync, and audit
 *
 * @public
 */
export const useOperationLogStore = defineStore('hst-operation-log', () => {
	// Configuration
	const config = ref<OperationLogConfig>({
		maxOperations: 100,
		enableCrossTabSync: true,
		autoSyncInterval: 30000,
		enablePersistence: false,
		persistenceKeyPrefix: 'stonecrop-ops',
	})

	// State
	const operations = ref<HSTOperation[]>([])
	const currentIndex = ref(-1) // Points to the last applied operation
	const clientId = ref(generateId())
	const batchMode = ref(false)
	const batchStack = ref<{ id: string; operations: HSTOperation[] }[]>([])

	// Computed
	const canUndo = computed(() => {
		// Can undo if there are operations and we're not at the beginning
		if (currentIndex.value < 0) return false

		// Check if the operation at currentIndex is reversible
		const operation = operations.value[currentIndex.value]
		return operation?.reversible ?? false
	})

	const canRedo = computed(() => {
		// Can redo if there are operations ahead of current index
		return currentIndex.value < operations.value.length - 1
	})

	const undoCount = computed(() => {
		let count = 0
		for (let i = currentIndex.value; i >= 0; i--) {
			if (operations.value[i]?.reversible) count++
			else break
		}
		return count
	})

	const redoCount = computed(() => {
		return operations.value.length - 1 - currentIndex.value
	})

	const undoRedoState = computed(
		(): UndoRedoState => ({
			canUndo: canUndo.value,
			canRedo: canRedo.value,
			undoCount: undoCount.value,
			redoCount: redoCount.value,
			currentIndex: currentIndex.value,
		})
	)

	// Core Methods

	/**
	 * Configure the operation log
	 */
	function configure(options: Partial<OperationLogConfig>) {
		config.value = { ...config.value, ...options }

		// Set up persistence if enabled
		if (config.value.enablePersistence) {
			loadFromPersistence()
			setupPersistenceWatcher()
		}

		// Set up cross-tab sync if enabled
		if (config.value.enableCrossTabSync) {
			setupCrossTabSync()
		}
	}

	/**
	 * Add an operation to the log
	 */
	function addOperation(operation: HSTOperationInput, source: OperationSource = 'user') {
		const fullOperation: HSTOperation = {
			...operation,
			id: generateId(),
			timestamp: new Date(),
			source: source,
			userId: config.value.userId,
		}

		// Apply filter if configured
		if (config.value.operationFilter && !config.value.operationFilter(fullOperation)) {
			return fullOperation.id
		}

		// If in batch mode, collect operations in current batch
		if (batchMode.value && batchStack.value.length > 0) {
			batchStack.value[batchStack.value.length - 1].operations.push(fullOperation)
			return fullOperation.id
		}

		// Remove any operations after current index (they become invalid after new operation)
		if (currentIndex.value < operations.value.length - 1) {
			operations.value = operations.value.slice(0, currentIndex.value + 1)
		}

		// Add new operation
		operations.value.push(fullOperation)
		currentIndex.value++

		// Enforce max operations limit
		if (config.value.maxOperations && operations.value.length > config.value.maxOperations) {
			const overflow = operations.value.length - config.value.maxOperations
			operations.value = operations.value.slice(overflow)
			currentIndex.value -= overflow
		}

		// Broadcast to other tabs
		if (config.value.enableCrossTabSync) {
			broadcastOperation(fullOperation)
		}

		return fullOperation.id
	}

	/**
	 * Start batch mode - collect multiple operations
	 */
	function startBatch() {
		batchMode.value = true
		batchStack.value.push({
			id: generateId(),
			operations: [],
		})
	}

	/**
	 * Commit batch - create a single batch operation
	 */
	function commitBatch(description?: string): string | null {
		if (!batchMode.value || batchStack.value.length === 0) {
			return null
		}

		const currentBatchData = batchStack.value.pop()!
		const batchOperations = currentBatchData.operations

		if (batchOperations.length === 0) {
			// Empty batch - just pop and continue if there are outer batches
			if (batchStack.value.length === 0) {
				batchMode.value = false
			}
			return null
		}

		const batchId = currentBatchData.id
		const allReversible = batchOperations.every(op => op.reversible)

		// Create ancestor batch operation
		const batchOperation: HSTOperation = {
			id: batchId,
			type: 'batch',
			path: '', // Batch doesn't have a single path
			fieldname: '',
			beforeValue: null,
			afterValue: null,
			doctype: batchOperations[0]?.doctype || '',
			timestamp: new Date(),
			source: 'user',
			reversible: allReversible,
			irreversibleReason: allReversible ? undefined : 'Contains irreversible operations',
			descendantOperationIds: batchOperations.map(op => op.id),
			metadata: { description },
		}

		// Add ancestor operation ID to all descendants
		batchOperations.forEach(op => {
			op.ancestorOperationId = batchId
		})

		// If we're inside a ancestor batch, add this batch as a descendant of the ancestor
		if (batchStack.value.length > 0) {
			// Nested batch - add the batch operation to the ancestor batch
			batchStack.value[batchStack.value.length - 1].operations.push(batchOperation)
		} else {
			// Top-level batch - add to the operations log
			operations.value.push(...batchOperations, batchOperation)
			currentIndex.value = operations.value.length - 1
		}

		// Broadcast batch
		if (config.value.enableCrossTabSync) {
			broadcastBatch(batchOperations, batchOperation)
		}

		// If no more batches on stack, exit batch mode
		if (batchStack.value.length === 0) {
			batchMode.value = false
		}

		return batchId
	}

	/**
	 * Cancel batch mode without committing
	 */
	function cancelBatch() {
		batchStack.value = []
		batchMode.value = false
	}

	/**
	 * Undo the last operation
	 */
	function undo(store: HSTNode): boolean {
		if (!canUndo.value) return false

		const operation = operations.value[currentIndex.value]

		if (!operation.reversible) {
			// Warn about irreversible operation
			if (typeof console !== 'undefined' && operation.irreversibleReason) {
				console.warn('Cannot undo irreversible operation:', operation.irreversibleReason)
			}
			return false
		}

		try {
			// Handle batch operations
			if (operation.type === 'batch' && operation.descendantOperationIds) {
				// Undo all descendant operations in reverse order
				for (let i = operation.descendantOperationIds.length - 1; i >= 0; i--) {
					const descendantId = operation.descendantOperationIds[i]
					const descendantOp = operations.value.find(op => op.id === descendantId)
					if (descendantOp) {
						revertOperation(descendantOp, store)
					}
				}
			} else {
				// Undo single operation
				revertOperation(operation, store)
			}

			currentIndex.value--

			// Broadcast undo to other tabs
			if (config.value.enableCrossTabSync) {
				broadcastUndo(operation)
			}

			return true
		} catch (error) {
			// Log error in development
			if (typeof console !== 'undefined') {
				console.error('Undo failed:', error)
			}
			return false
		}
	}

	/**
	 * Redo the next operation
	 */
	function redo(store: HSTNode): boolean {
		if (!canRedo.value) return false

		const operation = operations.value[currentIndex.value + 1]

		try {
			// Handle batch operations
			if (operation.type === 'batch' && operation.descendantOperationIds) {
				// Redo all descendant operations in order
				for (const descendantId of operation.descendantOperationIds) {
					const descendantOp = operations.value.find(op => op.id === descendantId)
					if (descendantOp) {
						applyOperation(descendantOp, store)
					}
				}
			} else {
				// Redo single operation
				applyOperation(operation, store)
			}

			currentIndex.value++

			// Broadcast redo to other tabs
			if (config.value.enableCrossTabSync) {
				broadcastRedo(operation)
			}

			return true
		} catch (error) {
			// Log error in development
			if (typeof console !== 'undefined') {
				console.error('Redo failed:', error)
			}
			return false
		}
	}

	/**
	 * Get operation log snapshot for debugging
	 */
	function getSnapshot(): OperationLogSnapshot {
		const reversibleOps = operations.value.filter(op => op.reversible).length
		const timestamps = operations.value.map(op => op.timestamp)

		return {
			operations: [...operations.value],
			currentIndex: currentIndex.value,
			totalOperations: operations.value.length,
			reversibleOperations: reversibleOps,
			irreversibleOperations: operations.value.length - reversibleOps,
			oldestOperation: timestamps.length > 0 ? new Date(Math.min(...timestamps.map(t => t.getTime()))) : undefined,
			newestOperation: timestamps.length > 0 ? new Date(Math.max(...timestamps.map(t => t.getTime()))) : undefined,
		}
	}

	/**
	 * Clear all operations
	 */
	function clear() {
		operations.value = []
		currentIndex.value = -1
	}

	/**
	 * Get operations for a specific doctype and recordId
	 */
	function getOperationsFor(doctype: string, recordId?: string): HSTOperation[] {
		return operations.value.filter(op => op.doctype === doctype && (recordId === undefined || op.recordId === recordId))
	}

	/**
	 * Mark an operation as irreversible
	 * @param operationId - The ID of the operation to mark
	 * @param reason - The reason why the operation is irreversible
	 */
	function markIrreversible(operationId: string, reason: string) {
		const operation = operations.value.find(op => op.id === operationId)
		if (operation) {
			operation.reversible = false
			operation.irreversibleReason = reason
		}
	}

	/**
	 * Log an action execution (stateless actions like print, email, etc.)
	 * These operations are tracked but typically not reversible
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
		const operation: HSTOperationInput = {
			type: 'action',
			path: recordIds && recordIds.length > 0 ? `${doctype}.${recordIds[0]}` : doctype,
			fieldname: '',
			beforeValue: null,
			afterValue: null,
			doctype,
			recordId: recordIds && recordIds.length > 0 ? recordIds[0] : undefined,
			reversible: false, // Actions are typically not reversible
			actionName,
			actionRecordIds: recordIds,
			actionResult: result,
			actionError: error,
		}

		return addOperation(operation)
	}

	// Cross-tab synchronization
	let broadcastChannel: BroadcastChannel | null = null

	function setupCrossTabSync() {
		if (typeof window === 'undefined' || !window.BroadcastChannel) return

		broadcastChannel = new BroadcastChannel('stonecrop-operation-log')

		broadcastChannel.addEventListener('message', (event: MessageEvent) => {
			const rawMessage = event.data

			if (!rawMessage || typeof rawMessage !== 'object') return

			const message = deserializeFromBroadcast(rawMessage)

			// Ignore messages from this tab
			if (message.clientId === clientId.value) return

			if (message.type === 'operation' && message.operation) {
				// Add operation from another tab
				operations.value.push({ ...message.operation, source: 'sync' })
				currentIndex.value = operations.value.length - 1
			} else if (message.type === 'operation' && message.operations) {
				// Add batch operations from another tab
				operations.value.push(
					...message.operations.map((op): HSTOperation => Object.assign({}, op, { source: 'sync' as const }))
				)
				currentIndex.value = operations.value.length - 1
			}
		})
	}

	function broadcastOperation(operation: HSTOperation) {
		if (!broadcastChannel) return

		const message: CrossTabMessage = {
			type: 'operation',
			operation,
			clientId: clientId.value,
			timestamp: new Date(),
		}
		// oxlint-disable-next-line unicorn/require-post-message-target-origin -- BroadcastChannel.postMessage does not accept targetOrigin; rule only applies to window.postMessage
		broadcastChannel.postMessage(serializeForBroadcast(message))
	}

	function broadcastBatch(descendantOps: HSTOperation[], batchOp: HSTOperation) {
		if (!broadcastChannel) return

		const message: CrossTabMessage = {
			type: 'operation',
			operations: [...descendantOps, batchOp],
			clientId: clientId.value,
			timestamp: new Date(),
		}
		// oxlint-disable-next-line unicorn/require-post-message-target-origin -- BroadcastChannel.postMessage does not accept targetOrigin; rule only applies to window.postMessage
		broadcastChannel.postMessage(serializeForBroadcast(message))
	}

	function broadcastUndo(operation: HSTOperation) {
		if (!broadcastChannel) return

		const message: CrossTabMessage = {
			type: 'undo',
			operation,
			clientId: clientId.value,
			timestamp: new Date(),
		}
		// oxlint-disable-next-line unicorn/require-post-message-target-origin -- BroadcastChannel.postMessage does not accept targetOrigin; rule only applies to window.postMessage
		broadcastChannel.postMessage(serializeForBroadcast(message))
	}

	function broadcastRedo(operation: HSTOperation) {
		if (!broadcastChannel) return

		const message: CrossTabMessage = {
			type: 'redo',
			operation,
			clientId: clientId.value,
			timestamp: new Date(),
		}
		// oxlint-disable-next-line unicorn/require-post-message-target-origin -- BroadcastChannel.postMessage does not accept targetOrigin; rule only applies to window.postMessage
		broadcastChannel.postMessage(serializeForBroadcast(message))
	}

	// Persistence using VueUse
	type PersistedData = {
		operations: Array<Omit<HSTOperation, 'timestamp'> & { timestamp: string }>
		currentIndex: number
	}

	const persistedData = useLocalStorage<PersistedData | null>('stonecrop-operations', null, {
		serializer: {
			read: (v: string) => {
				try {
					const data = JSON.parse(v)
					return data
				} catch {
					return null
				}
			},
			write: (v: PersistedData | null) => {
				if (!v) return ''
				return JSON.stringify(v)
			},
		},
	})

	function loadFromPersistence() {
		if (typeof window === 'undefined') return

		try {
			const data = persistedData.value
			if (data && Array.isArray(data.operations)) {
				operations.value = data.operations.map(op => ({
					...op,
					timestamp: new Date(op.timestamp),
				}))
				currentIndex.value = data.currentIndex ?? -1
			}
		} catch (error) {
			// Log error in development
			if (typeof console !== 'undefined') {
				console.error('Failed to load operations from persistence:', error)
			}
		}
	}

	function saveToPersistence() {
		if (typeof window === 'undefined') return

		try {
			persistedData.value = {
				operations: operations.value.map(op => ({
					...op,
					timestamp: op.timestamp.toISOString(),
				})),
				currentIndex: currentIndex.value,
			}
		} catch (error) {
			// Log error in development
			if (typeof console !== 'undefined') {
				console.error('Failed to save operations to persistence:', error)
			}
		}
	}

	function setupPersistenceWatcher() {
		watch(
			[operations, currentIndex],
			() => {
				if (config.value.enablePersistence) {
					saveToPersistence()
				}
			},
			{ deep: true }
		)
	}

	return {
		// State
		operations,
		currentIndex,
		config,
		clientId,
		undoRedoState,

		// Computed
		canUndo,
		canRedo,
		undoCount,
		redoCount,

		// Methods
		configure,
		addOperation,
		startBatch,
		commitBatch,
		cancelBatch,
		undo,
		redo,
		clear,
		getOperationsFor,
		getSnapshot,
		markIrreversible,
		logAction,
	}
})
