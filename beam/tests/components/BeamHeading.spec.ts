import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BeamHeading from '../../src/components/BeamHeading.vue'

describe('BeamHeading', () => {
	it('renders h1 element', () => {
		const wrapper = mount(BeamHeading, {
			slots: {
				default: 'Test Heading',
			},
		})
		expect(wrapper.find('h1').exists()).toBe(true)
	})

	it('renders slot content', () => {
		const wrapper = mount(BeamHeading, {
			slots: {
				default: 'Test Heading',
			},
		})
		expect(wrapper.text()).toBe('Test Heading')
	})

	it('applies correct class', () => {
		const wrapper = mount(BeamHeading, {
			slots: {
				default: 'Test Heading',
			},
		})
		expect(wrapper.find('h1').classes()).toContain('beam_header')
	})
})
