import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { type Component, defineComponent, h, nextTick } from 'vue'

import ACurrencyInput from '../src/components/form/ACurrencyInput.vue'
import AFormLink from '../src/components/form/AFormLink.vue'
import AQuantityInput from '../src/components/form/AQuantityInput.vue'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

// The borders take their colour from these tokens; unset, a border is not drawn and has no width.
const borderTokens = '--sc-input-border-color: gray; --sc-input-active-border-color: black'

const mountInHost = (component: Component, props: Record<string, unknown>) => {
	const Host = defineComponent({
		setup: () => () => h('div', { style: `width: 800px; ${borderTokens}` }, [h(component, props)]),
	})
	wrapper = mount(Host, { attachTo: document.body })
}

const expectSameEdges = (element: Element, space: Element) => {
	const box = element.getBoundingClientRect()
	const edges = space.getBoundingClientRect()
	expect(box.left).toBeCloseTo(edges.left, 0)
	expect(box.right).toBeCloseTo(edges.right, 0)
}

// Needs real layout: a bordered box's width is what the browser computes from its border.
describe('a bordered box spans exactly the space it is given', { tags: ['component'] }, () => {
	it('the quantity field: its number-and-unit group, so it lines up with the row under it', () => {
		mountInHost(AQuantityInput, { label: 'Quantity', options: { uoms: ['Nos', 'Box'], stockUom: 'Nos' } })

		const group = document.querySelector('.aquantity__group')!
		expectSameEdges(group, group.parentElement!)
	})

	it('the currency field: its amount-and-currency group, so it lines up with the row under it', () => {
		mountInHost(ACurrencyInput, { label: 'Price', options: { baseCurrency: { id: 'USD', displayText: 'US Dollar' } } })

		const group = document.querySelector('.acurrency__group')!
		expectSameEdges(group, group.parentElement!)
	})

	it('the link field: its list of matches, as wide as the box it hangs from', async () => {
		mountInHost(AFormLink, { label: 'Customer', filterFunction: () => [{ id: 1, displayText: 'Liberty' }] })

		const input = document.querySelector<HTMLInputElement>('input[role="combobox"]')!
		input.dispatchEvent(new FocusEvent('focus'))
		await nextTick()
		await nextTick()

		const list = document.querySelector('.autocomplete-results')
		expect(list).not.toBeNull()
		expectSameEdges(list!, input)
	})
})
