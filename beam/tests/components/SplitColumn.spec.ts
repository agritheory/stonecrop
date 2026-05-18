import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SplitColumn from '../../src/components/SplitColumn.vue'

describe('SplitColumn', { tags: ['component'] }, () => {
	it('renders with default props', () => {
		const wrapper = mount(SplitColumn, {
			slots: {
				left: 'Left content',
				right: 'Right content',
			},
		})
		expect(wrapper.find('.two-column').exists()).toBe(true)
	})

	it('applies default justify-content style', () => {
		const wrapper = mount(SplitColumn)
		const div = wrapper.find('.two-column')
		expect(div.attributes('style')).toContain('justify-content: space-between')
	})

	it('applies custom justify-content style', () => {
		const wrapper = mount(SplitColumn, {
			props: {
				justifyContent: 'center',
			},
		})
		const div = wrapper.find('.two-column')
		expect(div.attributes('style')).toContain('justify-content: center')
	})

	it('applies default align-items style', () => {
		const wrapper = mount(SplitColumn)
		const div = wrapper.find('.two-column')
		expect(div.attributes('style')).toContain('align-items: flex-start')
	})

	it('applies custom align-items style', () => {
		const wrapper = mount(SplitColumn, {
			props: {
				alignItems: 'center',
			},
		})
		const div = wrapper.find('.two-column')
		expect(div.attributes('style')).toContain('align-items: center')
	})

	it('renders left slot content', () => {
		const wrapper = mount(SplitColumn, {
			slots: {
				left: 'Left Content',
			},
		})
		expect(wrapper.text()).toContain('Left Content')
	})

	it('renders right slot content', () => {
		const wrapper = mount(SplitColumn, {
			slots: {
				right: 'Right Content',
			},
		})
		expect(wrapper.text()).toContain('Right Content')
	})

	it('renders both left and right columns', () => {
		const wrapper = mount(SplitColumn, {
			slots: {
				left: 'Left',
				right: 'Right',
			},
		})
		expect(wrapper.find('.column-left').exists()).toBe(true)
		expect(wrapper.find('.column-right').exists()).toBe(true)
	})
})
