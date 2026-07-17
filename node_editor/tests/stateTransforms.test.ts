import { Position } from '@vue-flow/core'
import { describe, expect, it } from 'vitest'
import type { WorkflowMeta } from '@stonecrop/schema'

import type { FlowElements } from '../src/types'
import { flowElementsToStates, statesToFlowElements } from '../src/utils/stateTransforms'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const issueWorkflow: WorkflowMeta = {
	states: ['New', 'Draft', 'Assigned', 'Resolved', 'Closed'],
	actions: {
		save: { label: 'Save', allowedStates: ['New'], nextState: 'Draft' },
		assign: { label: 'Assign', allowedStates: ['Draft'], nextState: 'Assigned' },
		resolve: {
			label: 'Resolve',
			allowedStates: ['Draft', 'Assigned'],
			nextState: 'Resolved',
		},
		close: { label: 'Close', allowedStates: ['Resolved'], nextState: 'Closed' },
		reopen: { label: 'Reopen', allowedStates: ['Closed'], nextState: 'Draft' },
		print: { label: 'Print', stateless: true, allowedStates: ['Resolved', 'Closed'] },
		email: { label: 'Email', stateless: true },
	},
}

// A mutate-in-place `save`: a self-transition scoped to two mutable states, plus a normal transition
// out of Pending, so tests can assert self-loops and cross-state edges coexist.
const saveWorkflow: WorkflowMeta = {
	states: ['Draft', 'Pending', 'Closed'],
	actions: {
		save: {
			label: 'Save',
			selfTransition: true,
			allowedStates: ['Draft', 'Pending'],
			clientHandler: 'noop()',
		},
		close: { label: 'Close', allowedStates: ['Pending'], nextState: 'Closed' },
	},
}

const isNode = (el: any) => !('source' in el)
const isEdge = (el: any) => 'source' in el

// ===========================================================================
// statesToFlowElements
// ===========================================================================

describe('statesToFlowElements', { tags: ['unit'] }, () => {
	it('creates one node per state', () => {
		const elements = statesToFlowElements(issueWorkflow)
		expect(elements.filter(isNode)).toHaveLength(5)
	})

	it('renders every state identically — no start-state (input) marking', () => {
		// All nodes get both handles so a returning transition (reject/reopen into the start state)
		// is authorable and self-loops can anchor both ends. The `New` start state is not special.
		const elements = statesToFlowElements(issueWorkflow)
		for (const node of elements.filter(isNode)) {
			expect((node as any).type).toBeUndefined()
			expect((node as any).class).toBeUndefined()
		}
	})

	it('produces one edge per (action, allowedState) pair for Workflow actions', () => {
		const elements = statesToFlowElements(issueWorkflow)
		const edges = elements.filter(isEdge)
		// save(1) + assign(1) + resolve(2) + close(1) + reopen(1) = 6; Verbs produce no edges
		expect(edges).toHaveLength(6)
	})

	it('edge source and target match state names', () => {
		const elements = statesToFlowElements(issueWorkflow)
		const saveEdge = elements.find(e => isEdge(e) && (e as any).data?.actionKey === 'save')
		expect((saveEdge as any)?.source).toBe('New')
		expect((saveEdge as any)?.target).toBe('Draft')
	})

	it('paints the display label on the edge, carrying the action key in data', () => {
		// The key (`save`) is the stable identity; the label (`Save`) is what the edge shows and
		// the doctype view renders. Decoupling them lets a relabel rename without re-keying.
		const elements = statesToFlowElements(issueWorkflow)
		const saveEdge = elements.find(e => isEdge(e) && (e as any).data?.actionKey === 'save')
		expect((saveEdge as any)?.label).toBe('Save')
		expect((saveEdge as any)?.data?.actionKey).toBe('save')
	})

	it('multi-allowedStates action produces one edge per source state', () => {
		const elements = statesToFlowElements(issueWorkflow)
		const resolveEdges = elements.filter(e => isEdge(e) && (e as any).data?.actionKey === 'resolve')
		expect(resolveEdges).toHaveLength(2)
		const sources = resolveEdges.map((e: any) => e.source as string).toSorted((a, b) => a.localeCompare(b))
		expect(sources).toEqual(['Assigned', 'Draft'])
	})

	it('Verbs (stateless: true) produce no edges', () => {
		const elements = statesToFlowElements(issueWorkflow)
		const printEdge = elements.find(e => isEdge(e) && (e as any).data?.actionKey === 'print')
		const emailEdge = elements.find(e => isEdge(e) && (e as any).data?.actionKey === 'email')
		expect(printEdge).toBeUndefined()
		expect(emailEdge).toBeUndefined()
	})

	it('Workflow action without allowedStates produces no edges', () => {
		const workflow: WorkflowMeta = {
			states: ['Draft', 'Active'],
			actions: {
				globalAction: { label: 'Global', nextState: 'Active' }, // no allowedStates
			},
		}
		const elements = statesToFlowElements(workflow)
		expect(elements.filter(isEdge)).toHaveLength(0)
	})

	it('applies layout positions when provided', () => {
		const layout = { New: { position: { x: 50, y: 75 } } }
		const elements = statesToFlowElements(issueWorkflow, layout)
		const newNode = elements.find(e => isNode(e) && e.id === 'New') as any
		expect(newNode?.position).toEqual({ x: 50, y: 75 })
	})

	it('applies layout source/targetPosition when provided', () => {
		const layout = {
			New: { position: { x: 0, y: 0 }, sourcePosition: Position.Top, targetPosition: Position.Bottom },
		}
		const elements = statesToFlowElements(issueWorkflow, layout)
		const newNode = elements.find(e => isNode(e) && e.id === 'New') as any
		expect(newNode?.sourcePosition).toBe(Position.Top)
		expect(newNode?.targetPosition).toBe(Position.Bottom)
	})

	it('staggers default x positions when no layout is provided', () => {
		const elements = statesToFlowElements(issueWorkflow)
		const newNode = elements.find(e => isNode(e) && e.id === 'New') as any
		const draftNode = elements.find(e => isNode(e) && e.id === 'Draft') as any
		expect(newNode?.position.x).toBe(0)
		expect(draftNode?.position.x).toBe(200)
	})

	it('returns empty array when workflow has no states', () => {
		expect(statesToFlowElements({ states: [], actions: {} })).toEqual([])
	})

	// --- self-transitions (mutate-in-place) ---

	it('renders a self-transition as a self-loop edge per allowed state', () => {
		const elements = statesToFlowElements(saveWorkflow)
		const saveEdges = elements.filter(e => isEdge(e) && (e as any).data?.actionKey === 'save')
		expect(saveEdges).toHaveLength(2)
		for (const edge of saveEdges as any[]) {
			expect(edge.source).toBe(edge.target) // self-loop: source === target
			expect(edge.type).toBe('selfloop')
			expect(edge.data.actionKey).toBe('save')
			expect(edge.label).toBe('Save')
		}
		const sources = (saveEdges as any[]).map(e => e.source as string).toSorted((a, b) => a.localeCompare(b))
		expect(sources).toEqual(['Draft', 'Pending'])
	})

	it('self-transitions and cross-state transitions coexist', () => {
		const elements = statesToFlowElements(saveWorkflow)
		const closeEdge = elements.find(e => isEdge(e) && (e as any).data?.actionKey === 'close') as any
		expect(closeEdge.source).toBe('Pending')
		expect(closeEdge.target).toBe('Closed')
		expect(closeEdge.type).toBe('smoothstep') // a normal transition, not a self-loop
	})
})

// ===========================================================================
// flowElementsToStates
// ===========================================================================

describe('flowElementsToStates', { tags: ['unit'] }, () => {
	it('round-trips all state names', () => {
		const elements = statesToFlowElements(issueWorkflow)
		const { workflow } = flowElementsToStates(elements, issueWorkflow)
		expect(workflow.states?.toSorted((a, b) => a.localeCompare(b))).toEqual(
			[...issueWorkflow.states!].toSorted((a, b) => a.localeCompare(b))
		)
	})

	it('round-trips transition nextState correctly', () => {
		const elements = statesToFlowElements(issueWorkflow)
		const { workflow } = flowElementsToStates(elements, issueWorkflow)
		expect(workflow.actions?.save?.nextState).toBe('Draft')
	})

	it('round-trips multi-allowedStates action', () => {
		const elements = statesToFlowElements(issueWorkflow)
		const { workflow } = flowElementsToStates(elements, issueWorkflow)
		expect(workflow.actions?.resolve?.allowedStates?.toSorted((a, b) => a.localeCompare(b))).toEqual([
			'Assigned',
			'Draft',
		])
		expect(workflow.actions?.resolve?.nextState).toBe('Resolved')
	})

	it('preserves requiredFields from existing workflow on round-trip', () => {
		const workflowWithMeta: WorkflowMeta = {
			states: ['Open', 'Closed'],
			actions: {
				close: {
					label: 'Close',
					requiredFields: ['resolution'],
					allowedStates: ['Open'],
					nextState: 'Closed',
				},
			},
		}
		const elements = statesToFlowElements(workflowWithMeta)
		const { workflow } = flowElementsToStates(elements, workflowWithMeta)
		expect(workflow.actions?.close?.requiredFields).toEqual(['resolution'])
	})

	it('preserves clientHandler and any unknown field on round-trip (spread, not whitelist)', () => {
		// Guards the enumerate-and-drop regression: a graph edit must preserve every field the
		// graph doesn't own — clientHandler today, and any field added to ActionDefinition later.
		const close = {
			label: 'Close',
			handler: 'close_ticket',
			clientHandler: "router.push('/done')",
			allowedStates: ['Open'],
			nextState: 'Closed',
			futureField: 42,
		}
		const workflowWithExtras = { states: ['Open', 'Closed'], actions: { close } } as unknown as WorkflowMeta
		const elements = statesToFlowElements(workflowWithExtras)
		const { workflow } = flowElementsToStates(elements, workflowWithExtras)
		expect(workflow.actions?.close?.clientHandler).toBe("router.push('/done')")
		expect((workflow.actions?.close as Record<string, unknown>)?.futureField).toBe(42)
	})

	it('relabeling an edge renames the action without re-keying it or dropping its handler', () => {
		// The decouple invariant: the edge label is the *display* name, the action key is stable.
		// Editing the label in the graph must update `label` while keeping the key (and everything
		// keyed to it — clientHandler here) intact. Previously the label WAS the key, so a relabel
		// re-keyed the action and orphaned its handler.
		const wf: WorkflowMeta = {
			states: ['Open', 'Closed'],
			actions: {
				save: { label: 'Save', clientHandler: "router.push('/x')", allowedStates: ['Open'], nextState: 'Closed' },
			},
		}
		const elements = statesToFlowElements(wf)
		// Simulate the user double-clicking the edge and renaming it. NodeEditor sets el.label and
		// leaves data.actionKey untouched, then emits a JSON clone — mirror both here.
		const relabeled: FlowElements = JSON.parse(JSON.stringify(elements))
		for (const el of relabeled) if ('source' in el) el.label = 'Submit'
		const { workflow } = flowElementsToStates(relabeled, wf)
		expect(workflow.actions?.save?.label).toBe('Submit')
		expect(workflow.actions?.save?.clientHandler).toBe("router.push('/x')")
		expect(workflow.actions?.save?.nextState).toBe('Closed')
		// NOT re-keyed under the new display name.
		expect(workflow.actions?.Submit).toBeUndefined()
	})

	it('preserves the sibling triggers map (and any unknown top-level key) on round-trip', () => {
		// The graph owns states + actions only. The sibling `triggers` map (a WorkflowMeta key the
		// graph does NOT own) and any other top-level key must survive a graph edit — else authoring
		// a field-validation trigger and then dragging a state node silently wipes it.
		const workflowWithTriggers = {
			states: ['Open', 'Closed'],
			actions: {
				close: { label: 'Close', allowedStates: ['Open'], nextState: 'Closed' },
			},
			triggers: {
				dateOrder: {
					label: 'Date order',
					on: ['createdAt', 'updatedAt'],
					clientHandler: "setError('updatedAt', 'bad')",
				},
			},
			futureTopLevel: 7,
		} as unknown as WorkflowMeta
		const elements = statesToFlowElements(workflowWithTriggers)
		const { workflow } = flowElementsToStates(elements, workflowWithTriggers)
		const asRecord = workflow as Record<string, unknown>
		const triggers = asRecord.triggers as Record<string, { on: string[] }> | undefined
		expect(triggers?.dateOrder?.on).toEqual(['createdAt', 'updatedAt'])
		expect(asRecord.futureTopLevel).toBe(7)
	})

	it('new edge seeds a skeleton action with nextState and no handler', () => {
		const elements: FlowElements = [
			{ id: 'Open', label: 'Open', position: { x: 0, y: 0 }, type: 'input' } as any,
			{ id: 'Closed', label: 'Closed', position: { x: 200, y: 0 } } as any,
			{ id: 'e1', source: 'Open', target: 'Closed', label: 'newAction', type: 'smoothstep' } as any,
		]
		const { workflow } = flowElementsToStates(elements)
		// A freshly-drawn edge carries topology only: nextState plus a label defaulting to the
		// action key. There is no handler link — the server applies nextState, guarded by
		// allowedStates, on dispatch.
		expect(workflow.actions?.newAction?.nextState).toBe('Closed')
		expect(workflow.actions?.newAction?.label).toBe('newAction')
	})

	it('removed edge deletes the Workflow action', () => {
		// Start with workflow that has 'close'; render without it; check it's gone
		const workflowWithClose: WorkflowMeta = {
			states: ['Open', 'Closed'],
			actions: {
				close: { label: 'Close', allowedStates: ['Open'], nextState: 'Closed' },
			},
		}
		// Graph with no edges (user deleted the close edge)
		const elements: FlowElements = [
			{ id: 'Open', label: 'Open', position: { x: 0, y: 0 }, type: 'input' } as any,
			{ id: 'Closed', label: 'Closed', position: { x: 200, y: 0 } } as any,
		]
		const { workflow } = flowElementsToStates(elements, workflowWithClose)
		expect(workflow.actions?.close).toBeUndefined()
	})

	it('passes Verbs (stateless: true) through verbatim from existingWorkflow', () => {
		const elements = statesToFlowElements(issueWorkflow)
		const { workflow } = flowElementsToStates(elements, issueWorkflow)
		// scoped Verb
		expect(workflow.actions?.print?.stateless).toBe(true)
		expect(workflow.actions?.print?.allowedStates).toEqual(['Resolved', 'Closed'])
		// universal Verb
		expect(workflow.actions?.email?.stateless).toBe(true)
		expect(workflow.actions?.email?.allowedStates).toBeUndefined()
	})

	it('passes global Workflow action (no allowedStates) through verbatim', () => {
		const workflowWithGlobal: WorkflowMeta = {
			states: ['Draft', 'Active'],
			actions: {
				globalAction: { label: 'Global', nextState: 'Active' },
			},
		}
		const elements: FlowElements = [
			{ id: 'Draft', label: 'Draft', position: { x: 0, y: 0 }, type: 'input' } as any,
			{ id: 'Active', label: 'Active', position: { x: 200, y: 0 } } as any,
		]
		const { workflow } = flowElementsToStates(elements, workflowWithGlobal)
		expect(workflow.actions?.globalAction?.label).toBe('Global')
		expect(workflow.actions?.globalAction?.nextState).toBe('Active')
	})

	it('resolves new-node id to label in edge targets', () => {
		// Regression: new nodes have id='node-N' but label='Done'.
		// Edge.target references the id; the result must use the label as the state key.
		const elements: FlowElements = [
			{ id: 'Open', label: 'Open', position: { x: 0, y: 0 }, type: 'input' } as any,
			{ id: 'node-3', label: 'Done', position: { x: 200, y: 0 } } as any,
			{ id: 'e1', source: 'Open', target: 'node-3', label: 'close', type: 'smoothstep' } as any,
		]
		const { workflow } = flowElementsToStates(elements)
		expect(workflow.actions?.close?.nextState).toBe('Done')
		expect(workflow.states).toContain('Done')
		expect(workflow.states).not.toContain('node-3')
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

	// --- self-transitions (mutate-in-place) ---

	it('round-trips a self-transition to selfTransition + allowedStates with no nextState', () => {
		const elements = statesToFlowElements(saveWorkflow)
		const { workflow } = flowElementsToStates(elements, saveWorkflow)
		const save = workflow.actions?.save
		expect(save?.selfTransition).toBe(true)
		expect(save?.allowedStates?.toSorted((a, b) => a.localeCompare(b))).toEqual(['Draft', 'Pending'])
		// A self-transition carries no target — it stays in the current state.
		expect(save?.nextState).toBeUndefined()
	})

	it('preserves clientHandler on a self-transition round-trip', () => {
		const elements = statesToFlowElements(saveWorkflow)
		const { workflow } = flowElementsToStates(elements, saveWorkflow)
		expect(workflow.actions?.save?.clientHandler).toBe('noop()')
		// The coexisting normal transition is unaffected.
		expect(workflow.actions?.close?.nextState).toBe('Closed')
		expect(workflow.actions?.close?.selfTransition).toBeUndefined()
	})

	it('recognizes a freshly-drawn self-loop edge (source === target) as a self-transition', () => {
		// A user drawing a node→itself connection authors a self-transition even with no existing
		// workflow — the reverse transform must classify by topology, not require a prior flag.
		const elements: FlowElements = [
			{ id: 'Draft', label: 'Draft', position: { x: 0, y: 0 }, type: 'input' } as any,
			{ id: 'e1', source: 'Draft', target: 'Draft', label: 'save', type: 'selfloop' } as any,
		]
		const { workflow } = flowElementsToStates(elements)
		expect(workflow.actions?.save?.selfTransition).toBe(true)
		expect(workflow.actions?.save?.allowedStates).toEqual(['Draft'])
		expect(workflow.actions?.save?.nextState).toBeUndefined()
	})
})
