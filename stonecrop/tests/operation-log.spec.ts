import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOperationLogStore } from '../src/stores/operation-log'
import { createHST } from '../src/stores/hst'
import type { HSTOperation } from '../src/types/operation-log'

describe('Operation Log Store', () => {
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
			const hstStore = createHST({ task: { '123': data } }, 'StonecropStore')

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
			expect(batchOp.childOperationIds).toHaveLength(2)
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
})
