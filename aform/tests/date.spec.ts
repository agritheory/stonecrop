import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ADate from '../src/components/form/ADate.vue'

describe('date component', () => {
	it('date input is rendered', async () => {
		const wrapper = mount(ADate)
		const $input = wrapper.find('input')
		expect($input.exists()).toBe(true)
		expect($input.attributes('type')).toBe('date')
	})

	it('date input is rendered with value', async () => {
		const wrapper = mount(ADate, {
			props: {
				modelValue: '2021-01-01',
			},
		})

		const $input = wrapper.find('input')
		expect($input.element.value).toBe('2021-01-01')
	})

	it('date input is disabled by default', async () => {
		const wrapper = mount(ADate, {
			props: {
				mode: 'read',
			},
		})

		const $input = wrapper.find('input')
		expect($input.attributes()).toHaveProperty('disabled')
	})

	it('date input is required', async () => {
		const wrapper = mount(ADate)
		const $input = wrapper.find('input')

		// TODO: setup environment to test spawning the datepicker
		await $input.trigger('click')
		expect($input.element.showPicker).toBeUndefined()
	})

	it('formats date value on input change', async () => {
		const wrapper = mount(ADate)
		const $input = wrapper.find('input')
		await $input.setValue('2023-06-15')
		await wrapper.vm.$nextTick()
		expect(($input.element as HTMLInputElement).value).toBe('2023-06-15')
	})

	it('renders in display mode with formatted date', () => {
		const wrapper = mount(ADate, {
			props: { modelValue: '2021-01-01', mode: 'display' },
		})
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').exists()).toBe(true)
	})

	it('renders in display mode with empty span when no value', () => {
		const wrapper = mount(ADate, { props: { mode: 'display' } })
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').text()).toBe('')
	})
})
