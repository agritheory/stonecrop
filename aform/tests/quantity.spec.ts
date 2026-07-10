import { describe, it, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'

import AQuantityInput from '../src/components/form/AQuantityInput.vue'

const options = {
	uoms: ['Nos', 'Box', 'Kg'],
	stockUom: 'Nos',
	conversionFactors: { Box: 10, Kg: 25 },
}

// The uom picker is a dropdown-toggle button + menu (not a native <select>), so
// selecting a uom means opening the menu, then clicking the matching option.
const pickUom = async (wrapper: VueWrapper, value: string) => {
	await wrapper.find('.aquantity__uom-toggle').trigger('click')
	const option = wrapper.findAll('.aquantity__uom-option').find(li => li.text() === value)
	await option!.trigger('click')
}

// The menu is toggled with v-show, which sets/clears an inline `display: none`.
// Read that directly rather than via isVisible() (backed by getComputedStyle),
// which jsdom caches stale once it's been read earlier for the same element.
const isMenuOpen = (wrapper: VueWrapper) =>
	wrapper.find('.aquantity__uom-menu').attributes('style') !== 'display: none;'

describe('AQuantityInput', () => {
	describe('rendering', () => {
		it('renders a qty input and a uom dropdown-toggle button in edit mode', () => {
			const wrapper = mount(AQuantityInput, { props: { label: 'Quantity', options } })
			expect(wrapper.find('input[type="number"]').exists()).toBe(true)
			expect(wrapper.find('select').exists()).toBe(false)
			expect(wrapper.find('button.aquantity__uom-toggle').exists()).toBe(true)
		})

		it('renders qty input and uom toggle joined inside a single group', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			const group = wrapper.find('.aquantity__group')
			expect(group.find('input[type="number"]').exists()).toBe(true)
			expect(group.find('button.aquantity__uom-toggle').exists()).toBe(true)
		})

		it('renders uom options from options.uoms', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			const optionEls = wrapper.findAll('.aquantity__uom-option')
			expect(optionEls.map(o => o.text())).toEqual(['Nos', 'Box', 'Kg'])
		})

		it('opens the uom menu when the toggle button is clicked', async () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			expect(isMenuOpen(wrapper)).toBe(false)
			await wrapper.find('.aquantity__uom-toggle').trigger('click')
			expect(isMenuOpen(wrapper)).toBe(true)
		})

		it('closes the uom menu after an option is selected', async () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			await pickUom(wrapper, 'Box')
			expect(isMenuOpen(wrapper)).toBe(false)
		})

		it('renders a label for the quantity input', () => {
			const wrapper = mount(AQuantityInput, { props: { label: 'Quantity', options } })
			expect(wrapper.findAll('label').at(0)!.text()).toBe('Quantity')
		})

		it('associates the quantity label with the quantity input via for/id', () => {
			const wrapper = mount(AQuantityInput, { props: { uuid: 'item-qty', options } })
			const qtyLabel = wrapper.findAll('label').at(0)!
			expect(qtyLabel.attributes('for')).toBe(wrapper.find('input').attributes('id'))
		})

		it('shows the custom uom label as placeholder text on the toggle when no uom is selected', () => {
			const wrapper = mount(AQuantityInput, { props: { options, uomLabel: 'Unit' } })
			expect(wrapper.find('.aquantity__uom-toggle').text()).toContain('Unit')
		})

		it('shows the selected uom value on the toggle button', () => {
			const wrapper = mount(AQuantityInput, {
				props: { options, modelValue: { qty: 5, uom: 'Box', stockQty: 50, stockUom: 'Nos', conversionFactor: 10 } },
			})
			expect(wrapper.find('.aquantity__uom-toggle').text()).toContain('Box')
		})

		it('is disabled in read mode', () => {
			const wrapper = mount(AQuantityInput, { props: { mode: 'read', options } })
			expect(wrapper.find('input').attributes()).toHaveProperty('disabled')
			expect(wrapper.find('.aquantity__uom-toggle').attributes()).toHaveProperty('disabled')
		})

		it('renders plain text in display mode without inputs', () => {
			const wrapper = mount(AQuantityInput, {
				props: {
					mode: 'display',
					modelValue: { qty: 5, uom: 'Nos', stockQty: 5, stockUom: 'Nos', conversionFactor: 1 },
				},
			})
			expect(wrapper.find('input').exists()).toBe(false)
			expect(wrapper.find('button').exists()).toBe(false)
			expect(wrapper.find('.aform_display-value').text()).toBe('5 Nos')
		})

		it('shows "—" in display mode when there is no uom', () => {
			const wrapper = mount(AQuantityInput, { props: { mode: 'display' } })
			expect(wrapper.find('.aform_display-value').text()).toBe('—')
		})

		it('shows stock qty/uom in display mode when uom differs from stock uom', () => {
			const wrapper = mount(AQuantityInput, {
				props: {
					mode: 'display',
					modelValue: { qty: 2, uom: 'Box', stockQty: 20, stockUom: 'Nos', conversionFactor: 10 },
				},
			})
			expect(wrapper.find('.aform_display-value').text()).toBe('2 Box (20 Nos)')
		})
	})

	describe('stock qty computation', () => {
		it('sets conversionFactor to 1 and stockQty = qty when uom equals stockUom', async () => {
			const wrapper = mount(AQuantityInput, {
				props: { options, modelValue: { qty: 0, uom: '', stockQty: 0, stockUom: '', conversionFactor: 1 } },
			})
			await pickUom(wrapper, 'Nos')
			await wrapper.find('input').setValue(5)

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last).toEqual({ qty: 5, uom: 'Nos', stockUom: 'Nos', conversionFactor: 1, stockQty: 5 })
		})

		it('computes stockQty using the conversion factor for a non-stock uom', async () => {
			const wrapper = mount(AQuantityInput, {
				props: { options, modelValue: { qty: 0, uom: '', stockQty: 0, stockUom: '', conversionFactor: 1 } },
			})
			await pickUom(wrapper, 'Box')
			await wrapper.find('input').setValue(3)

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last).toEqual({ qty: 3, uom: 'Box', stockUom: 'Nos', conversionFactor: 10, stockQty: 30 })
		})

		it('recomputes stockQty when uom changes after qty is already set', async () => {
			const wrapper = mount(AQuantityInput, {
				props: { options, modelValue: { qty: 4, uom: 'Nos', stockQty: 4, stockUom: 'Nos', conversionFactor: 1 } },
			})
			await pickUom(wrapper, 'Kg')

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last).toEqual({ qty: 4, uom: 'Kg', stockUom: 'Nos', conversionFactor: 25, stockQty: 100 })
		})
	})

	describe('keyboard navigation', () => {
		it('opens the menu and selects the next uom on ArrowDown + Enter', async () => {
			const wrapper = mount(AQuantityInput, {
				props: { options, modelValue: { qty: 1, uom: 'Nos', stockQty: 1, stockUom: 'Nos', conversionFactor: 1 } },
			})
			const toggle = wrapper.find('.aquantity__uom-toggle')
			await toggle.trigger('keydown.down') // opens the menu, activates current uom (Nos)
			await toggle.trigger('keydown.down') // moves active to next uom (Box)
			await toggle.trigger('keydown.enter')

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last.uom).toBe('Box')
		})

		it('closes the menu on Escape without changing the uom', async () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			await wrapper.find('.aquantity__uom-toggle').trigger('click')
			await wrapper.find('.aquantity__uom-toggle').trigger('keydown.esc')
			expect(isMenuOpen(wrapper)).toBe(false)
			expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		})
	})

	describe('read-only stock fields', () => {
		const modelValue = { qty: 2, uom: 'Box', stockQty: 20, stockUom: 'Nos', conversionFactor: 10 }

		it('displays stock uom, stock qty, and conversion factor within the same box', () => {
			const wrapper = mount(AQuantityInput, { props: { options, modelValue } })
			expect(wrapper.find('.aquantity__field--stock-uom input').element.value).toBe('Nos')
			expect(wrapper.find('.aquantity__field--stock-qty input').element.value).toBe('20')
			expect(wrapper.find('.aquantity__field--conversion input').element.value).toBe('10')
		})

		it('labels each read-only field', () => {
			const wrapper = mount(AQuantityInput, { props: { label: 'Quantity', options, modelValue } })
			const labels = wrapper.findAll('label').map(l => l.text())
			expect(labels).toEqual(['Quantity', 'Stock UOM', 'Stock Qty', 'Conversion Factor'])
		})

		it('is always disabled, even in edit mode', () => {
			const wrapper = mount(AQuantityInput, { props: { options, modelValue, mode: 'edit' } })
			expect(wrapper.find('.aquantity__field--stock-uom input').attributes()).toHaveProperty('disabled')
			expect(wrapper.find('.aquantity__field--stock-qty input').attributes()).toHaveProperty('disabled')
			expect(wrapper.find('.aquantity__field--conversion input').attributes()).toHaveProperty('disabled')
		})

		it('updates live as qty/uom change', async () => {
			const wrapper = mount(AQuantityInput, {
				props: { options, modelValue: { qty: 0, uom: 'Nos', stockQty: 0, stockUom: 'Nos', conversionFactor: 1 } },
			})
			await pickUom(wrapper, 'Box')
			await wrapper.find('input[type="number"]').setValue(4)

			const emitted = wrapper.emitted('update:modelValue')!
			await wrapper.setProps({ modelValue: emitted[emitted.length - 1][0] as any })

			expect(wrapper.find('.aquantity__field--stock-qty input').element.value).toBe('40')
			expect(wrapper.find('.aquantity__field--conversion input').element.value).toBe('10')
		})
	})
})
