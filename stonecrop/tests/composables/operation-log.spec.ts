import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import { useOperationLog, useUndoRedoShortcuts, withBatch } from '../../src/composables/operation-log'
import { createHST } from '../../src/stores/hst'
import type { HSTNode } from '../../src/stores/hst'

describe('Operation Log Composable', { tags: ['unit'] }, () => {
	let hstStore: HSTNode

	beforeEach(() => {
		setActivePinia(createPinia())
		const data = { title: 'Initial Title', status: 'draft', priority: 'low' }
		hstStore = createHST({ task: { '123': data } }, 'StonecropStore')
	})

	describe('useOperationLog', () => {
		it('should provide access to operation log state', () => {
			const { operations, currentIndex, canUndo, canRedo, undoCount, redoCount, undoRedoState } = useOperationLog()

			expect(operations.value).toEqual([])
			expect(currentIndex.value).toBe(-1)
			expect(canUndo.value).toBe(false)
			expect(canRedo.value).toBe(false)
			expect(undoCount.value).toBe(0)
			expect(redoCount.value).toBe(0)
			expect(undoRedoState.value).toEqual({
				canUndo: false,
				canRedo: false,
				undoCount: 0,
				redoCount: 0,
				currentIndex: -1,
			})
		})

		it('should configure the operation log', () => {
			const { configure } = useOperationLog()

			configure({
				maxOperations: 25,
				enableCrossTabSync: false,
				enablePersistence: true,
			})

			const { undoRedoState } = useOperationLog()
			expect(undoRedoState.value).toBeDefined()
		})

		it('should pass configuration on initialization', () => {
			const { operations } = useOperationLog({
				maxOperations: 10,
				enableCrossTabSync: false,
			})

			// Add more than 10 operations to test max limit
			for (let i = 0; i < 15; i++) {
				hstStore.set(`task.123.field${i}`, `value${i}`)
			}

			// Should be limited to 10 operations
			expect(operations.value.length).toBeLessThanOrEqual(10)
		})

		it('should undo an operation', () => {
			const { undo, canUndo, currentIndex } = useOperationLog()

			hstStore.set('task.123.title', 'New Title')

			expect(canUndo.value).toBe(true)
			expect(currentIndex.value).toBe(0)

			const result = undo(hstStore)

			expect(result).toBe(true)
			expect(hstStore.get('task.123.title')).toBe('Initial Title')
			expect(currentIndex.value).toBe(-1)
			expect(canUndo.value).toBe(false)
		})

		it('should redo an operation', () => {
			const { undo, redo, canRedo, currentIndex } = useOperationLog()

			hstStore.set('task.123.title', 'New Title')
			undo(hstStore)

			expect(canRedo.value).toBe(true)

			const result = redo(hstStore)

			expect(result).toBe(true)
			expect(hstStore.get('task.123.title')).toBe('New Title')
			expect(currentIndex.value).toBe(0)
			expect(canRedo.value).toBe(false)
		})

		it('should handle batch operations', () => {
			const { startBatch, commitBatch, operations } = useOperationLog()

			startBatch()
			hstStore.set('task.123.title', 'Batch Title')
			hstStore.set('task.123.status', 'active')
			const batchId = commitBatch('Update task')

			expect(batchId).toBeDefined()
			expect(batchId).not.toBeNull()
			// Should have 2 child operations + 1 batch operation
			expect(operations.value.length).toBe(3)

			// Find the batch operation
			const batchOp = operations.value.find(op => op.type === 'batch')
			expect(batchOp).toBeDefined()
			expect(batchOp?.descendantOperationIds?.length).toBe(2)
		})

		it('should cancel a batch', () => {
			const { startBatch, cancelBatch, operations } = useOperationLog()

			const initialCount = operations.value.length

			startBatch()
			hstStore.set('task.123.title', 'Canceled Title')
			cancelBatch()

			// Operations should not have been added to the log
			expect(operations.value.length).toBe(initialCount)
		})

		it('should clear all operations', () => {
			const { clear, operations, currentIndex } = useOperationLog()

			hstStore.set('task.123.title', 'Title 1')
			hstStore.set('task.123.status', 'active')

			expect(operations.value.length).toBe(2)

			clear()

			expect(operations.value.length).toBe(0)
			expect(currentIndex.value).toBe(-1)
		})

		it('should get operations for a specific doctype', () => {
			const { getOperationsFor } = useOperationLog()

			hstStore.set('task.123.title', 'Task Title')
			hstStore.set('task.123.status', 'active')

			const taskOps = getOperationsFor('task')
			expect(taskOps.length).toBe(2)
			expect(taskOps.every(op => op.doctype === 'task')).toBe(true)
		})

		it('should get operations for a specific record', () => {
			const { getOperationsFor } = useOperationLog()

			// Add another record to the HST
			hstStore.set('task.456', {
				id: '456',
				title: 'Initial',
				description: 'Task 456',
				status: 'todo',
				priority: 'low',
			})

			hstStore.set('task.123.title', 'Task 123')
			hstStore.set('task.456.title', 'Task 456')

			const record123Ops = getOperationsFor('task', '123')
			expect(record123Ops.length).toBe(1)
			expect(record123Ops[0].recordId).toBe('123')
		})

		it('should get a snapshot', () => {
			const { getSnapshot } = useOperationLog()

			hstStore.set('task.123.title', 'Snapshot Test')

			const snapshot = getSnapshot()

			expect(snapshot).toHaveProperty('operations')
			expect(snapshot).toHaveProperty('currentIndex')
			expect(snapshot).toHaveProperty('totalOperations')
			expect(snapshot).toHaveProperty('reversibleOperations')
			expect(snapshot).toHaveProperty('irreversibleOperations')
			expect(snapshot.operations.length).toBe(1)
			expect(snapshot.totalOperations).toBe(1)
		})

		it('should mark an operation as irreversible', () => {
			const { markIrreversible, operations } = useOperationLog()

			hstStore.set('task.123.status', 'published')

			const opId = operations.value[0].id

			markIrreversible(opId, 'Cannot unpublish')
			const operation = operations.value.find(op => op.id === opId)
			expect(operation?.reversible).toBe(false)
			expect(operation?.irreversibleReason).toBe('Cannot unpublish')
		})

		it('should update undo/redo counts correctly', () => {
			const { undo, undoCount, redoCount } = useOperationLog()

			hstStore.set('task.123.title', 'Count 1')
			hstStore.set('task.123.status', 'Count 2')

			expect(undoCount.value).toBe(2)
			expect(redoCount.value).toBe(0)

			undo(hstStore)

			expect(undoCount.value).toBe(1)
			expect(redoCount.value).toBe(1)

			undo(hstStore)

			expect(undoCount.value).toBe(0)
			expect(redoCount.value).toBe(2)
		})
	})

	describe('useUndoRedoShortcuts', () => {
		it('should setup keyboard shortcuts for undo/redo', async () => {
			const { undo, _redo, canUndo, canRedo } = useOperationLog()

			hstStore.set('task.123.title', 'Shortcut Test')

			// Initialize shortcuts
			useUndoRedoShortcuts(hstStore)

			// Wait for Vue to set up watchers
			await nextTick()

			// Verify we can undo (shortcuts are set up)
			expect(canUndo.value).toBe(true)
			expect(canRedo.value).toBe(false)

			// Manually trigger undo to verify the integration works
			undo(hstStore)
			await nextTick()

			expect(hstStore.get('task.123.title')).toBe('Initial Title')
			expect(canUndo.value).toBe(false)
			expect(canRedo.value).toBe(true)
		})

		it('should handle redo shortcuts', async () => {
			const { undo, redo, canRedo } = useOperationLog()

			hstStore.set('task.123.title', 'Redo Test')

			useUndoRedoShortcuts(hstStore)
			await nextTick()

			// Undo first
			undo(hstStore)
			await nextTick()

			expect(canRedo.value).toBe(true)

			// Manually trigger redo
			redo(hstStore)
			await nextTick()

			expect(hstStore.get('task.123.title')).toBe('Redo Test')
		})

		it('should respect the enabled parameter', () => {
			const { canUndo } = useOperationLog()

			hstStore.set('task.123.title', 'Disabled Test')

			// Initialize with disabled shortcuts
			useUndoRedoShortcuts(hstStore, false)

			expect(canUndo.value).toBe(true)

			// Shortcuts should not be registered, so this would be a no-op
			// (We can't easily test this without mocking useMagicKeys, but we verify it doesn't crash)
		})

		it('should handle Mac keyboard shortcuts', async () => {
			const { undo, canUndo } = useOperationLog()

			hstStore.set('task.123.title', 'Mac Test')

			useUndoRedoShortcuts(hstStore)
			await nextTick()

			// Verify shortcuts are set up by checking state
			expect(canUndo.value).toBe(true)

			// Manually trigger undo (simulating what Cmd+Z would do)
			undo(hstStore)
			await nextTick()

			expect(hstStore.get('task.123.title')).toBe('Initial Title')
		})
	})

	describe('withBatch', () => {
		it('should execute function within a batch', async () => {
			const { operations } = useOperationLog()

			const batchId = await withBatch(() => {
				hstStore.set('task.123.title', 'Batch Title')
				hstStore.set('task.123.status', 'active')
				hstStore.set('task.123.priority', 'high')
			}, 'Update all fields')

			expect(batchId).toBeDefined()
			expect(batchId).not.toBeNull()

			// Should have 3 child operations + 1 batch operation
			expect(operations.value.length).toBe(4)

			const batchOp = operations.value.find(op => op.type === 'batch')
			expect(batchOp).toBeDefined()
			expect(batchOp?.descendantOperationIds?.length).toBe(3)
			expect(batchOp?.metadata?.description).toBe('Update all fields')
		})

		it('should handle async functions', async () => {
			const { operations } = useOperationLog()

			const batchId = await withBatch(async () => {
				await new Promise(resolve => setTimeout(resolve, 10))
				hstStore.set('task.123.title', 'Async Title')
				await new Promise(resolve => setTimeout(resolve, 10))
				hstStore.set('task.123.status', 'active')
			})

			expect(batchId).toBeDefined()
			expect(operations.value.length).toBe(3) // 2 operations + 1 batch
		})

		it('should cancel batch on error', async () => {
			const { operations } = useOperationLog()

			const initialCount = operations.value.length

			await expect(
				withBatch(() => {
					hstStore.set('task.123.title', 'Error Title')
					throw new Error('Test error')
				})
			).rejects.toThrow('Test error')

			// Batch should be canceled, no operations added
			expect(operations.value.length).toBe(initialCount)
		})

		it('should handle async errors', async () => {
			const { operations } = useOperationLog()

			const initialCount = operations.value.length

			await expect(
				withBatch(async () => {
					hstStore.set('task.123.title', 'Async Error')
					await new Promise((_, reject) => setTimeout(() => reject(new Error('Async error')), 10))
				})
			).rejects.toThrow('Async error')

			expect(operations.value.length).toBe(initialCount)
		})

		it('should work without description', async () => {
			const { operations } = useOperationLog()

			const batchId = await withBatch(() => {
				hstStore.set('task.123.title', 'No Description')
			})

			expect(batchId).toBeDefined()
			expect(operations.value.length).toBe(2) // 1 operation + 1 batch

			const batchOp = operations.value.find(op => op.type === 'batch')
			expect(batchOp?.metadata?.description).toBeUndefined()
		})

		it('should allow nested changes', async () => {
			const { operations } = useOperationLog()

			const batchId = await withBatch(() => {
				hstStore.set('task.123.title', 'Parent Title')

				// Nested function that also modifies data
				const updateStatus = () => {
					hstStore.set('task.123.status', 'active')
				}
				updateStatus()

				hstStore.set('task.123.priority', 'high')
			}, 'Complex update')

			expect(batchId).toBeDefined()
			// Should have all operations in a single batch
			const batchOp = operations.value.find(op => op.type === 'batch')
			expect(batchOp?.descendantOperationIds?.length).toBe(3)
		})
	})

	describe('Integration scenarios', () => {
		it('should handle complex workflow with batch, undo, and redo', async () => {
			const { undo, redo, canUndo, canRedo, operations, currentIndex } = useOperationLog()

			// Make initial change
			hstStore.set('task.123.title', 'Step 1')
			expect(operations.value.length).toBe(1)
			expect(currentIndex.value).toBe(0)

			// Make batch changes
			const batchId = await withBatch(() => {
				hstStore.set('task.123.status', 'active')
				hstStore.set('task.123.priority', 'high')
			}, 'Batch update')

			expect(batchId).toBeDefined()
			// Operations array: [0: initial, 1: child1, 2: child2, 3: batch]
			expect(operations.value.length).toBe(4)
			expect(currentIndex.value).toBe(3) // At the batch operation

			// Undo the batch
			const undoResult = undo(hstStore)
			expect(undoResult).toBe(true)
			expect(hstStore.get('task.123.status')).toBe('draft')
			expect(hstStore.get('task.123.priority')).toBe('low')
			expect(currentIndex.value).toBe(2) // Moved back one (to child2, but batch is undone)

			// Redo the batch
			const redoResult = redo(hstStore)
			expect(redoResult).toBe(true)
			expect(hstStore.get('task.123.status')).toBe('active')
			expect(hstStore.get('task.123.priority')).toBe('high')
			expect(currentIndex.value).toBe(3) // Back at the batch

			// Now undo everything - need to undo batch + 2 child ops + 1 initial
			undo(hstStore) // Undo batch (at index 3, now at 2)
			expect(hstStore.get('task.123.status')).toBe('draft')
			expect(currentIndex.value).toBe(2)

			undo(hstStore) // Undo child op at index 2 (now at 1)
			expect(currentIndex.value).toBe(1)

			undo(hstStore) // Undo child op at index 1 (now at 0)
			expect(currentIndex.value).toBe(0)

			undo(hstStore) // Undo initial change at index 0 (now at -1)
			expect(currentIndex.value).toBe(-1)
			expect(hstStore.get('task.123.title')).toBe('Initial Title')
			expect(canUndo.value).toBe(false)
			expect(canRedo.value).toBe(true)
		})

		it('should track state correctly across multiple operations', () => {
			const { undoRedoState, undo } = useOperationLog()

			// Make several changes
			hstStore.set('task.123.title', 'Change 1')
			hstStore.set('task.123.status', 'active')
			hstStore.set('task.123.priority', 'high')

			expect(undoRedoState.value).toEqual({
				canUndo: true,
				canRedo: false,
				undoCount: 3,
				redoCount: 0,
				currentIndex: 2,
			})

			undo(hstStore)

			expect(undoRedoState.value).toEqual({
				canUndo: true,
				canRedo: true,
				undoCount: 2,
				redoCount: 1,
				currentIndex: 1,
			})
		})

		it('should handle configuration changes mid-operation', () => {
			const { configure, operations } = useOperationLog()

			// Make some changes
			hstStore.set('task.123.title', 'Config Test 1')
			hstStore.set('task.123.status', 'active')

			expect(operations.value.length).toBe(2)

			// Change max operations limit
			configure({ maxOperations: 3 })

			// Add more operations
			hstStore.set('task.123.priority', 'high')
			hstStore.set('task.123.title', 'Config Test 2')

			// Should enforce new limit
			expect(operations.value.length).toBeLessThanOrEqual(3)
		})
	})
})
