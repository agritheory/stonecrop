import { describe, it, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'

import AQuantityInput from '../src/components/form/AQuantityInput.vue'

const options = {
	uoms: ['Nos', 'Box', 'Kg'],
	stockUom: 'Nos',
	conversionFactors: { Box: 10, Kg: 25 },
}

// UOM uses embedded ADropdown (button trigger + shared autocomplete list).
const pickUom = async (wrapper: VueWrapper, value: string) => {
	await wrapper.find('.aform_dropdown-button').trigger('click')
	const option = wrapper.findAll('.autocomplete-result').find(li => li.text() === value)
	await option!.trigger('mousedown')
}

const isMenuOpen = (wrapper: VueWrapper) =>
	wrapper.find('.autocomplete-results').attributes('style') !== 'display: none;'

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
			expect(wrapper.find('button.aform_dropdown-button').exists()).toBe(true)
		})

		it('renders qty input and uom toggle joined inside a single group', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			const group = wrapper.find('.aquantity__group')
			expect(group.find('input[type="number"]').exists()).toBe(true)
			expect(group.find('button.aform_dropdown-button').exists()).toBe(true)
		})

		it('renders uom options from options.uoms', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			const optionEls = wrapper.findAll('.autocomplete-result')
			expect(optionEls.map(o => o.text())).toEqual(['Nos', 'Box', 'Kg'])
		})

		it('opens the uom menu when the toggle button is clicked', async () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			expect(isMenuOpen(wrapper)).toBe(false)
			await wrapper.find('.aform_dropdown-button').trigger('click')
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
			expect(wrapper.find('.aform_dropdown-button').text()).toContain('Unit')
		})

		it('shows the selected uom value on the toggle button', () => {
			const wrapper = mount(AQuantityInput, {
				props: { options, modelValue: { qty: 5, uom: 'Box', stockQty: 50, stockUom: 'Nos', conversionFactor: 10 } },
			})
			expect(wrapper.find('.aform_dropdown-button').text()).toContain('Box')
		})

		it('is disabled in read mode', () => {
			const wrapper = mount(AQuantityInput, { props: { mode: 'read', options } })
			expect(wrapper.find('input').attributes()).toHaveProperty('disabled')
			expect(wrapper.find('.aform_dropdown-button').attributes()).toHaveProperty('disabled')
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

	describe('no quantity', () => {
		const noQty = { qty: null, uom: 'Box', stockQty: null, stockUom: 'Nos', conversionFactor: 10 }

		it('holds no quantity, and no stock quantity, once its box is emptied', async () => {
			const wrapper = mount(AQuantityInput, { props: { options, modelValue: { ...noQty, qty: 2, stockQty: 20 } } })
			await wrapper.find('.aquantity__qty').setValue('')
			expect(wrapper.emitted('update:modelValue')!.at(-1)![0]).toMatchObject({ qty: null, stockQty: null })
		})

		it('shows an empty box for a value with no quantity', () => {
			const wrapper = mount(AQuantityInput, { props: { options, modelValue: noQty } })
			expect(wrapper.find<HTMLInputElement>('.aquantity__qty').element.value).toBe('')
		})

		it('keeps no quantity when a unit is picked', async () => {
			const wrapper = mount(AQuantityInput, { props: { options, modelValue: noQty } })
			await pickUom(wrapper, 'Kg')
			expect(wrapper.emitted('update:modelValue')!.at(-1)![0]).toMatchObject({ qty: null, stockQty: null })
		})

		it('shows "—" in display mode for a value with no quantity', () => {
			const wrapper = mount(AQuantityInput, { props: { mode: 'display', modelValue: noQty } })
			expect(wrapper.find('.aform_display-value').text()).toBe('—')
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
			const toggle = wrapper.find('.aform_dropdown-button')
			await toggle.trigger('keydown.down') // opens the menu, activates current uom (Nos)
			await toggle.trigger('keydown.down') // moves active to next uom (Box)
			await toggle.trigger('keydown.enter')

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last.uom).toBe('Box')
		})

		it('closes the menu on Escape without changing the uom', async () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			await wrapper.find('.aform_dropdown-button').trigger('click')
			await wrapper.find('.aform_dropdown-button').trigger('keydown.esc')
			expect(isMenuOpen(wrapper)).toBe(false)
			expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		})
	})

	describe('conversion helper line', () => {
		const modelValue = { qty: 2, uom: 'Box', stockQty: 20, stockUom: 'Nos', conversionFactor: 10 }

		it('shows stock conversion as a helper line when uom differs from stock uom', () => {
			const wrapper = mount(AQuantityInput, { props: { options, modelValue, uuid: 'qty-helper' } })
			expect(wrapper.find('.aquantity__helper').text()).toBe('= 20 Nos · 1 Box = 10 Nos')
		})

		it('does not show the helper when uom matches stock uom', () => {
			const wrapper = mount(AQuantityInput, {
				props: {
					options,
					modelValue: { qty: 5, uom: 'Nos', stockQty: 5, stockUom: 'Nos', conversionFactor: 1 },
				},
			})
			expect(wrapper.find('.aquantity__helper').exists()).toBe(false)
		})

		it('links the helper via aria-describedby on the qty input', () => {
			const wrapper = mount(AQuantityInput, { props: { options, modelValue, uuid: 'qty-helper' } })
			expect(wrapper.find('input[type="number"]').attributes('aria-describedby')).toBe('qty-helper-helper')
		})

		it('updates the helper live as qty/uom change', async () => {
			const wrapper = mount(AQuantityInput, {
				props: {
					options,
					uuid: 'qty-live',
					modelValue: { qty: 0, uom: 'Nos', stockQty: 0, stockUom: 'Nos', conversionFactor: 1 },
				},
			})
			await pickUom(wrapper, 'Box')
			await wrapper.find('input[type="number"]').setValue(4)

			const emitted = wrapper.emitted('update:modelValue')!
			await wrapper.setProps({ modelValue: emitted[emitted.length - 1][0] as any })

			expect(wrapper.find('.aquantity__helper').text()).toBe('= 40 Nos · 1 Box = 10 Nos')
		})

		it('hides the helper when an error is shown', () => {
			const wrapper = mount(AQuantityInput, {
				props: { options, modelValue, uuid: 'qty-err', errors: ['Too many'] },
			})
			expect(wrapper.find('.aquantity__helper').exists()).toBe(false)
			expect(wrapper.find('input[type="number"]').attributes('aria-describedby')).toBe('qty-err-error')
		})
	})

	describe('qty input restriction', () => {
		it('allows digit keys', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			expect(dispatchKey(wrapper, '7').defaultPrevented).toBe(false)
		})

		it('rejects non-numeric character keys', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			for (const key of ['a', 'e', 'E', '+']) {
				expect(dispatchKey(wrapper, key).defaultPrevented).toBe(true)
			}
		})

		it('allows a leading minus — quantity is signed (returns, adjustments, credit lines)', () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			expect(dispatchKey(wrapper, '-').defaultPrevented).toBe(false)
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
			expect(dispatchPaste(wrapper, '-12.5').defaultPrevented).toBe(false)
			expect(dispatchPaste(wrapper, '12abc').defaultPrevented).toBe(true)
		})

		it('computes a negative stockQty from a negative qty', async () => {
			const wrapper = mount(AQuantityInput, {
				props: {
					options,
					modelValue: { qty: 0, uom: 'Box', stockQty: 0, stockUom: 'Nos', conversionFactor: 10 },
				},
			})
			await wrapper.find('input[type="number"]').setValue(-2)

			const emitted = wrapper.emitted('update:modelValue')!
			const last = emitted[emitted.length - 1][0] as any
			expect(last.qty).toBe(-2)
			expect(last.stockQty).toBe(-20)
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
			// A parent may bind a value that has not been fully populated yet: a missing quantity
			// shows as none, and a missing unit as the placeholder.
			const missingQty = mount(AQuantityInput, { props: { options, modelValue: { uom: 'Box' } as any } })
			expect((missingQty.find('.aquantity__qty').element as HTMLInputElement).value).toBe('')

			const missingUom = mount(AQuantityInput, { props: { options, modelValue: { qty: 5 } as any, uomLabel: 'Unit' } })
			expect(missingUom.find('.aform_dropdown-button').text()).toContain('Unit')
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
			const toggle = wrapper.find('.aform_dropdown-button')
			await toggle.trigger('keydown.down') // opens, active = Nos (index 0)
			await toggle.trigger('keydown.up') // wraps to last (Kg)
			await toggle.trigger('keydown.enter')

			const emitted = wrapper.emitted('update:modelValue')!
			expect((emitted[emitted.length - 1][0] as any).uom).toBe('Kg')
		})

		it('opens the menu (without selecting) when Enter is pressed while it is closed', async () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			await wrapper.find('.aform_dropdown-button').trigger('keydown.enter')
			expect(isMenuOpen(wrapper)).toBe(true)
			expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		})

		it('highlights an option on hover (mouseenter sets the active index)', async () => {
			const wrapper = mount(AQuantityInput, { props: { options } })
			await wrapper.find('.aform_dropdown-button').trigger('click')
			const boxOption = wrapper.findAll('.autocomplete-result').find(li => li.text() === 'Box')!
			await boxOption.trigger('mouseenter')
			expect(boxOption.classes()).toContain('is-active')
		})

		it('points aria-activedescendant at the active option once the menu is open', async () => {
			const wrapper = mount(AQuantityInput, { props: { uuid: 'q', options } })
			const toggle = wrapper.find('.aform_dropdown-button')
			expect(toggle.attributes('aria-activedescendant')).toBeUndefined()
			await toggle.trigger('keydown.down') // opens, active index 0
			const active = toggle.attributes('aria-activedescendant')
			expect(active).toBe('q-uom-listbox-opt-0')
			expect(wrapper.find(`#${active}`).classes()).toContain('is-active')
		})

		it('does not throw or emit when there are no uom options', async () => {
			const wrapper = mount(AQuantityInput, { props: { options: { uoms: [] } } })
			const toggle = wrapper.find('.aform_dropdown-button')
			await toggle.trigger('keydown.down')
			await toggle.trigger('keydown.down')
			await toggle.trigger('keydown.enter')
			expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		})
	})
})
