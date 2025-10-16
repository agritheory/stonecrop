import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type {
	HSTOperation,
	HSTOperationInput,
	OperationLogConfig,
	UndoRedoState,
	OperationLogSnapshot,
	SyncDelta,
	CrossTabMessage,
	OperationSource,
} from '../types/operation-log'
import type { HSTNode } from './hst'

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
		enableServerSync: false,
		autoSyncInterval: 30000,
		enablePersistence: false,
		persistenceKeyPrefix: 'stonecrop-ops',
	})

	// State
	const operations = ref<HSTOperation[]>([])
	const currentIndex = ref(-1) // Points to the last applied operation
	const clientId = ref(generateId())
	const lastSyncTimestamp = ref(new Date())
	const batchMode = ref(false)
	const currentBatch = ref<HSTOperation[]>([])
	const currentBatchId = ref<string | null>(null)

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

	const undoRedoState = computed<UndoRedoState>(() => ({
		canUndo: canUndo.value,
		canRedo: canRedo.value,
		undoCount: undoCount.value,
		redoCount: redoCount.value,
		currentIndex: currentIndex.value,
	}))

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

		// Set up server sync if enabled
		if (config.value.enableServerSync && config.value.autoSyncInterval) {
			setupServerSync()
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

		// If in batch mode, collect operations
		if (batchMode.value) {
			currentBatch.value.push(fullOperation)
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
		currentBatch.value = []
		currentBatchId.value = generateId()
	}

	/**
	 * Commit batch - create a single batch operation
	 */
	function commitBatch(description?: string): string | null {
		if (!batchMode.value || currentBatch.value.length === 0) {
			batchMode.value = false
			currentBatch.value = []
			currentBatchId.value = null
			return null
		}

		const batchId = currentBatchId.value!
		const allReversible = currentBatch.value.every(op => op.reversible)

		// Create parent batch operation
		const batchOperation: HSTOperation = {
			id: batchId,
			type: 'batch',
			path: '', // Batch doesn't have a single path
			fieldname: '',
			beforeValue: null,
			afterValue: null,
			doctype: currentBatch.value[0]?.doctype || '',
			timestamp: new Date(),
			source: 'user',
			reversible: allReversible,
			irreversibleReason: allReversible ? undefined : 'Contains irreversible operations',
			childOperationIds: currentBatch.value.map(op => op.id),
			metadata: { description },
		}

		// Add parent operation ID to all children
		currentBatch.value.forEach(op => {
			op.parentOperationId = batchId
		})

		// Add all operations to the log
		operations.value.push(...currentBatch.value, batchOperation)
		currentIndex.value = operations.value.length - 1

		// Broadcast batch
		if (config.value.enableCrossTabSync) {
			broadcastBatch(currentBatch.value, batchOperation)
		}

		// Reset batch state
		const result = batchId
		batchMode.value = false
		currentBatch.value = []
		currentBatchId.value = null

		return result
	}

	/**
	 * Cancel batch mode without committing
	 */
	function cancelBatch() {
		batchMode.value = false
		currentBatch.value = []
		currentBatchId.value = null
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
				// eslint-disable-next-line no-console
				console.warn('Cannot undo irreversible operation:', operation.irreversibleReason)
			}
			return false
		}

		try {
			// Handle batch operations
			if (operation.type === 'batch' && operation.childOperationIds) {
				// Undo all child operations in reverse order
				for (let i = operation.childOperationIds.length - 1; i >= 0; i--) {
					const childId = operation.childOperationIds[i]
					const childOp = operations.value.find(op => op.id === childId)
					if (childOp) {
						revertOperation(childOp, store)
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
				// eslint-disable-next-line no-console
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
			if (operation.type === 'batch' && operation.childOperationIds) {
				// Redo all child operations in order
				for (const childId of operation.childOperationIds) {
					const childOp = operations.value.find(op => op.id === childId)
					if (childOp) {
						applyOperation(childOp, store)
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
				// eslint-disable-next-line no-console
				console.error('Redo failed:', error)
			}
			return false
		}
	}

	/**
	 * Revert an operation (apply beforeValue)
	 */
	function revertOperation(operation: HSTOperation, store: HSTNode) {
		// Both 'set' and 'delete' operations can be reverted by setting to beforeValue
		if ((operation.type === 'set' || operation.type === 'delete') && store && typeof store.set === 'function') {
			store.set(operation.path, operation.beforeValue, 'undo')
		}
		// Note: 'transition' operations are marked as non-reversible, so they won't reach here
		// Note: 'batch' operations are handled separately in the undo function
	}

	/**
	 * Apply an operation (apply afterValue)
	 */
	function applyOperation(operation: HSTOperation, store: HSTNode) {
		// Both 'set' and 'delete' operations can be applied by setting to afterValue
		if ((operation.type === 'set' || operation.type === 'delete') && store && typeof store.set === 'function') {
			store.set(operation.path, operation.afterValue, 'redo')
		}
		// Note: 'transition' operations are marked as non-reversible, so they won't reach here
		// Note: 'batch' operations are handled separately in the redo function
	}

	/**
	 * Get operations since a timestamp (for server sync)
	 */
	function getOperationsSince(timestamp: Date): HSTOperation[] {
		return operations.value.filter(op => op.timestamp > timestamp && op.source !== 'sync')
	}

	/**
	 * Create sync delta for server
	 */
	function createSyncDelta(): SyncDelta {
		return {
			operations: getOperationsSince(lastSyncTimestamp.value),
			lastSyncTimestamp: lastSyncTimestamp.value,
			currentTimestamp: new Date(),
			clientId: clientId.value,
		}
	}

	/**
	 * Apply sync delta from server
	 */
	function applySyncDelta(delta: SyncDelta) {
		delta.operations.forEach(operation => {
			// Add operations from server with 'sync' source
			const fullOp: HSTOperation = { ...operation, source: 'sync' }
			operations.value.push(fullOp)
		})

		lastSyncTimestamp.value = delta.currentTimestamp
		currentIndex.value = operations.value.length - 1
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
		lastSyncTimestamp.value = new Date()
	}

	/**
	 * Get operations for a specific doctype and recordId
	 */
	function getOperationsFor(doctype: string, recordId?: string): HSTOperation[] {
		return operations.value.filter(op => op.doctype === doctype && (recordId === undefined || op.recordId === recordId))
	}

	/**
	 * Mark an operation as irreversible
	 */
	function markIrreversible(operationId: string, reason: string) {
		const operation = operations.value.find(op => op.id === operationId)
		if (operation) {
			operation.reversible = false
			operation.irreversibleReason = reason
		}
	}

	// Cross-tab synchronization
	let broadcastChannel: BroadcastChannel | null = null

	function setupCrossTabSync() {
		if (typeof window === 'undefined' || !window.BroadcastChannel) return

		broadcastChannel = new BroadcastChannel('stonecrop-operation-log')

		broadcastChannel.addEventListener('message', (event: MessageEvent) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const rawMessage = event.data

			if (!rawMessage || typeof rawMessage !== 'object') return

			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			const message = deserializeFromBroadcast(rawMessage)

			// Ignore messages from this tab
			if (message.clientId === clientId.value) return

			if (message.type === 'operation' && message.operation) {
				// Add operation from another tab
				operations.value.push({ ...message.operation, source: 'sync' as OperationSource })
				currentIndex.value = operations.value.length - 1
			} else if (message.type === 'operation' && message.operations) {
				// Add batch operations from another tab
				operations.value.push(...message.operations.map(op => ({ ...op, source: 'sync' as OperationSource })))
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
		broadcastChannel.postMessage(serializeForBroadcast(message))
	}

	function broadcastBatch(childOps: HSTOperation[], batchOp: HSTOperation) {
		if (!broadcastChannel) return

		const message: CrossTabMessage = {
			type: 'operation',
			operations: [...childOps, batchOp],
			clientId: clientId.value,
			timestamp: new Date(),
		}
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
		broadcastChannel.postMessage(serializeForBroadcast(message))
	}

	// Persistence using VueUse
	type PersistedData = {
		operations: Array<Omit<HSTOperation, 'timestamp'> & { timestamp: string }>
		currentIndex: number
	}

	const persistedData = useLocalStorage<PersistedData | null>('stonecrop-ops-operations', null, {
		serializer: {
			read: (v: string) => {
				try {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const data = JSON.parse(v)
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
				// eslint-disable-next-line no-console
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
				// eslint-disable-next-line no-console
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

	// Server synchronization
	function setupServerSync() {
		if (!config.value.serverSyncEndpoint || !config.value.autoSyncInterval) return

		setInterval(async () => {
			try {
				const delta = createSyncDelta()
				if (delta.operations.length === 0) return

				const response = await fetch(config.value.serverSyncEndpoint!, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(delta),
				})

				if (response.ok) {
					lastSyncTimestamp.value = new Date()
				}
			} catch (error) {
				// Log error in development
				if (typeof console !== 'undefined') {
					// eslint-disable-next-line no-console
					console.error('Server sync failed:', error)
				}
			}
		}, config.value.autoSyncInterval)
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
		getOperationsSince,
		createSyncDelta,
		applySyncDelta,
		getSnapshot,
		markIrreversible,
	}
})
