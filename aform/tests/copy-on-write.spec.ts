import { describe, expect, it, vi } from 'vite-plus/test'
import { isReactive, reactive, toRaw } from 'vue'

import { copyOnWrite, settle } from '../src/utils/copyOnWrite'

/*
A table's rows are often the store's own objects. A component that writes into a row it was handed must leave
that row as it was and report the change as new rows, so the store hears of it and its undo log keeps it (#557).
*/

const lines = () => [
	{ sku: 'A-1', qty: 1, price: { amount: 10, currency: 'EUR' } },
	{ sku: 'B-2', qty: 2, price: { amount: 20, currency: 'EUR' } },
]

describe('copyOnWrite', { tags: ['unit'] }, () => {
	it('reads as the value it was given', () => {
		const source = lines()
		const rows = copyOnWrite(source, vi.fn())

		expect(rows).toEqual(source)
		expect(Array.isArray(rows)).toBe(true)
		expect(rows.length).toBe(2)
		expect(rows.map(row => row.sku)).toEqual(['A-1', 'B-2'])
		expect({ ...rows[0] }).toMatchObject({ sku: 'A-1', qty: 1 })
		expect(JSON.stringify(rows)).toBe(JSON.stringify(source))
	})

	it('reports a write into a row as new rows and leaves the rows it was given', () => {
		const source = lines()
		const before = structuredClone(source)
		const onWrite = vi.fn()
		const rows = copyOnWrite(source, onWrite)

		rows[0].qty = 5

		expect(source).toEqual(before)
		expect(onWrite).toHaveBeenCalledTimes(1)
		const [next] = onWrite.mock.calls[0]
		expect(next).toEqual([{ ...before[0], qty: 5 }, before[1]])
		// What the write did not touch is shared, not copied.
		expect(next[1]).toBe(source[1])
	})

	it('reports a write at any depth', () => {
		const source = lines()
		const onWrite = vi.fn()
		const rows = copyOnWrite(source, onWrite)

		rows[1].price.amount = 25

		expect(source[1].price.amount).toBe(20)
		expect(onWrite.mock.calls[0][0][1]).toEqual({ sku: 'B-2', qty: 2, price: { amount: 25, currency: 'EUR' } })
		expect(onWrite.mock.calls[0][0][0]).toBe(source[0])
	})

	it('builds each write on the one before it, and shows it through rows read before', () => {
		const source = lines()
		const onWrite = vi.fn()
		const rows = copyOnWrite(source, onWrite)
		const first = rows[0]

		first.qty = 5
		first.sku = 'A-9'

		expect(first).toMatchObject({ sku: 'A-9', qty: 5 })
		expect(onWrite.mock.calls.at(-1)![0][0]).toMatchObject({ sku: 'A-9', qty: 5 })
		expect(source[0]).toMatchObject({ sku: 'A-1', qty: 1 })
	})

	it("reports a list's own methods as one write each", () => {
		const source = lines()
		const onWrite = vi.fn()
		const rows = copyOnWrite(source, onWrite)

		rows.push({ sku: 'C-3', qty: 3, price: { amount: 30, currency: 'EUR' } })

		expect(source).toHaveLength(2)
		expect(onWrite).toHaveBeenCalledTimes(1)
		expect(onWrite.mock.calls[0][0].map((row: { sku: string }) => row.sku)).toEqual(['A-1', 'B-2', 'C-3'])
	})

	it('reports a removed property', () => {
		const source = lines()
		const onWrite = vi.fn()
		const rows = copyOnWrite(source, onWrite)

		delete (rows[0] as Partial<(typeof source)[0]>).price

		expect(source[0].price).toBeDefined()
		expect(onWrite.mock.calls[0][0][0]).toEqual({ sku: 'A-1', qty: 1 })
	})

	it('reports nothing for a write that changes nothing', () => {
		const onWrite = vi.fn()
		const rows = copyOnWrite(lines(), onWrite)

		rows[0].qty = 1

		expect(onWrite).not.toHaveBeenCalled()
	})

	it("leaves a store's reactive rows as they were, and keeps their raw objects to itself", () => {
		const source = reactive(lines())
		const onWrite = vi.fn()
		const rows = copyOnWrite(source, onWrite)

		rows[0].qty = 5
		;(toRaw(rows[1]) as { qty: number }).qty = 7

		expect(source[0].qty).toBe(1)
		expect(source[1].qty).toBe(2)
		expect(isReactive(rows)).toBe(false)
		expect(onWrite).toHaveBeenCalledTimes(2)
		expect([...rows].map(row => row.qty)).toEqual([5, 7])
	})

	it('hands over a value that is not a plain object or a list as it is', () => {
		const due = new Date('2026-01-01')
		const rows = copyOnWrite([{ due }], vi.fn())

		expect(rows[0].due).toBe(due)
		expect(rows[0].due.getFullYear()).toBe(2026)
		expect(copyOnWrite(due, vi.fn())).toBe(due)
	})
})

describe('settle', { tags: ['unit'] }, () => {
	it('swaps each view, at any depth, for the value it shows', () => {
		const source = lines()
		const rows = copyOnWrite(source, vi.fn())
		rows[0].qty = 5

		const handedBack = settle([{ ...rows[0], sku: 'A-2' }, rows[1]])

		expect(handedBack[0]).toEqual({ sku: 'A-2', qty: 5, price: { amount: 10, currency: 'EUR' } })
		expect(handedBack[0].price).toBe(source[0].price)
		expect(handedBack[1]).toBe(source[1])
	})

	it('returns a value holding no view as it is', () => {
		const source = lines()
		expect(settle(source)).toBe(source)
	})
})
