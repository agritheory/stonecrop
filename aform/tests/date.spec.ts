import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ADate from '../src/components/form/ADate.vue'
import ADateSelection from '../src/components/form/ADateSelection.vue'
import ADatePicker from '../src/components/form/ADatePicker.vue'
import ADateTimeInput from '../src/components/form/ADateTimeInput.vue'

const globalComponents = {
	global: {
		components: {
			ADateSelection,
			ADatePicker,
			ADateTimeInput,
		},
	},
}

describe('date component', { tags: ['component'] }, () => {
	it('uses shared form field classes', () => {
		const wrapper = mount(ADate, globalComponents)
		expect(wrapper.find('.aform_form-element').exists()).toBe(true)
		expect(wrapper.find('.aform_input-field').exists()).toBe(true)
		expect(wrapper.find('.aform_field-label').exists()).toBe(true)
	})

	it('date input is rendered', async () => {
		const wrapper = mount(ADate, globalComponents)
		const $input = wrapper.find('input')
		expect($input.exists()).toBe(true)
		expect($input.attributes('type')).toBe('text')
		expect($input.attributes()).not.toHaveProperty('readonly')
	})

	it('date input is rendered with value', async () => {
		const wrapper = mount(ADate, {
			...globalComponents,
			props: {
				modelValue: '2021-01-01',
			},
		})

		const $input = wrapper.find('input')
		expect($input.element.value).toBe(new Date(2021, 0, 1).toLocaleDateString())
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

	it('shows formatted date after picker selection', async () => {
		const wrapper = mount(ADate, globalComponents)
		await wrapper.find('input').trigger('click')
		await wrapper.findComponent(ADateSelection).vm.$emit('get-date', { selected: new Date(2023, 5, 15) })
		expect((wrapper.find('input').element as HTMLInputElement).value).toBe(new Date(2023, 5, 15).toLocaleDateString())
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

	it('opens the custom date picker when the input is clicked', async () => {
		const wrapper = mount(ADate, globalComponents)
		expect(wrapper.findComponent(ADateSelection).exists()).toBe(false)
		await wrapper.find('input').trigger('click')
		expect(wrapper.findComponent(ADateSelection).exists()).toBe(true)
		await wrapper.find('input').trigger('click')
		expect(wrapper.findComponent(ADateSelection).exists()).toBe(true)
	})

	it('commits a typed date on blur', async () => {
		const emitted: (string | Date | undefined)[] = []
		const wrapper = mount(ADate, {
			...globalComponents,
			props: { 'onUpdate:modelValue': (v: string | Date | undefined) => emitted.push(v) },
		})
		const $input = wrapper.find('input')
		await $input.setValue('2023-06-15')
		await $input.trigger('blur')
		expect(emitted.length).toBeGreaterThan(0)
		expect(($input.element as HTMLInputElement).value).toBe(new Date(2023, 5, 15).toLocaleDateString())
	})

	it('highlights the field value as the selected date in the picker', async () => {
		const wrapper = mount(ADate, {
			...globalComponents,
			props: { modelValue: '2026-08-20' },
		})
		await wrapper.find('input').trigger('click')
		await wrapper.vm.$nextTick()
		const selected = wrapper.find('.selectedDate')
		expect(selected.exists()).toBe(true)
		expect(selected.text()).toBe('20')
	})

	it('keeps focus on the input when the picker opens', async () => {
		const wrapper = mount(ADate, { ...globalComponents, attachTo: document.body })
		const input = wrapper.find('input').element as HTMLInputElement
		input.focus()
		await wrapper.find('input').trigger('click')
		await wrapper.vm.$nextTick()
		expect(document.activeElement).toBe(input)
		wrapper.unmount()
	})

	it('handles date selection from picker', async () => {
		const emitted: (string | Date | undefined)[] = []
		const wrapper = mount(ADate, {
			...globalComponents,
			props: { 'onUpdate:modelValue': (v: string | Date | undefined) => emitted.push(v) },
		})
		await wrapper.find('input').trigger('click')
		const picker = wrapper.findComponent(ADateSelection)
		await picker.vm.$emit('get-date', { selected: new Date(2023, 5, 15) })
		expect(emitted.length).toBeGreaterThan(0)
	})
})
