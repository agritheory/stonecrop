import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ACheckbox from '../src/components/form/ACheckbox.vue'

describe('checkbox component', () => {
	let wrapper = mount(ACheckbox, {
		props: { value: false },
	})

	it('emits checkbox value when changed', async () => {
		await wrapper.find('input').setValue(true)
		await wrapper.find('input').setValue(false)

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(2)
		expect(updateEvents![0]).toEqual([true])
		expect(updateEvents![1]).toEqual([false])
	})

	it('is disabled in read mode', () => {
		const w = mount(ACheckbox, { props: { mode: 'read' } })
		expect(w.find('input').attributes()).toHaveProperty('disabled')
	})

	it('renders checked value in display mode', () => {
		const w = mount(ACheckbox, { props: { mode: 'display', modelValue: true } })
		expect(w.find('input').exists()).toBe(false)
		expect(w.text()).toContain('✓')
	})

	it('renders unchecked value in display mode', () => {
		const w = mount(ACheckbox, { props: { mode: 'display', modelValue: false } })
		expect(w.find('input').exists()).toBe(false)
		expect(w.text()).toContain('✗')
	})
})
