import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { defineComponent, h, ref, type Ref } from 'vue'

import { ATable, install as installATable, type TableColumn, type TableRow } from '@stonecrop/atable'

import ATableTupleCurrencyPicker from '../src/components/table/ATableTupleCurrencyPicker.vue'
import ATableTupleQuantityPicker from '../src/components/table/ATableTupleQuantityPicker.vue'
import ATupleCellEditor from '../src/components/table/ATupleCellEditor.vue'
import type { CurrencyValue, QuantityValue } from '../src/types'

type QuantityRow = { product: string; note: string; qty: QuantityValue }
type PriceRow = { product: string; note: string; price: CurrencyValue }

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

// A product, the value under test and a note, so the value has a cell either side, and a box outside the table to
// move focus to.
const mountTable = <Row extends TableRow>(column: TableColumn, row: Row) => {
	const rows = ref([row]) as Ref<Row[]>
	const Host = defineComponent({
		setup: () => () =>
			h('div', [
				h(ATable, {
					columns: [
						{ name: 'product', label: 'Product', component: 'ATextInput', edit: true },
						{ ...column, edit: true },
						{ name: 'note', label: 'Note', component: 'ATextInput', edit: true },
					],
					rows: rows.value,
					config: { view: 'list' },
					'onUpdate:rows': (next: TableRow[]) => (rows.value = next as Row[]),
				}),
				h('input', { id: 'outside', 'aria-label': 'Outside the table' }),
			]),
	})
	wrapper = mount(Host, {
		attachTo: document.body,
		global: {
			plugins: [createPinia(), { install: installATable }],
			components: { ATupleCellEditor, ATableTupleQuantityPicker, ATableTupleCurrencyPicker },
		},
	})
	return { rows }
}

// Two boxes of ten.
const mountQuantityTable = () =>
	mountTable<QuantityRow>(
		{
			name: 'qty',
			label: 'Qty',
			component: 'AQuantityInput',
			options: { uoms: ['Nos', 'Box'], stockUom: 'Nos', conversionFactors: { Box: 10 } },
		},
		{
			product: 'Widget',
			note: 'Fragile',
			qty: { qty: 2, uom: 'Box', stockQty: 20, stockUom: 'Nos', conversionFactor: 10 },
		}
	)

const usd = { id: 'USD', displayText: 'US Dollar', symbol: '$' }

// Fifty dollars.
const mountPriceTable = () =>
	mountTable<PriceRow>(
		{ name: 'price', label: 'Price', component: 'ACurrencyInput', options: { baseCurrency: usd } },
		{
			product: 'Widget',
			note: 'Fragile',
			price: { amount: 50, currency: usd, baseAmount: 50, baseCurrency: usd, exchangeRate: 1 },
		}
	)

const tupleCell = () => document.querySelector<HTMLElement>('td.atable-cell--tuple')!
const outside = () => document.querySelector<HTMLElement>('#outside')!

// Clicking the cell puts its number in a box to type into, with the number selected.
const startEditingCell = async () => {
	await userEvent.click(tupleCell())
	await expect.poll(() => document.activeElement?.closest('td')).toBe(tupleCell())
	return document.activeElement as HTMLInputElement
}

const pickUnit = async (unit: string) => {
	await userEvent.click(tupleCell().querySelector<HTMLElement>('.atable-tuple-shell__handle')!)
	const option = [...document.querySelectorAll<HTMLElement>('.atable-tuple-picker-modal [role="option"]')].find(
		element => element.textContent?.trim() === unit
	)
	await userEvent.click(option!)
}

describe('a quantity cell in a table', { tags: ['browser'] }, () => {
	// The form's quantity box refuses a key that is not part of a number; the table's must not wipe the quantity for one.
	it('refuses a letter typed into the quantity', async () => {
		const { rows } = mountQuantityTable()
		await startEditingCell()
		await userEvent.keyboard('12a')
		await userEvent.click(outside())

		expect(rows.value[0].qty).toMatchObject({ qty: 12, uom: 'Box', stockQty: 120 })
	})

	// The box holds the text on its way to a number. "1." and "-" are not numbers yet, and must not be replaced by one.
	it.each([
		['1.5', 1.5],
		['-5', -5],
	])('keeps %s typed into the quantity', async (typed, qty) => {
		const { rows } = mountQuantityTable()
		await startEditingCell()
		await userEvent.keyboard(typed)
		await userEvent.click(outside())

		expect(rows.value[0].qty.qty).toBe(qty)
	})

	// These keys move the caret in a box being typed in. Moving to another cell is for the cell, not its box.
	it.each(['ArrowLeft', 'ArrowRight', 'Home', 'End'])('keeps focus in the quantity being typed on %s', async key => {
		mountQuantityTable()
		const input = await startEditingCell()
		await userEvent.keyboard(`{${key}}`)

		expect(document.activeElement).toBe(input)
	})

	it('returns focus to the cell once a unit is picked', async () => {
		mountQuantityTable()
		await startEditingCell()
		await pickUnit('Nos')

		expect(tupleCell().contains(document.activeElement)).toBe(true)
	})

	it('stops editing the cell when focus leaves it after a unit is picked', async () => {
		mountQuantityTable()
		await startEditingCell()
		await pickUnit('Nos')
		await userEvent.click(outside())

		expect(tupleCell().classList.contains('atable-cell--tuple-active')).toBe(false)
	})
})

describe('a price cell in a table', { tags: ['browser'] }, () => {
	// The box shows the price as typed; formatting it as "1.00" after the first key would push the rest past the cents.
	it('keeps a price typed with cents', async () => {
		const { rows } = mountPriceTable()
		await startEditingCell()
		await userEvent.keyboard('12.75')
		await userEvent.click(outside())

		expect(rows.value[0].price.amount).toBe(12.75)
	})
})
