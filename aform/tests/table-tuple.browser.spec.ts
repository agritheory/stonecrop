import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { defineComponent, h, ref } from 'vue'

import { ATable, install as installATable, type TableRow } from '@stonecrop/atable'

import ATableTupleCurrencyPicker from '../src/components/table/ATableTupleCurrencyPicker.vue'
import ATableTupleQuantityPicker from '../src/components/table/ATableTupleQuantityPicker.vue'
import ATupleCellEditor from '../src/components/table/ATupleCellEditor.vue'

type QuantityValue = {
	qty: number | null
	uom: string
	stockQty: number | null
	stockUom: string
	conversionFactor: number
}
type QuantityRow = { product: string; note: string; qty: QuantityValue }

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

// A product, its quantity in boxes of ten and a note, so the quantity has a cell either side, and a box outside the
// table to move focus to.
const mountQuantityTable = () => {
	const rows = ref<QuantityRow[]>([
		{
			product: 'Widget',
			note: 'Fragile',
			qty: { qty: 2, uom: 'Box', stockQty: 20, stockUom: 'Nos', conversionFactor: 10 },
		},
	])
	const Host = defineComponent({
		setup: () => () =>
			h('div', [
				h(ATable, {
					columns: [
						{ name: 'product', label: 'Product', component: 'ATextInput', edit: true },
						{
							name: 'qty',
							label: 'Qty',
							component: 'AQuantityInput',
							edit: true,
							options: { uoms: ['Nos', 'Box'], stockUom: 'Nos', conversionFactors: { Box: 10 } },
						},
						{ name: 'note', label: 'Note', component: 'ATextInput', edit: true },
					],
					rows: rows.value,
					config: { view: 'list' },
					'onUpdate:rows': (next: TableRow[]) => (rows.value = next as QuantityRow[]),
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

const quantityCell = () => document.querySelector<HTMLElement>('td.atable-cell--tuple')!
const outside = () => document.querySelector<HTMLElement>('#outside')!

// Clicking a quantity cell puts its number in a box to type into, with the number selected.
const startEditingQuantity = async () => {
	await userEvent.click(quantityCell())
	await expect.poll(() => document.activeElement?.closest('td')).toBe(quantityCell())
	return document.activeElement as HTMLInputElement
}

const pickUnit = async (unit: string) => {
	await userEvent.click(quantityCell().querySelector<HTMLElement>('.atable-tuple-shell__handle')!)
	const option = [...document.querySelectorAll<HTMLElement>('.atable-tuple-picker-modal [role="option"]')].find(
		element => element.textContent?.trim() === unit
	)
	await userEvent.click(option!)
}

describe('a quantity cell in a table', { tags: ['browser'] }, () => {
	// The form's quantity box refuses a key that is not part of a number; the table's must not wipe the quantity for one.
	it('refuses a letter typed into the quantity', async () => {
		const { rows } = mountQuantityTable()
		await startEditingQuantity()
		await userEvent.keyboard('12a')
		await userEvent.click(outside())

		expect(rows.value[0].qty).toMatchObject({ qty: 12, uom: 'Box', stockQty: 120 })
	})

	// These keys move the caret in a box being typed in. Moving to another cell is for the cell, not its box.
	it.each(['ArrowLeft', 'ArrowRight', 'Home', 'End'])('keeps focus in the quantity being typed on %s', async key => {
		mountQuantityTable()
		const input = await startEditingQuantity()
		await userEvent.keyboard(`{${key}}`)

		expect(document.activeElement).toBe(input)
	})

	it('returns focus to the cell once a unit is picked', async () => {
		mountQuantityTable()
		await startEditingQuantity()
		await pickUnit('Nos')

		expect(quantityCell().contains(document.activeElement)).toBe(true)
	})

	it('stops editing the cell when focus leaves it after a unit is picked', async () => {
		mountQuantityTable()
		await startEditingQuantity()
		await pickUnit('Nos')
		await userEvent.click(outside())

		expect(quantityCell().classList.contains('atable-cell--tuple-active')).toBe(false)
	})
})
