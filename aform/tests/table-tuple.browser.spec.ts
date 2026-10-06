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
const eur = { id: 'EUR', displayText: 'Euro', symbol: '€' }
const jpy = { id: 'JPY', displayText: 'Yen', symbol: '¥' }

// Fifty dollars, or fifty of another currency.
const mountPriceTable = (currency = usd) =>
	mountTable<PriceRow>(
		{ name: 'price', label: 'Price', component: 'ACurrencyInput', options: { baseCurrency: currency } },
		{
			product: 'Widget',
			note: 'Fragile',
			price: { amount: 50, currency, baseAmount: 50, baseCurrency: currency, exchangeRate: 1 },
		}
	)

const tupleCell = () => document.querySelector<HTMLElement>('td.atable-cell--tuple')!
const outside = () => document.querySelector<HTMLElement>('#outside')!

// Puts `text` on the clipboard, as copying it from elsewhere would.
const copy = async (text: string) => {
	const source = document.body.appendChild(document.createElement('textarea'))
	source.value = text
	source.select()
	await userEvent.copy()
	source.remove()
}

// Clicking the cell puts its number in a box to type into, with the number selected.
const startEditingCell = async () => {
	await userEvent.click(tupleCell())
	await expect.poll(() => document.activeElement?.closest('td')).toBe(tupleCell())
	return document.activeElement as HTMLInputElement
}

const unitList = () => document.querySelector('.atable-tuple-picker-modal')
const isEditing = () => tupleCell().classList.contains('atable-cell--tuple-active')

const openUnitList = async () => {
	await userEvent.click(tupleCell().querySelector<HTMLElement>('.atable-tuple-shell__handle')!)
	await expect.poll(unitList).not.toBeNull()
}

const pickUnit = async (unit: string) => {
	await openUnitList()
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

	// A spreadsheet cell is copied with a line break after it.
	it('takes a quantity pasted from a spreadsheet', async () => {
		const { rows } = mountQuantityTable()
		await copy('12\r\n')
		await startEditingCell()
		await userEvent.paste()
		await userEvent.click(outside())

		expect(rows.value[0].qty).toMatchObject({ qty: 12, uom: 'Box', stockQty: 120 })
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

		expect(isEditing()).toBe(false)
	})

	// The unit list holds focus while it is open, so the cell must still learn that focus has gone elsewhere.
	it('stops editing the cell when another cell is clicked with the unit list open', async () => {
		mountQuantityTable()
		await startEditingCell()
		await openUnitList()
		await userEvent.click(document.querySelector<HTMLElement>('td[data-colindex="2"]')!)

		await expect.poll(isEditing).toBe(false)
	})

	it('keeps editing the cell when its handle is clicked with the unit list open', async () => {
		mountQuantityTable()
		await startEditingCell()
		await openUnitList()
		await userEvent.click(tupleCell().querySelector<HTMLElement>('.atable-tuple-shell__handle')!)
		await new Promise(resolve => setTimeout(resolve, 100))

		expect(isEditing()).toBe(true)
	})

	it('closes the unit list when Tab moves focus out of it', async () => {
		mountQuantityTable()
		await startEditingCell()
		await openUnitList()
		await userEvent.keyboard('{Tab}')

		await expect.poll(unitList).toBeNull()
		await expect.poll(isEditing).toBe(false)
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

	// A refused key leaves the rest of what was typed, as in the form's price box.
	it.each([
		['12a', 12],
		['-12', -12],
	])('reads %s typed into a price as %s', async (typed, amount) => {
		const { rows } = mountPriceTable()
		await startEditingCell()
		await userEvent.keyboard(typed)
		await userEvent.click(outside())

		expect(rows.value[0].price.amount).toBe(amount)
	})

	it('refuses a decimal point in a price without decimals', async () => {
		const { rows } = mountPriceTable(jpy)
		await startEditingCell()
		await userEvent.keyboard('1.5')
		await userEvent.click(outside())

		expect(rows.value[0].price.amount).toBe(15)
	})

	// The cell writes a price the browser's way whatever its currency, so the box reads it the same way.
	it('keeps a euro price typed the way the browser writes numbers', async () => {
		const { rows } = mountPriceTable(eur)
		await startEditingCell()
		await userEvent.keyboard(new Intl.NumberFormat(undefined, { minimumFractionDigits: 2 }).format(1234.56))
		await userEvent.click(outside())

		expect(rows.value[0].price.amount).toBe(1234.56)
	})

	// The form's price box refuses a paste that is not an amount; the table's must not save it as 0.
	it('refuses a pasted price that is not an amount', async () => {
		const { rows } = mountPriceTable()
		await copy('abc')
		await startEditingCell()
		await userEvent.paste()
		await userEvent.click(outside())

		expect(rows.value[0].price.amount).toBe(50)
	})
})

// Fifty dollars on a dollar order that takes euros and pounds too.
const mountPriceTableWithRates = (currency = usd) =>
	mountTable<PriceRow>(
		{
			name: 'price',
			label: 'Price',
			component: 'ACurrencyInput',
			options: { baseCurrency: usd, exchangeRates: { EUR: 1.1, GBP: 1.25 } },
		},
		{
			product: 'Widget',
			note: 'Fragile',
			price: { amount: 50, currency, baseAmount: 50, baseCurrency: usd, exchangeRate: 1 },
		}
	)

const currencyChoices = () =>
	[...document.querySelectorAll('.atable-tuple-picker-modal [role="option"]')].map(option => option.textContent?.trim())

const openCurrencyListByKeyboard = async () => {
	await startEditingCell()
	await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}')
	await expect.poll(unitList).not.toBeNull()
}

describe('the currency list of a price cell in a table', { tags: ['browser'] }, () => {
	// The price's own currency is listed once, under its name, though it also has a rate.
	it("lists the order's currency, the price's, then each one with a rate", async () => {
		mountPriceTableWithRates(eur)
		await startEditingCell()
		await openUnitList()

		expect(currencyChoices()).toEqual(['$ — US Dollar', '€ — Euro', 'GBP'])
	})

	it("keeps the amount and works out the order's amount when a currency is clicked", async () => {
		const { rows } = mountPriceTableWithRates()
		await startEditingCell()
		await pickUnit('EUR')

		expect(rows.value[0].price).toMatchObject({
			amount: 50,
			currency: { id: 'EUR' },
			exchangeRate: 1.1,
			baseAmount: 55,
		})
		expect(tupleCell().contains(document.activeElement)).toBe(true)
	})

	// Arrows move through the list in a loop; Enter picks the highlighted currency, or the first if none is.
	it.each([
		['{Enter}', 'USD'],
		['{ArrowDown}{ArrowDown}{Enter}', 'EUR'],
		['{ArrowUp}{Enter}', 'GBP'],
		['{ArrowUp}{ArrowDown}{Enter}', 'USD'],
		['{ArrowDown}{ArrowUp}{Enter}', 'GBP'],
	])('picks with %s: %s', async (keys, currency) => {
		const { rows } = mountPriceTableWithRates(eur)
		await openCurrencyListByKeyboard()
		await userEvent.keyboard(keys)

		await expect.poll(unitList).toBeNull()
		expect(rows.value[0].price.currency.id).toBe(currency)
	})

	// A doctype carries its lookup as text.
	it("lists what the column's currency lookup returns", async () => {
		mountTable<PriceRow>(
			{
				name: 'price',
				label: 'Price',
				component: 'ACurrencyInput',
				options: {
					baseCurrency: usd,
					filterFunction:
						"async () => [{ id: 'USD', displayText: 'US Dollar' }, { id: 'INR', displayText: 'Rupee', symbol: '₹' }]",
				},
			},
			{
				product: 'Widget',
				note: 'Fragile',
				price: { amount: 50, currency: usd, baseAmount: 50, baseCurrency: usd, exchangeRate: 1 },
			}
		)
		await startEditingCell()
		await openUnitList()

		await expect.poll(currencyChoices).toEqual(['US Dollar', '₹ — Rupee'])
	})
})
