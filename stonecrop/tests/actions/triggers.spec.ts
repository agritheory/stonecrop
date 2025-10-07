import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FieldTriggerEngine, getGlobalTriggerEngine, registerGlobalAction } from '../../src/field-triggers'
import type { FieldChangeContext } from '../../src/types/field-triggers'

describe('Field Trigger System', () => {
	let triggerEngine: FieldTriggerEngine

	beforeEach(() => {
		triggerEngine = new FieldTriggerEngine()
	})

	describe('FieldTriggerEngine', () => {
		it('should register and execute field actions', async () => {
			const testAction = vi.fn()
			triggerEngine.registerAction('testAction', testAction)

			// Register a doctype with field triggers
			const actions = new Map([
				['emailAddress', ['testAction']], // field trigger
			])
			triggerEngine.registerDoctypeActions('Task', actions)

			const context: FieldChangeContext = {
				path: 'task.123.emailAddress',
				fieldname: 'emailAddress',
				beforeValue: 'old@example.com',
				afterValue: 'new@example.com',
				operation: 'set',
				doctype: 'Task',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			expect(result.allSucceeded).toBe(true)
			expect(result.actionResults).toHaveLength(1)
			expect(testAction).toHaveBeenCalledWith(context)
		})

		it('should execute multiple actions sequentially', async () => {
			const action1 = vi.fn()
			const action2 = vi.fn()

			triggerEngine.registerAction('action1', action1)
			triggerEngine.registerAction('action2', action2)

			// Register field triggers
			const actions = new Map([['emailAddress', ['action1', 'action2']]])
			triggerEngine.registerDoctypeActions('Task', actions)

			const context: FieldChangeContext = {
				path: 'task.123.emailAddress',
				fieldname: 'emailAddress',
				beforeValue: '',
				afterValue: 'test@example.com',
				operation: 'set',
				doctype: 'Task',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			expect(result.allSucceeded).toBe(true)
			expect(result.actionResults).toHaveLength(2)
			expect(action1).toHaveBeenCalledWith(context)
			expect(action2).toHaveBeenCalledWith(context)
		})

		it('should handle wildcard patterns', async () => {
			const testAction = vi.fn()
			triggerEngine.registerAction('testAction', testAction)

			// Register wildcard pattern
			const actions = new Map([['emailAddress.*', ['testAction']]])
			triggerEngine.registerDoctypeActions('Task', actions)

			const context: FieldChangeContext = {
				path: 'task.123.emailAddress.is_primary',
				fieldname: 'emailAddress.is_primary',
				beforeValue: false,
				afterValue: true,
				operation: 'set',
				doctype: 'Task',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			expect(result.allSucceeded).toBe(true)
			expect(result.actionResults).toHaveLength(1)
			expect(testAction).toHaveBeenCalledWith(context)
		})

		it('should handle async actions', async () => {
			const asyncAction = vi.fn().mockImplementation(async () => {
				await new Promise(resolve => setTimeout(resolve, 10))
				return 'async result'
			})

			triggerEngine.registerAction('asyncAction', asyncAction)

			const actions = new Map([['title', ['asyncAction']]])
			triggerEngine.registerDoctypeActions('Task', actions)

			const context: FieldChangeContext = {
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old Title',
				afterValue: 'New Title',
				operation: 'set',
				doctype: 'Task',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			expect(result.allSucceeded).toBe(true)
			expect(result.actionResults).toHaveLength(1)
			expect(asyncAction).toHaveBeenCalledWith(context)
		})

		it('should handle action errors gracefully', async () => {
			const errorAction = vi.fn().mockImplementation(() => {
				throw new Error('Test error')
			})

			triggerEngine.registerAction('errorAction', errorAction)

			const actions = new Map([['title', ['errorAction']]])
			triggerEngine.registerDoctypeActions('Task', actions)

			const context: FieldChangeContext = {
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old Title',
				afterValue: 'New Title',
				operation: 'set',
				doctype: 'Task',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			expect(result.allSucceeded).toBe(false)
			expect(result.actionResults).toHaveLength(1)
			expect(result.actionResults[0].success).toBe(false)
			expect(result.actionResults[0].error?.message).toBe('Test error')
		})

		it('should handle missing actions gracefully', async () => {
			const actions = new Map([['title', ['nonExistentAction']]])
			triggerEngine.registerDoctypeActions('Task', actions)

			const context: FieldChangeContext = {
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old Title',
				afterValue: 'New Title',
				operation: 'set',
				doctype: 'Task',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			expect(result.allSucceeded).toBe(false)
			expect(result.actionResults).toHaveLength(1)
			expect(result.actionResults[0].success).toBe(false)
			expect(result.actionResults[0].error?.message).toContain('Action "nonExistentAction" not found')
		})
	})

	describe('Global trigger engine', () => {
		it('should provide a global instance', () => {
			const engine1 = getGlobalTriggerEngine()
			const engine2 = getGlobalTriggerEngine()

			expect(engine1).toBe(engine2) // Same instance
		})

		it('should allow registering global actions', () => {
			const testAction = vi.fn()
			registerGlobalAction('globalTestAction', testAction)

			const engine = getGlobalTriggerEngine()
			expect(engine['globalActions'].has('globalTestAction')).toBe(true)
		})
	})

	describe('Field pattern matching', () => {
		it('should match exact field names', async () => {
			const testAction = vi.fn()
			triggerEngine.registerAction('testAction', testAction)

			const actions = new Map([['title', ['testAction']]])
			triggerEngine.registerDoctypeActions('Task', actions)

			const context: FieldChangeContext = {
				path: 'task.123.title',
				fieldname: 'title',
				beforeValue: 'Old',
				afterValue: 'New',
				operation: 'set',
				doctype: 'Task',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			expect(result.allSucceeded).toBe(true)
			expect(testAction).toHaveBeenCalled()
		})

		it('should match wildcard patterns', async () => {
			const testAction = vi.fn()
			triggerEngine.registerAction('testAction', testAction)

			const actions = new Map([['*.is_primary', ['testAction']]])
			triggerEngine.registerDoctypeActions('Task', actions)

			const context: FieldChangeContext = {
				path: 'task.123.emailAddress.is_primary',
				fieldname: 'emailAddress.is_primary',
				beforeValue: false,
				afterValue: true,
				operation: 'set',
				doctype: 'Task',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			expect(result.allSucceeded).toBe(true)
			expect(testAction).toHaveBeenCalled()
		})

		it('should not match patterns with different segment counts', async () => {
			const testAction = vi.fn()
			triggerEngine.registerAction('testAction', testAction)

			const actions = new Map([
				['*.is_primary', ['testAction']], // expects 2 segments
			])
			triggerEngine.registerDoctypeActions('Task', actions)

			const context: FieldChangeContext = {
				path: 'task.123.simple_field',
				fieldname: 'simple_field', // only 1 segment
				beforeValue: 'old',
				afterValue: 'new',
				operation: 'set',
				doctype: 'Task',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			expect(result.allSucceeded).toBe(true)
			expect(result.actionResults).toHaveLength(0)
			expect(testAction).not.toHaveBeenCalled()
		})
	})
})
