import type { WorkflowMeta } from '@stonecrop/schema'
import { describe, expect, it } from 'vitest'

import {
	addTrigger,
	formatOn,
	nextTriggerKey,
	parseOnInput,
	projectWorkflowRows,
	removeTrigger,
	writeActionField,
	writeTriggerField,
} from '../src/runtime/app/components/docbuilderActions'

// A workflow carrying every row kind: a transition, a stateless Command, and a Trigger.
const workflow: WorkflowMeta = {
	states: ['Draft', 'Pending'],
	actions: {
		submit: { label: 'Submit', allowedStates: ['Draft'], nextState: 'Pending' },
		email: { label: 'Email', stateless: true },
	},
	triggers: {
		dateOrder: {
			label: 'Date order',
			on: ['createdAt', 'updatedAt'],
			clientHandler: "setError('updatedAt', 'bad')",
		},
	},
}

describe('projectWorkflowRows', () => {
	it('projects a transition action into a Transition row (on = —)', () => {
		const row = projectWorkflowRows(workflow).find(r => r.__key === 'submit')!
		expect(row.type).toBe('Transition')
		expect(row.kind).toBe('transition')
		expect(row.on).toBe('—')
		expect(row.allowedStates).toBe('Draft')
		expect(row.nextState).toBe('Pending')
	})

	it('projects a stateless action into a Command row', () => {
		const row = projectWorkflowRows(workflow).find(r => r.__key === 'email')!
		expect(row.type).toBe('Command')
		expect(row.kind).toBe('command')
		expect(row.nextState).toBe('—')
	})

	it('projects a trigger into a Trigger row with formatted `on` and N/A state columns', () => {
		const row = projectWorkflowRows(workflow).find(r => r.__key === 'dateOrder')!
		expect(row.type).toBe('Trigger')
		expect(row.kind).toBe('trigger')
		expect(row.on).toBe('createdAt, updatedAt')
		expect(row.allowedStates).toBe('—')
		expect(row.nextState).toBe('—')
		expect(row.__trigger?.clientHandler).toBe("setError('updatedAt', 'bad')")
	})

	it('orders action rows before trigger rows', () => {
		const kinds = projectWorkflowRows(workflow).map(r => r.kind)
		expect(kinds).toEqual(['transition', 'command', 'trigger'])
	})

	it('returns [] for an undefined workflow', () => {
		expect(projectWorkflowRows(undefined)).toEqual([])
	})
})

describe('formatOn / parseOnInput', () => {
	it('formats an on-array as a comma-space list', () => {
		expect(formatOn(['a', 'b'])).toBe('a, b')
		expect(formatOn([])).toBe('')
		expect(formatOn(undefined)).toBe('')
	})

	it('parses a comma string into a trimmed, empty-free array', () => {
		expect(parseOnInput('a, b ,, c ')).toEqual(['a', 'b', 'c'])
		expect(parseOnInput('')).toEqual([])
	})
})

describe('nextTriggerKey', () => {
	it('starts at trigger1 for an empty/undefined map', () => {
		expect(nextTriggerKey(undefined)).toBe('trigger1')
		expect(nextTriggerKey({})).toBe('trigger1')
	})

	it('fills the lowest free slot', () => {
		expect(nextTriggerKey({ trigger1: {} as never })).toBe('trigger2')
		expect(nextTriggerKey({ trigger1: {} as never, trigger3: {} as never })).toBe('trigger2')
	})
})

describe('addTrigger / removeTrigger', () => {
	it('adds an empty trigger under a fresh key, seeding a workflow when undefined', () => {
		const next = addTrigger(undefined)
		expect(next.triggers?.trigger1).toEqual({ label: '', on: [], clientHandler: '' })
	})

	it('appends without touching existing actions or triggers', () => {
		const next = addTrigger(workflow)
		expect(next.triggers?.dateOrder).toBeDefined()
		expect(next.triggers?.trigger1).toBeDefined()
		expect(next.actions?.submit).toBeDefined()
	})

	it('removes a trigger, preserving other triggers and actions', () => {
		const next = removeTrigger(addTrigger(workflow), 'trigger1')
		expect(next.triggers?.trigger1).toBeUndefined()
		expect(next.triggers?.dateOrder).toBeDefined()
		expect(next.actions?.submit).toBeDefined()
	})
})

describe('writeActionField / writeTriggerField', () => {
	it('writes an action field without disturbing the triggers map', () => {
		const next = writeActionField(workflow, 'submit', 'label', 'Send')
		expect(next.actions?.submit?.label).toBe('Send')
		expect(next.triggers?.dateOrder).toBeDefined()
	})

	it('writes a trigger field without disturbing the actions map', () => {
		const next = writeTriggerField(workflow, 'dateOrder', 'label', 'Dates')
		expect(next.triggers?.dateOrder?.label).toBe('Dates')
		expect(next.actions?.submit).toBeDefined()
	})

	it('writes the on-array onto a trigger', () => {
		const next = writeTriggerField(workflow, 'dateOrder', 'on', ['a', 'b'])
		expect(next.triggers?.dateOrder?.on).toEqual(['a', 'b'])
	})
})
