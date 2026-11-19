import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vite-plus/test'
import { effectScope, nextTick, reactive } from 'vue'

import { useOperationLogStore } from '../../src/stores/operation-log'
import { createHST } from '../../src/stores/hst'

/*
Stonecrop doesn't catch or block a write made straight into an object read from the store: it lets the write
through and warns the developer, since the operation log never hears of it and Undo would skip it (#557).
*/

const order = () => ({
	order: {
		'o-1': {
			shipping_address: '1 Elm St',
			lines: [{ sku: 'A-1', qty: 1, price: { amount: 10 } }],
		},
	},
})

describe('A write straight into the store', { tags: ['unit'] }, () => {
	let warn: MockInstance<typeof console.warn>

	beforeEach(() => {
		setActivePinia(createPinia())
		warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
	})

	afterEach(() => warn.mockRestore())

	const warnings = () => warn.mock.calls.map(call => String(call[0])).filter(text => text.startsWith('[Stonecrop]'))

	it('is let through, and warns naming the path it changed', () => {
		const store = createHST(reactive(order()), 'StonecropStore')
		const lines = store.get('order.o-1.lines') as { qty: number }[]

		lines[0].qty = 5

		expect(store.get('order.o-1.lines.0.qty')).toBe(5)
		expect(warnings()).toHaveLength(1)
		expect(warnings()[0]).toContain('order.o-1.lines.0.qty')
		expect(warnings()[0]).toContain('useStonecrop')
	})

	it('warns at any depth, and for a field app code writes into a record it read', () => {
		const store = createHST(reactive(order()), 'StonecropStore')
		const record = store.get('order.o-1') as ReturnType<typeof order>['order']['o-1']

		record.lines[0].price.amount = 25
		record.shipping_address = '2 Oak Ave'

		expect(warnings()[0]).toContain('order.o-1.lines.0.price.amount')
		expect(warnings()[1]).toContain('order.o-1.shipping_address')
	})

	it('warns for a row added or removed in place', () => {
		const store = createHST(reactive(order()), 'StonecropStore')
		const lines = store.get('order.o-1.lines') as unknown[]

		lines.push({ sku: 'B-2', qty: 2 })
		lines.splice(0, 1)

		expect(warnings().length).toBeGreaterThan(0)
		expect(warnings().every(text => text.includes('order.o-1.lines'))).toBe(true)
	})

	it('is not logged, so it is not what Undo reverses', () => {
		const store = createHST(reactive(order()), 'StonecropStore')
		const log = useOperationLogStore()
		store.set('order.o-1.shipping_address', '2 Oak Ave')
		;(store.get('order.o-1.lines') as { qty: number }[])[0].qty = 5

		expect(log.operations.at(-1)).toMatchObject({ path: 'order.o-1.shipping_address' })
	})

	it('does not warn for a change made through set(), nor for undo and redo', () => {
		const store = createHST(reactive(order()), 'StonecropStore')
		const log = useOperationLogStore()

		store.set('order.o-1.lines', [{ sku: 'A-1', qty: 5 }])
		store.set('order.o-1.lines.0.qty', 6)
		store.set('order.o-2', { shipping_address: '3 Pine Rd', lines: [] })
		log.undo(store)
		log.redo(store)

		expect(warnings()).toEqual([])
	})

	it('warns for a row or a key added through set(), when it is later written straight into', () => {
		const store = createHST(reactive(order()), 'StonecropStore')

		store.set('order.o-1.lines', [
			{ sku: 'A-1', qty: 1 },
			{ sku: 'B-2', qty: 2 },
		])
		store.set('order.o-2', { shipping_address: '3 Pine Rd', lines: [] })
		expect(warnings()).toEqual([])

		;(store.get('order.o-1.lines') as { qty: number }[])[1].qty = 7
		;(store.get('order.o-2') as { shipping_address: string }).shipping_address = '4 Ash Ln'
		;(store.get('order.o-1.lines') as { qty: number }[]).push({ qty: 3 })
		;(store.get('order.o-1.lines') as { qty: number }[])[2].qty = 9

		expect(warnings()[0]).toContain('order.o-1.lines.1.qty')
		expect(warnings()[1]).toContain('order.o-2.shipping_address')
		expect(warnings().at(-1)).toContain('order.o-1.lines.2.qty')
	})

	it('warns once per write', () => {
		const store = createHST(reactive(order()), 'StonecropStore')
		store.set('order.o-1.lines', [{ sku: 'A-1', qty: 1 }])
		store.set('order.o-1.lines', [{ sku: 'A-1', qty: 2 }])

		;(store.get('order.o-1.lines') as { qty: number }[])[0].qty = 5

		expect(warnings()).toHaveLength(1)
	})

	it('does not walk the rest of the store again after each change', async () => {
		const data = order() as Record<string, any>
		let reads = 0
		const other: Record<string, unknown> = {}
		Object.defineProperty(other, 'name', { enumerable: true, configurable: true, get: () => (reads++, 'x') })
		data.customer = { 'c-1': other }
		const store = createHST(reactive(data), 'StonecropStore')
		const readsAfterCreate = reads

		for (let i = 0; i < 5; i++) store.set('order.o-1.lines.0.qty', i)
		;(store.get('order.o-1.lines') as { qty: number }[])[0].qty = 9
		await nextTick()

		expect(reads).toBe(readsAfterCreate)
	})

	it('keeps warning after the scope that built the store is stopped', () => {
		const scope = effectScope()
		const store = scope.run(() => createHST(reactive(order()), 'StonecropStore'))!
		scope.stop()

		;(store.get('order.o-1.lines') as { qty: number }[])[0].qty = 5

		expect(warnings()).toHaveLength(1)
	})

	it("is not watched in production, where the warning's cost is not paid", () => {
		vi.stubEnv('NODE_ENV', 'production')
		try {
			const store = createHST(reactive(order()), 'StonecropStore')
			;(store.get('order.o-1.lines') as { qty: number }[])[0].qty = 5
			expect(warnings()).toEqual([])
		} finally {
			vi.unstubAllEnvs()
		}
	})
})
