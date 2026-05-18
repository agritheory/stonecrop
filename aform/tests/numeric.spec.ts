import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ANumericInput from '../src/components/form/ANumericInput.vue'

describe('numeric input component', () => {
	const numericInputModel = 25
	const wrapper = mount(ANumericInput, {
		props: { modelValue: numericInputModel, label: 'Age' },
	})

	it('emits update event when input changed', async () => {
		await wrapper.find('input').setValue(26)
		await wrapper.vm.$nextTick()

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(1)
		expect(updateEvents![0]).toEqual([26])
	})

	it('is disabled in read mode', () => {
		const w = mount(ANumericInput, { props: { modelValue: 42, label: 'Amount', mode: 'read' } })
		expect(w.find('input').attributes()).toHaveProperty('disabled')
	})

	it('renders value in display mode without input', () => {
		const w = mount(ANumericInput, { props: { modelValue: 42, label: 'Amount', mode: 'display' } })
		expect(w.find('input').exists()).toBe(false)
		expect(w.find('.aform_display-value').text()).toBe('42')
	})

	it('renders empty string in display mode when no value', () => {
		const w = mount(ANumericInput, { props: { label: 'Amount', mode: 'display' } })
		expect(w.find('input').exists()).toBe(false)
		expect(w.find('.aform_display-value').text()).toBe('')
	})
})
