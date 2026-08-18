import { describe, it, expect, beforeEach } from 'vitest'
import { List, Map } from 'immutable'
import type { DoctypeField } from '@stonecrop/schema'
import {
	getGlobalTriggerEngine,
	registerGlobalAction,
	registerTransitionAction,
	triggerTransition,
} from '../../src/field-triggers'
import type { TransitionChangeContext, FieldChangeContext } from '../../src/types/field-triggers'
import Doctype from '../../src/doctype'
import Registry from '../../src/registry'
import { createHST } from '../../src/stores/hst'

/**
 * Register field triggers the way an application does now: imperatively, on the engine.
 *
 * A doctype used to carry this map itself and `registry.addDoctype` forwarded it here. That
 * declarative route is gone — it could cross neither the Zod gate nor the SDL, so it only ever
 * worked for a host bypassing both. The engine and everything under it are unchanged; only who
 * calls `registerDoctypeActions` moved. Registering under name AND slug mirrors what `addDoctype`
 * did, so these tests drive the same engine state as before.
 */
const registerTriggers = (doctype: Doctype, actions: Map<string, string[]>) => {
	const engine = getGlobalTriggerEngine()
	engine.registerDoctypeActions(doctype.doctype, actions)
	if (doctype.slug !== doctype.doctype) engine.registerDoctypeActions(doctype.slug, actions)
}

describe('XState Transition Integration', { tags: ['unit'] }, () => {
	let registry: Registry

	beforeEach(() => {
		// Create a fresh registry for each test
		registry = new Registry()

		// Get the singleton engine and clear its maps
		const engine = getGlobalTriggerEngine()
		;(engine as any).globalActions.clear()
		;(engine as any).globalTransitionActions.clear()
		;(engine as any).doctypeActions.clear()
		;(engine as any).doctypeTransitions.clear()
		;(engine as any).fieldRollbackConfig.clear()
	})

	describe('Uppercase Convention Detection', () => {
		it('should categorize UPPERCASE actions as transitions', () => {
			const actions = Map({
				SAVE: ['saveFn'],
				SUBMIT: ['submitFn'],
				VALIDATE: ['validateFn'],
				// Lowercase should be field triggers
				email: ['emailFn'],
				first_name: ['nameFn'],
			})

			const doctype = new Doctype('TestDoc', List(), {})

			registry.addDoctype(doctype)
			registerTriggers(doctype, actions)

			const engine = getGlobalTriggerEngine()
			// Registered under both doctype.doctype and doctype.slug
			const transitions = (engine as any).doctypeTransitions.get('TestDoc')
			const actions2 = (engine as any).doctypeActions.get('TestDoc')

			// Check transitions (uppercase)
			expect(transitions).toBeDefined()
			expect(transitions.has('SAVE')).toBe(true)
			expect(transitions.has('SUBMIT')).toBe(true)
			expect(transitions.has('VALIDATE')).toBe(true)

			// Check field triggers (lowercase)
			expect(actions2.has('email')).toBe(true)
			expect(actions2.has('first_name')).toBe(true)

			// Verify separation
			expect(actions2.has('SAVE')).toBe(false)
			expect(transitions.has('email')).toBe(false)
		})

		it('should handle mixed case and underscores correctly', () => {
			const doctype = new Doctype('TestDoc', List(), {})

			registry.addDoctype(doctype)
			registerTriggers(
				doctype,
				Map({
					SAVE_DRAFT: ['saveDraftFn'], // Uppercase with underscore = transition
					CREATE_NEW: ['createFn'], // Uppercase with underscore = transition
					Save: ['saveFn'], // Mixed case = field trigger
					myField: ['fieldFn'], // Camel case = field trigger
					'user.email': ['emailFn'], // Dot notation = field trigger
				})
			)

			const engine = getGlobalTriggerEngine()
			const transitions = (engine as any).doctypeTransitions.get('TestDoc')
			const actions = (engine as any).doctypeActions.get('TestDoc')

			// Uppercase with underscores = transitions
			expect(transitions).toBeDefined()
			expect(transitions.has('SAVE_DRAFT')).toBe(true)
			expect(transitions.has('CREATE_NEW')).toBe(true)

			// Mixed/lowercase = field triggers
			expect(actions.has('Save')).toBe(true)
			expect(actions.has('myField')).toBe(true)
			expect(actions.has('user.email')).toBe(true)
		})
	})

	describe('Transition Execution', () => {
		it('should execute transition actions with context', async () => {
			const transitionResults: TransitionChangeContext[] = []

			// Register a transition action
			registerTransitionAction('saveAction', async (context: TransitionChangeContext) => {
				transitionResults.push(context)
			})

			const doctype = new Doctype('Todo', List<DoctypeField>(), {})

			registry.addDoctype(doctype)
			registerTriggers(
				doctype,
				Map({
					SAVE: ['saveAction'],
				})
			)

			// Trigger the transition
			const results = await triggerTransition('Todo', 'SAVE', {
				recordId: '123',
				currentState: 'editing',
				targetState: 'saved',
				fsmContext: { validated: true },
			})

			expect(results).toHaveLength(1)
			expect(results[0].success).toBe(true)
			expect(transitionResults).toHaveLength(1)

			const context = transitionResults[0]
			expect(context.transition).toBe('SAVE')
			expect(context.doctype).toBe('Todo')
			expect(context.recordId).toBe('123')
			expect(context.currentState).toBe('editing')
			expect(context.targetState).toBe('saved')
			expect(context.fsmContext).toEqual({ validated: true })
		})

		it('should execute multiple transition actions sequentially', async () => {
			const executionOrder: string[] = []

			registerTransitionAction('action1', async () => {
				executionOrder.push('action1')
			})

			registerTransitionAction('action2', async () => {
				executionOrder.push('action2')
			})

			registerTransitionAction('action3', async () => {
				executionOrder.push('action3')
			})

			const doctype = new Doctype('Todo', List<DoctypeField>(), {})

			registry.addDoctype(doctype)
			registerTriggers(
				doctype,
				Map({
					VALIDATE: ['action1', 'action2', 'action3'],
				})
			)

			await triggerTransition('Todo', 'VALIDATE')

			expect(executionOrder).toEqual(['action1', 'action2', 'action3'])
		})

		it('should stop on first error in transition actions', async () => {
			const executionOrder: string[] = []

			registerTransitionAction('successAction', async () => {
				executionOrder.push('success')
			})

			registerTransitionAction('failAction', async () => {
				executionOrder.push('fail')
				throw new Error('Transition failed')
			})

			registerTransitionAction('afterFailAction', async () => {
				executionOrder.push('afterFail')
			})

			const doctype = new Doctype('Todo', List<DoctypeField>(), {})

			registry.addDoctype(doctype)
			registerTriggers(
				doctype,
				Map({
					SUBMIT: ['successAction', 'failAction', 'afterFailAction'],
				})
			)

			const results = await triggerTransition('Todo', 'SUBMIT')

			expect(executionOrder).toEqual(['success', 'fail'])
			expect(results).toHaveLength(2)
			expect(results[0].success).toBe(true)
			expect(results[1].success).toBe(false)
			expect(results[1].error?.message).toBe('Transition failed')
		})

		it('should allow sharing actions between field triggers and transitions', async () => {
			const sharedActionCalls: string[] = []

			// Register as a regular action (can be used by both)
			registerGlobalAction('sharedAction', async (context: FieldChangeContext) => {
				sharedActionCalls.push(`called-${context.doctype}`)
			})

			const doctype = new Doctype('Todo', List<DoctypeField>(), {})

			registry.addDoctype(doctype)
			registerTriggers(
				doctype,
				Map({
					SAVE: ['sharedAction'], // Used in transition
					title: ['sharedAction'], // Used in field trigger
				})
			)

			// Should work for transition
			await triggerTransition('Todo', 'SAVE')
			expect(sharedActionCalls).toContain('called-Todo')
		})
	})

	describe('HST Integration', () => {
		it('should trigger transitions from HST node', async () => {
			const transitionCalls: string[] = []

			registerTransitionAction('saveDoc', async (context: TransitionChangeContext) => {
				transitionCalls.push(`${context.transition}-${context.doctype}-${context.recordId}`)
			})

			const doctype = new Doctype('Task', List<DoctypeField>(), {})

			registry.addDoctype(doctype)
			registerTriggers(
				doctype,
				Map({
					SAVE: ['saveDoc'],
				})
			)

			// Create HST store
			const data = {
				Task: {
					'task-1': {
						title: 'Test Task',
						status: 'editing',
					},
				},
			}

			const store = createHST(data, 'StonecropStore')
			const taskNode = store.getNode('Task.task-1')

			// Trigger transition from HST node
			await taskNode.triggerTransition('SAVE', {
				currentState: 'editing',
				targetState: 'saved',
			})

			expect(transitionCalls).toContain('SAVE-Task-task-1')
		})

		it('should pass correct context from HST node', async () => {
			let capturedContext: TransitionChangeContext | null = null

			registerTransitionAction('captureContext', async (context: TransitionChangeContext) => {
				capturedContext = context
			})

			const doctype = new Doctype('Todo', List<DoctypeField>(), {})

			registry.addDoctype(doctype)
			registerTriggers(
				doctype,
				Map({
					SUBMIT: ['captureContext'],
				})
			)

			const data = {
				Todo: {
					'123': { title: 'My Todo' },
				},
			}

			const store = createHST(data, 'StonecropStore')
			const todoNode = store.getNode('Todo.123')

			await todoNode.triggerTransition('SUBMIT', {
				currentState: 'draft',
				targetState: 'submitted',
				fsmContext: { validated: true, user: 'john' },
			})

			expect(capturedContext).not.toBeNull()
			expect(capturedContext!.transition).toBe('SUBMIT')
			expect(capturedContext!.doctype).toBe('Todo')
			expect(capturedContext!.recordId).toBe('123')
			expect(capturedContext!.currentState).toBe('draft')
			expect(capturedContext!.targetState).toBe('submitted')
			expect(capturedContext!.fsmContext).toEqual({ validated: true, user: 'john' })
		})
	})

	describe('Error Handling', () => {
		it('should handle missing transition actions gracefully', async () => {
			const doctype = new Doctype('Todo', List(), {})
			registry.addDoctype(doctype)

			// Try to trigger non-existent transition
			const results = await triggerTransition('Todo', 'NONEXISTENT')

			expect(results).toEqual([])
		})

		it('should handle unregistered transition action functions', async () => {
			const doctype = new Doctype('Todo', List<DoctypeField>(), {})

			registry.addDoctype(doctype)
			registerTriggers(
				doctype,
				Map({
					SAVE: ['unregisteredAction'],
				})
			)

			const results = await triggerTransition('Todo', 'SAVE')

			expect(results).toHaveLength(1)
			expect(results[0].success).toBe(false)
			expect(results[0].error?.message).toContain('not found in registry')
		})

		it('should call error handler on transition failures', async () => {
			const errorHandlerCalls: Array<{ error: Error; action: string }> = []

			// Get the singleton engine and temporarily set error handler
			const engine = getGlobalTriggerEngine()
			const originalHandler = (engine as any).options.errorHandler
			;(engine as any).options.errorHandler = (error: Error, context: any, action: any) => {
				errorHandlerCalls.push({ error, action: String(action) })
			}

			registerTransitionAction('failingAction', async () => {
				throw new Error('Intentional failure')
			})

			const doctype = new Doctype('Todo', List(), {})

			// Register directly with engine
			registry.addDoctype(doctype)
			registerTriggers(
				doctype,
				Map({
					CANCEL: ['failingAction'],
				})
			)

			await triggerTransition('Todo', 'CANCEL')

			expect(errorHandlerCalls).toHaveLength(1)
			expect(errorHandlerCalls[0].error.message).toBe('Intentional failure')
			expect(errorHandlerCalls[0].action).toBe('failingAction')

			// Restore original handler
			;(engine as any).options.errorHandler = originalHandler
		})
	})

	describe('Real-World Workflow Scenarios', () => {
		it('should support typical CRUD workflow transitions', async () => {
			const workflowLog: string[] = []

			registerTransitionAction('validateData', async (ctx: TransitionChangeContext) => {
				workflowLog.push(`validate:${ctx.currentState}->${ctx.targetState}`)
			})

			registerTransitionAction('saveData', async (ctx: TransitionChangeContext) => {
				workflowLog.push(`save:${ctx.currentState}->${ctx.targetState}`)
			})

			registerTransitionAction('submitData', async (ctx: TransitionChangeContext) => {
				workflowLog.push(`submit:${ctx.currentState}->${ctx.targetState}`)
			})

			registerTransitionAction('cancelData', async (ctx: TransitionChangeContext) => {
				workflowLog.push(`cancel:${ctx.currentState}->${ctx.targetState}`)
			})

			const doctype = new Doctype('Document', List<DoctypeField>(), {})

			registry.addDoctype(doctype)
			registerTriggers(
				doctype,
				Map({
					VALIDATE: ['validateData'],
					SAVE: ['validateData', 'saveData'],
					SUBMIT: ['validateData', 'saveData', 'submitData'],
					CANCEL: ['cancelData'],
				})
			)

			// Simulate workflow: create -> validate -> save -> submit
			await triggerTransition('Document', 'VALIDATE', {
				currentState: 'editing',
				targetState: 'editing',
			})

			await triggerTransition('Document', 'SAVE', {
				currentState: 'editing',
				targetState: 'saved',
			})

			await triggerTransition('Document', 'SUBMIT', {
				currentState: 'saved',
				targetState: 'submitted',
			})

			expect(workflowLog).toEqual([
				'validate:editing->editing',
				'validate:editing->saved',
				'save:editing->saved',
				'validate:saved->submitted',
				'save:saved->submitted',
				'submit:saved->submitted',
			])
		})
	})
})
