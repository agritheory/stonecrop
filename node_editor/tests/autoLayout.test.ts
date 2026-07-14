import { describe, expect, it } from 'vitest'

import type { FlowElements } from '../src/types'
import { autoLayout } from '../src/utils/autoLayout'

// ---------------------------------------------------------------------------
// Helpers — build minimal VueFlow nodes/edges. autoLayout only cares about
// node id + edge source/target; everything else is passed through untouched.
// ---------------------------------------------------------------------------

const isNode = (el: any) => !('source' in el)
const node = (id: string, extra: Record<string, unknown> = {}) =>
	({ id, label: id, position: { x: 0, y: 0 }, ...extra }) as any
const edge = (source: string, target: string, extra: Record<string, unknown> = {}) =>
	({ id: `${source}->${target}`, source, target, ...extra }) as any

const nodeById = (els: FlowElements, id: string) => els.find(e => isNode(e) && e.id === id) as any
const build = (...els: any[]) => els as FlowElements

const DIMS = { nodeWidth: 100, nodeHeight: 40 }

describe('autoLayout', { tags: ['unit'] }, () => {
	it('lays a linear chain out left-to-right (increasing x along edges)', () => {
		const out = autoLayout(build(node('A'), node('B'), node('C'), edge('A', 'B'), edge('B', 'C')), DIMS)
		const [a, b, c] = ['A', 'B', 'C'].map(id => nodeById(out, id).position.x)
		expect(a).toBeLessThan(b)
		expect(b).toBeLessThan(c)
	})

	it('is deterministic — same input yields identical positions', () => {
		const input = () => build(node('A'), node('B'), node('C'), edge('A', 'B'), edge('A', 'C'))
		const first = autoLayout(input(), DIMS)
		const second = autoLayout(input(), DIMS)
		for (const id of ['A', 'B', 'C']) {
			expect(nodeById(second, id).position).toEqual(nodeById(first, id).position)
		}
	})

	it('gives every node a distinct position on a branch/fan-in graph (no overlap)', () => {
		// A -> B, A -> C, B -> D, C -> D  (diamond)
		const out = autoLayout(
			build(node('A'), node('B'), node('C'), node('D'), edge('A', 'B'), edge('A', 'C'), edge('B', 'D'), edge('C', 'D')),
			DIMS
		)
		const keys = ['A', 'B', 'C', 'D'].map(id => {
			const p = nodeById(out, id).position
			return `${p.x},${p.y}`
		})
		expect(new Set(keys).size).toBe(4)
	})

	it('converts dagre center coordinates to VueFlow top-left', () => {
		// A lone node is centered by dagre at (w/2, h/2); top-left = center - (w/2, h/2) = (0, 0).
		const [only] = autoLayout(build(node('A')), DIMS)
		expect((only as any).position).toEqual({ x: 0, y: 0 })
	})

	it('does not throw on a cycle and produces finite positions', () => {
		const out = autoLayout(build(node('A'), node('B'), edge('A', 'B'), edge('B', 'A')), DIMS)
		for (const id of ['A', 'B']) {
			const p = nodeById(out, id).position
			expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true)
		}
	})

	it('places a disconnected node with finite coordinates', () => {
		const out = autoLayout(build(node('A'), node('B'), node('Island'), edge('A', 'B')), DIMS)
		const p = nodeById(out, 'Island').position
		expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true)
	})

	it('handles a single node and an empty graph without throwing', () => {
		expect(() => autoLayout(build(node('A')), DIMS)).not.toThrow()
		expect(autoLayout(build(), DIMS)).toEqual([])
	})

	it('skips self-loop edges (source === target) without error — forward-compat for self-transitions', () => {
		const out = autoLayout(build(node('A'), node('B'), edge('A', 'B'), edge('A', 'A')), DIMS)
		const p = nodeById(out, 'A').position
		expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true)
		// The self-loop edge is preserved in the output (only node positions change).
		expect(out.some((e: any) => e.source === 'A' && e.target === 'A')).toBe(true)
	})

	it('preserves every non-position field on nodes and passes edges through untouched', () => {
		const input = build(
			node('A', { type: 'input', sourcePosition: 'right', data: { actionKey: 'k' } }),
			node('B'),
			edge('A', 'B', { label: 'go', data: { actionKey: 'go' }, animated: true })
		)
		const out = autoLayout(input, DIMS)
		const a = nodeById(out, 'A')
		expect(a.type).toBe('input')
		expect(a.sourcePosition).toBe('right')
		expect(a.data).toEqual({ actionKey: 'k' })
		const e = out.find((x: any) => x.source === 'A' && x.target === 'B') as any
		expect(e.label).toBe('go')
		expect(e.data).toEqual({ actionKey: 'go' })
		expect(e.animated).toBe(true)
	})

	it('does not mutate the input array or its node positions', () => {
		const input = build(node('A'), node('B'), edge('A', 'B'))
		const beforeA = { ...nodeById(input, 'A').position }
		autoLayout(input, DIMS)
		expect(nodeById(input, 'A').position).toEqual(beforeA)
	})

	it('uses per-node measured dimensions when provided (button path)', () => {
		// Wide A vs narrow B on the same LR rank pair: just assert it runs and orders correctly with
		// explicit dimensions supplied (the button passes measured node sizes).
		const out = autoLayout(build(node('A'), node('B'), edge('A', 'B')), {
			dimensions: { A: { width: 300, height: 40 }, B: { width: 80, height: 40 } },
		})
		expect(nodeById(out, 'A').position.x).toBeLessThan(nodeById(out, 'B').position.x)
	})
})
