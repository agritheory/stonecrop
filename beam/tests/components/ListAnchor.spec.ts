import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ListAnchor from '../../src/components/ListAnchor.vue'

describe('ListAnchor', () => {
	it('renders anchor element', () => {
		const wrapper = mount(ListAnchor, {
			slots: {
				default: 'Link text',
			},
		})
		expect(wrapper.find('a').exists()).toBe(true)
	})

	it('renders slot content', () => {
		const wrapper = mount(ListAnchor, {
			slots: {
				default: 'Link text',
			},
		})
		expect(wrapper.text()).toBe('Link text')
	})

	it('applies href attribute', () => {
		const wrapper = mount(ListAnchor, {
			props: {
				to: '/test-path',
			},
		})
		expect(wrapper.find('a').attributes('href')).toBe('/test-path')
	})

	it('applies default empty href when no to prop', () => {
		const wrapper = mount(ListAnchor)
		expect(wrapper.find('a').attributes('href')).toBe('')
	})

	it('applies correct class', () => {
		const wrapper = mount(ListAnchor)
		expect(wrapper.find('a').classes()).toContain('beam_list-anchor')
	})
})
