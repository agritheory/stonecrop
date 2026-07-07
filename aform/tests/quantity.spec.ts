import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AQuantityInput from '../src/components/form/AQuantityInput.vue'

const options = {
	uoms: ['Nos', 'Box', 'Kg'],
	stockUom: 'Nos',
	conversionFactors: { Box: 10, Kg: 25 },
}

describe('AQuantityInput', () => {
	describe('rendering', () => {
		it('renders qty input and uom select in edit mode', () => {
			const wrapper = mount(AQuantityInput, { props: { label: 'Quantity', options } })
			expect(wrapper.find('input[type="number"]').exists()).toBe(true)
			expect(wrapper.find('select').exists()).toBe(true)
		})

		it('renders uom options from options.uoms', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			const optionEls = wrapper.findAll('option')
			expect(optionEls.map(o => o.text())).toEqual(['Nos', 'Box', 'Kg'])
		})

		it('renders a label for the quantity input and a separate label for the uom select', () => {
			const wrapper = mount(AQuantityInput, { props: { label: 'Quantity', options } })
			const labels = wrapper.findAll('label')
			expect(labels.slice(0, 2).map(l => l.text())).toEqual(['Quantity', 'UOM'])
		})

		it('associates each label with its own input via for/id', () => {
			const wrapper = mount(AQuantityInput, { props: { uuid: 'item-qty', options } })
			const [qtyLabel, uomLabel] = wrapper.findAll('label')
			expect(qtyLabel.attributes('for')).toBe(wrapper.find('input').attributes('id'))
			expect(uomLabel.attributes('for')).toBe(wrapper.find('select').attributes('id'))
		})

		it('renders a custom uom label', () => {
			const wrapper = mount(AQuantityInput, { props: { options, uomLabel: 'Unit' } })
			expect(wrapper.findAll('label').at(1)!.text()).toBe('Unit')
		})

		it('is disabled in read mode', () => {
			const wrapper = mount(AQuantityInput, { props: { mode: 'read', options } })
			expect(wrapper.find('input').attributes()).toHaveProperty('disabled')
			expect(wrapper.find('select').attributes()).toHaveProperty('disabled')
		})

		it('renders plain text in display mode without inputs', () => {
			const wrapper = mount(AQuantityInput, {
				props: {
					mode: 'display',
					modelValue: { qty: 5, uom: 'Nos', stockQty: 5, stockUom: 'Nos', conversionFactor: 1 },
				},
			})
			expect(wrapper.find('input').exists()).toBe(false)
			expect(wrapper.find('select').exists()).toBe(false)
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
			await wrapper.find('select').setValue('Nos')
			await wrapper.find('input').setValue(5)

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last).toEqual({ qty: 5, uom: 'Nos', stockUom: 'Nos', conversionFactor: 1, stockQty: 5 })
		})

		it('computes stockQty using the conversion factor for a non-stock uom', async () => {
			const wrapper = mount(AQuantityInput, {
				props: { options, modelValue: { qty: 0, uom: '', stockQty: 0, stockUom: '', conversionFactor: 1 } },
			})
			await wrapper.find('select').setValue('Box')
			await wrapper.find('input').setValue(3)

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last).toEqual({ qty: 3, uom: 'Box', stockUom: 'Nos', conversionFactor: 10, stockQty: 30 })
		})

		it('recomputes stockQty when uom changes after qty is already set', async () => {
			const wrapper = mount(AQuantityInput, {
				props: { options, modelValue: { qty: 4, uom: 'Nos', stockQty: 4, stockUom: 'Nos', conversionFactor: 1 } },
			})
			await wrapper.find('select').setValue('Kg')

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last).toEqual({ qty: 4, uom: 'Kg', stockUom: 'Nos', conversionFactor: 25, stockQty: 100 })
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
			expect(labels).toEqual(['Quantity', 'UOM', 'Stock UOM', 'Stock Qty', 'Conversion Factor'])
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
			await wrapper.find('select').setValue('Box')
			await wrapper.find('input[type="number"]').setValue(4)

			const emitted = wrapper.emitted('update:modelValue')!
			await wrapper.setProps({ modelValue: emitted[emitted.length - 1][0] as any })

			expect(wrapper.find('.aquantity__field--stock-qty input').element.value).toBe('40')
			expect(wrapper.find('.aquantity__field--conversion input').element.value).toBe('10')
		})
	})
})
