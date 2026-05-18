import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ToggleArrow from '../../src/components/ToggleArrow.vue'

describe('ToggleArrow', { tags: ['component'] }, () => {
	it('renders arrow icon', () => {
		const wrapper = mount(ToggleArrow, {
			props: {
				open: false,
			},
		})
		expect(wrapper.find('.arrow-icon').exists()).toBe(true)
	})

	it('applies open class when open prop is true', () => {
		const wrapper = mount(ToggleArrow, {
			props: {
				open: true,
			},
		})
		expect(wrapper.find('.arrow-icon').classes()).toContain('open')
	})

	it('does not apply open class when open prop is false', () => {
		const wrapper = mount(ToggleArrow, {
			props: {
				open: false,
			},
		})
		expect(wrapper.find('.arrow-icon').classes()).not.toContain('open')
	})

	it('renders svg element', () => {
		const wrapper = mount(ToggleArrow, {
			props: {
				open: false,
			},
		})
		expect(wrapper.find('svg').exists()).toBe(true)
	})
})
