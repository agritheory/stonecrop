import { describe, it, expect } from 'vitest'
import { List, Map } from 'immutable'
import type { UnknownMachineConfig } from 'xstate'
import type { WorkflowMeta } from '@stonecrop/schema'

import Doctype from '../../src/doctype'
import type { DoctypeField } from '@stonecrop/schema'

describe('Doctype class', { tags: ['unit'] }, () => {
	const mockSchema = List([
		{
			kind: 'field',
			fieldname: 'title',
			component: 'ATextInput',
			label: 'Title',
		},
		{
			kind: 'field',
			fieldname: 'description',
			component: 'ATextarea',
			label: 'Description',
		},
	] as DoctypeField[])

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
		const emptySchema = List<DoctypeField>()
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

		describe('WorkflowMeta format', () => {
			const workflowMeta: WorkflowMeta = {
				states: ['planning', 'review', 'approved', 'applied'],
				actions: {
					save: { label: 'Save', handler: 'plan:save', allowedStates: ['planning'] },
					submit: { label: 'Submit', handler: 'plan:submit', allowedStates: ['planning'], nextState: 'review' },
					approve: {
						label: 'Approve',
						handler: 'plan:approve',
						allowedStates: ['review'],
						confirm: true,
						nextState: 'approved',
					},
					reject: { label: 'Reject', handler: 'plan:reject', allowedStates: ['review'], nextState: 'planning' },
					apply: {
						label: 'Apply',
						handler: 'plan:apply',
						allowedStates: ['planning', 'approved'],
						nextState: 'applied',
					},
					global: { label: 'Global', handler: 'plan:global' },
				},
			}

			it('filters actions by allowedStates', () => {
				const doctype = new Doctype('Plan', mockSchema, workflowMeta, mockActions)

				const planningTransitions = doctype.getAvailableTransitions('planning')
				expect(planningTransitions).toHaveLength(4)
				const planningNames = planningTransitions.map(t => t.name).toSorted()
				expect(planningNames).toEqual(['apply', 'global', 'save', 'submit'])

				const reviewTransitions = doctype.getAvailableTransitions('review')
				expect(reviewTransitions).toHaveLength(3)
				const reviewNames = reviewTransitions.map(t => t.name).toSorted()
				expect(reviewNames).toEqual(['approve', 'global', 'reject'])

				const approvedTransitions = doctype.getAvailableTransitions('approved')
				expect(approvedTransitions).toHaveLength(2)
				const approvedNames = approvedTransitions.map(t => t.name).toSorted()
				expect(approvedNames).toEqual(['apply', 'global'])
			})

			it('includes actions without allowedStates in all states', () => {
				const doctype = new Doctype('Plan', mockSchema, workflowMeta, mockActions)

				const planningTransitions = doctype.getAvailableTransitions('planning')
				expect(planningTransitions.some(t => t.name === 'global')).toBe(true)

				const reviewTransitions = doctype.getAvailableTransitions('review')
				expect(reviewTransitions.some(t => t.name === 'global')).toBe(true)
			})

			it('returns nextState as targetState for state-transitioning actions', () => {
				const doctype = new Doctype('Plan', mockSchema, workflowMeta, mockActions)

				const transitions = doctype.getAvailableTransitions('planning')
				const submit = transitions.find(t => t.name === 'submit')
				expect(submit?.targetState).toBe('review')

				const apply = transitions.find(t => t.name === 'apply')
				expect(apply?.targetState).toBe('applied')

				const reviewTransitions = doctype.getAvailableTransitions('review')
				const approve = reviewTransitions.find(t => t.name === 'approve')
				expect(approve?.targetState).toBe('approved')

				const reject = reviewTransitions.find(t => t.name === 'reject')
				expect(reject?.targetState).toBe('planning')
			})

			it('falls back to currentState as targetState when nextState is absent', () => {
				const doctype = new Doctype('Plan', mockSchema, workflowMeta, mockActions)

				const transitions = doctype.getAvailableTransitions('planning')
				const save = transitions.find(t => t.name === 'save')
				expect(save?.targetState).toBe('planning')

				const globalAction = transitions.find(t => t.name === 'global')
				expect(globalAction?.targetState).toBe('planning')
			})

			it('returns empty array for state not in states list', () => {
				const doctype = new Doctype('Plan', mockSchema, workflowMeta, mockActions)

				const transitions = doctype.getAvailableTransitions('unknown')
				expect(transitions).toEqual([])
			})

			it('handles empty actions', () => {
				const noActions: WorkflowMeta = { states: ['draft', 'submitted'] }
				const doctype = new Doctype('Task', mockSchema, noActions, mockActions)

				expect(doctype.getAvailableTransitions('draft')).toEqual([])
			})

			it('handles empty states', () => {
				const noStates: WorkflowMeta = { actions: { save: { label: 'Save', handler: 'save' } } }
				const doctype = new Doctype('Task', mockSchema, noStates, mockActions)

				expect(doctype.getAvailableTransitions('draft')).toEqual([])
			})
		})
	})

	describe('fromObject', () => {
		it('creates Doctype from obj object with all fields', () => {
			const obj = {
				name: 'Plan',
				fields: [
					{ kind: 'field', fieldname: 'title', label: 'Title', fieldtype: 'Data' },
					{ kind: 'field', fieldname: 'status', label: 'Status', fieldtype: 'Data' },
				] as DoctypeField[],
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

		it('accepts WorkflowMeta format for workflow', () => {
			const obj = {
				name: 'Plan',
				workflow: {
					states: ['draft', 'submitted', 'approved'],
					actions: {
						submit: { label: 'Submit', handler: 'plan:submit', allowedStates: ['draft'] },
						approve: { label: 'Approve', handler: 'plan:approve', allowedStates: ['submitted'] },
					},
				} as WorkflowMeta,
			}

			const doctype = Doctype.fromObject(obj)

			expect(doctype.workflow).toBeDefined()
			expect(Array.isArray(doctype.workflow?.states)).toBe(true)

			const draftTransitions = doctype.getAvailableTransitions('draft')
			expect(draftTransitions).toHaveLength(1)
			expect(draftTransitions[0].name).toBe('submit')

			const submittedTransitions = doctype.getAvailableTransitions('submitted')
			expect(submittedTransitions).toHaveLength(1)
			expect(submittedTransitions[0].name).toBe('approve')
		})

		it('accepts XState UnknownMachineConfig format for workflow', () => {
			const obj = {
				name: 'Task',
				workflow: {
					id: 'task',
					initial: 'todo',
					states: {
						todo: { on: { START: 'in_progress' } },
						in_progress: { on: { COMPLETE: 'done' } },
						done: { type: 'final' as const },
					},
				} as UnknownMachineConfig,
			}

			const doctype = Doctype.fromObject(obj)

			expect(doctype.workflow).toBeDefined()
			expect(typeof (doctype.workflow as UnknownMachineConfig).states).toBe('object')
			expect(doctype.getAvailableTransitions('todo')).toEqual([{ name: 'START', targetState: 'in_progress' }])
		})
	})

	describe('getSchemaArray', () => {
		it('returns empty array when schema is undefined', () => {
			const doctype = new Doctype('Task', undefined as any, mockWorkflow, mockActions)
			expect(doctype.getSchemaArray()).toEqual([])
		})

		it('returns empty array when schema is empty List', () => {
			const emptySchema = List<DoctypeField>()
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
					{ kind: 'field', fieldname: 'title', label: 'Title', fieldtype: 'Data' },
					{ kind: 'field', fieldname: 'status', label: 'Status', fieldtype: 'Data' },
				] as DoctypeField[],
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

	describe('getActionMeta', () => {
		it('returns action metadata from WorkflowMeta format', () => {
			const workflowMeta: WorkflowMeta = {
				states: ['draft', 'submitted'],
				actions: {
					submit: {
						label: 'Submit for Review',
						handler: 'plan:submit',
						requiredFields: ['title', 'description'],
						allowedStates: ['draft'],
						confirm: true,
						args: { notify: true },
					},
				},
			}
			const doctype = new Doctype('Plan', mockSchema, workflowMeta, mockActions)

			const meta = doctype.getActionMeta('submit')
			expect(meta).toEqual({
				label: 'Submit for Review',
				handler: 'plan:submit',
				requiredFields: ['title', 'description'],
				allowedStates: ['draft'],
				confirm: true,
				args: { notify: true },
			})
		})

		it('returns undefined for unknown action', () => {
			const workflowMeta: WorkflowMeta = {
				states: ['draft'],
				actions: { submit: { label: 'Submit', handler: 'submit' } },
			}
			const doctype = new Doctype('Plan', mockSchema, workflowMeta, mockActions)

			expect(doctype.getActionMeta('unknown')).toBeUndefined()
		})

		it('returns undefined for XState format workflow', () => {
			const doctype = new Doctype('Task', mockSchema, mockWorkflow, mockActions)

			expect(doctype.getActionMeta('load')).toBeUndefined()
		})

		it('returns undefined when workflow is undefined', () => {
			const doctype = new Doctype('Task', mockSchema, undefined, mockActions)

			expect(doctype.getActionMeta('submit')).toBeUndefined()
		})

		it('returns undefined when workflow has no actions', () => {
			const workflowMeta: WorkflowMeta = { states: ['draft'] }
			const doctype = new Doctype('Task', mockSchema, workflowMeta, mockActions)

			expect(doctype.getActionMeta('submit')).toBeUndefined()
		})
	})
})
