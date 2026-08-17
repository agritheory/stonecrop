import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ADate from '../src/components/form/ADate.vue'
import ADateSelection from '../src/components/form/ADateSelection.vue'
import ADatePicker from '../src/components/form/ADatePicker.vue'
import ADateTime from '../src/components/form/ADateTime.vue'

const globalComponents = {
	global: {
		components: {
			ADateSelection,
			ADatePicker,
			ADateTime,
		},
	},
}

describe('date component', { tags: ['component'] }, () => {
	it('date input is rendered', async () => {
		const wrapper = mount(ADate, globalComponents)
		const $input = wrapper.find('input')
		expect($input.exists()).toBe(true)
		expect($input.attributes('type')).toBe('date')
	})

	it('date input is rendered with value', async () => {
		const wrapper = mount(ADate, {
			...globalComponents,
			props: {
				modelValue: '2021-01-01',
			},
		})

		const $input = wrapper.find('input')
		expect($input.element.value).toBe('2021-01-01')
	})

	it('date input is disabled by default', async () => {
		const wrapper = mount(ADate, {
			...globalComponents,
			props: {
				mode: 'read',
			},
		})

		const $input = wrapper.find('input')
		expect($input.attributes()).toHaveProperty('disabled')
	})

	it('date input is required', async () => {
		const wrapper = mount(ADate, globalComponents)
		const $input = wrapper.find('input')

		// TODO: setup environment to test spawning the datepicker
		await $input.trigger('click')
		expect($input.element.showPicker).toBeUndefined()
	})

	it('formats date value on input change', async () => {
		const wrapper = mount(ADate, globalComponents)
		const $input = wrapper.find('input')
		await $input.setValue('2023-06-15')
		await wrapper.vm.$nextTick()
		expect(($input.element as HTMLInputElement).value).toBe('2023-06-15')
	})

	it('renders in display mode with formatted date', () => {
		const wrapper = mount(ADate, {
			...globalComponents,
			props: { modelValue: '2021-01-01', mode: 'display' },
		})
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').exists()).toBe(true)
	})

	it('renders in display mode with empty span when no value', () => {
		const wrapper = mount(ADate, {
			...globalComponents,
			props: { mode: 'display' },
		})
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').text()).toBe('')
	})

	it('toggles custom date picker when input is clicked', async () => {
		const wrapper = mount(ADate, globalComponents)
		expect(wrapper.findComponent(ADateSelection).exists()).toBe(false)
		await wrapper.find('input').trigger('click.prevent')
		expect(wrapper.findComponent(ADateSelection).exists()).toBe(true)
		await wrapper.find('input').trigger('click.prevent')
		expect(wrapper.findComponent(ADateSelection).exists()).toBe(false)
	})

	it('handles date selection from picker', async () => {
		const emitted: (string | Date | undefined)[] = []
		const wrapper = mount(ADate, {
			...globalComponents,
			props: { 'onUpdate:modelValue': (v: string | Date | undefined) => emitted.push(v) },
		})
		await wrapper.find('input').trigger('click.prevent')
		const picker = wrapper.findComponent(ADateSelection)
		await picker.vm.$emit('get-date', { selected: new Date('2023-06-15') })
		expect(emitted.length).toBeGreaterThan(0)
	})
})
