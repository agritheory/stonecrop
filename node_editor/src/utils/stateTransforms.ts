import { Position, type Edge, type Node } from '@vue-flow/core'

import type { EditorStates, FlowElements, Layout } from '../types'

const isEdge = (el: Node | Edge): el is Edge => 'source' in el && 'target' in el

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

		if ((value as any)?.type === 'final') {
			el.type = 'output'
			el.class = 'default-output-node'
		}

		stateHash[key] = el
		index++
	}

	for (const [key, value] of Object.entries(states)) {
		if ((value as any)?.on) {
			for (const [edgeKey, edgeValue] of Object.entries((value as any).on)) {
				const target = (edgeValue as any)?.target ?? edgeValue
				stateElements.push({
					id: `${key}-${target}`,
					source: key,
					target: target as string,
					label: edgeKey,
					animated: true,
					type: 'smoothstep',
					interactionWidth: 40,
				} as Edge)
				hasInputs[target as string] = true
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
	const edges: Record<string, Record<string, any>> = {}
	const idToLabel: Record<string, string> = {}
	const nextStates: EditorStates = {}
	const nextLayout: Layout = {}

	// First pass: build id→label map from nodes so edge targets resolve correctly
	for (const el of nextElements) {
		if (!isEdge(el as Node | Edge)) {
			idToLabel[el.id] = el.label as string
		}
	}

	// Second pass: process all elements
	for (const el of nextElements) {
		const label = el.label as string

		if (el.type === 'input') {
			nextStates[label] = { on: {} }
		} else if (el.type === 'output') {
			nextStates[label] = { type: 'final' } as any
		} else if (isEdge(el as Node | Edge)) {
			const edge = el as unknown as Edge
			const targetLabel = idToLabel[edge.target] || edge.target
			edges[edge.source] = edges[edge.source] || {}
			edges[edge.source][label] = { target: targetLabel }
		} else {
			nextStates[label] = { on: {} }
		}

		if (!isEdge(el as Node | Edge)) {
			const node = el as unknown as Node
			if (node.position) {
				const nodeLabel = idToLabel[el.id] || el.id
				nextLayout[nodeLabel] = {
					position: node.position,
					...(node.targetPosition !== undefined && { targetPosition: node.targetPosition }),
					...(node.sourcePosition !== undefined && { sourcePosition: node.sourcePosition }),
				}
			}
		}
	}

	for (const [edgeKey, edgeValue] of Object.entries(edges)) {
		const label = idToLabel[edgeKey] || edgeKey
		for (const [key, value] of Object.entries(edgeValue)) {
			if (!nextStates[label]) {
				nextStates[label] = { on: {} }
			}
			;(nextStates[label] as any).on[key] = value
		}
	}

	return { states: nextStates, layout: nextLayout }
}
