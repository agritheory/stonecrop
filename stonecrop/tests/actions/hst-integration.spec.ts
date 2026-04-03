import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Map, List } from 'immutable'
import type { UnknownMachineConfig } from 'xstate'
import Doctype from '../../src/doctype'
import Registry from '../../src/registry'
import { Stonecrop } from '../../src/stonecrop'
import { registerGlobalAction } from '../../src/field-triggers'
import type { FieldActionFunction } from '../../src/types/field-triggers'

describe('Field Trigger Integration', () => {
	let registry: Registry
	let stonecrop: Stonecrop

	beforeEach(() => {
		// Initialize clean instances
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
		registry = new Registry()
		stonecrop = new Stonecrop(registry)
	})

	it('should register and trigger field actions through HST', async () => {
		// Register a test action
		const validateEmailPrimary = vi.fn()
		registerGlobalAction('validateEmailPrimary', validateEmailPrimary)

		// Create a doctype with field triggers in actions map
		const schema = List([
			{ fieldname: 'emailAddress', fieldtype: 'Doctype', cardinality: 'noneOrMany', label: 'Email Addresses' },
		])
		const workflow: UnknownMachineConfig = {
			id: 'task',
			initial: 'draft',
			states: {
				draft: { on: { load: { target: 'pending' } } },
				pending: { type: 'final' },
			},
		}
		const actions = Map([
			['emailAddress.*.is_primary', ['validateEmailPrimary']], // field trigger pattern
			['saveTask', ['someRegularAction']], // regular action
		])

		const doctype = new Doctype('Task', schema, workflow, actions)
		registry.addDoctype(doctype)

		// Initialize HST store with data
		const store = stonecrop.getStore()
		stonecrop.addRecord('task', '123', {
			emailAddress: [{ email: 'test@example.com', is_primary: false }],
		})

		// Trigger field change that should execute the action
		store.set('task.123.emailAddress.0.is_primary', true)

		// Wait for async field triggers to complete
		await new Promise(resolve => setTimeout(resolve, 10))

		// Verify the action was called
		expect(validateEmailPrimary).toHaveBeenCalledWith(
			expect.objectContaining({
				path: 'task.123.emailAddress.0.is_primary',
				fieldname: 'emailAddress.0.is_primary',
				afterValue: true,
				doctype: 'task', // Uses slug for HST path resolution
				recordId: '123',
			})
		)
	})

	it('should handle multiple triggers on the same field', async () => {
		const action1 = vi.fn()
		const action2 = vi.fn()

		registerGlobalAction('action1', action1)
		registerGlobalAction('action2', action2)

		const schema = List([{ fieldname: 'emailAddress', fieldtype: 'Data', label: 'Email' }])
		const workflow: UnknownMachineConfig = {
			id: 'task',
			initial: 'draft',
			states: {
				draft: { on: { load: { target: 'pending' } } },
				pending: { type: 'final' },
			},
		}
		const actions = Map([
			['emailAddress', ['action1', 'action2']], // multiple actions for same field
		])

		const doctype = new Doctype('Task', schema, workflow, actions)
		registry.addDoctype(doctype)

		const store = stonecrop.getStore()
		stonecrop.addRecord('task', '123', { emailAddress: 'old@example.com' })

		store.set('task.123.emailAddress', 'new@example.com')

		// Wait a bit for the async field triggers to complete
		await new Promise(resolve => setTimeout(resolve, 10))

		expect(action1).toHaveBeenCalled()
		expect(action2).toHaveBeenCalled()
	})

	it('should work with nested object paths', async () => {
		const validateName = vi.fn()
		registerGlobalAction('validateName', validateName)

		const schema = List([{ fieldname: 'profile', fieldtype: 'Section', label: 'Profile' }])
		const workflow: UnknownMachineConfig = {
			id: 'user',
			initial: 'active',
			states: {
				active: { on: { load: { target: 'pending' } } },
				pending: { type: 'final' },
			},
		}
		const actions = Map([['profile.name', ['validateName']]])

		const doctype = new Doctype('User', schema, workflow, actions)
		registry.addDoctype(doctype)

		const store = stonecrop.getStore()
		stonecrop.addRecord('user', '123', { profile: { name: 'John Doe' } })

		store.set('user.123.profile.name', 'Jane Doe')

		// Wait for async field triggers to complete
		await new Promise(resolve => setTimeout(resolve, 10))

		expect(validateName).toHaveBeenCalledWith(
			expect.objectContaining({
				fieldname: 'profile.name',
				afterValue: 'Jane Doe',
			})
		)
	})

	it('should handle trigger errors gracefully without breaking HST operations', async () => {
		const errorAction = vi.fn().mockImplementation(() => {
			throw new Error('Test trigger error')
		})
		registerGlobalAction('errorAction', errorAction)

		const schema = List([{ fieldname: 'title', fieldtype: 'Data', label: 'Title' }])
		const workflow: UnknownMachineConfig = {
			id: 'task',
			initial: 'draft',
			states: {
				draft: { on: { load: { target: 'pending' } } },
				pending: { type: 'final' },
			},
		}
		const actions = Map([['title', ['errorAction']]])

		const doctype = new Doctype('Task', schema, workflow, actions)
		registry.addDoctype(doctype)

		const store = stonecrop.getStore()
		stonecrop.addRecord('task', '123', { title: 'Original Title' })

		// Should not throw, but continue with HST operation
		expect(() => {
			store.set('task.123.title', 'New Title')
		}).not.toThrow()

		// HST should still update the value despite trigger error
		expect(store.get('task.123.title')).toBe('New Title')
		expect(errorAction).toHaveBeenCalled()
	})
})
