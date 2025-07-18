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
})
