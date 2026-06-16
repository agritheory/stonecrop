import { Position } from '@vue-flow/core'
import { describe, expect, it } from 'vitest'

import type { EditorStates, FlowElements } from '../src/types'
import { flowElementsToStates, statesToFlowElements } from '../src/utils/stateTransforms'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const issueStates: EditorStates = {
	New: { on: { Save: 'Draft' } },
	Draft: {
		on: {
			Assign: { target: 'Assigned' },
			Resolve: { target: 'Resolved' },
		},
	},
	Assigned: { on: { Resolve: { target: 'Resolved' } } },
	Resolved: { on: { Close: { target: 'Closed' } } },
	Closed: { on: { Reopen: { target: 'Draft' } } },
}

const isNode = (el: any) => !('source' in el)
const isEdge = (el: any) => 'source' in el

// ===========================================================================
// statesToFlowElements
// ===========================================================================

describe('statesToFlowElements', { tags: ['unit'] }, () => {
	it('marks the state with no incoming edges as an input node', () => {
		const elements = statesToFlowElements(issueStates)
		const newNode = elements.find(e => isNode(e) && e.id === 'New')
		expect(newNode?.type).toBe('input')
	})

	it('leaves states that have incoming edges as non-input nodes', () => {
		const elements = statesToFlowElements(issueStates)
		const draftNode = elements.find(e => isNode(e) && e.id === 'Draft')
		expect(draftNode?.type).not.toBe('input')
	})

	it('marks type:final states as output nodes', () => {
		const states: EditorStates = {
			Active: { on: { Deactivate: { target: 'Inactive' } } },
			Inactive: { type: 'final' },
		}
		const elements = statesToFlowElements(states)
		const inactive = elements.find(e => isNode(e) && e.id === 'Inactive')
		expect(inactive?.type).toBe('output')
	})

	it('produces one edge per transition (shorthand and object form)', () => {
		const elements = statesToFlowElements(issueStates)
		const edges = elements.filter(isEdge)
		// New→Draft, Draft→Assigned, Draft→Resolved, Assigned→Resolved, Resolved→Closed, Closed→Draft
		expect(edges).toHaveLength(6)
	})

	it('edge source and target match state names', () => {
		const elements = statesToFlowElements(issueStates)
		const saveEdge = elements.find(e => isEdge(e) && (e as any).label === 'Save')
		expect((saveEdge as any)?.source).toBe('New')
		expect((saveEdge as any)?.target).toBe('Draft')
	})

	it('applies layout positions when provided', () => {
		const layout = { New: { position: { x: 50, y: 75 } } }
		const elements = statesToFlowElements(issueStates, layout)
		const newNode = elements.find(e => isNode(e) && e.id === 'New') as any
		expect(newNode?.position).toEqual({ x: 50, y: 75 })
	})

	it('applies layout source/targetPosition when provided', () => {
		const layout = {
			New: { position: { x: 0, y: 0 }, sourcePosition: Position.Top, targetPosition: Position.Bottom },
		}
		const elements = statesToFlowElements(issueStates, layout)
		const newNode = elements.find(e => isNode(e) && e.id === 'New') as any
		expect(newNode?.sourcePosition).toBe(Position.Top)
		expect(newNode?.targetPosition).toBe(Position.Bottom)
	})

	it('staggers default x positions when no layout is provided', () => {
		const states: EditorStates = {
			A: { on: { go: { target: 'B' } } },
			B: { on: {} },
		}
		const elements = statesToFlowElements(states)
		const nodeA = elements.find(e => isNode(e) && e.id === 'A') as any
		const nodeB = elements.find(e => isNode(e) && e.id === 'B') as any
		expect(nodeA?.position.x).toBe(0) // first state: index 0
		expect(nodeB?.position.x).toBe(200) // second state: index 1
	})

	it('returns empty array when states is empty', () => {
		expect(statesToFlowElements({})).toEqual([])
	})
})

// ===========================================================================
// flowElementsToStates
// ===========================================================================

describe('flowElementsToStates', { tags: ['unit'] }, () => {
	it('round-trips all state names', () => {
		const elements = statesToFlowElements(issueStates)
		const { states } = flowElementsToStates(elements)
		expect(Object.keys(states).toSorted()).toEqual(Object.keys(issueStates).toSorted())
	})

	it('round-trips transition targets correctly', () => {
		const elements = statesToFlowElements(issueStates)
		const { states } = flowElementsToStates(elements)
		expect((states.New as any)?.on?.Save?.target).toBe('Draft')
	})

	it('maps output nodes back to type:final states', () => {
		const states: EditorStates = {
			Active: { on: { Deactivate: { target: 'Inactive' } } },
			Inactive: { type: 'final' },
		}
		const elements = statesToFlowElements(states)
		const { states: result } = flowElementsToStates(elements)
		expect((result.Inactive as any)?.type).toBe('final')
	})

	it('resolves new-node id to label in edge targets', () => {
		// Regression: new nodes have id='node-N' but label='Done'.
		// Edge.target references the id; the result must use the label as the state key.
		const elements: FlowElements = [
			{ id: 'Open', label: 'Open', position: { x: 0, y: 0 }, type: 'input' } as any,
			{ id: 'node-3', label: 'Done', position: { x: 200, y: 0 }, type: 'output' } as any,
			{ id: 'e1', source: 'Open', target: 'node-3', label: 'Close', type: 'smoothstep' } as any,
		]
		const { states } = flowElementsToStates(elements)
		expect((states.Open as any)?.on?.Close?.target).toBe('Done')
	})

	it('extracts node positions into layout keyed by state name', () => {
		const elements: FlowElements = [
			{
				id: 'New',
				label: 'New',
				position: { x: 50, y: 75 },
				targetPosition: Position.Left,
				sourcePosition: Position.Right,
				type: 'input',
			} as any,
		]
		const { layout } = flowElementsToStates(elements)
		expect(layout.New?.position).toEqual({ x: 50, y: 75 })
	})

	it('keys layout by label, not by id, for new nodes', () => {
		const elements: FlowElements = [
			{
				id: 'node-5',
				label: 'Review',
				position: { x: 400, y: 100 },
				type: 'editable',
			} as any,
		]
		const { layout } = flowElementsToStates(elements)
		expect(layout['Review']).toBeDefined()
		expect(layout['node-5']).toBeUndefined()
	})
})
