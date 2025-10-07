import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FieldTriggerEngine } from '../../src/field-triggers'
import type { FieldChangeContext, ActionResult } from '../../src/types/field-triggers'

describe('Field Trigger Transactional System', () => {
	let triggerEngine: FieldTriggerEngine
	let mockDatabase: Record<string, any>

	beforeEach(() => {
		triggerEngine = new FieldTriggerEngine()
		mockDatabase = {}
	})

	describe('Successful action execution with mutations tracking', () => {
		it('should track mutations for successful actions', async () => {
			const createUserAction = vi.fn().mockImplementation((context: FieldChangeContext): ActionResult => {
				const userId = `user_${Date.now()}`
				mockDatabase[userId] = { email: context.afterValue, created: true }

				return {
					mutations: { userId, createdUser: true },
					rollback: () => {
						delete mockDatabase[userId]
					},
				}
			})

			const sendWelcomeEmailAction = vi.fn().mockImplementation((context: FieldChangeContext): ActionResult => {
				const emailId = `email_${Date.now()}`
				mockDatabase[emailId] = {
					to: context.afterValue,
					subject: 'Welcome!',
					sent: true,
				}

				return {
					mutations: { emailId, emailSent: true },
					rollback: () => {
						delete mockDatabase[emailId]
					},
				}
			})

			triggerEngine.registerAction('createUser', createUserAction)
			triggerEngine.registerAction('sendWelcomeEmail', sendWelcomeEmailAction)

			const actions = new Map([['emailAddress', ['createUser', 'sendWelcomeEmail']]])
			triggerEngine.registerDoctypeActions('User', actions)

			const context: FieldChangeContext = {
				path: 'user.123.emailAddress',
				fieldname: 'emailAddress',
				beforeValue: '',
				afterValue: 'test@example.com',
				operation: 'set',
				doctype: 'User',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			// All actions should succeed
			expect(result.allSucceeded).toBe(true)
			expect(result.rolledBack).toBe(false)
			expect(result.actionResults).toHaveLength(2)

			// Both mutations should be tracked
			expect(result.actionResults[0].mutations).toMatchObject({
				createdUser: true,
			})
			expect(result.actionResults[1].mutations).toMatchObject({
				emailSent: true,
			})

			// Both actions should have rollback functions
			expect(result.actionResults[0].rollback).toBeDefined()
			expect(result.actionResults[1].rollback).toBeDefined()

			// Database should contain both records
			const userKeys = Object.keys(mockDatabase).filter(k => k.startsWith('user_'))
			const emailKeys = Object.keys(mockDatabase).filter(k => k.startsWith('email_'))
			expect(userKeys).toHaveLength(1)
			expect(emailKeys).toHaveLength(1)
		})
	})

	describe('Action failure with rollback execution', () => {
		it('should rollback previous successful actions when a later action fails', async () => {
			const createUserAction = vi.fn().mockImplementation((context: FieldChangeContext): ActionResult => {
				const userId = `user_${Date.now()}`
				mockDatabase[userId] = { email: context.afterValue, created: true }

				return {
					mutations: { userId, createdUser: true },
					rollback: () => {
						delete mockDatabase[userId]
					},
				}
			})

			const createProfileAction = vi.fn().mockImplementation((context: FieldChangeContext): ActionResult => {
				const profileId = `profile_${Date.now()}`
				mockDatabase[profileId] = { email: context.afterValue, profile: true }

				return {
					mutations: { profileId, profileCreated: true },
					rollback: () => {
						delete mockDatabase[profileId]
					},
				}
			})

			const failingAction = vi.fn().mockImplementation(() => {
				throw new Error('Email service unavailable')
			})

			triggerEngine.registerAction('createUser', createUserAction)
			triggerEngine.registerAction('createProfile', createProfileAction)
			triggerEngine.registerAction('failingAction', failingAction)

			const actions = new Map([['emailAddress', ['createUser', 'createProfile', 'failingAction']]])
			triggerEngine.registerDoctypeActions('User', actions)

			const context: FieldChangeContext = {
				path: 'user.123.emailAddress',
				fieldname: 'emailAddress',
				beforeValue: '',
				afterValue: 'test@example.com',
				operation: 'set',
				doctype: 'User',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			// Overall execution should fail
			expect(result.allSucceeded).toBe(false)
			expect(result.stoppedOnError).toBe(true)
			expect(result.rolledBack).toBe(true)

			// Should have 3 action results: 2 successful, 1 failed
			expect(result.actionResults).toHaveLength(3)
			expect(result.actionResults[0].success).toBe(true) // createUser
			expect(result.actionResults[1].success).toBe(true) // createProfile
			expect(result.actionResults[2].success).toBe(false) // failingAction

			// Should have rollback results for the 2 successful actions
			expect(result.rollbackResults).toBeDefined()
			expect(result.rollbackResults).toHaveLength(2)
			expect(result.rollbackResults![0].success).toBe(true) // profile rollback (LIFO)
			expect(result.rollbackResults![1].success).toBe(true) // user rollback

			// Database should be empty after rollbacks
			expect(Object.keys(mockDatabase)).toHaveLength(0)

			// All actions should have been called
			expect(createUserAction).toHaveBeenCalled()
			expect(createProfileAction).toHaveBeenCalled()
			expect(failingAction).toHaveBeenCalled()
		})

		it('should handle rollback failures gracefully', async () => {
			const createUserAction = vi.fn().mockImplementation((context: FieldChangeContext): ActionResult => {
				const userId = `user_${Date.now()}`
				mockDatabase[userId] = { email: context.afterValue, created: true }

				return {
					mutations: { userId, createdUser: true },
					rollback: () => {
						throw new Error('Rollback failed - database locked')
					},
				}
			})

			const failingAction = vi.fn().mockImplementation(() => {
				throw new Error('Second action failed')
			})

			triggerEngine.registerAction('createUser', createUserAction)
			triggerEngine.registerAction('failingAction', failingAction)

			const actions = new Map([['emailAddress', ['createUser', 'failingAction']]])
			triggerEngine.registerDoctypeActions('User', actions)

			const context: FieldChangeContext = {
				path: 'user.123.emailAddress',
				fieldname: 'emailAddress',
				beforeValue: '',
				afterValue: 'test@example.com',
				operation: 'set',
				doctype: 'User',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			// Overall execution should fail
			expect(result.allSucceeded).toBe(false)
			expect(result.rolledBack).toBe(true)

			// Should have rollback results with failure
			expect(result.rollbackResults).toBeDefined()
			expect(result.rollbackResults).toHaveLength(1)
			expect(result.rollbackResults![0].success).toBe(false)
			expect(result.rollbackResults![0].error?.message).toBe('Rollback failed - database locked')
		})
	})

	describe('Complex transactional scenarios', () => {
		it('should handle mixed success/failure with partial rollbacks', async () => {
			let stepCounter = 0

			const step1Action = vi.fn().mockImplementation((): ActionResult => {
				stepCounter++
				mockDatabase.step1 = { executed: true, step: stepCounter }
				return {
					mutations: { step: 1 },
					rollback: () => {
						delete mockDatabase.step1
						stepCounter--
					},
				}
			})

			const step2Action = vi.fn().mockImplementation((): ActionResult => {
				stepCounter++
				mockDatabase.step2 = { executed: true, step: stepCounter }
				return {
					mutations: { step: 2 },
					rollback: () => {
						delete mockDatabase.step2
						stepCounter--
					},
				}
			})

			const step3Action = vi.fn().mockImplementation((): ActionResult => {
				stepCounter++
				mockDatabase.step3 = { executed: true, step: stepCounter }
				return {
					mutations: { step: 3 },
					rollback: () => {
						delete mockDatabase.step3
						stepCounter--
					},
				}
			})

			const step4FailAction = vi.fn().mockImplementation(() => {
				throw new Error('Step 4 validation failed')
			})

			triggerEngine.registerAction('step1', step1Action)
			triggerEngine.registerAction('step2', step2Action)
			triggerEngine.registerAction('step3', step3Action)
			triggerEngine.registerAction('step4Fail', step4FailAction)

			const actions = new Map([['complexField', ['step1', 'step2', 'step3', 'step4Fail']]])
			triggerEngine.registerDoctypeActions('Complex', actions)

			const context: FieldChangeContext = {
				path: 'complex.456.complexField',
				fieldname: 'complexField',
				beforeValue: null,
				afterValue: 'new_value',
				operation: 'set',
				doctype: 'Complex',
				recordId: '456',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			// Verify execution results
			expect(result.allSucceeded).toBe(false)
			expect(result.rolledBack).toBe(true)
			expect(result.actionResults).toHaveLength(4)

			// First 3 should succeed, 4th should fail
			expect(result.actionResults[0].success).toBe(true)
			expect(result.actionResults[1].success).toBe(true)
			expect(result.actionResults[2].success).toBe(true)
			expect(result.actionResults[3].success).toBe(false)

			// Verify rollbacks executed in reverse order (LIFO)
			expect(result.rollbackResults).toBeDefined()
			expect(result.rollbackResults).toHaveLength(3)

			// Database should be clean after rollbacks
			expect(mockDatabase).toEqual({})
			expect(stepCounter).toBe(0)

			// All actions should have been attempted
			expect(step1Action).toHaveBeenCalled()
			expect(step2Action).toHaveBeenCalled()
			expect(step3Action).toHaveBeenCalled()
			expect(step4FailAction).toHaveBeenCalled()
		})

		it('should work with actions that do not provide rollback functions', async () => {
			const noRollbackAction = vi.fn().mockImplementation(() => {
				mockDatabase.noRollback = { executed: true }
				// No rollback function provided
			})

			const rollbackAction = vi.fn().mockImplementation((): ActionResult => {
				mockDatabase.withRollback = { executed: true }
				return {
					mutations: { hasRollback: true },
					rollback: () => {
						delete mockDatabase.withRollback
					},
				}
			})

			const failingAction = vi.fn().mockImplementation(() => {
				throw new Error('Final action failed')
			})

			triggerEngine.registerAction('noRollback', noRollbackAction)
			triggerEngine.registerAction('withRollback', rollbackAction)
			triggerEngine.registerAction('failing', failingAction)

			const actions = new Map([['mixedField', ['noRollback', 'withRollback', 'failing']]])
			triggerEngine.registerDoctypeActions('Mixed', actions)

			const context: FieldChangeContext = {
				path: 'mixed.789.mixedField',
				fieldname: 'mixedField',
				beforeValue: 'old',
				afterValue: 'new',
				operation: 'set',
				doctype: 'Mixed',
				recordId: '789',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			expect(result.allSucceeded).toBe(false)
			expect(result.rolledBack).toBe(true)

			// Only one rollback should be executed (for the action that provided one)
			expect(result.rollbackResults).toBeDefined()
			expect(result.rollbackResults).toHaveLength(1)
			expect(result.rollbackResults![0].success).toBe(true)

			// The action without rollback should still be in the database
			expect(mockDatabase.noRollback).toBeDefined()
			// The action with rollback should be removed
			expect(mockDatabase.withRollback).toBeUndefined()
		})
	})

	describe('Edge cases and error handling', () => {
		it('should handle empty action lists gracefully', async () => {
			const actions = new Map([['emptyField', []]])
			triggerEngine.registerDoctypeActions('Empty', actions)

			const context: FieldChangeContext = {
				path: 'empty.123.emptyField',
				fieldname: 'emptyField',
				beforeValue: 'old',
				afterValue: 'new',
				operation: 'set',
				doctype: 'Empty',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			expect(result.allSucceeded).toBe(true)
			expect(result.rolledBack).toBe(false)
			expect(result.actionResults).toHaveLength(0)
		})

		it('should handle async rollback functions', async () => {
			const asyncAction = vi.fn().mockImplementation((): ActionResult => {
				mockDatabase.asyncData = { value: 'test' }
				return {
					mutations: { asyncCreated: true },
					rollback: async () => {
						// Simulate async cleanup (e.g., API call)
						await new Promise(resolve => setTimeout(resolve, 10))
						delete mockDatabase.asyncData
					},
				}
			})

			const failingAction = vi.fn().mockImplementation(() => {
				throw new Error('Async test failure')
			})

			triggerEngine.registerAction('asyncAction', asyncAction)
			triggerEngine.registerAction('failing', failingAction)

			const actions = new Map([['asyncField', ['asyncAction', 'failing']]])
			triggerEngine.registerDoctypeActions('Async', actions)

			const context: FieldChangeContext = {
				path: 'async.123.asyncField',
				fieldname: 'asyncField',
				beforeValue: null,
				afterValue: 'test',
				operation: 'set',
				doctype: 'Async',
				recordId: '123',
				timestamp: new Date(),
			}

			const result = await triggerEngine.executeFieldTriggers(context)

			expect(result.allSucceeded).toBe(false)
			expect(result.rolledBack).toBe(true)
			expect(result.rollbackResults![0].success).toBe(true)
			expect(mockDatabase.asyncData).toBeUndefined()
		})
	})
})
