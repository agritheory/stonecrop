import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { ATable, install as installATable } from '@stonecrop/atable'

import ACurrencyInput from '../src/components/form/ACurrencyInput.vue'
import ANumericInput from '../src/components/form/ANumericInput.vue'
import AQuantityInput from '../src/components/form/AQuantityInput.vue'
import ATableTupleCurrencyPicker from '../src/components/table/ATableTupleCurrencyPicker.vue'
import ATableTupleQuantityPicker from '../src/components/table/ATableTupleQuantityPicker.vue'
import ATupleCellEditor from '../src/components/table/ATupleCellEditor.vue'

const lastEmitted = (wrapper: VueWrapper) => {
	const emitted = wrapper.emitted('update:modelValue') ?? []
	return emitted[emitted.length - 1]?.[0]
}

// Types `text` into the box as one input, then leaves it.
const enter = async (wrapper: VueWrapper, selector: string, text: string) => {
	const input = wrapper.find<HTMLInputElement>(selector)
	await input.trigger('focus')
	input.element.value = text
	await input.trigger('input')
	await input.trigger('blur')
	await nextTick()
	return input
}

// Focuses the box and leaves it, typing nothing.
const focusAndLeave = async (wrapper: VueWrapper, selector: string) => {
	const input = wrapper.find<HTMLInputElement>(selector)
	await input.trigger('focus')
	await input.trigger('blur')
	await nextTick()
}

const keyPrevented = (wrapper: VueWrapper, selector: string, key: string) => {
	const event = new KeyboardEvent('keydown', { key, cancelable: true, bubbles: true })
	wrapper.find(selector).element.dispatchEvent(event)
	return event.defaultPrevented
}

const pastePrevented = (wrapper: VueWrapper, selector: string, text: string) => {
	const event = new Event('paste', { cancelable: true, bubbles: true })
	Object.defineProperty(event, 'clipboardData', { value: { getData: () => text } })
	wrapper.find(selector).element.dispatchEvent(event)
	return event.defaultPrevented
}

describe('ANumericInput arithmetic', { tags: ['component'] }, () => {
	const box = '.aform_input-field'
	// No options: arithmetic is on by default.
	const mountNumeric = (modelValue: number | null = 5, arithmetic?: boolean) =>
		mount(ANumericInput, {
			props: { modelValue, label: 'Qty', options: arithmetic === undefined ? undefined : { arithmetic } },
		})

	it('takes arithmetic by default: a text box, so there is no spinner and an operator can be typed', () => {
		const input = mountNumeric().find(box)
		expect(input.attributes('type')).toBe('text')
		expect(input.attributes('inputmode')).toBe('decimal')
		expect(input.element.getAttribute('value') ?? (input.element as HTMLInputElement).value).toBe('5')
	})

	it('keeps the plain number box with arithmetic: false', () => {
		expect(mountNumeric(5, false).find(box).attributes('type')).toBe('number')
	})

	it('evaluates the expression and settles the box to the result', async () => {
		const wrapper = mountNumeric()
		const input = await enter(wrapper, box, '12*3+4')
		expect(lastEmitted(wrapper)).toBe(40)
		expect(input.element.value).toBe('40')
	})

	it('takes each well-formed result as it is typed', async () => {
		const wrapper = mountNumeric()
		const input = wrapper.find<HTMLInputElement>(box)
		await input.trigger('focus')
		input.element.value = '12*3'
		await input.trigger('input')
		expect(lastEmitted(wrapper)).toBe(36)
		// Unfinished: the model keeps 36 and the box keeps the text.
		input.element.value = '12*3+'
		await input.trigger('input')
		expect(lastEmitted(wrapper)).toBe(36)
		expect(input.element.value).toBe('12*3+')
	})

	it('settles on Enter', async () => {
		const wrapper = mountNumeric()
		const input = wrapper.find<HTMLInputElement>(box)
		await input.trigger('focus')
		input.element.value = '(2+3)*4'
		await input.trigger('input')
		await input.trigger('keydown', { key: 'Enter' })
		await nextTick()
		expect(lastEmitted(wrapper)).toBe(20)
		expect(input.element.value).toBe('20')
	})

	it('reverts an unfinished expression to the last number on blur', async () => {
		const wrapper = mountNumeric()
		const input = await enter(wrapper, box, '12*')
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		expect(input.element.value).toBe('5')
	})

	it('reverts division by zero', async () => {
		const wrapper = mountNumeric()
		const input = await enter(wrapper, box, '5/0')
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		expect(input.element.value).toBe('5')
	})

	it('holds null once emptied', async () => {
		const wrapper = mountNumeric()
		await enter(wrapper, box, '')
		expect(lastEmitted(wrapper)).toBeNull()
	})

	it('reads a leading = or + as a spreadsheet does', async () => {
		const wrapper = mountNumeric()
		const input = await enter(wrapper, box, '=12*3')
		expect(lastEmitted(wrapper)).toBe(36)
		expect(input.element.value).toBe('36')
		await enter(wrapper, box, '+2*4')
		expect(lastEmitted(wrapper)).toBe(8)
	})

	it('takes = only as the first character', () => {
		const wrapper = mountNumeric()
		const input = wrapper.find<HTMLInputElement>(box).element
		input.value = ''
		expect(keyPrevented(wrapper, box, '=')).toBe(false)
		input.value = '12'
		input.setSelectionRange(2, 2)
		expect(keyPrevented(wrapper, box, '=')).toBe(true)
		// Typed over the whole box, as Excel muscle memory does on a selected field.
		input.setSelectionRange(0, 2)
		expect(keyPrevented(wrapper, box, '=')).toBe(false)
		expect(pastePrevented(wrapper, box, '=5*2')).toBe(false)
	})

	it('refuses exponent keys and letters, and takes operators', () => {
		const wrapper = mountNumeric()
		for (const key of ['e', 'E', '^', 'x']) expect(keyPrevented(wrapper, box, key), key).toBe(true)
		for (const key of ['7', '+', '-', '*', '/', '%', '(', ')', '.', 'Backspace', 'ArrowLeft'])
			expect(keyPrevented(wrapper, box, key), key).toBe(false)
	})

	it('refuses a paste with an exponent or letters', () => {
		const wrapper = mountNumeric()
		expect(pastePrevented(wrapper, box, '1e3')).toBe(true)
		expect(pastePrevented(wrapper, box, 'abc')).toBe(true)
		expect(pastePrevented(wrapper, box, '(12*3)+4')).toBe(false)
	})

	it('writes nothing when the box is focused and left without an edit', async () => {
		const wrapper = mountNumeric()
		await focusAndLeave(wrapper, box)
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})

	// A database numeric reaches the form as text; 9007199254740993 is past what a number holds exactly.
	it.each(['40', '9007199254740993'])('writes nothing for %s arriving as text', async modelValue => {
		const wrapper = mount(ANumericInput, { props: { modelValue: modelValue as unknown as number, label: 'Qty' } })
		await focusAndLeave(wrapper, box)
		await wrapper.find(box).trigger('keydown', { key: 'Enter' })
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})

	it('rounds the result to options.precision', async () => {
		const wrapper = mount(ANumericInput, { props: { modelValue: 1, label: 'Total', options: { precision: 2 } } })
		const input = await enter(wrapper, box, '10/3')
		expect(lastEmitted(wrapper)).toBe(3.33)
		expect(input.element.value).toBe('3.33')
	})

	it('keeps every digit without a precision', async () => {
		const wrapper = mountNumeric()
		await enter(wrapper, box, '10/3')
		expect(lastEmitted(wrapper)).toBe(3.33333333333333)
	})

	it('rounds a plain number box to options.precision too', async () => {
		const wrapper = mount(ANumericInput, {
			props: { modelValue: 1, label: 'Total', options: { arithmetic: false, precision: 2 } },
		})
		await wrapper.find(box).setValue('3.14159')
		expect(lastEmitted(wrapper)).toBe(3.14)
	})

	it('follows the model while the box is not focused', async () => {
		const wrapper = mountNumeric()
		await wrapper.setProps({ modelValue: 9 })
		expect(wrapper.find<HTMLInputElement>(box).element.value).toBe('9')
	})
})

describe('AQuantityInput arithmetic', { tags: ['component'] }, () => {
	const box = '.aquantity__qty'
	const options = { uoms: ['Nos', 'Box'], stockUom: 'Nos', conversionFactors: { Box: 10 } }
	const mountQuantity = () =>
		mount(AQuantityInput, {
			props: {
				label: 'Qty',
				options,
				modelValue: { qty: 1, uom: 'Box', stockQty: 10, stockUom: 'Nos', conversionFactor: 10 },
			},
		})

	it('evaluates the quantity and converts the result to the stock unit', async () => {
		const wrapper = mountQuantity()
		const input = await enter(wrapper, box, '3*4')
		expect(lastEmitted(wrapper)).toMatchObject({ qty: 12, uom: 'Box', stockQty: 120 })
		expect(input.element.value).toBe('12')
		expect(input.attributes('type')).toBe('text')
	})

	it('refuses exponent keys', () => {
		expect(keyPrevented(mountQuantity(), box, 'e')).toBe(true)
	})
})

describe('ACurrencyInput arithmetic', { tags: ['component'] }, () => {
	const box = '.acurrency__amount'
	const value = {
		amount: 10,
		currency: { id: 'EUR', displayText: 'Euro' },
		baseAmount: 11,
		baseCurrency: { id: 'USD', displayText: 'US Dollar' },
		exchangeRate: 1.1,
	}
	const mountCurrency = (extra: Record<string, unknown> = {}) =>
		mount(ACurrencyInput, {
			props: {
				label: 'Total',
				options: {
					baseCurrency: { id: 'USD', displayText: 'US Dollar' },
					exchangeRates: { EUR: 1.1 },
					...extra,
				},
				modelValue: value,
			},
		})

	it('evaluates the amount, recomputes the base amount and settles to the masked amount', async () => {
		const wrapper = mountCurrency()
		const input = await enter(wrapper, box, '100*3')
		expect(lastEmitted(wrapper)).toMatchObject({ amount: 300, baseAmount: 330 })
		expect(input.element.value).toBe('300.00')
	})

	it('reads grouped amounts in the expression', async () => {
		const wrapper = mountCurrency()
		await enter(wrapper, box, '1,000.50*2')
		expect(lastEmitted(wrapper)).toMatchObject({ amount: 2001 })
	})

	it('settles to a plain number without the mask', async () => {
		const wrapper = mountCurrency({ amountMask: false })
		const input = await enter(wrapper, box, '12.5*2')
		expect(lastEmitted(wrapper)).toMatchObject({ amount: 25 })
		expect(input.element.value).toBe('25')
	})

	it("rounds a worked-out amount to the currency's decimals, as the box shows it", async () => {
		const wrapper = mountCurrency()
		const input = await enter(wrapper, box, '10/3')
		expect(lastEmitted(wrapper)).toMatchObject({ amount: 3.33 })
		expect(input.element.value).toBe('3.33')
	})

	it('rounds to the currency even without the mask', async () => {
		const wrapper = mountCurrency({ amountMask: false })
		await enter(wrapper, box, '10/3')
		expect(lastEmitted(wrapper)).toMatchObject({ amount: 3.33 })
	})

	it('writes nothing when the amount box is focused and left without an edit', async () => {
		const wrapper = mountCurrency()
		await focusAndLeave(wrapper, box)
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})

	it('refuses exponent keys', () => {
		expect(keyPrevented(mountCurrency(), box, 'e')).toBe(true)
		expect(keyPrevented(mountCurrency(), box, '*')).toBe(false)
	})
})

describe('arithmetic in table quantity and currency cells', { tags: ['component'] }, () => {
	let wrapper: VueWrapper | undefined

	afterEach(() => {
		wrapper?.unmount()
		wrapper = undefined
	})

	const mountTable = async (column: Record<string, unknown>, row: unknown) => {
		wrapper = mount(ATable, {
			props: {
				columns: [{ name: 'value', label: 'Value', edit: true, ...column }],
				rows: [{ value: row }],
				config: { view: 'list' },
			},
			attachTo: document.body,
			global: {
				plugins: [createPinia(), { install: installATable }],
				components: { ATupleCellEditor, ATableTupleQuantityPicker, ATableTupleCurrencyPicker },
			},
		})
		await nextTick()
		await wrapper.find('td.atable-cell--tuple').trigger('click')
		await nextTick()
		return wrapper
	}

	const typeAndLeave = async (table: VueWrapper, text: string) => {
		const input = table.find<HTMLInputElement>('input.atable-tuple-shell__input')
		input.element.value = text
		await input.trigger('input')
		await input.trigger('blur')
		await nextTick()
		return input
	}

	const cellData = (table: VueWrapper) =>
		(table.vm as unknown as { store: { getCellData: (c: number, r: number) => any } }).store.getCellData(0, 0)

	it('evaluates a quantity cell', async () => {
		const table = await mountTable(
			{ component: 'AQuantityInput', options: { stockUom: 'Nos' } },
			{ qty: 2, uom: 'Nos', stockQty: 2, stockUom: 'Nos', conversionFactor: 1 }
		)
		await typeAndLeave(table, '2*(3+4)')
		expect(cellData(table)).toMatchObject({ qty: 14, stockQty: 14 })
	})

	it('leaves a quantity cell at its last number for an unfinished expression', async () => {
		const table = await mountTable(
			{ component: 'AQuantityInput', options: { stockUom: 'Nos' } },
			{ qty: 2, uom: 'Nos', stockQty: 2, stockUom: 'Nos', conversionFactor: 1 }
		)
		// Enter settles the box while the cell is still being edited, so the box itself shows the revert.
		const input = table.find<HTMLInputElement>('input.atable-tuple-shell__input')
		input.element.value = '2*'
		await input.trigger('input')
		await input.trigger('keydown', { key: 'Enter' })
		await nextTick()
		expect(cellData(table)).toMatchObject({ qty: 2 })
		expect(input.element.value).toBe('2')

		await input.trigger('blur')
		await nextTick()
		expect(cellData(table)).toMatchObject({ qty: 2 })
	})

	it('reads a leading = in a cell', async () => {
		const table = await mountTable(
			{ component: 'AQuantityInput', options: { stockUom: 'Nos' } },
			{ qty: 2, uom: 'Nos', stockQty: 2, stockUom: 'Nos', conversionFactor: 1 }
		)
		await typeAndLeave(table, '=2*3')
		expect(cellData(table)).toMatchObject({ qty: 6 })
	})

	it('keeps a cell plain with arithmetic: false', async () => {
		const table = await mountTable(
			{ component: 'AQuantityInput', options: { stockUom: 'Nos', arithmetic: false } },
			{ qty: 2, uom: 'Nos', stockQty: 2, stockUom: 'Nos', conversionFactor: 1 }
		)
		expect(keyPrevented(table, 'input.atable-tuple-shell__input', '*')).toBe(true)
	})

	it('evaluates a currency cell', async () => {
		const table = await mountTable(
			{ component: 'ACurrencyInput', options: { baseCurrency: 'USD' } },
			{ amount: 10, currency: { id: 'USD' }, baseAmount: 10, baseCurrency: { id: 'USD' }, exchangeRate: 1 }
		)
		await typeAndLeave(table, '10+5.5')
		expect(cellData(table)).toMatchObject({ amount: 15.5, baseAmount: 15.5 })
	})

	it("rounds a currency cell to the currency's decimals", async () => {
		const table = await mountTable(
			{ component: 'ACurrencyInput', options: { baseCurrency: 'USD' } },
			{ amount: 10, currency: { id: 'USD' }, baseAmount: 10, baseCurrency: { id: 'USD' }, exchangeRate: 1 }
		)
		await typeAndLeave(table, '10/3')
		expect(cellData(table)).toMatchObject({ amount: 3.33, baseAmount: 3.33 })
	})

	it('writes nothing to the row when a cell is entered and left without an edit', async () => {
		const row = { qty: '2', uom: 'Nos', stockQty: 2, stockUom: 'Nos', conversionFactor: 1 }
		const table = await mountTable({ component: 'AQuantityInput', options: { stockUom: 'Nos' } }, row)
		const input = table.find<HTMLInputElement>('input.atable-tuple-shell__input')
		await input.trigger('focus')
		await input.trigger('keydown', { key: 'Enter' })
		await input.trigger('blur')
		await table.find('td.atable-cell--tuple').trigger('focusout')
		await nextTick()
		// Still the record's own value: the text qty was neither re-read as a number nor rewritten.
		expect(cellData(table)).toEqual(row)
	})

	it('refuses exponent keys in a cell', async () => {
		const table = await mountTable(
			{ component: 'AQuantityInput', options: { stockUom: 'Nos' } },
			{ qty: 2, uom: 'Nos', stockQty: 2, stockUom: 'Nos', conversionFactor: 1 }
		)
		expect(keyPrevented(table, 'input.atable-tuple-shell__input', 'e')).toBe(true)
		expect(keyPrevented(table, 'input.atable-tuple-shell__input', '*')).toBe(false)
	})
})
