/**
 * Type of HST operation
 * @public
 */
export type HSTOperationType = 'set' | 'delete' | 'batch' | 'transition' | 'action'

/**
 * Operation source - where the change originated
 * @public
 */
export type OperationSource = 'user' | 'system' | 'sync' | 'undo' | 'redo'

/**
 * Complete metadata for an HST mutation
 * Enables time travel, synchronization, and audit trails
 * @public
 */
export interface HSTOperation {
	/** Unique operation identifier */
	id: string

	/** Type of operation performed */
	type: HSTOperationType

	/** Full HST path affected (e.g., "task.123.title") */
	path: string

	/** Field name extracted from path */
	fieldname: string

	/** Value before the operation */
	beforeValue: any

	/** Value after the operation */
	afterValue: any

	/** Doctype this operation affects */
	doctype: string

	/** Record ID if applicable */
	recordId?: string

	/** Timestamp of the operation */
	timestamp: Date

	/** Source of the operation (defaults to 'user' if not specified) */
	source?: OperationSource

	/** Whether this operation can be undone */
	reversible: boolean

	/** Reason if operation is irreversible */
	irreversibleReason?: string

	/** XState transition name if triggered by FSM */
	transition?: string

	/** XState current state before transition */
	currentState?: string

	/** XState target state after transition */
	targetState?: string

	/** Action name if operation is an action execution (type: 'action') */
	actionName?: string

	/** Record IDs that the action was executed on */
	actionRecordIds?: string[]

	/** Result or status of the action execution */
	actionResult?: 'success' | 'failure' | 'pending'

	/** Error message if action execution failed */
	actionError?: string

	/** User or session identifier */
	userId?: string

	/** Additional metadata for custom use cases */
	metadata?: Record<string, any>

	/** Ancestor operation ID for batch operations */
	ancestorOperationId?: string

	/** Descendant operation IDs for batch operations */
	descendantOperationIds?: string[]
}

/**
 * Input type for adding operations
 * Excludes system-generated fields (id, timestamp)
 * @public
 */
export type HSTOperationInput = Omit<HSTOperation, 'id' | 'timestamp' | 'source'> & {
	source?: OperationSource
}

/**
 * Batch operation wrapper
 * @public
 */
export interface BatchOperation {
	/** Unique batch identifier */
	id: string
	/** Operations included in this batch */
	operations: HSTOperation[]
	/** When the batch was created */
	timestamp: Date
	/** Optional description of what this batch represents */
	description?: string
	/** Whether the entire batch can be undone */
	reversible: boolean
}

/**
 * Operation log configuration
 * @public
 */
export interface OperationLogConfig {
	/** Maximum operations to store (default: 100) */
	maxOperations?: number

	/** Enable cross-tab synchronization (default: true) */
	enableCrossTabSync?: boolean

	/** Auto-sync interval in milliseconds (default: 30000) */
	autoSyncInterval?: number

	/** Enable operation persistence to localStorage (default: false) */
	enablePersistence?: boolean

	/** Persistence key prefix */
	persistenceKeyPrefix?: string

	/** User identifier for multi-user scenarios */
	userId?: string

	/** Custom operation filter */
	operationFilter?: (operation: HSTOperation) => boolean
}

/**
 * Undo/Redo state
 * @public
 */
export interface UndoRedoState {
	/** Can undo */
	canUndo: boolean

	/** Can redo */
	canRedo: boolean

	/** Number of operations available for undo */
	undoCount: number

	/** Number of operations available for redo */
	redoCount: number

	/** Current operation index */
	currentIndex: number
}

/**
 * Operation log snapshot for debugging
 * @public
 */
export interface OperationLogSnapshot {
	/** All operations in the log */
	operations: HSTOperation[]
	/** Current operation index in the history */
	currentIndex: number
	/** Total number of operations */
	totalOperations: number
	/** Number of operations that can be undone */
	reversibleOperations: number
	/** Number of operations that cannot be undone */
	irreversibleOperations: number
	/** Timestamp of the oldest operation */
	oldestOperation?: Date
	/** Timestamp of the newest operation */
	newestOperation?: Date
}

/**
 * Cross-tab message types
 * @public
 */
export type CrossTabMessageType = 'operation' | 'undo' | 'redo' | 'sync-request' | 'sync-response'

/**
 * Cross-tab message payload
 * @public
 */
export interface CrossTabMessage {
	/** Type of cross-tab message */
	type: CrossTabMessageType
	/** Single operation for operation/undo/redo messages */
	operation?: HSTOperation
	/** Multiple operations for sync messages */
	operations?: HSTOperation[]
	/** Identifier of the client/tab sending the message */
	clientId: string
	/** When the message was sent */
	timestamp: Date
}
