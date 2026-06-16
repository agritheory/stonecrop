import { Position, type Node } from '@vue-flow/core'

import type { EditorStates, FlowElements, Layout } from '../types'

export function statesToFlowElements(states: EditorStates, layout?: Layout): FlowElements {
	const hasInputs: Record<string, boolean> = {}
	const stateElements: FlowElements = []
	const stateHash: Record<string, Node> = {}

	let index = 0
	for (const [key, value] of Object.entries(states)) {
		const el: Node = {
			id: key,
			label: key,
			position: layout?.[key]?.position ?? { x: 200 * index, y: 100 },
			targetPosition: layout?.[key]?.targetPosition ?? Position.Left,
			sourcePosition: layout?.[key]?.sourcePosition ?? Position.Right,
		}

		if (value.type === 'final') {
			el.type = 'output'
			el.class = 'default-output-node'
		}

		stateHash[key] = el
		index++
	}

	for (const [key, value] of Object.entries(states)) {
		if (value.on) {
			for (const [edgeKey, edgeValue] of Object.entries(value.on)) {
				const target =
					typeof edgeValue === 'string'
						? edgeValue
						: edgeValue != null &&
							  typeof edgeValue === 'object' &&
							  'target' in edgeValue &&
							  typeof edgeValue.target === 'string'
							? edgeValue.target
							: ''
				stateElements.push({
					id: `${key}-${target}`,
					source: key,
					target,
					label: edgeKey,
					animated: true,
					type: 'smoothstep',
					interactionWidth: 40,
				})
				hasInputs[target] = true
			}
		}
	}

	for (const [key] of Object.entries(stateHash)) {
		if (!hasInputs[key]) {
			stateHash[key].type = 'input'
			stateHash[key].class = 'default-input-node'
		}
		stateElements.push(stateHash[key])
	}

	return stateElements
}

export function flowElementsToStates(nextElements: FlowElements): { states: EditorStates; layout: Layout } {
	const transitionsBySource: Record<string, Record<string, { target: string }>> = {}
	const idToLabel: Record<string, string> = {}
	const nodeTypeByLabel: Record<string, string | undefined> = {}
	const nextLayout: Layout = {}

	// First pass: build id→label map from nodes so edge targets resolve correctly
	for (const el of nextElements) {
		if (!('source' in el)) {
			idToLabel[el.id] = typeof el.label === 'string' ? el.label : el.id
		}
	}

	// Second pass: collect node types, layout positions, and edge transitions
	for (const el of nextElements) {
		if ('source' in el && 'target' in el) {
			const edgeLabel = typeof el.label === 'string' ? el.label : el.id
			const sourceLabel = idToLabel[el.source] || el.source
			const targetLabel = idToLabel[el.target] || el.target
			transitionsBySource[sourceLabel] = transitionsBySource[sourceLabel] ?? {}
			transitionsBySource[sourceLabel][edgeLabel] = { target: targetLabel }
		} else {
			const nodeLabel = typeof el.label === 'string' ? el.label : el.id
			nodeTypeByLabel[nodeLabel] = el.type
			if (el.position) {
				nextLayout[nodeLabel] = {
					position: el.position,
					...(el.targetPosition !== undefined && { targetPosition: el.targetPosition }),
					...(el.sourcePosition !== undefined && { sourcePosition: el.sourcePosition }),
				}
			}
		}
	}

	// Build states from node types and collected transitions
	const nextStates: EditorStates = {}
	for (const [label, nodeType] of Object.entries(nodeTypeByLabel)) {
		if (nodeType === 'output') {
			nextStates[label] = { type: 'final' }
		} else {
			nextStates[label] = { on: transitionsBySource[label] ?? {} }
		}
	}
	// Capture any transition sources that had no corresponding node entry
	for (const [sourceLabel, on] of Object.entries(transitionsBySource)) {
		if (!nextStates[sourceLabel]) {
			nextStates[sourceLabel] = { on }
		}
	}

	return { states: nextStates, layout: nextLayout }
}
