import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import FixedTop from '../../src/components/FixedTop.vue'

describe('FixedTop', { tags: ['component'] }, () => {
	it('renders div element', () => {
		const wrapper = mount(FixedTop, {
			slots: {
				default: 'Fixed content',
			},
		})
		expect(wrapper.find('div').exists()).toBe(true)
	})

	it('renders slot content', () => {
		const wrapper = mount(FixedTop, {
			slots: {
				default: 'Fixed content',
			},
		})
		expect(wrapper.text()).toContain('Fixed content')
	})

	it('applies correct class', () => {
		const wrapper = mount(FixedTop, {
			slots: {
				default: 'Fixed content',
			},
		})
		expect(wrapper.find('.fixed-top').exists()).toBe(true)
	})
})
