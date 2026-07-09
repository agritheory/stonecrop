import { Position, type Node } from '@vue-flow/core'
import type { ActionDefinition, WorkflowMeta } from '@stonecrop/schema'

import type { FlowElements, Layout } from '../types'

export function statesToFlowElements(workflow: WorkflowMeta, layout?: Layout): FlowElements {
	const { states = [], actions = {} } = workflow
	const hasIncoming = new Set<string>()
	const edges: FlowElements = []
	const nodes: Node[] = []

	for (const [actionKey, actionDef] of Object.entries(actions)) {
		if (actionDef.stateless || !actionDef.nextState || !actionDef.allowedStates?.length) continue
		for (const source of actionDef.allowedStates) {
			edges.push({
				id: `${actionKey}-${source}`,
				source,
				target: actionDef.nextState,
				// The edge paints the human display label; its identity (the action key) rides in
				// `data.actionKey`, so relabeling the edge renames the action without re-keying it.
				label: actionDef.label ?? actionKey,
				data: { actionKey },
				animated: true,
				type: 'smoothstep',
				interactionWidth: 40,
			})
			hasIncoming.add(actionDef.nextState)
		}
	}

	for (let index = 0; index < states.length; index++) {
		const state = states[index]
		const node: Node = {
			id: state,
			label: state,
			position: layout?.[state]?.position ?? { x: 200 * index, y: 100 },
			targetPosition: layout?.[state]?.targetPosition ?? Position.Left,
			sourcePosition: layout?.[state]?.sourcePosition ?? Position.Right,
		}
		if (!hasIncoming.has(state)) {
			node.type = 'input'
			node.class = 'default-input-node'
		}
		nodes.push(node)
	}

	return [...edges, ...nodes]
}

export function flowElementsToStates(
	nextElements: FlowElements,
	existingWorkflow?: WorkflowMeta
): { workflow: WorkflowMeta; layout: Layout } {
	const idToLabel: Record<string, string> = {}
	const nextLayout: Layout = {}
	const stateNames: string[] = []

	for (const el of nextElements) {
		if ('source' in el) continue
		const label = typeof el.label === 'string' ? el.label : el.id
		idToLabel[el.id] = label
		stateNames.push(label)
		if (el.position) {
			nextLayout[label] = {
				position: el.position,
				...(el.targetPosition !== undefined && { targetPosition: el.targetPosition }),
				...(el.sourcePosition !== undefined && { sourcePosition: el.sourcePosition }),
			}
		}
	}

	// Group directed edges by their stable action key. A round-tripped edge carries the key in
	// `data.actionKey`; a freshly-drawn edge (no data yet) falls back to its label as the key — the
	// one moment label and key coincide, when the action is first born. The edge's label is captured
	// separately as the display name, so a later relabel renames the action without re-keying it.
	const transitionGroups: Record<string, { nextState: string; allowedStates: string[]; label: string }> = {}
	for (const el of nextElements) {
		if (!('source' in el)) continue
		const edgeLabel = typeof el.label === 'string' ? el.label : el.id
		const actionKey = el.data?.actionKey ?? edgeLabel
		const sourceLabel = idToLabel[el.source] || el.source
		const targetLabel = idToLabel[el.target] || el.target
		if (!transitionGroups[actionKey]) {
			transitionGroups[actionKey] = { nextState: targetLabel, allowedStates: [sourceLabel], label: edgeLabel }
		} else {
			transitionGroups[actionKey].allowedStates.push(sourceLabel)
		}
	}

	const nextActions: Record<string, ActionDefinition> = {}

	// Transitions derived from graph edges
	for (const [actionKey, group] of Object.entries(transitionGroups)) {
		const existing = existingWorkflow?.actions?.[actionKey]
		nextActions[actionKey] = {
			// Spread existing first so every field the graph does NOT own — clientHandler,
			// requiredFields and any field added to ActionDefinition later — survives the
			// round-trip. The graph owns topology (allowedStates/nextState) and the display label.
			// (Enumerating named fields here previously dropped clientHandler on every graph edit.)
			...existing,
			// The edge's label is the display name (decoupled from the key). Fall back to the
			// existing label, then the key, if an edge ever arrives label-less.
			label: group.label || existing?.label || actionKey,
			// The graph owns topology only — allowedStates and nextState below. The server owns
			// the transition: dispatch applies nextState, guarded by allowedStates, with no
			// per-action handler link. A freshly-drawn edge is therefore complete as-is.
			allowedStates: group.allowedStates,
			nextState: group.nextState,
		}
	}

	// Pass through Verbs (stateless: true) and global Workflow actions (no allowedStates) verbatim
	for (const [actionKey, actionDef] of Object.entries(existingWorkflow?.actions ?? {})) {
		if (actionKey in transitionGroups) continue
		if (actionDef.stateless || !actionDef.allowedStates?.length) {
			nextActions[actionKey] = actionDef
		}
		// Workflow action with allowedStates not in graph = user deleted its edges → remove
	}

	return {
		// Spread existingWorkflow first so every top-level key the graph does NOT own — the
		// sibling `triggers` map (field-validation triggers), and any WorkflowMeta key added
		// later — survives the round-trip. The graph owns topology only: states + actions,
		// overridden below. (Same principle the per-action spread applies above; enumerating
		// only states+actions here previously dropped `triggers` on every graph edit.)
		workflow: { ...existingWorkflow, states: stateNames, actions: nextActions },
		layout: nextLayout,
	}
}
