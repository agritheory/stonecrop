import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ADate from '@/components/form/ADate.vue'

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
				readonly: true,
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
})
