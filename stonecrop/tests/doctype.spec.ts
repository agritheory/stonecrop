import { describe, it, expect } from 'vitest'
import { List, Map } from 'immutable'
import type { UnknownMachineConfig } from 'xstate'

import DoctypeMeta from '../src/doctype'
import type { SchemaTypes } from '@stonecrop/aform'

describe('DoctypeMeta class', () => {
	const mockSchema = List([
		{
			fieldname: 'title',
			component: 'ATextInput',
			label: 'Title',
		},
		{
			fieldname: 'description',
			component: 'ATextarea',
			label: 'Description',
		},
	] as SchemaTypes[])

	const mockWorkflow: UnknownMachineConfig = {
		id: 'task',
		initial: 'draft',
		states: {
			draft: { on: { load: { target: 'pending' } } },
			pending: {
				on: {
					approve: { target: 'completed' },
					reject: { target: 'draft' },
				},
			},
			completed: { type: 'final' },
		},
	}

	const mockActions = Map({
		load: ['loadData'],
		save: ['validateData', 'saveData'],
		delete: ['confirmDelete', 'deleteData'],
	})

	it('creates a DoctypeMeta instance with required properties', () => {
		const doctype = new DoctypeMeta('Task', mockSchema, mockWorkflow, mockActions)

		expect(doctype.doctype).toBe('Task')
		expect(doctype.schema).toBe(mockSchema)
		expect(doctype.workflow).toBe(mockWorkflow)
		expect(doctype.actions).toBe(mockActions)
		expect(doctype.component).toBeUndefined()
	})

	it('creates a DoctypeMeta instance with optional component', () => {
		const mockComponent = { name: 'TaskComponent' }
		const doctype = new DoctypeMeta('Task', mockSchema, mockWorkflow, mockActions, mockComponent)

		expect(doctype.component).toBe(mockComponent)
	})

	it('generates correct slug for simple doctype names', () => {
		const doctype = new DoctypeMeta('Task', mockSchema, mockWorkflow, mockActions)
		expect(doctype.slug).toBe('task')
	})

	it('generates correct slug for camelCase doctype names', () => {
		const doctype = new DoctypeMeta('taskItem', mockSchema, mockWorkflow, mockActions)
		expect(doctype.slug).toBe('task-item')
	})

	it('generates correct slug for PascalCase doctype names', () => {
		const doctype = new DoctypeMeta('UserProfile', mockSchema, mockWorkflow, mockActions)
		expect(doctype.slug).toBe('user-profile')
	})

	it('generates correct slug for names with spaces', () => {
		const doctype = new DoctypeMeta('TaskItem', mockSchema, mockWorkflow, mockActions)
		expect(doctype.slug).toBe('task-item')
	})

	it('generates correct slug for names with underscores', () => {
		const doctype = new DoctypeMeta('task_item', mockSchema, mockWorkflow, mockActions)
		expect(doctype.slug).toBe('task-item')
	})

	it('handles missing schema', () => {
		// TODO: should these fail instead during init?
		const emptySchema = List<SchemaTypes>()
		const doctype = new DoctypeMeta('Task', emptySchema, mockWorkflow, mockActions)

		expect(doctype.schema).toBe(emptySchema)
		expect(doctype.schema?.size).toBe(0)
	})

	it('handles missing actions', () => {
		// TODO: should these fail instead during init?
		const emptyActions = Map<string, string[]>()
		const doctype = new DoctypeMeta('Task', mockSchema, mockWorkflow, emptyActions)

		expect(doctype.actions).toBe(emptyActions)
		expect(doctype.actions?.size).toBe(0)
	})

	describe('getAvailableTransitions', () => {
		it('returns transitions for a known state', () => {
			const doctype = new DoctypeMeta('Task', mockSchema, mockWorkflow, mockActions)

			const transitions = doctype.getAvailableTransitions('draft')
			expect(transitions).toHaveLength(1)
			expect(transitions[0].name).toBe('load')
			// The workflow uses object-style targets ({ target: 'pending' }), so targetState is 'unknown'
			expect(transitions[0].targetState).toBe('unknown')
		})

		it('returns multiple transitions when the state has more than one', () => {
			const doctype = new DoctypeMeta('Task', mockSchema, mockWorkflow, mockActions)

			const transitions = doctype.getAvailableTransitions('pending')
			expect(transitions).toHaveLength(2)
			const names = transitions.map(t => t.name)
			expect(names).toContain('approve')
			expect(names).toContain('reject')
			// Both use object-style targets
			transitions.forEach(t => expect(t.targetState).toBe('unknown'))
		})

		it('returns an empty array for a final state with no transitions', () => {
			const doctype = new DoctypeMeta('Task', mockSchema, mockWorkflow, mockActions)

			const transitions = doctype.getAvailableTransitions('completed')
			expect(transitions).toEqual([])
		})

		it('returns an empty array for an unknown state', () => {
			const doctype = new DoctypeMeta('Task', mockSchema, mockWorkflow, mockActions)

			const transitions = doctype.getAvailableTransitions('nonexistent')
			expect(transitions).toEqual([])
		})

		it('returns an empty array when workflow has no states', () => {
			const noStatesWorkflow: UnknownMachineConfig = {
				id: 'empty',
				initial: 'draft',
			}
			const doctype = new DoctypeMeta('Task', mockSchema, noStatesWorkflow, mockActions)

			const transitions = doctype.getAvailableTransitions('draft')
			expect(transitions).toEqual([])
		})

		it('returns an empty array when workflow is undefined', () => {
			const doctype = new DoctypeMeta('Task', mockSchema, undefined as any, mockActions)

			const transitions = doctype.getAvailableTransitions('draft')
			expect(transitions).toEqual([])
		})

		it('handles object-style transition targets gracefully (returns "unknown" for non-string targets)', () => {
			// When a workflow uses XState object-style targets like { target: 'X', actions: [] },
			// getAvailableTransitions cannot extract a plain string so it falls back to 'unknown'
			const objectTargetWorkflow: UnknownMachineConfig = {
				id: 'object-target',
				initial: 'idle',
				states: {
					idle: { on: { START: { target: 'running', actions: ['log'] } } },
					running: { type: 'final' },
				},
			}
			const doctype = new DoctypeMeta('Task', mockSchema, objectTargetWorkflow, mockActions)

			const transitions = doctype.getAvailableTransitions('idle')
			expect(transitions).toHaveLength(1)
			expect(transitions[0].name).toBe('START')
			expect(transitions[0].targetState).toBe('unknown')
		})

		it('handles string-style transition targets correctly', () => {
			const stringTargetWorkflow: UnknownMachineConfig = {
				id: 'string-target',
				initial: 'open',
				states: {
					open: { on: { CLOSE: 'closed' } },
					closed: { type: 'final' },
				},
			}
			const doctype = new DoctypeMeta('Task', mockSchema, stringTargetWorkflow, mockActions)

			const transitions = doctype.getAvailableTransitions('open')
			expect(transitions).toHaveLength(1)
			expect(transitions[0].name).toBe('CLOSE')
			expect(transitions[0].targetState).toBe('closed')
		})
	})
})
