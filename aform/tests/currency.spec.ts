import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises, VueWrapper } from '@vue/test-utils'

import ACurrencyInput from '../src/components/form/ACurrencyInput.vue'

const options = {
	doctype: 'currency',
	baseCurrency: { id: 'USD', displayText: 'US Dollar' },
	exchangeRates: { EUR: 1.1, GBP: 1.3 },
	filterFunction: (_: string) => [
		{ id: 'USD', displayText: 'US Dollar' },
		{ id: 'EUR', displayText: 'Euro' },
		{ id: 'GBP', displayText: 'British Pound' },
	],
}

// The currency picker is AFormLink composed inline (a search input + autocomplete dropdown that
// opens on focus), not a native <select> — selecting a currency means focusing the input, then
// clicking the matching option.
const pickCurrency = async (wrapper: VueWrapper, value: string) => {
	const input = wrapper.find('.acurrency__currency input[type="text"]')
	await input.trigger('focus')
	await flushPromises()
	const option = wrapper.findAll('.autocomplete-result').find(li => li.text() === value)
	await option!.trigger('mousedown')
	await wrapper.vm.$nextTick()
}

describe('ACurrencyInput', () => {
	describe('rendering', () => {
		it('renders an amount input and a currency link input in edit mode', () => {
			const wrapper = mount(ACurrencyInput, { props: { label: 'Amount', options } })
			expect(wrapper.find('input[type="number"]').exists()).toBe(true)
			expect(wrapper.find('select').exists()).toBe(false)
			expect(wrapper.find('.acurrency__currency input[type="text"]').exists()).toBe(true)
		})

		it('shows the currency label as a placeholder instead of a floating label, merged into one group', () => {
			const wrapper = mount(ACurrencyInput, { props: { label: 'Amount', options } })
			const currencyInput = wrapper.find('.acurrency__currency input[type="text"]')
			expect(currencyInput.attributes('placeholder')).toBe('Currency')
			expect(wrapper.find('.acurrency__currency label').exists()).toBe(false)
		})

		it('has no navigate button in the currency box (embedded mode suppresses it)', () => {
			const wrapper = mount(ACurrencyInput, {
				props: {
					options,
					modelValue: {
						amount: 5,
						currency: { id: 'EUR', displayText: 'Euro' },
						baseAmount: 5.5,
						baseCurrency: { id: 'USD', displayText: 'US Dollar' },
						exchangeRate: 1.1,
					},
				},
			})
			expect(wrapper.find('.acurrency__currency button').exists()).toBe(false)
		})

		it('renders amount and currency fields side by side in the same row', () => {
			const wrapper = mount(ACurrencyInput, { props: { options } })
			const row = wrapper.find('.acurrency__row')
			expect(row.find('input[type="number"]').exists()).toBe(true)
			expect(row.find('input[type="text"]').exists()).toBe(true)
		})

		it('renders a label for the amount input', () => {
			const wrapper = mount(ACurrencyInput, { props: { label: 'Amount', options } })
			expect(wrapper.findAll('label').at(0)!.text()).toBe('Amount')
		})

		it('associates the amount label with the amount input via for/id', () => {
			const wrapper = mount(ACurrencyInput, { props: { uuid: 'line-amount', options } })
			const amountLabel = wrapper.findAll('label').at(0)!
			expect(amountLabel.attributes('for')).toBe(wrapper.find('input[type="number"]').attributes('id'))
		})

		it('shows the selected currency displayText in the currency input', () => {
			const wrapper = mount(ACurrencyInput, {
				props: {
					options,
					modelValue: {
						amount: 5,
						currency: { id: 'EUR', displayText: 'Euro' },
						baseAmount: 5.5,
						baseCurrency: { id: 'USD', displayText: 'US Dollar' },
						exchangeRate: 1.1,
					},
				},
			})
			expect(wrapper.find('.acurrency__currency input[type="text"]').element.value).toBe('Euro')
		})

		it('is disabled in read mode', () => {
			const wrapper = mount(ACurrencyInput, { props: { mode: 'read', options } })
			expect(wrapper.find('input[type="number"]').attributes()).toHaveProperty('disabled')
			expect(wrapper.find('.acurrency__currency input[type="text"]').attributes()).toHaveProperty('disabled')
		})

		it('renders plain text in display mode without inputs', () => {
			const wrapper = mount(ACurrencyInput, {
				props: {
					mode: 'display',
					modelValue: {
						amount: 5,
						currency: { id: 'USD', displayText: 'US Dollar' },
						baseAmount: 5,
						baseCurrency: { id: 'USD', displayText: 'US Dollar' },
						exchangeRate: 1,
					},
				},
			})
			expect(wrapper.find('input').exists()).toBe(false)
			expect(wrapper.find('.aform_display-value').text()).toBe('5 US Dollar')
		})

		it('shows "—" in display mode when there is no currency', () => {
			const wrapper = mount(ACurrencyInput, { props: { mode: 'display' } })
			expect(wrapper.find('.aform_display-value').text()).toBe('—')
		})

		it('shows base amount/currency in display mode when currency differs from base', () => {
			const wrapper = mount(ACurrencyInput, {
				props: {
					mode: 'display',
					modelValue: {
						amount: 2,
						currency: { id: 'EUR', displayText: 'Euro' },
						baseAmount: 2.2,
						baseCurrency: { id: 'USD', displayText: 'US Dollar' },
						exchangeRate: 1.1,
					},
				},
			})
			expect(wrapper.find('.aform_display-value').text()).toBe('2 Euro (2.2 US Dollar)')
		})
	})

	describe('base amount computation', () => {
		it('sets exchangeRate to 1 and baseAmount = amount when currency equals baseCurrency', async () => {
			const wrapper = mount(ACurrencyInput, {
				props: {
					options,
					modelValue: {
						amount: 0,
						currency: { id: '' },
						baseAmount: 0,
						baseCurrency: { id: '' },
						exchangeRate: 1,
					},
				},
			})
			await pickCurrency(wrapper, 'US Dollar')
			await wrapper.find('input[type="number"]').setValue(5)

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last).toEqual({
				amount: 5,
				currency: { id: 'USD', displayText: 'US Dollar' },
				baseCurrency: { id: 'USD', displayText: 'US Dollar' },
				exchangeRate: 1,
				baseAmount: 5,
			})
		})

		it('computes baseAmount using the exchange rate for a non-base currency', async () => {
			const wrapper = mount(ACurrencyInput, {
				props: {
					options,
					modelValue: {
						amount: 0,
						currency: { id: '' },
						baseAmount: 0,
						baseCurrency: { id: '' },
						exchangeRate: 1,
					},
				},
			})
			await pickCurrency(wrapper, 'Euro')
			await wrapper.find('input[type="number"]').setValue(3)

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last.amount).toBe(3)
			expect(last.currency).toEqual({ id: 'EUR', displayText: 'Euro' })
			expect(last.baseCurrency).toEqual({ id: 'USD', displayText: 'US Dollar' })
			expect(last.exchangeRate).toBe(1.1)
			expect(last.baseAmount).toBeCloseTo(3.3, 10)
		})

		it('recomputes baseAmount when currency changes after amount is already set', async () => {
			const wrapper = mount(ACurrencyInput, {
				props: {
					options,
					modelValue: {
						amount: 4,
						currency: { id: 'USD', displayText: 'US Dollar' },
						baseAmount: 4,
						baseCurrency: { id: 'USD', displayText: 'US Dollar' },
						exchangeRate: 1,
					},
				},
			})
			await pickCurrency(wrapper, 'British Pound')

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last).toEqual({
				amount: 4,
				currency: { id: 'GBP', displayText: 'British Pound' },
				baseCurrency: { id: 'USD', displayText: 'US Dollar' },
				exchangeRate: 1.3,
				baseAmount: 5.2,
			})
		})
	})

	describe('amount input guarding', () => {
		it('blocks non-numeric keydowns on the amount input', () => {
			const wrapper = mount(ACurrencyInput, { props: { options } })
			const input = wrapper.find('input[type="number"]').element as HTMLInputElement
			const event = new KeyboardEvent('keydown', { key: 'e', cancelable: true })
			input.dispatchEvent(event)
			expect(event.defaultPrevented).toBe(true)
		})

		it('allows digit keydowns on the amount input', () => {
			const wrapper = mount(ACurrencyInput, { props: { options } })
			const input = wrapper.find('input[type="number"]').element as HTMLInputElement
			const event = new KeyboardEvent('keydown', { key: '5', cancelable: true })
			input.dispatchEvent(event)
			expect(event.defaultPrevented).toBe(false)
		})
	})

	describe('read-only base fields', () => {
		const modelValue = {
			amount: 2,
			currency: { id: 'EUR', displayText: 'Euro' },
			baseAmount: 2.2,
			baseCurrency: { id: 'USD', displayText: 'US Dollar' },
			exchangeRate: 1.1,
		}

		it('displays base currency, base amount, and exchange rate within the same row', () => {
			const wrapper = mount(ACurrencyInput, { props: { options, modelValue } })
			expect(wrapper.find('.acurrency__field--base-currency input').element.value).toBe('US Dollar')
			expect(wrapper.find('.acurrency__field--base-amount input').element.value).toBe('2.2')
			expect(wrapper.find('.acurrency__field--exchange-rate input').element.value).toBe('1.1')
		})

		it('labels each read-only field', () => {
			const wrapper = mount(ACurrencyInput, { props: { label: 'Amount', options, modelValue } })
			const labels = wrapper.findAll('label').map(l => l.text())
			// Currency has no label of its own — it's embedded in the amount+currency group,
			// merged under the single "Amount" label, with its name shown as a placeholder instead.
			expect(labels).toEqual(['Amount', 'Base Currency', 'Base Amount', 'Exchange Rate'])
		})

		it('is always disabled, even in edit mode', () => {
			const wrapper = mount(ACurrencyInput, { props: { options, modelValue, mode: 'edit' } })
			expect(wrapper.find('.acurrency__field--base-currency input').attributes()).toHaveProperty('disabled')
			expect(wrapper.find('.acurrency__field--base-amount input').attributes()).toHaveProperty('disabled')
			expect(wrapper.find('.acurrency__field--exchange-rate input').attributes()).toHaveProperty('disabled')
		})

		it('updates live as amount/currency change', async () => {
			const wrapper = mount(ACurrencyInput, {
				props: {
					options,
					modelValue: {
						amount: 0,
						currency: { id: 'USD', displayText: 'US Dollar' },
						baseAmount: 0,
						baseCurrency: { id: 'USD', displayText: 'US Dollar' },
						exchangeRate: 1,
					},
				},
			})
			await pickCurrency(wrapper, 'Euro')
			await wrapper.find('input[type="number"]').setValue(4)

			const emitted = wrapper.emitted('update:modelValue')!
			await wrapper.setProps({ modelValue: emitted[emitted.length - 1][0] as any })

			expect(wrapper.find('.acurrency__field--base-amount input').element.value).toBe('4.4')
			expect(wrapper.find('.acurrency__field--exchange-rate input').element.value).toBe('1.1')
		})
	})

	describe('base currency resolution', () => {
		it('resolves base currency displayText via injected aformLinkResolver when only an id is given', async () => {
			const resolver = vi.fn(async (_doctype: string, id: string) => `Resolved ${id}`)
			const wrapper = mount(ACurrencyInput, {
				props: {
					options: { doctype: 'currency', baseCurrency: 'USD' },
					modelValue: {
						amount: 1,
						currency: { id: 'USD' },
						baseAmount: 1,
						baseCurrency: { id: 'USD' },
						exchangeRate: 1,
					},
				},
				global: { provide: { aformLinkResolver: resolver } },
			})

			await flushPromises()

			expect(resolver).toHaveBeenCalledWith('currency', 'USD')
			expect(wrapper.find('.acurrency__field--base-currency input').element.value).toBe('Resolved USD')
		})
	})

	describe('currency symbol display', () => {
		const optionsWithSymbols = {
			doctype: 'currency',
			baseCurrency: { id: 'USD', displayText: 'US Dollar', symbol: '$' },
			exchangeRates: { EUR: 1.1 },
			filterFunction: (_: string) => [
				{ id: 'USD', displayText: 'US Dollar', symbol: '$' },
				{ id: 'EUR', displayText: 'Euro', symbol: '€' },
			],
		}

		it('shows the symbol, not the name, in the currency box once a currency is picked', () => {
			const wrapper = mount(ACurrencyInput, {
				props: {
					options: optionsWithSymbols,
					modelValue: {
						amount: 5,
						currency: { id: 'EUR', displayText: 'Euro', symbol: '€' },
						baseAmount: 5.5,
						baseCurrency: { id: 'USD', displayText: 'US Dollar', symbol: '$' },
						exchangeRate: 1.1,
					},
				},
			})
			expect(wrapper.find('.acurrency__currency input[type="text"]').element.value).toBe('€')
		})

		it('shows the symbol alongside the name in the search dropdown', async () => {
			const wrapper = mount(ACurrencyInput, { props: { options: optionsWithSymbols } })
			const input = wrapper.find('.acurrency__currency input[type="text"]')
			await input.trigger('focus')
			await flushPromises()
			const results = wrapper.findAll('.autocomplete-result').map(li => li.text())
			expect(results).toEqual(['$ — US Dollar', '€ — Euro'])
		})

		it('falls back to the full name when a currency has no symbol', () => {
			// `options` (module-level, no `symbol` field) covers the plain fallback case already
			// exercised by the rendering tests above — this just makes the intent explicit here.
			const wrapper = mount(ACurrencyInput, {
				props: {
					options,
					modelValue: {
						amount: 5,
						currency: { id: 'EUR', displayText: 'Euro' },
						baseAmount: 5.5,
						baseCurrency: { id: 'USD', displayText: 'US Dollar' },
						exchangeRate: 1.1,
					},
				},
			})
			expect(wrapper.find('.acurrency__currency input[type="text"]').element.value).toBe('Euro')
		})

		it('applies the symbol formatter immediately on selection, not just after blur', async () => {
			const wrapper = mount(ACurrencyInput, { props: { options: optionsWithSymbols } })
			await pickCurrency(wrapper, '€ — Euro')
			expect(wrapper.find('.acurrency__currency input[type="text"]').element.value).toBe('€')
		})
	})
})
