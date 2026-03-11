import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AFileAttach from '../src/components/form/AFileAttach.vue'

describe('file attach component', () => {
	it('renders attach and reset buttons by default', () => {
		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File' },
		})
		const buttons = wrapper.findAll('button')
		expect(buttons.length).toBe(2)
		expect(buttons[0].text()).toContain('Attach File')
		expect(buttons[1].text()).toContain('Reset')
	})

	it('reset button is disabled when no file is selected', () => {
		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File' },
		})
		const resetBtn = wrapper.findAll('button')[1]
		expect(resetBtn.attributes()).toHaveProperty('disabled')
	})

	it('both buttons are disabled in read mode', () => {
		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File', mode: 'read' },
		})
		const buttons = wrapper.findAll('button')
		expect(buttons[0].attributes()).toHaveProperty('disabled')
		expect(buttons[1].attributes()).toHaveProperty('disabled')
	})

	it('renders display mode with no-file message when no file selected', () => {
		const wrapper = mount(AFileAttach, {
			props: { label: 'Attach File', mode: 'display' },
		})
		expect(wrapper.find('button').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').text()).toBe('No file selected')
	})
})
