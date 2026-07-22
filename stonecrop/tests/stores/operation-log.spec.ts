import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOperationLogStore } from '../../src/stores/operation-log'
import { createHST } from '../../src/stores/hst'
import type { HSTOperation } from '../../src/types/operation-log'

describe('Operation Log Store', { tags: ['unit'] }, () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	describe('Basic Operations', () => {
		it('should add an operation to the log', () => {
			const store = useOperationLogStore()

			const operationId = store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old Title',
				afterValue: 'New Title',
				doctype: 'task',
				recordId: '123',
				reversible: true,
			})

			expect(operationId).toBeDefined()
			expect(store.operations).toHaveLength(1)
			expect(store.currentIndex).toBe(0)
		})

		it('should track operation metadata correctly', () => {
			const store = useOperationLogStore()

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				recordId: '123',
				reversible: true,
			})

			const operation = store.operations[0]
			expect(operation.type).toBe('set')
			expect(operation.doctype).toBe('task')
			expect(operation.recordId).toBe('123')
			expect(operation.fieldname).toBe('title')
			expect(operation.beforeValue).toBe('Old')
			expect(operation.afterValue).toBe('New')
			expect(operation.reversible).toBe(true)
			expect(operation.timestamp).toBeInstanceOf(Date)
		})

		it('should detect DELETE operations when setting to undefined', () => {
			const store = useOperationLogStore()
			const data = { title: 'Test Task', status: 'active' }
			const hstStore = createHST({ task: { '123': data } }, 'StonecropStore')

			// Delete a record by setting to undefined
			hstStore.set('task.123', undefined)

			expect(store.operations).toHaveLength(1)
			const operation = store.operations[0]
			expect(operation.type).toBe('delete')
			expect(operation.beforeValue).toEqual(data)
			expect(operation.afterValue).toBe(undefined)
			expect(operation.reversible).toBe(true)
		})

		it('should track DELETE operations with correct metadata', () => {
			const store = useOperationLogStore()
			const recordData = { id: '123', title: 'Test Task', status: 'active' }
			const hstStore = createHST({ task: { '123': recordData } }, 'StonecropStore')

			// Delete record
			hstStore.set('task.123', undefined)

			const operation = store.operations[0]
			expect(operation.type).toBe('delete')
			expect(operation.doctype).toBe('task')
			expect(operation.recordId).toBe('123')
			expect(operation.path).toBe('task.123')
			expect(operation.beforeValue).toEqual(recordData)
			expect(operation.afterValue).toBe(undefined)
		})

		it('should NOT log as DELETE when setting undefined on non-existent path', () => {
			const store = useOperationLogStore()
			const hstStore = createHST({ task: {} }, 'StonecropStore')

			// Try to delete something that doesn't exist
			hstStore.set('task.999', undefined)

			expect(store.operations).toHaveLength(1)
			const operation = store.operations[0]
			// Should be SET since beforeValue was undefined
			expect(operation.type).toBe('set')
			expect(operation.beforeValue).toBe(undefined)
			expect(operation.afterValue).toBe(undefined)
		})

		it('should enforce max operations limit', () => {
			const store = useOperationLogStore()
			store.configure({ maxOperations: 3 })

			for (let i = 0; i < 5; i++) {
				store.addOperation({
					type: 'set',
					path: `task.${i}.title`,
					fieldname: 'title',
					beforeValue: `Old ${i}`,
					afterValue: `New ${i}`,
					doctype: 'task',
					recordId: `${i}`,
					reversible: true,
				})
			}

			expect(store.operations).toHaveLength(3)
			expect(store.currentIndex).toBe(2)
		})
	})

	describe('Undo/Redo', () => {
		it('should undo an operation', () => {
			const store = useOperationLogStore()
			const data = { title: 'Old Title' }
			const hstStore = createHST({ task: { '123': data } }, 'StonecropStore')

			// Make a change - this will automatically log the operation
			hstStore.set('task.123.title', 'New Title')

			expect(store.canUndo).toBe(true)
			expect(store.canRedo).toBe(false)
			expect(store.operations).toHaveLength(1)

			// Undo
			store.undo(hstStore)

			expect(hstStore.get('task.123.title')).toBe('Old Title')
			expect(store.currentIndex).toBe(-1)
			expect(store.canUndo).toBe(false)
			expect(store.canRedo).toBe(true)
		})

		it('should redo an operation', () => {
			const store = useOperationLogStore()
			const data = { title: 'Old Title' }
			const hstStore = createHST({ task: { '123': data } }, 'StonecropStore')

			// Add operation
			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old Title',
				afterValue: 'New Title',
				doctype: 'task',
				recordId: '123',
				reversible: true,
			})

			// Undo
			store.undo(hstStore)
			expect(hstStore.get('task.123.title')).toBe('Old Title')

			// Redo
			store.redo(hstStore)
			expect(hstStore.get('task.123.title')).toBe('New Title')
			expect(store.currentIndex).toBe(0)
			expect(store.canUndo).toBe(true)
			expect(store.canRedo).toBe(false)
		})

		it('should not undo irreversible operations', () => {
			const store = useOperationLogStore()
			const data = { status: 'draft' }
			const _hstStore = createHST({ task: { '123': data } }, 'StonecropStore')

			store.addOperation({
				type: 'set',
				path: 'task.123.status',
				fieldname: 'status',
				beforeValue: 'draft',
				afterValue: 'submitted',
				doctype: 'task',
				recordId: '123',
				reversible: false,
				irreversibleReason: 'Submitted to external system',
			})

			expect(store.canUndo).toBe(false)
		})

		it('should undo a DELETE operation and restore the record', () => {
			const store = useOperationLogStore()
			const recordData = { id: '123', title: 'Test Task', status: 'active' }
			const hstStore = createHST({ task: { '123': recordData } }, 'StonecropStore')

			// Delete the record
			hstStore.set('task.123', undefined)

			expect(store.operations).toHaveLength(1)
			expect(store.operations[0].type).toBe('delete')
			expect(hstStore.get('task.123')).toBe(undefined)

			// Undo the delete
			store.undo(hstStore)

			// Record should be restored
			expect(hstStore.get('task.123')).toEqual(recordData)
			expect(store.canUndo).toBe(false)
			expect(store.canRedo).toBe(true)
		})

		it('should redo a DELETE operation', () => {
			const store = useOperationLogStore()
			const recordData = { id: '123', title: 'Test Task' }
			const hstStore = createHST({ task: { '123': recordData } }, 'StonecropStore')

			// Delete the record
			hstStore.set('task.123', undefined)
			expect(hstStore.get('task.123')).toBe(undefined)

			// Undo the delete
			store.undo(hstStore)
			expect(hstStore.get('task.123')).toEqual(recordData)

			// Redo the delete
			store.redo(hstStore)
			expect(hstStore.get('task.123')).toBe(undefined)
			expect(store.canUndo).toBe(true)
			expect(store.canRedo).toBe(false)
		})
	})

	describe('Batch Operations', () => {
		it('should create a batch operation', () => {
			const store = useOperationLogStore()

			store.startBatch()

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old Title',
				afterValue: 'New Title',
				doctype: 'task',
				recordId: '123',
				reversible: true,
			})

			store.addOperation({
				type: 'set',
				path: 'task.123.status',
				fieldname: 'status',
				beforeValue: 'draft',
				afterValue: 'active',
				doctype: 'task',
				recordId: '123',
				reversible: true,
			})

			const batchId = store.commitBatch('Update task')

			expect(batchId).toBeDefined()
			// Should have 2 child operations + 1 batch operation
			expect(store.operations).toHaveLength(3)

			const batchOp = store.operations[2]
			expect(batchOp.type).toBe('batch')
			expect(batchOp.descendantOperationIds).toHaveLength(2)
		})

		it('should undo a batch as a single unit', () => {
			const store = useOperationLogStore()
			const data = { title: 'Old Title', status: 'draft' }
			const hstStore = createHST({ task: { '123': data } }, 'StonecropStore')

			// Start batch and make changes - these will be automatically logged
			store.startBatch()
			hstStore.set('task.123.title', 'New Title')
			hstStore.set('task.123.status', 'active')
			const batchId = store.commitBatch('Update task details')

			expect(batchId).toBeDefined()
			expect(hstStore.get('task.123.title')).toBe('New Title')
			expect(hstStore.get('task.123.status')).toBe('active')

			// Undo the batch - should revert both changes
			const result = store.undo(hstStore)

			expect(result).toBe(true)
			expect(hstStore.get('task.123.title')).toBe('Old Title')
			expect(hstStore.get('task.123.status')).toBe('draft')
		})
	})

	describe('Configuration', () => {
		it('should apply configuration', () => {
			const store = useOperationLogStore()

			store.configure({
				maxOperations: 50,
				enableCrossTabSync: false,
				enablePersistence: true,
			})

			expect(store.config.maxOperations).toBe(50)
			expect(store.config.enableCrossTabSync).toBe(false)
			expect(store.config.enablePersistence).toBe(true)
		})

		it('should filter operations', () => {
			const store = useOperationLogStore()

			store.configure({
				operationFilter: (op: HSTOperation) => op.doctype === 'task',
			})

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			store.addOperation({
				type: 'set',
				path: 'project.456.name',
				fieldname: 'name',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'project',
				reversible: true,
			})

			expect(store.operations).toHaveLength(1)
			expect(store.operations[0].doctype).toBe('task')
		})
	})

	describe('Utilities', () => {
		it('should get operations for a specific doctype', () => {
			const store = useOperationLogStore()

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				recordId: '123',
				reversible: true,
			})

			store.addOperation({
				type: 'set',
				path: 'project.456.name',
				fieldname: 'name',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'project',
				recordId: '456',
				reversible: true,
			})

			const taskOps = store.getOperationsFor('task')
			expect(taskOps).toHaveLength(1)
			expect(taskOps[0].doctype).toBe('task')

			const taskRecordOps = store.getOperationsFor('task', '123')
			expect(taskRecordOps).toHaveLength(1)
		})

		it('should get a snapshot', () => {
			const store = useOperationLogStore()

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			store.addOperation({
				type: 'set',
				path: 'task.123.status',
				fieldname: 'status',
				beforeValue: 'draft',
				afterValue: 'active',
				doctype: 'task',
				reversible: false,
			})

			const snapshot = store.getSnapshot()
			expect(snapshot.totalOperations).toBe(2)
			expect(snapshot.reversibleOperations).toBe(1)
			expect(snapshot.irreversibleOperations).toBe(1)
		})

		it('should mark operation as irreversible', () => {
			const store = useOperationLogStore()

			const opId = store.addOperation({
				type: 'set',
				path: 'task.123.status',
				fieldname: 'status',
				beforeValue: 'draft',
				afterValue: 'submitted',
				doctype: 'task',
				reversible: true,
			})

			expect(store.operations[0].reversible).toBe(true)

			store.markIrreversible(opId, 'Submitted to external API')

			expect(store.operations[0].reversible).toBe(false)
			expect(store.operations[0].irreversibleReason).toBe('Submitted to external API')
		})
	})

	describe('Undo/Redo State', () => {
		it('should track undo/redo state correctly', () => {
			const store = useOperationLogStore()

			expect(store.undoRedoState.canUndo).toBe(false)
			expect(store.undoRedoState.canRedo).toBe(false)
			expect(store.undoRedoState.undoCount).toBe(0)
			expect(store.undoRedoState.redoCount).toBe(0)

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			expect(store.undoRedoState.canUndo).toBe(true)
			expect(store.undoRedoState.undoCount).toBe(1)
		})
	})

	describe('Cross-Tab Sync', () => {
		let mockBroadcastChannel: {
			addEventListener: ReturnType<typeof vi.fn>
			postMessage: ReturnType<typeof vi.fn>
			close: ReturnType<typeof vi.fn>
			onmessage: ((event: MessageEvent) => void) | null
		}
		let messageHandlers: Map<string, (event: MessageEvent) => void>
		let originalBroadcastChannel: any

		beforeEach(() => {
			// Reset Pinia to ensure clean state
			setActivePinia(createPinia())

			// Save original BroadcastChannel
			originalBroadcastChannel = (global as any).BroadcastChannel

			// Mock BroadcastChannel
			messageHandlers = new Map()

			mockBroadcastChannel = {
				addEventListener: vi.fn((type: string, handler: (event: MessageEvent) => void) => {
					messageHandlers.set(type, handler)
				}),
				postMessage: vi.fn(),
				close: vi.fn(),
				onmessage: null,
			}

			// Create a proper constructor mock
			const BroadcastChannelMock = vi.fn(function (this: any) {
				return mockBroadcastChannel
			}) as any
			BroadcastChannelMock.prototype = {}
			;(global as any).BroadcastChannel = BroadcastChannelMock
		})

		afterEach(() => {
			// Restore original BroadcastChannel
			if (originalBroadcastChannel === undefined) {
				delete (global as any).BroadcastChannel
			} else {
				;(global as any).BroadcastChannel = originalBroadcastChannel
			}

			// Clean up message handlers
			messageHandlers.clear()

			// Reset Pinia again to clean up any lingering state
			setActivePinia(createPinia())
		})

		it('should setup BroadcastChannel when enabled', () => {
			const store = useOperationLogStore()

			store.configure({
				enableCrossTabSync: true,
			})

			// Add an operation to trigger broadcast setup
			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			expect(mockBroadcastChannel.addEventListener).toHaveBeenCalledWith('message', expect.any(Function))
		})

		it('should not setup BroadcastChannel when disabled', () => {
			const store = useOperationLogStore()

			store.configure({
				enableCrossTabSync: false,
			})

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			expect(mockBroadcastChannel.addEventListener).not.toHaveBeenCalled()
		})

		it('should broadcast operations to other tabs', () => {
			const store = useOperationLogStore()

			store.configure({
				enableCrossTabSync: true,
			})

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			expect(mockBroadcastChannel.postMessage).toHaveBeenCalled()

			// Verify message structure
			const message = mockBroadcastChannel.postMessage.mock.calls[0][0]
			expect(message).toHaveProperty('type', 'operation')
			expect(message).toHaveProperty('operation')
			expect(message).toHaveProperty('clientId')
			expect(message).toHaveProperty('timestamp')
			expect(message.operation).toHaveProperty('type', 'set')
			expect(message.operation).toHaveProperty('path', 'task.123.title')
		})

		it('should receive operations from other tabs', () => {
			const store = useOperationLogStore()

			store.configure({
				enableCrossTabSync: true,
			})

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			const initialCount = store.operations.length

			// Simulate receiving a message from another tab
			const messageHandler = messageHandlers.get('message')
			expect(messageHandler).toBeDefined()

			const incomingMessage = {
				type: 'operation',
				clientId: 'different-client-id',
				timestamp: new Date().toISOString(),
				operation: {
					id: 'op-2',
					type: 'set',
					path: 'task.456.status',
					fieldname: 'status',
					beforeValue: 'open',
					afterValue: 'closed',
					doctype: 'task',
					recordId: '456',
					reversible: true,
					timestamp: new Date().toISOString(),
					source: 'user',
				},
			}

			messageHandler!(new MessageEvent('message', { data: incomingMessage }))

			// Should add the operation from the other tab
			expect(store.operations.length).toBe(initialCount + 1)
			const addedOp = store.operations[store.operations.length - 1]
			expect(addedOp.path).toBe('task.456.status')
			expect(addedOp.source).toBe('sync')
		})

		it('should ignore messages from the same client', () => {
			const store = useOperationLogStore()

			store.configure({
				enableCrossTabSync: true,
			})

			// Add operation to trigger setup and get clientId
			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			const initialCount = store.operations.length

			// Get the broadcast message to extract clientId
			const broadcastMessage = mockBroadcastChannel.postMessage.mock.calls[0][0]
			const clientId = broadcastMessage.clientId

			// Simulate receiving a message from the same client
			const messageHandler = messageHandlers.get('message')
			const incomingMessage = {
				type: 'operation',
				clientId: clientId, // Same client ID
				timestamp: new Date().toISOString(),
				operation: {
					id: 'op-2',
					type: 'set',
					path: 'task.456.status',
					fieldname: 'status',
					beforeValue: 'open',
					afterValue: 'closed',
					doctype: 'task',
					reversible: true,
					timestamp: new Date().toISOString(),
					source: 'user',
				},
			}

			messageHandler!(new MessageEvent('message', { data: incomingMessage }))

			// Should NOT add the operation (same client)
			expect(store.operations.length).toBe(initialCount)
		})

		it('should serialize and deserialize Date objects correctly', () => {
			const store = useOperationLogStore()

			store.configure({
				enableCrossTabSync: true,
			})

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			// Check that the broadcast message has serialized timestamps
			const message = mockBroadcastChannel.postMessage.mock.calls[0][0]
			expect(typeof message.timestamp).toBe('string')
			expect(typeof message.operation.timestamp).toBe('string')

			// Verify it's a valid ISO string
			expect(() => new Date(message.timestamp)).not.toThrow()
			expect(() => new Date(message.operation.timestamp)).not.toThrow()
		})

		it('should broadcast batch operations correctly', () => {
			const store = useOperationLogStore()

			store.configure({
				enableCrossTabSync: true,
			})

			store.startBatch()

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			store.addOperation({
				type: 'set',
				path: 'task.123.status',
				fieldname: 'status',
				beforeValue: 'open',
				afterValue: 'closed',
				doctype: 'task',
				reversible: true,
			})

			store.commitBatch()

			// Should have broadcast the batch
			expect(mockBroadcastChannel.postMessage).toHaveBeenCalled()

			// Find the batch broadcast (last call)
			const calls = mockBroadcastChannel.postMessage.mock.calls
			const batchMessage = calls[calls.length - 1][0]

			expect(batchMessage.type).toBe('operation')
			expect(batchMessage.operations).toBeDefined()
			expect(batchMessage.operations.length).toBeGreaterThan(2) // 2 child ops + 1 batch op
		})

		it('should receive batch operations from other tabs', () => {
			const store = useOperationLogStore()

			store.configure({
				enableCrossTabSync: true,
			})

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			const initialCount = store.operations.length

			// Simulate receiving batch operations from another tab
			const messageHandler = messageHandlers.get('message')

			const incomingMessage = {
				type: 'operation',
				clientId: 'different-client-id',
				timestamp: new Date().toISOString(),
				operations: [
					{
						id: 'op-2',
						type: 'set',
						path: 'task.456.title',
						fieldname: 'title',
						beforeValue: 'A',
						afterValue: 'B',
						doctype: 'task',
						reversible: true,
						timestamp: new Date().toISOString(),
						source: 'user',
					},
					{
						id: 'op-3',
						type: 'set',
						path: 'task.456.status',
						fieldname: 'status',
						beforeValue: 'open',
						afterValue: 'closed',
						doctype: 'task',
						reversible: true,
						timestamp: new Date().toISOString(),
						source: 'user',
					},
					{
						id: 'batch-1',
						type: 'batch',
						label: 'Batch update',
						descendantOperationIds: ['op-2', 'op-3'],
						doctype: 'task',
						reversible: true,
						timestamp: new Date().toISOString(),
						source: 'user',
					},
				],
			}

			messageHandler!(new MessageEvent('message', { data: incomingMessage }))

			// Should add all operations from the batch
			expect(store.operations.length).toBe(initialCount + 3)
			expect(store.operations[store.operations.length - 1].type).toBe('batch')
		})

		it('should handle malformed messages gracefully', () => {
			const store = useOperationLogStore()

			store.configure({
				enableCrossTabSync: true,
			})

			// Trigger setup
			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			const initialCount = store.operations.length
			const messageHandler = messageHandlers.get('message')

			// Test various malformed messages
			const malformedMessages = [
				null,
				undefined,
				'string',
				123,
				{}, // Missing required fields
				{ type: 'unknown' }, // Unknown type
				{ type: 'operation' }, // Missing operation/operations
			]

			malformedMessages.forEach(message => {
				messageHandler!(new MessageEvent('message', { data: message }))
			})

			// Should not crash and should not add any operations
			expect(store.operations.length).toBe(initialCount)
		})

		it('should work when BroadcastChannel is not available', () => {
			delete (global as any).BroadcastChannel

			const store = useOperationLogStore()

			store.configure({
				enableCrossTabSync: true,
			})

			// Should not crash when BroadcastChannel is unavailable
			expect(() => {
				store.addOperation({
					type: 'set',
					path: 'task.123.title',
					fieldname: 'title',
					beforeValue: 'Old',
					afterValue: 'New',
					doctype: 'task',
					reversible: true,
				})
			}).not.toThrow()
		})

		it('should broadcast undo to other tabs', () => {
			const store = useOperationLogStore()

			store.configure({
				enableCrossTabSync: true,
			})

			// Add and then undo an operation
			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			const hstStore = createHST({ task: { '123': { title: 'New' } } }, 'StonecropStore')
			store.undo(hstStore)

			// Find the undo broadcast
			const calls = mockBroadcastChannel.postMessage.mock.calls
			const undoCall = calls.find((call: any) => call[0].type === 'undo')
			expect(undoCall).toBeDefined()
			expect(undoCall![0].type).toBe('undo')
			expect(undoCall![0].operation).toBeDefined()
		})

		it('should broadcast redo to other tabs', () => {
			const store = useOperationLogStore()

			store.configure({
				enableCrossTabSync: true,
			})

			// Add, undo, then redo an operation
			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			const hstStore = createHST({ task: { '123': { title: 'New' } } }, 'StonecropStore')
			store.undo(hstStore)
			store.redo(hstStore)

			// Find the redo broadcast
			const calls = mockBroadcastChannel.postMessage.mock.calls
			const redoCall = calls.find((call: any) => call[0].type === 'redo')
			expect(redoCall).toBeDefined()
			expect(redoCall![0].type).toBe('redo')
			expect(redoCall![0].operation).toBeDefined()
		})
	})

	describe('Batch Operation Edge Cases', () => {
		it('should cancel a batch without committing', () => {
			const store = useOperationLogStore()

			store.startBatch()

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			store.cancelBatch()

			// No operations should be added
			expect(store.operations).toHaveLength(0)
			expect(store.currentIndex).toBe(-1)
		})

		it('should handle empty batch commit', () => {
			const store = useOperationLogStore()

			store.startBatch()
			const batchId = store.commitBatch()

			// Should return null for empty batch
			expect(batchId).toBeNull()
			expect(store.operations).toHaveLength(0)
		})

		it('should create irreversible batch when any child is irreversible', () => {
			const store = useOperationLogStore()

			store.startBatch()

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			store.addOperation({
				type: 'set',
				path: 'task.123.status',
				fieldname: 'status',
				beforeValue: 'draft',
				afterValue: 'submitted',
				doctype: 'task',
				reversible: false, // Irreversible
			})

			const _batchId = store.commitBatch('Mixed batch')

			const batchOp = store.operations.find(op => op.type === 'batch')
			expect(batchOp?.reversible).toBe(false)
			expect(batchOp?.irreversibleReason).toBe('Contains irreversible operations')
		})

		it('should undo batch with mixed reversible children', () => {
			const store = useOperationLogStore()
			const data = { title: 'Old', status: 'draft' }
			const hstStore = createHST({ task: { '123': data } }, 'StonecropStore')

			store.startBatch()

			// Add mixed reversible/irreversible operations
			hstStore.set('task.123.title', 'New Title') // reversible by default
			hstStore.set('task.123.status', 'submitted') // would be irreversible in real scenario

			// Manually add another operation to the batch
			store.addOperation({
				type: 'set',
				path: 'task.123.description',
				fieldname: 'description',
				beforeValue: '',
				afterValue: 'Test description',
				doctype: 'task',
				reversible: true,
			})

			store.commitBatch()

			// Should be able to undo - batch itself is reversible
			expect(store.canUndo).toBe(true)
			expect(store.operations.length).toBe(4) // 3 ops + 1 batch

			// Verify HST values before undo
			expect(hstStore.get('task.123.title')).toBe('New Title')
			expect(hstStore.get('task.123.status')).toBe('submitted')

			store.undo(hstStore)

			// Batch should be undone (currentIndex points to last child)
			expect(store.currentIndex).toBe(2)
			// After undoing batch, canRedo should be true (we can redo the batch)
			expect(store.canRedo).toBe(true)
		})
	})

	describe('Undo/Redo Edge Cases', () => {
		it('should not redo when nothing to redo', () => {
			const store = useOperationLogStore()
			const data = { title: 'Test' }
			const hstStore = createHST({ task: { '123': data } }, 'StonecropStore')

			// Add an operation
			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			expect(store.canRedo).toBe(false)

			const result = store.redo(hstStore)
			expect(result).toBe(false)
		})

		it('should not undo when nothing to undo', () => {
			const store = useOperationLogStore()

			expect(store.canUndo).toBe(false)

			const hstStore = createHST({ task: { '123': {} } }, 'StonecropStore')
			const result = store.undo(hstStore)
			expect(result).toBe(false)
		})

		it('should handle undo failure gracefully', () => {
			const store = useOperationLogStore()
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			// Create an HST store without proper set method to trigger error path
			const brokenStore = {
				get: () => 'value',
				set: vi.fn(() => {
					throw new Error('Undo failed')
				}),
			} as any

			const result = store.undo(brokenStore)
			expect(result).toBe(false)
			consoleSpy.mockRestore()
		})

		it('should handle redo failure gracefully', () => {
			const store = useOperationLogStore()
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			store.undo(createHST({ task: { '123': { title: 'Old' } } }, 'StonecropStore'))

			// Create a broken store to trigger error
			const brokenStore = {
				get: () => 'value',
				set: vi.fn(() => {
					throw new Error('Redo failed')
				}),
			} as any

			const result = store.redo(brokenStore)
			expect(result).toBe(false)
			consoleSpy.mockRestore()
		})

		it('should track consecutive undo/redo operations', () => {
			const store = useOperationLogStore()
			const data = { title: 'Title 1' }
			const hstStore = createHST({ task: { '123': data } }, 'StonecropStore')

			// Add multiple operations
			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Title 1',
				afterValue: 'Title 2',
				doctype: 'task',
				reversible: true,
			})

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Title 2',
				afterValue: 'Title 3',
				doctype: 'task',
				reversible: true,
			})

			expect(store.undoRedoState.undoCount).toBe(2)

			// Undo twice
			store.undo(hstStore)
			expect(hstStore.get('task.123.title')).toBe('Title 2')

			store.undo(hstStore)
			expect(hstStore.get('task.123.title')).toBe('Title 1')

			expect(store.undoRedoState.redoCount).toBe(2)

			// Redo twice
			store.redo(hstStore)
			expect(hstStore.get('task.123.title')).toBe('Title 2')

			store.redo(hstStore)
			expect(hstStore.get('task.123.title')).toBe('Title 3')
		})
	})

	describe('logAction', () => {
		it('should log action with multiple record IDs', () => {
			const store = useOperationLogStore()

			const opId = store.logAction('task', 'submit', ['task-1', 'task-2', 'task-3'], 'success')

			expect(opId).toBeDefined()
			expect(store.operations).toHaveLength(1)

			const op = store.operations[0]
			expect(op.type).toBe('action')
			expect(op.doctype).toBe('task')
			expect(op.actionName).toBe('submit')
			expect(op.actionRecordIds).toEqual(['task-1', 'task-2', 'task-3'])
			expect(op.actionResult).toBe('success')
			expect(op.reversible).toBe(false)
		})

		it('should log action without record ID', () => {
			const store = useOperationLogStore()

			const opId = store.logAction('task', 'print', undefined, 'success')

			expect(opId).toBeDefined()
			const op = store.operations[0]
			expect(op.path).toBe('task')
			expect(op.recordId).toBeUndefined()
		})

		it('should log failed action with error', () => {
			const store = useOperationLogStore()

			store.logAction('task', 'submit', ['task-1'], 'failure', 'Network error')

			const op = store.operations[0]
			expect(op.actionResult).toBe('failure')
			expect(op.actionError).toBe('Network error')
		})

		it('should log pending action', () => {
			const store = useOperationLogStore()

			store.logAction('task', 'submit', ['task-1'], 'pending')

			const op = store.operations[0]
			expect(op.actionResult).toBe('pending')
		})
	})

	describe('Clear and Reset', () => {
		it('should clear all operations', () => {
			const store = useOperationLogStore()

			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			store.addOperation({
				type: 'set',
				path: 'task.456.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				doctype: 'task',
				reversible: true,
			})

			expect(store.operations).toHaveLength(2)

			store.clear()

			expect(store.operations).toHaveLength(0)
			expect(store.currentIndex).toBe(-1)
			expect(store.canUndo).toBe(false)
			expect(store.canRedo).toBe(false)
		})
	})

	describe('New operations after undo', () => {
		it('should remove redo operations when adding new operation', () => {
			const store = useOperationLogStore()

			// Add first operation
			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Title 1',
				afterValue: 'Title 2',
				doctype: 'task',
				reversible: true,
			})

			// Add second operation
			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Title 2',
				afterValue: 'Title 3',
				doctype: 'task',
				reversible: true,
			})

			// Undo the second operation
			const hstStore = createHST({ task: { '123': { title: 'Title 3' } } }, 'StonecropStore')
			store.undo(hstStore)

			expect(store.canRedo).toBe(true)
			expect(store.undoRedoState.redoCount).toBe(1)

			// Add a new operation - this should invalidate the redo
			store.addOperation({
				type: 'set',
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Title 2',
				afterValue: 'Title 4',
				doctype: 'task',
				reversible: true,
			})

			// Redo should now be cleared
			expect(store.canRedo).toBe(false)
			expect(store.undoRedoState.redoCount).toBe(0)
		})
	})
})
