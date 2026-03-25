import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { Stonecrop } from '../src/stonecrop'
import Registry from '../src/registry'
import Doctype from '../src/doctype'
import { Map, List } from 'immutable'
import { useOperationLog } from '../src/composables/operation-log'

describe('Operation Log - Action Tracking', () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let mockDoctype: Doctype

	beforeEach(() => {
		// Setup Pinia
		setActivePinia(createPinia())

		// Reset static instances
		Registry._root = undefined as any
		Stonecrop._root = undefined as any

		// Create registry
		registry = new Registry()

		// Create mock doctype with actions
		const mockActions = Map({
			print: ['console.log("Printing document")'],
			email: ['console.log("Sending email")'],
			archive: ['console.log("Archiving record")'],
		})

		mockDoctype = new Doctype('Task', List([]), undefined, mockActions)

		registry.addDoctype(mockDoctype)

		// Create Stonecrop instance
		stonecrop = new Stonecrop(registry)
	})

	describe('logAction', () => {
		it('should log a successful action execution', () => {
			const { operations, logAction } = useOperationLog()

			const initialCount = operations.value.length

			const opId = logAction('Task', 'print', ['TASK-001'], 'success')

			expect(opId).toBeTruthy()
			expect(operations.value.length).toBe(initialCount + 1)

			const operation = operations.value[operations.value.length - 1]
			expect(operation.type).toBe('action')
			expect(operation.doctype).toBe('Task')
			expect(operation.actionName).toBe('print')
			expect(operation.actionRecordIds).toEqual(['TASK-001'])
			expect(operation.actionResult).toBe('success')
			expect(operation.reversible).toBe(false) // Actions are not reversible
		})

		it('should log action without record IDs', () => {
			const { operations, logAction } = useOperationLog()

			logAction('Task', 'email')

			const operation = operations.value[operations.value.length - 1]
			expect(operation.type).toBe('action')
			expect(operation.actionName).toBe('email')
			expect(operation.actionRecordIds).toBeUndefined()
			expect(operation.recordId).toBeUndefined()
		})

		it('should log action with multiple record IDs', () => {
			const { operations, logAction } = useOperationLog()

			logAction('Task', 'archive', ['TASK-001', 'TASK-002', 'TASK-003'])

			const operation = operations.value[operations.value.length - 1]
			expect(operation.actionRecordIds).toEqual(['TASK-001', 'TASK-002', 'TASK-003'])
			// recordId should be the first one for path construction
			expect(operation.recordId).toBe('TASK-001')
			expect(operation.path).toBe('Task.TASK-001')
		})

		it('should log action failure with error message', () => {
			const { operations, logAction } = useOperationLog()

			logAction('Task', 'email', ['TASK-001'], 'failure', 'SMTP server unavailable')

			const operation = operations.value[operations.value.length - 1]
			expect(operation.actionResult).toBe('failure')
			expect(operation.actionError).toBe('SMTP server unavailable')
		})

		it('should log pending action execution', () => {
			const { operations, logAction } = useOperationLog()

			logAction('Task', 'print', ['TASK-001'], 'pending')

			const operation = operations.value[operations.value.length - 1]
			expect(operation.actionResult).toBe('pending')
		})

		it('should mark action operations as non-reversible', () => {
			const { operations, logAction } = useOperationLog()

			logAction('Task', 'email', ['TASK-001'])

			const operation = operations.value[operations.value.length - 1]
			expect(operation.reversible).toBe(false)
		})
	})

	describe('runAction integration', () => {
		it('should log action when runAction is called', () => {
			const { operations } = useOperationLog()

			const initialCount = operations.value.length

			// Execute action
			stonecrop.runAction(mockDoctype, 'print', ['TASK-001'])

			// Should have logged the action
			expect(operations.value.length).toBe(initialCount + 1)

			const operation = operations.value[operations.value.length - 1]
			expect(operation.type).toBe('action')
			expect(operation.actionName).toBe('print')
			expect(operation.actionRecordIds).toEqual(['TASK-001'])
			expect(operation.actionResult).toBe('success')
		})

		it('should log action failure when action throws error', () => {
			const { operations } = useOperationLog()

			// Create doctype with failing action
			const failingActions = Map({
				failing: ['throw new Error("Action failed")'],
			})

			const failingDoctype = new Doctype('FailingTask', List([]), undefined, failingActions)

			registry.addDoctype(failingDoctype)

			// Execute failing action
			stonecrop.runAction(failingDoctype, 'failing', ['TASK-001'])

			const operation = operations.value[operations.value.length - 1]
			expect(operation.actionResult).toBe('failure')
			expect(operation.actionError).toContain('Action failed')
		})

		it('should handle actions without record IDs', () => {
			const { operations } = useOperationLog()

			stonecrop.runAction(mockDoctype, 'email')

			const operation = operations.value[operations.value.length - 1]
			expect(operation.actionName).toBe('email')
			expect(operation.actionRecordIds).toBeUndefined()
		})

		it('should filter non-string arguments when extracting record IDs', () => {
			const { operations } = useOperationLog()

			// Call with mixed arguments
			stonecrop.runAction(mockDoctype, 'print', ['TASK-001', 123, null, 'TASK-002', undefined] as any)

			const operation = operations.value[operations.value.length - 1]
			// Should only include string arguments
			expect(operation.actionRecordIds).toEqual(['TASK-001', 'TASK-002'])
		})
	})

	describe('getOperationsFor with actions', () => {
		it('should retrieve action operations for a specific doctype', () => {
			const { logAction, getOperationsFor } = useOperationLog()

			// Log several actions
			logAction('Task', 'print', ['TASK-001'])
			logAction('Task', 'email', ['TASK-002'])
			logAction('Issue', 'archive', ['ISSUE-001'])

			const taskOperations = getOperationsFor('Task')

			expect(taskOperations.length).toBe(2)
			expect(taskOperations.every(op => op.doctype === 'Task')).toBe(true)
		})

		it('should retrieve action operations for a specific record', () => {
			const { logAction, getOperationsFor } = useOperationLog()

			// Log actions for different records
			logAction('Task', 'print', ['TASK-001'])
			logAction('Task', 'email', ['TASK-001'])
			logAction('Task', 'print', ['TASK-002'])

			const task001Operations = getOperationsFor('Task', 'TASK-001')

			expect(task001Operations.length).toBe(2)
			expect(task001Operations.every(op => op.recordId === 'TASK-001')).toBe(true)
		})
	})

	describe('operation log snapshot with actions', () => {
		it('should include action operations in snapshot', () => {
			const { logAction, getSnapshot } = useOperationLog()

			logAction('Task', 'print', ['TASK-001'])
			logAction('Task', 'email', ['TASK-002'])

			const snapshot = getSnapshot()

			const actionOps = snapshot.operations.filter(op => op.type === 'action')
			expect(actionOps.length).toBe(2)
			// All action operations should be irreversible
			expect(snapshot.reversibleOperations).toBe(0)
			expect(snapshot.irreversibleOperations).toBe(2)
		})
	})

	describe('action audit trail', () => {
		it('should maintain chronological order of action executions', () => {
			const { operations, logAction } = useOperationLog()

			const startTime = Date.now()

			logAction('Task', 'print', ['TASK-001'])
			logAction('Task', 'email', ['TASK-001'])
			logAction('Task', 'archive', ['TASK-001'])

			const actionOps = operations.value.filter(op => op.type === 'action')

			expect(actionOps.length).toBe(3)
			expect(actionOps[0].actionName).toBe('print')
			expect(actionOps[1].actionName).toBe('email')
			expect(actionOps[2].actionName).toBe('archive')

			// Verify timestamps are in order
			expect(actionOps[0].timestamp.getTime()).toBeGreaterThanOrEqual(startTime)
			expect(actionOps[1].timestamp.getTime()).toBeGreaterThanOrEqual(actionOps[0].timestamp.getTime())
			expect(actionOps[2].timestamp.getTime()).toBeGreaterThanOrEqual(actionOps[1].timestamp.getTime())
		})

		it('should support adding metadata to action operations', () => {
			const { operations, logAction } = useOperationLog()

			logAction('Task', 'email', ['TASK-001'])

			const operation = operations.value[operations.value.length - 1]

			// Metadata can be added after logging
			operation.metadata = {
				recipient: 'user@example.com',
				subject: 'Task Update',
			}

			expect(operation.metadata.recipient).toBe('user@example.com')
		})
	})
})
