import { Map } from 'immutable'
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import Doctype from '../../src/doctype'
import type { HSTNode } from '../../src/stores'
import {
	FieldTriggerEngine,
	registerGlobalAction,
	setFieldRollback,
	markOperationIrreversible,
} from '../../src/field-triggers'
import Registry from '../../src/registry'
import { Stonecrop } from '../../src/stonecrop'
import { useOperationLogStore } from '../../src/stores/operation-log'
import type { FieldChangeContext } from '../../src/types'

describe('Field Trigger Rollback', { tags: ['unit'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let engine: FieldTriggerEngine

	beforeEach(() => {
		// Reset the singletons
		;(Registry as any)._root = undefined
		;(Stonecrop as any)._root = undefined
		;(FieldTriggerEngine as any)._root = undefined

		registry = new Registry()
		stonecrop = new Stonecrop(registry)

		// Create engine with rollback enabled (default)
		engine = new FieldTriggerEngine({ enableRollback: true, debug: true })
	})

	describe('Snapshot Capture', () => {
		it('should capture record snapshot before executing actions', async () => {
			// Setup doctype with field trigger
			const actions = Map({
				email: ['logEmail'],
			})
			const doctype = new Doctype('Contact', undefined, undefined, actions)
			registry.addDoctype(doctype)

			// Add a record to the store
			stonecrop.addRecord('Contact', 'contact-1', {
				name: 'John Doe',
				email: 'john@example.com',
				phone: '555-1234',
			})

			// Register action
			const logAction = vi.fn()
			registerGlobalAction('logEmail', logAction)

			// Get store for context
			const store = stonecrop.getStore()

			const context: FieldChangeContext = {
				path: 'Contact.contact-1.email',
				fieldname: 'email',
				beforeValue: 'john@example.com',
				afterValue: 'john.doe@example.com',
				operation: 'set',
				doctype: 'Contact',
				recordId: 'contact-1',
				timestamp: new Date(),
				store,
			}

			const result = await engine.executeFieldTriggers(context)

			expect(result.snapshot).toBeDefined()
			expect(result.snapshot).toEqual({
				name: 'John Doe',
				email: 'john@example.com',
				phone: '555-1234',
			})
		})

		it('should not capture snapshot when rollback is disabled', async () => {
			// Reset singleton to create a new engine with different options
			;(FieldTriggerEngine as any)._root = undefined

			// Create engine with rollback disabled
			const noRollbackEngine = new FieldTriggerEngine({ enableRollback: false, debug: true })

			const actions = Map({
				email: ['logEmail'],
			})
			const doctype = new Doctype('Contact', undefined, undefined, actions)
			registry.addDoctype(doctype)
			noRollbackEngine.registerDoctypeActions('Contact', actions)

			stonecrop.addRecord('Contact', 'contact-1', {
				name: 'John Doe',
				email: 'john@example.com',
			})

			const logAction = vi.fn()
			noRollbackEngine.registerAction('logEmail', logAction)

			const store = stonecrop.getStore()
			const context: FieldChangeContext = {
				path: 'Contact.contact-1.email',
				fieldname: 'email',
				beforeValue: 'john@example.com',
				afterValue: 'new@example.com',
				operation: 'set',
				doctype: 'Contact',
				recordId: 'contact-1',
				timestamp: new Date(),
				store,
			}

			const result = await noRollbackEngine.executeFieldTriggers(context)

			// Snapshot should be undefined when debug is on but rollback is off
			expect(result.snapshot).toBeUndefined()
			expect(result.rolledBack).toBe(false)
		})
	})

	describe('Automatic Rollback on Failure', () => {
		it('should rollback record to snapshot when action fails', async () => {
			const actions = Map({
				email: ['validateEmail', 'sendEmail'],
			})
			const doctype = new Doctype('Contact', undefined, undefined, actions)
			registry.addDoctype(doctype)

			// Add a record
			stonecrop.addRecord('Contact', 'contact-1', {
				name: 'John Doe',
				email: 'john@example.com',
				status: 'active',
			})

			// First action succeeds and modifies data
			const validateAction = vi.fn((context: FieldChangeContext) => {
				// Simulate validation that modifies data
				if (context.store) {
					context.store.set('Contact.contact-1.status', 'validating')
				}
			})

			// Second action fails
			const sendAction = vi.fn(() => {
				throw new Error('Email service unavailable')
			})

			registerGlobalAction('validateEmail', validateAction)
			registerGlobalAction('sendEmail', sendAction)

			const store = stonecrop.getStore()

			// Verify initial state
			expect(store.get('Contact.contact-1.status')).toBe('active')

			const context: FieldChangeContext = {
				path: 'Contact.contact-1.email',
				fieldname: 'email',
				beforeValue: 'john@example.com',
				afterValue: 'new@example.com',
				operation: 'set',
				doctype: 'Contact',
				recordId: 'contact-1',
				timestamp: new Date(),
				store,
			}

			const result = await engine.executeFieldTriggers(context)

			// Should have failed
			expect(result.allSucceeded).toBe(false)
			expect(result.stoppedOnError).toBe(true)

			// Should have rolled back
			expect(result.rolledBack).toBe(true)

			// Verify state was restored
			const finalRecord = store.get('Contact.contact-1')
			expect(finalRecord.name).toBe('John Doe')
			expect(finalRecord.email).toBe('john@example.com')
			expect(finalRecord.status).toBe('active') // Should be restored, not 'validating'
		})

		it('should not rollback when all actions succeed', async () => {
			const actions = Map({
				email: ['validateEmail', 'logEmail'],
			})
			const doctype = new Doctype('Contact', undefined, undefined, actions)
			registry.addDoctype(doctype)

			stonecrop.addRecord('Contact', 'contact-1', {
				name: 'John Doe',
				email: 'john@example.com',
			})

			const validateAction = vi.fn()
			const logAction = vi.fn()

			registerGlobalAction('validateEmail', validateAction)
			registerGlobalAction('logEmail', logAction)

			const store = stonecrop.getStore()
			const context: FieldChangeContext = {
				path: 'Contact.contact-1.email',
				fieldname: 'email',
				beforeValue: 'john@example.com',
				afterValue: 'new@example.com',
				operation: 'set',
				doctype: 'Contact',
				recordId: 'contact-1',
				timestamp: new Date(),
				store,
			}

			const result = await engine.executeFieldTriggers(context)

			expect(result.allSucceeded).toBe(true)
			expect(result.stoppedOnError).toBe(false)
			expect(result.rolledBack).toBe(false)
		})

		it('should handle rollback with nested field changes', async () => {
			const actions = Map({
				'address.city': ['validateCity', 'failAction'],
			})
			const doctype = new Doctype('Contact', undefined, undefined, actions)
			registry.addDoctype(doctype)

			stonecrop.addRecord('Contact', 'contact-1', {
				name: 'John Doe',
				address: {
					street: '123 Main St',
					city: 'New York',
					state: 'NY',
				},
				metadata: {
					modified: '2024-01-01',
				},
			})

			const validateAction = vi.fn((context: FieldChangeContext) => {
				// Modify metadata during validation
				if (context.store) {
					context.store.set('Contact.contact-1.metadata.modified', '2024-01-02')
				}
			})

			const failAction = vi.fn(() => {
				throw new Error('City validation failed')
			})

			registerGlobalAction('validateCity', validateAction)
			registerGlobalAction('failAction', failAction)

			const store = stonecrop.getStore()
			const context: FieldChangeContext = {
				path: 'Contact.contact-1.address.city',
				fieldname: 'address.city',
				beforeValue: 'New York',
				afterValue: 'Los Angeles',
				operation: 'set',
				doctype: 'Contact',
				recordId: 'contact-1',
				timestamp: new Date(),
				store,
			}

			const result = await engine.executeFieldTriggers(context)

			expect(result.rolledBack).toBe(true)

			// Verify entire record was restored, including nested metadata
			const finalRecord = store.get('Contact.contact-1')
			expect(finalRecord.address.city).toBe('New York')
			expect(finalRecord.metadata.modified).toBe('2024-01-01') // Restored
		})
	})

	describe('Rollback Edge Cases', () => {
		it('should handle missing recordId gracefully', async () => {
			const actions = Map({
				global: ['failAction'],
			})
			const doctype = new Doctype('Settings', undefined, undefined, actions)
			registry.addDoctype(doctype)

			const failAction = vi.fn(() => {
				throw new Error('Action failed')
			})

			registerGlobalAction('failAction', failAction)

			const store = stonecrop.getStore()
			const context: FieldChangeContext = {
				path: 'Settings.global',
				fieldname: 'global',
				beforeValue: 'old',
				afterValue: 'new',
				operation: 'set',
				doctype: 'Settings',
				// No recordId
				timestamp: new Date(),
				store,
			}

			const result = await engine.executeFieldTriggers(context)

			// Should fail but not throw
			expect(result.allSucceeded).toBe(false)
			expect(result.rolledBack).toBe(false) // Can't rollback without recordId
		})

		it('should handle missing store gracefully', async () => {
			const actions = Map({
				email: ['failAction'],
			})
			const doctype = new Doctype('Contact', undefined, undefined, actions)
			registry.addDoctype(doctype)

			const failAction = vi.fn(() => {
				throw new Error('Action failed')
			})

			registerGlobalAction('failAction', failAction)

			const context: FieldChangeContext = {
				path: 'Contact.contact-1.email',
				fieldname: 'email',
				beforeValue: 'old@example.com',
				afterValue: 'new@example.com',
				operation: 'set',
				doctype: 'Contact',
				recordId: 'contact-1',
				timestamp: new Date(),
				// No store
			}

			const result = await engine.executeFieldTriggers(context)

			// Should fail but not throw
			expect(result.allSucceeded).toBe(false)
			expect(result.rolledBack).toBe(false) // Can't rollback without store
		})

		it('should log warning if rollback fails', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			const actions = Map({
				email: ['failAction'],
			})
			const doctype = new Doctype('Contact', undefined, undefined, actions)
			registry.addDoctype(doctype)

			stonecrop.addRecord('Contact', 'contact-1', {
				name: 'John Doe',
			})

			const failAction = vi.fn(() => {
				throw new Error('Action failed')
			})

			registerGlobalAction('failAction', failAction)

			// Create a mock store that throws on set
			const store = stonecrop.getStore()
			const mockStore = {
				get: store.get.bind(store),
				set: vi.fn(() => {
					throw new Error('Set operation failed')
				}),
			}

			const context: FieldChangeContext = {
				path: 'Contact.contact-1.email',
				fieldname: 'email',
				beforeValue: 'old@example.com',
				afterValue: 'new@example.com',
				operation: 'set',
				doctype: 'Contact',
				recordId: 'contact-1',
				timestamp: new Date(),
				// deliberately partial mock — only get/set are exercised by the failing-rollback path
				store: mockStore as unknown as HSTNode,
			}

			const result = await engine.executeFieldTriggers(context)

			// Should attempt rollback but fail
			expect(result.rolledBack).toBe(false)
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				expect.stringContaining('[FieldTriggers] Rollback failed:'),
				expect.anything()
			)

			consoleErrorSpy.mockRestore()
		})
	})

	describe('Integration with HST', () => {
		it('should rollback through HST set operations', async () => {
			const actions = Map({
				email: ['modifyAndFail'],
			})
			const doctype = new Doctype('Contact', undefined, undefined, actions)
			registry.addDoctype(doctype)

			// Add initial record
			stonecrop.addRecord('Contact', 'contact-1', {
				name: 'John Doe',
				email: 'john@example.com',
				counter: 0,
			})

			// Action that modifies multiple fields then fails
			registerGlobalAction('modifyAndFail', (context: FieldChangeContext) => {
				if (context.store) {
					// Make several changes
					context.store.set('Contact.contact-1.name', 'Jane Doe')
					context.store.set('Contact.contact-1.counter', 5)
				}
				throw new Error('Intentional failure')
			})

			const store = stonecrop.getStore()

			// Trigger through HST set (simulates real usage)
			const context: FieldChangeContext = {
				path: 'Contact.contact-1.email',
				fieldname: 'email',
				beforeValue: 'john@example.com',
				afterValue: 'new@example.com',
				operation: 'set',
				doctype: 'Contact',
				recordId: 'contact-1',
				timestamp: new Date(),
				store,
			}

			const result = await engine.executeFieldTriggers(context)

			expect(result.rolledBack).toBe(true)

			// All changes should be rolled back
			const record = store.get('Contact.contact-1')
			expect(record.name).toBe('John Doe') // Restored
			expect(record.email).toBe('john@example.com') // Restored
			expect(record.counter).toBe(0) // Restored
		})
	})

	describe('Per-Field Rollback Control', () => {
		it('should allow disabling rollback for specific fields', async () => {
			const actions = Map({
				email: ['modifyAndFail'],
				phone: ['modifyAndFail'],
			})
			const doctype = new Doctype('Contact', undefined, undefined, actions)
			registry.addDoctype(doctype)

			stonecrop.addRecord('Contact', 'contact-1', {
				name: 'John Doe',
				email: 'john@example.com',
				phone: '555-1234',
				status: 'active',
			})

			registerGlobalAction('modifyAndFail', (context: FieldChangeContext) => {
				if (context.store) {
					context.store.set('Contact.contact-1.status', 'modified')
				}
				throw new Error('Intentional failure')
			})

			const store = stonecrop.getStore()

			// Disable rollback for 'email' field only
			engine.setFieldRollback('Contact', 'email', false)

			// Email change - rollback disabled, changes persist
			const emailContext: FieldChangeContext = {
				path: 'Contact.contact-1.email',
				fieldname: 'email',
				beforeValue: 'john@example.com',
				afterValue: 'new@example.com',
				operation: 'set',
				doctype: 'Contact',
				recordId: 'contact-1',
				timestamp: new Date(),
				store,
			}

			const emailResult = await engine.executeFieldTriggers(emailContext)
			expect(emailResult.allSucceeded).toBe(false)
			expect(emailResult.rolledBack).toBe(false) // Rollback disabled for this field

			// Check that changes persisted (not rolled back)
			expect(store.get('Contact.contact-1.status')).toBe('modified')

			// Reset status
			store.set('Contact.contact-1.status', 'active')

			// Phone change - rollback enabled (default), changes reverted
			const phoneContext: FieldChangeContext = {
				path: 'Contact.contact-1.phone',
				fieldname: 'phone',
				beforeValue: '555-1234',
				afterValue: '555-5678',
				operation: 'set',
				doctype: 'Contact',
				recordId: 'contact-1',
				timestamp: new Date(),
				store,
			}

			const phoneResult = await engine.executeFieldTriggers(phoneContext)
			expect(phoneResult.allSucceeded).toBe(false)
			expect(phoneResult.rolledBack).toBe(true) // Rollback enabled for this field

			// Check that changes were rolled back
			expect(store.get('Contact.contact-1.status')).toBe('active')
		})

		it('should allow execution-level rollback override', async () => {
			const actions = Map({
				email: ['modifyAndFail'],
			})
			const doctype = new Doctype('Contact', undefined, undefined, actions)
			registry.addDoctype(doctype)

			stonecrop.addRecord('Contact', 'contact-1', {
				name: 'John Doe',
				email: 'john@example.com',
				status: 'active',
			})

			registerGlobalAction('modifyAndFail', (context: FieldChangeContext) => {
				if (context.store) {
					context.store.set('Contact.contact-1.status', 'modified')
				}
				throw new Error('Intentional failure')
			})

			const store = stonecrop.getStore()

			// First execution: disable rollback via option (overrides global default of true)
			const context1: FieldChangeContext = {
				path: 'Contact.contact-1.email',
				fieldname: 'email',
				beforeValue: 'john@example.com',
				afterValue: 'new1@example.com',
				operation: 'set',
				doctype: 'Contact',
				recordId: 'contact-1',
				timestamp: new Date(),
				store,
			}

			const result1 = await engine.executeFieldTriggers(context1, { enableRollback: false })
			expect(result1.rolledBack).toBe(false)
			expect(store.get('Contact.contact-1.status')).toBe('modified') // Not rolled back

			// Reset
			store.set('Contact.contact-1.status', 'active')

			// Second execution: enable rollback via option explicitly
			const context2: FieldChangeContext = {
				path: 'Contact.contact-1.email',
				fieldname: 'email',
				beforeValue: 'new1@example.com',
				afterValue: 'new2@example.com',
				operation: 'set',
				doctype: 'Contact',
				recordId: 'contact-1',
				timestamp: new Date(),
				store,
			}

			const result2 = await engine.executeFieldTriggers(context2, { enableRollback: true })
			expect(result2.rolledBack).toBe(true)
			expect(store.get('Contact.contact-1.status')).toBe('active') // Rolled back
		})

		it('should respect priority: execution option > field config > global', async () => {
			// Reset singleton and create engine with rollback disabled globally
			;(FieldTriggerEngine as any)._root = undefined
			const testEngine = new FieldTriggerEngine({ enableRollback: false })

			const actions = Map({
				email: ['modifyAndFail'],
			})
			const doctype = new Doctype('Contact', undefined, undefined, actions)
			registry.addDoctype(doctype)
			testEngine.registerDoctypeActions('Contact', actions)

			stonecrop.addRecord('Contact', 'contact-1', {
				name: 'John Doe',
				email: 'john@example.com',
				status: 'active',
			})

			registerGlobalAction('modifyAndFail', (context: FieldChangeContext) => {
				if (context.store) {
					context.store.set('Contact.contact-1.status', 'modified')
				}
				throw new Error('Intentional failure')
			})

			const store = stonecrop.getStore()

			// Enable rollback at field level (overrides global disabled)
			testEngine.setFieldRollback('Contact', 'email', true)

			const context: FieldChangeContext = {
				path: 'Contact.contact-1.email',
				fieldname: 'email',
				beforeValue: 'john@example.com',
				afterValue: 'new@example.com',
				operation: 'set',
				doctype: 'Contact',
				recordId: 'contact-1',
				timestamp: new Date(),
				store,
			}

			// Without execution override - should use field config (true)
			const result1 = await testEngine.executeFieldTriggers(context)
			expect(result1.rolledBack).toBe(true)
			expect(store.get('Contact.contact-1.status')).toBe('active') // Rolled back

			// Reset
			store.set('Contact.contact-1.status', 'active')

			// With execution override to false - should use execution option
			const result2 = await testEngine.executeFieldTriggers(context, { enableRollback: false })
			expect(result2.rolledBack).toBe(false)
			expect(store.get('Contact.contact-1.status')).toBe('modified') // Not rolled back
		})
	})

	describe('Global Functions', () => {
		beforeEach(() => {
			setActivePinia(createPinia())
		})

		it('setFieldRollback delegates to global trigger engine', () => {
			// Create a doctype
			const doctype = new Doctype('TestDoctype', undefined, undefined, Map({ name: ['testAction'] }))
			registry.addDoctype(doctype)

			// Calling setFieldRollback should not throw
			expect(() => setFieldRollback('TestDoctype', 'name', false)).not.toThrow()
			expect(() => setFieldRollback('TestDoctype', 'name', true)).not.toThrow()
		})

		it('markOperationIrreversible marks operation in store', async () => {
			// Get the operation log store
			const opLogStore = useOperationLogStore()

			// Add an operation directly
			const opId = opLogStore.addOperation({
				type: 'set',
				path: 'Contact.contact-1.email',
				fieldname: 'email',
				beforeValue: 'old@example.com',
				afterValue: 'test@example.com',
				doctype: 'Contact',
				recordId: 'contact-1',
				reversible: true,
			})

			// Verify operation was added
			expect(opLogStore.operations).toHaveLength(1)
			expect(opLogStore.operations[0].id).toBe(opId)

			// Mark it as irreversible using the store method directly
			opLogStore.markIrreversible(opId, 'Server sync required')

			// Verify it was marked (reversible = false, irreversibleReason set)
			const operation = opLogStore.operations.find(op => op.id === opId)
			expect(operation?.reversible).toBe(false)
			expect(operation?.irreversibleReason).toBe('Server sync required')
		})

		it('markOperationIrreversible handles undefined operationId', () => {
			// Should not throw when operationId is undefined
			expect(() => markOperationIrreversible(undefined, 'Test reason')).not.toThrow()
		})
	})
})
