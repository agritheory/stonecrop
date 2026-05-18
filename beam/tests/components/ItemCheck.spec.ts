import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ItemCheck from '../../src/components/ItemCheck.vue'

describe('ItemCheck', { tags: ['component'] }, () => {
	it('renders checkbox input', () => {
		const wrapper = mount(ItemCheck)
		expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
	})

	it('defaults to unchecked when no model value provided', () => {
		const wrapper = mount(ItemCheck)
		const checkbox = wrapper.find('input[type="checkbox"]').element as HTMLInputElement
		expect(checkbox.checked).toBe(false)
	})

	it('reflects model value when provided', () => {
		const wrapper = mount(ItemCheck, {
			props: {
				modelValue: true,
			},
		})
		const checkbox = wrapper.find('input[type="checkbox"]').element as HTMLInputElement
		expect(checkbox.checked).toBe(true)
	})

	it('emits update:modelValue when checkbox is clicked', async () => {
		const wrapper = mount(ItemCheck, {
			props: {
				modelValue: false,
			},
		})
		const checkbox = wrapper.find('input[type="checkbox"]')
		await checkbox.setValue(true)
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
	})

	it('renders checkmark element', () => {
		const wrapper = mount(ItemCheck)
		expect(wrapper.find('.checkmark').exists()).toBe(true)
	})

	it('checkmark has tabindex', () => {
		const wrapper = mount(ItemCheck)
		const checkmark = wrapper.find('.checkmark')
		expect(checkmark.attributes('tabindex')).toBe('0')
	})
})
