import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BeamBtn from '../../src/components/BeamBtn.vue'

describe('BeamBtn', () => {
	it('renders default slot content', () => {
		const wrapper = mount(BeamBtn, {
			slots: {
				default: 'Click Me',
			},
		})
		expect(wrapper.text()).toBe('Click Me')
	})

	it('renders default "Action" text when no slot is provided', () => {
		const wrapper = mount(BeamBtn)
		expect(wrapper.text()).toBe('Action')
	})

	it('applies beam_btn class', () => {
		const wrapper = mount(BeamBtn)
		expect(wrapper.find('button').classes()).toContain('beam_btn')
	})

	it('renders as a button element', () => {
		const wrapper = mount(BeamBtn)
		expect(wrapper.element.tagName).toBe('BUTTON')
	})
})
