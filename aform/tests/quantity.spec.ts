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

// The qty <input> guards keystrokes/pastes itself (@keydown/@paste). We dispatch native events
// on the element and assert defaultPrevented — the flag the handlers set to reject the input.
const dispatchKey = (wrapper: VueWrapper, key: string, init: KeyboardEventInit = {}) => {
	const el = wrapper.find('.aquantity__qty').element as HTMLInputElement
	const event = new KeyboardEvent('keydown', { key, cancelable: true, bubbles: true, ...init })
	el.dispatchEvent(event)
	return event
}

const dispatchPaste = (wrapper: VueWrapper, text: string) => {
	const el = wrapper.find('.aquantity__qty').element as HTMLInputElement
	const event = new Event('paste', { cancelable: true, bubbles: true })
	Object.defineProperty(event, 'clipboardData', { value: { getData: () => text } })
	el.dispatchEvent(event)
	return event
}

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

	describe('qty input restriction', () => {
		it('allows digit keys', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			expect(dispatchKey(wrapper, '7').defaultPrevented).toBe(false)
		})

		it('rejects non-numeric character keys', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			for (const key of ['a', 'e', 'E', '+', '-']) {
				expect(dispatchKey(wrapper, key).defaultPrevented).toBe(true)
			}
		})

		it('allows navigation/editing keys such as Backspace and ArrowLeft', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			expect(dispatchKey(wrapper, 'Backspace').defaultPrevented).toBe(false)
			expect(dispatchKey(wrapper, 'ArrowLeft').defaultPrevented).toBe(false)
		})

		it('lets shortcut chords through (Ctrl / Meta / Alt + key)', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			expect(dispatchKey(wrapper, 'a', { ctrlKey: true }).defaultPrevented).toBe(false)
			expect(dispatchKey(wrapper, 'v', { metaKey: true }).defaultPrevented).toBe(false)
			expect(dispatchKey(wrapper, 'x', { altKey: true }).defaultPrevented).toBe(false)
		})

		it('allows a single decimal point but rejects a second one', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			const el = wrapper.find('.aquantity__qty').element as HTMLInputElement
			el.value = '1'
			expect(dispatchKey(wrapper, '.').defaultPrevented).toBe(false)
			el.value = '1.5'
			expect(dispatchKey(wrapper, '.').defaultPrevented).toBe(true)
		})

		it('allows a numeric paste but blocks a non-numeric one', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			expect(dispatchPaste(wrapper, '12.5').defaultPrevented).toBe(false)
			expect(dispatchPaste(wrapper, '12abc').defaultPrevented).toBe(true)
		})
	})

	describe('conversion factor resolution', () => {
		it('keeps conversionFactor at 1 when qty is entered with no uom selected', async () => {
			const wrapper = mount(AQuantityInput, {
				props: { options, modelValue: { qty: 0, uom: '', stockQty: 0, stockUom: '', conversionFactor: 1 } },
			})
			await wrapper.find('input[type="number"]').setValue(3)

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last.conversionFactor).toBe(1)
			expect(last.stockQty).toBe(3)
		})

		it('resets conversionFactor to 1 when switching to a uom absent from conversionFactors', async () => {
			const wrapper = mount(AQuantityInput, {
				props: {
					options: { uoms: ['Nos', 'Box', 'Extra'], stockUom: 'Nos', conversionFactors: { Box: 10 } },
					modelValue: { qty: 2, uom: 'Box', stockQty: 20, stockUom: 'Nos', conversionFactor: 10 },
				},
			})
			await pickUom(wrapper, 'Extra')

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			// 'Extra' is a different unit with no mapping — must not silently reuse Box's ×10.
			expect(last).toEqual({ qty: 2, uom: 'Extra', stockUom: 'Nos', conversionFactor: 1, stockQty: 2 })
		})

		it('preserves the stored conversionFactor when editing qty on the same (unmapped) uom', async () => {
			const wrapper = mount(AQuantityInput, {
				props: {
					// No conversionFactors provided — factor comes from the loaded value and must round-trip.
					options: { uoms: ['Nos', 'Box'], stockUom: 'Nos' },
					modelValue: { qty: 2, uom: 'Box', stockQty: 20, stockUom: 'Nos', conversionFactor: 10 },
				},
			})
			await wrapper.find('input[type="number"]').setValue(3)

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last).toEqual({ qty: 3, uom: 'Box', stockUom: 'Nos', conversionFactor: 10, stockQty: 30 })
		})

		it('tolerates a partial modelValue (missing qty or uom)', () => {
			// A parent may bind a value that has not been fully populated yet; the getters
			// fall back to 0 / '' rather than surfacing undefined.
			const missingQty = mount(AQuantityInput, { props: { options, modelValue: { uom: 'Box' } as any } })
			expect((missingQty.find('.aquantity__qty').element as HTMLInputElement).value).toBe('0')

			const missingUom = mount(AQuantityInput, { props: { options, modelValue: { qty: 5 } as any, uomLabel: 'Unit' } })
			expect(missingUom.find('.aquantity__uom-toggle').text()).toContain('Unit')
		})

		it('derives stockUom from the value when options omits it', async () => {
			const wrapper = mount(AQuantityInput, {
				props: {
					options: { uoms: ['Nos', 'Box'], conversionFactors: { Box: 2 } }, // no stockUom in options
					modelValue: { qty: 0, uom: '', stockQty: 0, stockUom: 'Nos', conversionFactor: 1 },
				},
			})
			await pickUom(wrapper, 'Box')
			await wrapper.find('input[type="number"]').setValue(4)

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last).toEqual({ qty: 4, uom: 'Box', stockUom: 'Nos', conversionFactor: 2, stockQty: 8 })
		})

		it('rounds away floating-point noise in stockQty', async () => {
			const wrapper = mount(AQuantityInput, {
				props: {
					options: { uoms: ['Nos', 'Frac'], stockUom: 'Nos', conversionFactors: { Frac: 0.1 } },
					modelValue: { qty: 0, uom: '', stockQty: 0, stockUom: '', conversionFactor: 1 },
				},
			})
			await pickUom(wrapper, 'Frac')
			await wrapper.find('input[type="number"]').setValue(3)

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last.stockQty).toBe(0.3) // not 0.30000000000000004
		})
	})

	describe('keyboard navigation (edge cases)', () => {
		it('wraps to the last uom on ArrowUp from the first option', async () => {
			const wrapper = mount(AQuantityInput, {
				props: { options, modelValue: { qty: 1, uom: 'Nos', stockQty: 1, stockUom: 'Nos', conversionFactor: 1 } },
			})
			const toggle = wrapper.find('.aquantity__uom-toggle')
			await toggle.trigger('keydown.down') // opens, active = Nos (index 0)
			await toggle.trigger('keydown.up') // wraps to last (Kg)
			await toggle.trigger('keydown.enter')

			const emitted = wrapper.emitted('update:modelValue')!
			expect((emitted[emitted.length - 1][0] as any).uom).toBe('Kg')
		})

		it('opens the menu (without selecting) when Enter is pressed while it is closed', async () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			await wrapper.find('.aquantity__uom-toggle').trigger('keydown.enter')
			expect(isMenuOpen(wrapper)).toBe(true)
			expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		})

		it('highlights an option on hover (mouseenter sets the active index)', async () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			await wrapper.find('.aquantity__uom-toggle').trigger('click')
			const boxOption = wrapper.findAll('.aquantity__uom-option').find(li => li.text() === 'Box')!
			await boxOption.trigger('mouseenter')
			expect(boxOption.classes()).toContain('is-active')
		})

		it('points aria-activedescendant at the active option once the menu is open', async () => {
			const wrapper = mount(AQuantityInput, { props: { uuid: 'q', options } })
			const toggle = wrapper.find('.aquantity__uom-toggle')
			expect(toggle.attributes('aria-activedescendant')).toBeUndefined()
			await toggle.trigger('keydown.down') // opens, active index 0
			const active = toggle.attributes('aria-activedescendant')
			expect(active).toBe('q-uom-opt-0')
			expect(wrapper.find(`#${active}`).classes()).toContain('is-active')
		})

		it('does not throw or emit when there are no uom options', async () => {
			const wrapper = mount(AQuantityInput, { props: { options: { uoms: [] } } })
			const toggle = wrapper.find('.aquantity__uom-toggle')
			await toggle.trigger('keydown.down')
			await toggle.trigger('keydown.down')
			await toggle.trigger('keydown.enter')
			expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		})
	})
})
