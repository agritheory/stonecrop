import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { toRaw } from 'vue'

import AForm from '../src/components/AForm.vue'
import ACurrencyInput from '../src/components/form/ACurrencyInput.vue'
import ADropdown from '../src/components/form/ADropdown.vue'
import AQuantityInput from '../src/components/form/AQuantityInput.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { AFormLinkValue, ResolvedField } from '../src/types'

const lastData = (wrapper: { emitted: (event: string) => unknown[][] | undefined }) =>
	wrapper.emitted('update:data')?.at(-1)?.[0] as Record<string, unknown> | undefined

describe('a quantity field whose unit is a field of its own', { tags: ['component'] }, () => {
	const schema = (options: Record<string, unknown> = { uoms: ['Box', 'Case'] }): ResolvedField[] => [
		{
			kind: 'field',
			fieldname: 'quantity',
			component: 'AQuantityInput',
			label: 'Quantity',
			parts: { qty: 'quantity', uom: 'uom' },
			options,
		},
		{ kind: 'field', fieldname: 'uom', component: 'ATextInput', label: 'Unit', hidden: true },
	]

	const mountForm = (
		data: Record<string, unknown>,
		errors?: Record<string, string[]>,
		options?: Record<string, unknown>
	) =>
		mount(AForm, {
			props: { schema: schema(options), data, errors },
			global: { components: { AQuantityInput, ATextInput } },
		})

	it('shows the quantity and its unit in one box', () => {
		const wrapper = mountForm({ quantity: 5, uom: 'Box' })
		expect(wrapper.findAllComponents(AQuantityInput)).toHaveLength(1)
		expect(wrapper.findComponent(ATextInput).exists()).toBe(false)
		expect(wrapper.find<HTMLInputElement>('.aquantity__qty').element.value).toBe('5')
		expect(wrapper.findComponent(ADropdown).props('modelValue')).toBe('Box')
		expect(wrapper.find('.aquantity').attributes('parts')).toBeUndefined()
	})

	it('writes a typed quantity to the quantity field alone', async () => {
		const wrapper = mountForm({ quantity: 5, uom: 'Box', note: 'x' })
		await wrapper.find('.aquantity__qty').setValue('7')
		expect(lastData(wrapper)).toEqual({ quantity: 7, uom: 'Box', note: 'x' })
	})

	it('writes a chosen unit to the unit field alone', async () => {
		const wrapper = mountForm({ quantity: 5, uom: 'Box' })
		wrapper.findComponent(ADropdown).vm.$emit('update:modelValue', 'Case')
		await wrapper.vm.$nextTick()
		expect(lastData(wrapper)).toEqual({ quantity: 5, uom: 'Case' })
	})

	it('leaves an empty unit empty when only the quantity is typed', async () => {
		const wrapper = mountForm({ quantity: null, uom: null })
		await wrapper.find('.aquantity__qty').setValue('3')
		expect(lastData(wrapper)).toEqual({ quantity: 3, uom: null })
	})

	it('works out the stock quantity from its options, since no field holds it', () => {
		const options = { uoms: ['Box', 'Nos'], stockUom: 'Nos', conversionFactors: { Box: 12 } }
		const wrapper = mountForm({ quantity: 5, uom: 'Box' }, undefined, options)
		expect(wrapper.find('.aquantity__helper').text()).toBe('= 60 Nos · 1 Box = 12 Nos')
	})

	it('shows the errors of every field it edits', () => {
		const wrapper = mountForm({ quantity: 5, uom: null }, { uom: ['Pick a unit'] })
		expect(wrapper.find('.aquantity .aform_error').text()).toBe('Pick a unit')
	})
})

describe('an order’s totals sharing its one currency and rate', { tags: ['component'] }, () => {
	const USD: AFormLinkValue = { id: 'USD', displayText: 'US Dollar' }
	const EUR: AFormLinkValue = { id: 'EUR', displayText: 'Euro' }

	const total = (fieldname: string, label: string): ResolvedField => ({
		kind: 'field',
		fieldname,
		component: 'ACurrencyInput',
		label,
		parts: { amount: fieldname, currency: 'currencyCode', exchangeRate: 'exchangeRate' },
		options: { doctype: 'currency', baseCurrency: USD, exchangeRates: { EUR: 1.1 }, precision: 2, amountMask: false },
	})

	// The stored rate differs from today's 1.1 on purpose: an edit that re-read the options would change it.
	const order = () => ({ netTotal: 100, grandTotal: 110, currencyCode: EUR, exchangeRate: 1.25 })

	const mountForm = (data: Record<string, unknown>) =>
		mount(AForm, {
			props: { schema: [total('netTotal', 'Net Total'), total('grandTotal', 'Grand Total')], data },
			global: { components: { ACurrencyInput } },
		})

	it('shows each total in the currency they share', () => {
		const wrapper = mountForm(order())
		const boxes = wrapper.findAllComponents(ACurrencyInput)
		expect(boxes).toHaveLength(2)
		expect(boxes.map(box => box.find<HTMLInputElement>('.acurrency__amount').element.value)).toEqual(['100', '110'])
		expect(
			boxes.map(box => (box.vm.$props as { modelValue: { currency: AFormLinkValue } }).modelValue.currency)
		).toEqual([EUR, EUR])
	})

	it('writes a typed amount to its own field alone, leaving the shared currency and rate as stored', async () => {
		const data = order()
		const wrapper = mountForm(data)
		await wrapper.findAllComponents(ACurrencyInput)[1].find('.acurrency__amount').setValue('120')
		const written = lastData(wrapper)
		expect(written).toEqual({ netTotal: 100, grandTotal: 120, currencyCode: EUR, exchangeRate: 1.25 })
		expect(toRaw(written?.currencyCode)).toBe(EUR)
	})

	it('leaves an empty currency and rate empty when only an amount is typed', async () => {
		const wrapper = mountForm({ netTotal: null, grandTotal: null, currencyCode: null, exchangeRate: null })
		await wrapper.findAllComponents(ACurrencyInput)[1].find('.acurrency__amount').setValue('50')
		expect(lastData(wrapper)).toEqual({ netTotal: null, grandTotal: 50, currencyCode: null, exchangeRate: null })
	})

	it('works out the base amount from the stored rate, since no field holds it', () => {
		const wrapper = mountForm(order())
		const helpers = wrapper.findAll('.acurrency__helper').map(helper => helper.text())
		expect(helpers).toHaveLength(2)
		expect(helpers[1]).toContain('1 EUR = 1.25')
		expect(helpers[1]).toContain('137.5')
	})
})
