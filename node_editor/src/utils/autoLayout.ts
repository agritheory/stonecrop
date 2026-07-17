import { Graph, layout } from '@dagrejs/dagre'

import type { FlowElements } from '../types'

/**
 * Options for {@link autoLayout}.
 * @public
 */
export interface AutoLayoutOptions {
	/** Layout direction. Defaults to `'LR'` to match the editor's Left/Right handle defaults. */
	rankdir?: 'LR' | 'RL' | 'TB' | 'BT'
	/** Fallback node width when no measured size is supplied (the seed path has no DOM to measure). */
	nodeWidth?: number
	/** Fallback node height when no measured size is supplied. */
	nodeHeight?: number
	/** Measured per-node sizes (node id → box) — supplied by the on-demand "Auto-arrange" button. */
	dimensions?: Record<string, { width: number; height: number }>
}

/**
 * Compute node positions for a workflow graph with dagre's layered (Sugiyama) algorithm.
 *
 * Pure and synchronous: takes VueFlow elements (nodes + edges) and returns a new elements array with
 * each node's `position` replaced by a laid-out coordinate; edges and every other node field are
 * passed through untouched. Used two ways — as the seed for an un-arranged workflow (fixed default
 * dimensions, no DOM) and behind the toolbar button (measured `dimensions`).
 *
 * Self-loop edges (`source === target`) are skipped: dagre doesn't rank them, and they're reserved
 * for the separate mutate-in-place self-transition feature.
 * @public
 */
export function autoLayout(elements: FlowElements, options: AutoLayoutOptions = {}): FlowElements {
	const { rankdir = 'LR', nodeWidth = 160, nodeHeight = 40, dimensions } = options
	const sizeOf = (id: string) => dimensions?.[id] ?? { width: nodeWidth, height: nodeHeight }

	// Nodes are the elements without a `source` (the same discriminator flowElementsToStates uses).
	const nodeIds: string[] = []
	for (const el of elements) {
		if (!('source' in el)) nodeIds.push(el.id)
	}
	if (nodeIds.length === 0) return [...elements]

	const graph = new Graph()
	graph.setGraph({ rankdir, nodesep: 40, ranksep: 80, edgesep: 20 })
	graph.setDefaultEdgeLabel(() => ({}))

	for (const id of nodeIds) {
		const { width, height } = sizeOf(id)
		graph.setNode(id, { width, height })
	}
	for (const el of elements) {
		if (!('source' in el)) continue
		if (el.source === el.target) continue
		graph.setEdge(el.source, el.target)
	}

	layout(graph)

	// dagre reports each node by its CENTER; VueFlow positions nodes by their TOP-LEFT corner.
	return elements.map(el => {
		if ('source' in el) return el
		const center = graph.node(el.id)
		if (!center) return el
		const { width, height } = sizeOf(el.id)
		return { ...el, position: { x: center.x - width / 2, y: center.y - height / 2 } }
	})
}
