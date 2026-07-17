import { Position, type Node } from '@vue-flow/core'
import type { ActionDefinition, WorkflowMeta } from '@stonecrop/schema'

import type { FlowElements, Layout } from '../types'

export function statesToFlowElements(workflow: WorkflowMeta, layout?: Layout): FlowElements {
	const { states = [], actions = {} } = workflow
	const edges: FlowElements = []
	const nodes: Node[] = []

	for (const [actionKey, actionDef] of Object.entries(actions)) {
		// Stateless commands (print/email) have no graph presence; anything graph-owned needs states.
		if (actionDef.stateless || !actionDef.allowedStates?.length) continue

		// A self-transition (mutate-in-place `save`) renders as a self-loop on each allowed state:
		// `source === target`, tagged `selfloop` so NodeEditor routes it to the arc renderer.
		if (actionDef.selfTransition) {
			for (const source of actionDef.allowedStates) {
				edges.push({
					id: `${actionKey}-${source}`,
					source,
					target: source,
					label: actionDef.label ?? actionKey,
					data: { actionKey },
					animated: true,
					type: 'selfloop',
					interactionWidth: 40,
				})
			}
			continue
		}

		// A cross-state transition needs a target; a malformed action with neither is skipped.
		if (!actionDef.nextState) continue
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
		// Every state renders identically — both handles, no start-state styling — so any transition
		// (including a returning `reject`/`reopen` into the initial state) is authorable and a
		// self-loop can anchor both ends. Marking an entry state is deferred (YAGNI) until needed.
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
	const transitionGroups: Record<
		string,
		{ nextState?: string; allowedStates: string[]; label: string; selfLoop: boolean }
	> = {}
	for (const el of nextElements) {
		if (!('source' in el)) continue
		const edgeLabel = typeof el.label === 'string' ? el.label : el.id
		const actionKey = el.data?.actionKey ?? edgeLabel
		const sourceLabel = idToLabel[el.source] || el.source
		const targetLabel = idToLabel[el.target] || el.target
		// Classify by topology, not by edge `type`: a self-loop (source === target) round-trips to a
		// self-transition regardless of how it was authored (drawn node→itself, or re-rendered from a
		// `selfTransition` action). A group's kind is set by its first edge; a multi-state self-loop
		// (e.g. `save` on Draft AND Pending) accumulates each source into allowedStates.
		const isSelf = el.source === el.target
		if (!transitionGroups[actionKey]) {
			transitionGroups[actionKey] = {
				allowedStates: [sourceLabel],
				label: edgeLabel,
				selfLoop: isSelf,
				...(isSelf ? {} : { nextState: targetLabel }),
			}
		} else {
			transitionGroups[actionKey].allowedStates.push(sourceLabel)
		}
	}

	const nextActions: Record<string, ActionDefinition> = {}

	// Transitions (and self-transitions) derived from graph edges
	for (const [actionKey, group] of Object.entries(transitionGroups)) {
		const existing = existingWorkflow?.actions?.[actionKey]
		nextActions[actionKey] = {
			// Spread existing first so every field the graph does NOT own — clientHandler,
			// requiredFields and any field added to ActionDefinition later — survives the
			// round-trip. The graph owns topology (allowedStates/nextState/selfTransition) and the
			// display label. (Enumerating named fields here previously dropped clientHandler.)
			...existing,
			// The edge's label is the display name (decoupled from the key). Fall back to the
			// existing label, then the key, if an edge ever arrives label-less.
			label: group.label || existing?.label || actionKey,
			// The graph owns topology only. A self-transition (self-loop) stays in place: mark
			// `selfTransition`, carry NO `nextState`. A cross-state transition carries `nextState`
			// and clears any stale self flag (a self-loop redrawn as a normal edge). Explicit
			// `undefined` on the unused field is dropped by JSON.stringify, so no format churn.
			allowedStates: group.allowedStates,
			nextState: group.selfLoop ? undefined : group.nextState,
			selfTransition: group.selfLoop ? true : undefined,
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
