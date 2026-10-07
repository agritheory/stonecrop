import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'

import ACurrencyInput from '../src/components/form/ACurrencyInput.vue'
import type { AFormLinkValue, CurrencyOptions, CurrencyValue } from '../src/types'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

const usd = { id: 'USD', displayText: 'US Dollar', symbol: '$' }
const jpy = { id: 'JPY', displayText: 'Yen', symbol: '¥' }

const currencies = [usd, { id: 'EUR', displayText: 'Euro', symbol: '€' }, jpy]
const lookup = (search: string) =>
	currencies.filter(currency => currency.displayText.toLowerCase().includes(search.toLowerCase()))

// A price, and a box outside the field to move focus to.
const mountPrice = (amount: number | null, currency: AFormLinkValue = usd, options: CurrencyOptions = {}) => {
	const model = ref<CurrencyValue | null>({ amount, currency, baseAmount: amount, baseCurrency: usd, exchangeRate: 1 })
	const Host = defineComponent({
		setup: () => () =>
			h('div', [
				h(ACurrencyInput, {
					label: 'Price',
					options: { baseCurrency: usd, ...options },
					modelValue: model.value,
					'onUpdate:modelValue': (value: CurrencyValue | null | undefined) => (model.value = value ?? null),
				}),
				h('input', { id: 'outside', 'aria-label': 'Outside the field' }),
			]),
	})
	wrapper = mount(Host, { attachTo: document.body })
	return { model }
}

const amountBox = () => document.querySelector<HTMLInputElement>('.acurrency__amount')!
const currencyBox = () => document.querySelector<HTMLInputElement>('.acurrency__currency input')!
const outside = () => document.querySelector<HTMLInputElement>('#outside')!

const typeAmount = async (typed: string) => {
	await userEvent.click(amountBox())
	await userEvent.keyboard(typed)
	await userEvent.click(outside())
}

const copy = async (text: string) => {
	outside().value = text
	outside().select()
	await userEvent.copy()
}

// 1234.56 with the separators the other way round from the browser's. In English that is "1.234,56", as a European
// invoice writes it.
const writtenTheOtherWay = () => (new Intl.NumberFormat().format(1.5) === '1.5' ? '1.234,56' : '1,234.56')

const currencyChoices = () =>
	[...document.querySelectorAll('.acurrency__currency [role="option"]')].map(option => option.textContent?.trim())

const isListOpen = () => currencyBox().getAttribute('aria-expanded') === 'true'

const listText = () => document.querySelector('.acurrency__currency [role="listbox"]')?.textContent?.trim()

// A doctype is JSON, so it carries its lookup as text.
const lookupAsText =
	"async () => [{ id: 'USD', displayText: 'US Dollar', symbol: '$' }, { id: 'INR', displayText: 'Rupee', symbol: '₹' }]"

describe('typing a price', { tags: ['browser'] }, () => {
	// A refused key leaves the rest of what was typed.
	it.each([
		['12a', 12],
		['1-2', 12],
		// A second decimal point would make the text no number, and so no price.
		['12.5.0', 12.5],
		// Credits and refunds are negative.
		['-12', -12],
	])('reads %s as %s', async (typed, amount) => {
		const { model } = mountPrice(null)
		await typeAmount(typed)

		expect(model.value?.amount).toBe(amount)
	})

	it('takes a price typed with grouping separators', async () => {
		const { model } = mountPrice(null)
		await typeAmount(new Intl.NumberFormat().format(1234567))

		expect(model.value?.amount).toBe(1234567)
	})

	it('refuses a decimal point in a currency without decimals', async () => {
		const { model } = mountPrice(null, jpy)
		await typeAmount('1.5')

		expect(model.value?.amount).toBe(15)
	})

	it('moves the caret with the arrow keys to fix a typo', async () => {
		const { model } = mountPrice(null)
		await typeAmount('15{ArrowLeft}2')

		expect(model.value?.amount).toBe(125)
	})

	it('lets keyboard shortcuts through', async () => {
		const { model } = mountPrice(null)
		await userEvent.click(amountBox())
		await userEvent.keyboard('12{Control>}a{/Control}7')
		await userEvent.click(outside())

		expect(model.value?.amount).toBe(7)
	})

	it('takes a pasted amount written the way the browser writes numbers', async () => {
		const { model } = mountPrice(50)
		await copy(new Intl.NumberFormat(undefined, { minimumFractionDigits: 2 }).format(1234.56))
		await userEvent.click(amountBox())
		await userEvent.paste()
		await userEvent.click(outside())

		expect(model.value?.amount).toBe(1234.56)
	})

	it('refuses a pasted price that is not an amount', async () => {
		const { model } = mountPrice(50)
		await copy('abc')
		await userEvent.click(amountBox())
		await userEvent.paste()
		await userEvent.click(outside())

		expect(model.value?.amount).toBe(50)
	})

	// Read with the browser's separators it would be 1.23456.
	it('refuses a pasted amount written with the separators the other way round', async () => {
		const { model } = mountPrice(50)
		await copy(writtenTheOtherWay())
		await userEvent.click(amountBox())
		await userEvent.paste()
		await userEvent.click(outside())

		expect(model.value?.amount).toBe(50)
	})

	// The paste is checked with what the box already holds, as a table cell checks it.
	it('refuses a pasted decimal point after the one already typed', async () => {
		const { model } = mountPrice(null)
		await copy('.5')
		await userEvent.click(amountBox())
		await userEvent.keyboard('12.3')
		await userEvent.paste()
		await userEvent.click(outside())

		expect(model.value?.amount).toBe(12.3)
	})

	// A plain number box takes "e" for an exponent and a second point mid-typing; a price takes neither.
	it.each([
		['12e3', 123],
		['1.2.3', 1.23],
		['-12', -12],
		['15{ArrowLeft}2', 125],
		['12{Control>}a{/Control}7', 7],
	])('reads %s as %s in a plain number box', async (typed, amount) => {
		const { model } = mountPrice(null, usd, { amountMask: false })
		await typeAmount(typed)

		expect(model.value?.amount).toBe(amount)
	})

	it.each([
		['12.5', 12.5],
		['abc', 50],
	])('reads %s pasted into a plain number box as %s', async (pasted, amount) => {
		const { model } = mountPrice(50, usd, { amountMask: false })
		await copy(pasted)
		await userEvent.click(amountBox())
		await userEvent.keyboard('{Control>}a{/Control}')
		await userEvent.paste()
		await userEvent.click(outside())

		expect(model.value?.amount).toBe(amount)
	})
})

describe('the currency box of a price', { tags: ['browser'] }, () => {
	// Focus stays in the box after a pick, so a click must open the list without a new focus.
	it('lists the currencies again when clicked after a pick', async () => {
		const { model } = mountPrice(50, usd, { filterFunction: lookup })
		await userEvent.click(currencyBox())
		await expect.poll(currencyChoices).toContain('€ — Euro')
		await userEvent.click([...document.querySelectorAll<HTMLElement>('[role="option"]')][1])
		await expect.poll(isListOpen).toBe(false)
		await userEvent.click(currencyBox())

		await expect.poll(isListOpen).toBe(true)
		expect(model.value?.currency).toMatchObject({ id: 'EUR' })
	})

	it('searches the currencies as you type', async () => {
		mountPrice(50, usd, { filterFunction: lookup })
		await userEvent.click(currencyBox())
		await userEvent.keyboard('ye')

		await expect.poll(currencyChoices).toEqual(['¥ — Yen'])
	})

	it('closes the list on Escape and shows the currency again', async () => {
		const { model } = mountPrice(50, usd, { filterFunction: lookup })
		await userEvent.click(currencyBox())
		await userEvent.keyboard('ye{Escape}')

		await expect.poll(isListOpen).toBe(false)
		expect(currencyBox().value).toBe('$')
		expect(model.value?.currency).toMatchObject({ id: 'USD' })
	})

	it("lists the currencies a doctype's lookup returns", async () => {
		mountPrice(50, usd, { filterFunction: lookupAsText })
		await userEvent.click(currencyBox())

		await expect.poll(currencyChoices).toEqual(['$ — US Dollar', '₹ — Rupee'])
	})

	it("shows the symbol of a currency stored by its id alone, from the doctype's lookup", async () => {
		mountPrice(50, { id: 'INR' }, { filterFunction: lookupAsText })

		await expect.poll(() => currencyBox().value).toBe('₹')
	})

	it('says the currencies are loading until a server lookup answers', async () => {
		let answer: (list: typeof currencies) => void = () => {}
		mountPrice(50, usd, { isAsync: true, filterFunction: () => new Promise(resolve => (answer = resolve)) })
		await userEvent.click(currencyBox())
		await expect.poll(listText).toBe('Loading results...')
		answer(currencies)

		await expect.poll(currencyChoices).toContain('€ — Euro')
	})

	// The list opens on a closed box with the first currency highlighted.
	it('picks a currency with the arrow keys and Enter', async () => {
		const { model } = mountPrice(50, usd, { filterFunction: lookup })
		await userEvent.click(currencyBox())
		await userEvent.keyboard('{Escape}{ArrowDown}{ArrowDown}{Enter}')

		await expect.poll(() => model.value?.currency).toMatchObject({ id: 'EUR' })
		expect(currencyBox().value).toBe('€')
	})
})
