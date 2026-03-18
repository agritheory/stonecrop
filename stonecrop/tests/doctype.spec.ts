import { describe, it, expect } from 'vitest'
import { List, Map } from 'immutable'
import type { UnknownMachineConfig } from 'xstate'

import Doctype from '../src/doctype'
import type { SchemaTypes } from '@stonecrop/aform'

describe('Doctype class', () => {
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

	it('creates a Doctype instance with required properties', () => {
		const doctype = new Doctype('Task', mockSchema, mockWorkflow, mockActions)

		expect(doctype.doctype).toBe('Task')
		expect(doctype.schema).toBe(mockSchema)
		expect(doctype.workflow).toBe(mockWorkflow)
		expect(doctype.actions).toBe(mockActions)
		expect(doctype.component).toBeUndefined()
	})

	it('creates a Doctype instance with optional component', () => {
		const mockComponent = { name: 'TaskComponent' }
		const doctype = new Doctype('Task', mockSchema, mockWorkflow, mockActions, mockComponent)

		expect(doctype.component).toBe(mockComponent)
	})

	it('generates correct slug for simple doctype names', () => {
		const doctype = new Doctype('Task', mockSchema, mockWorkflow, mockActions)
		expect(doctype.slug).toBe('task')
	})

	it('generates correct slug for camelCase doctype names', () => {
		const doctype = new Doctype('taskItem', mockSchema, mockWorkflow, mockActions)
		expect(doctype.slug).toBe('task-item')
	})

	it('generates correct slug for PascalCase doctype names', () => {
		const doctype = new Doctype('UserProfile', mockSchema, mockWorkflow, mockActions)
		expect(doctype.slug).toBe('user-profile')
	})

	it('generates correct slug for names with spaces', () => {
		const doctype = new Doctype('TaskItem', mockSchema, mockWorkflow, mockActions)
		expect(doctype.slug).toBe('task-item')
	})

	it('generates correct slug for names with underscores', () => {
		const doctype = new Doctype('task_item', mockSchema, mockWorkflow, mockActions)
		expect(doctype.slug).toBe('task-item')
	})

	it('handles missing schema', () => {
		// TODO: should these fail instead during init?
		const emptySchema = List<SchemaTypes>()
		const doctype = new Doctype('Task', emptySchema, mockWorkflow, mockActions)

		expect(doctype.schema).toBe(emptySchema)
		expect(doctype.schema?.size).toBe(0)
	})

	it('handles missing actions', () => {
		// TODO: should these fail instead during init?
		const emptyActions = Map<string, string[]>()
		const doctype = new Doctype('Task', mockSchema, mockWorkflow, emptyActions)

		expect(doctype.actions).toBe(emptyActions)
		expect(doctype.actions?.size).toBe(0)
	})

	describe('getAvailableTransitions', () => {
		it('returns transitions for a known state', () => {
			const doctype = new Doctype('Task', mockSchema, mockWorkflow, mockActions)

			const transitions = doctype.getAvailableTransitions('draft')
			expect(transitions).toHaveLength(1)
			expect(transitions[0].name).toBe('load')
			// The workflow uses object-style targets ({ target: 'pending' }), so targetState is 'unknown'
			expect(transitions[0].targetState).toBe('unknown')
		})

		it('returns multiple transitions when the state has more than one', () => {
			const doctype = new Doctype('Task', mockSchema, mockWorkflow, mockActions)

			const transitions = doctype.getAvailableTransitions('pending')
			expect(transitions).toHaveLength(2)
			const names = transitions.map(t => t.name)
			expect(names).toContain('approve')
			expect(names).toContain('reject')
			// Both use object-style targets
			transitions.forEach(t => expect(t.targetState).toBe('unknown'))
		})

		it('returns an empty array for a final state with no transitions', () => {
			const doctype = new Doctype('Task', mockSchema, mockWorkflow, mockActions)

			const transitions = doctype.getAvailableTransitions('completed')
			expect(transitions).toEqual([])
		})

		it('returns an empty array for an unknown state', () => {
			const doctype = new Doctype('Task', mockSchema, mockWorkflow, mockActions)

			const transitions = doctype.getAvailableTransitions('nonexistent')
			expect(transitions).toEqual([])
		})

		it('returns an empty array when workflow has no states', () => {
			const noStatesWorkflow: UnknownMachineConfig = {
				id: 'empty',
				initial: 'draft',
			}
			const doctype = new Doctype('Task', mockSchema, noStatesWorkflow, mockActions)

			const transitions = doctype.getAvailableTransitions('draft')
			expect(transitions).toEqual([])
		})

		it('returns an empty array when workflow is undefined', () => {
			const doctype = new Doctype('Task', mockSchema, undefined as any, mockActions)

			const transitions = doctype.getAvailableTransitions('draft')
			expect(transitions).toEqual([])
		})

		it('handles object-style transition targets gracefully (returns "unknown" for non-string targets)', () => {
			// When a workflow uses XState object-style targets like { target: 'X', actions: [] },
			// getAvailableTransitions cannot extract an obj string so it falls back to 'unknown'
			const objectTargetWorkflow: UnknownMachineConfig = {
				id: 'object-target',
				initial: 'idle',
				states: {
					idle: { on: { START: { target: 'running', actions: ['log'] } } },
					running: { type: 'final' },
				},
			}
			const doctype = new Doctype('Task', mockSchema, objectTargetWorkflow, mockActions)

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
			const doctype = new Doctype('Task', mockSchema, stringTargetWorkflow, mockActions)

			const transitions = doctype.getAvailableTransitions('open')
			expect(transitions).toHaveLength(1)
			expect(transitions[0].name).toBe('CLOSE')
			expect(transitions[0].targetState).toBe('closed')
		})
	})

	describe('fromObject', () => {
		it('creates Doctype from obj object with all fields', () => {
			const obj = {
				name: 'Plan',
				fields: [
					{ fieldname: 'title', label: 'Title', fieldtype: 'Data' },
					{ fieldname: 'status', label: 'Status', fieldtype: 'Data' },
				] as SchemaTypes[],
				workflow: {
					id: 'plan',
					initial: 'draft',
					states: { draft: {}, submitted: {} },
				},
				actions: {
					save: ['validateData', 'saveData'],
					submit: ['validateData', 'submitData'],
				},
			}

			const doctype = Doctype.fromObject(obj)

			expect(doctype.doctype).toBe('Plan')
			expect(doctype.name).toBe('Plan')
			expect(doctype.schema?.size).toBe(2)
			expect(doctype.schema?.first()?.fieldname).toBe('title')
			expect(doctype.workflow?.id).toBe('plan')
			expect(doctype.actions?.size).toBe(2)
			expect(doctype.actions?.get('save')).toEqual(['validateData', 'saveData'])
		})

		it('creates Doctype from obj object with minimal fields', () => {
			const obj = {
				name: 'Task',
			}

			const doctype = Doctype.fromObject(obj)

			expect(doctype.doctype).toBe('Task')
			expect(doctype.schema?.size).toBe(0)
			expect(doctype.actions?.size).toBe(0)
			expect(doctype.workflow).toBeUndefined()
		})

		it('creates Doctype from obj object with empty fields', () => {
			const obj = {
				name: 'Empty',
				fields: [],
				actions: {},
			}

			const doctype = Doctype.fromObject(obj)

			expect(doctype.doctype).toBe('Empty')
			expect(doctype.schema?.size).toBe(0)
			expect(doctype.actions?.size).toBe(0)
		})

		it('handles undefined fields gracefully', () => {
			const obj = {
				name: 'NoFields',
				fields: undefined,
				workflow: { id: 'test', initial: 'start', states: { start: {} } },
			}

			const doctype = Doctype.fromObject(obj)

			expect(doctype.doctype).toBe('NoFields')
			expect(doctype.schema?.size).toBe(0)
			expect(doctype.workflow?.id).toBe('test')
		})

		it('handles undefined actions gracefully', () => {
			const obj = {
				name: 'NoActions',
				actions: undefined,
			}

			const doctype = Doctype.fromObject(obj)

			expect(doctype.doctype).toBe('NoActions')
			expect(doctype.actions?.size).toBe(0)
		})

		it('preserves workflow configuration', () => {
			const obj = {
				name: 'Workflow',
				workflow: {
					id: 'approval',
					initial: 'draft',
					states: {
						draft: { on: { SUBMIT: 'pending' } },
						pending: { on: { APPROVE: 'approved', REJECT: 'draft' } },
						approved: { type: 'final' as const },
					},
				},
			}

			const doctype = Doctype.fromObject(obj)

			expect(doctype.workflow?.id).toBe('approval')
			expect(doctype.workflow?.initial).toBe('draft')
			// String-style target: 'SUBMIT: 'pending'' extracts targetState correctly
			expect(doctype.getAvailableTransitions('draft')).toEqual([{ name: 'SUBMIT', targetState: 'pending' }])
		})
	})

	describe('getSchemaArray', () => {
		it('returns empty array when schema is undefined', () => {
			const doctype = new Doctype('Task', undefined as any, mockWorkflow, mockActions)
			expect(doctype.getSchemaArray()).toEqual([])
		})

		it('returns empty array when schema is empty List', () => {
			const emptySchema = List<SchemaTypes>()
			const doctype = new Doctype('Task', emptySchema, mockWorkflow, mockActions)

			expect(doctype.getSchemaArray()).toEqual([])
		})

		it('converts Immutable.List to array', () => {
			const doctype = new Doctype('Task', mockSchema, mockWorkflow, mockActions)
			const schemaArray = doctype.getSchemaArray()

			expect(Array.isArray(schemaArray)).toBe(true)
			expect(schemaArray).toHaveLength(2)
			expect(schemaArray[0].fieldname).toBe('title')
		})

		it('works with Doctype.fromObject() result', () => {
			const obj = {
				name: 'Plan',
				fields: [
					{ fieldname: 'title', label: 'Title', fieldtype: 'Data' },
					{ fieldname: 'status', label: 'Status', fieldtype: 'Data' },
				] as SchemaTypes[],
			}

			const doctype = Doctype.fromObject(obj)
			const schemaArray = doctype.getSchemaArray()

			expect(Array.isArray(schemaArray)).toBe(true)
			expect(schemaArray).toHaveLength(2)
			expect(schemaArray[0].fieldname).toBe('title')
		})
	})

	describe('getActionsObject', () => {
		it('returns empty object when actions is undefined', () => {
			const doctype = new Doctype('Task', mockSchema, mockWorkflow, undefined as any)
			expect(doctype.getActionsObject()).toEqual({})
		})

		it('returns empty object when actions is empty Map', () => {
			const emptyActions = Map<string, string[]>()
			const doctype = new Doctype('Task', mockSchema, mockWorkflow, emptyActions)

			expect(doctype.getActionsObject()).toEqual({})
		})

		it('converts Immutable.Map to obj object', () => {
			const doctype = new Doctype('Task', mockSchema, mockWorkflow, mockActions)
			const actionsObject = doctype.getActionsObject()

			expect(actionsObject).toEqual({
				load: ['loadData'],
				save: ['validateData', 'saveData'],
				delete: ['confirmDelete', 'deleteData'],
			})
		})
	})
})
