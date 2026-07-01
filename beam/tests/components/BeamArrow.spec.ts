import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BeamArrow from '../../src/components/BeamArrow.vue'

describe('BeamArrow', { tags: ['component'] }, () => {
	it('renders arrow with default color', () => {
		const wrapper = mount(BeamArrow)
		expect(wrapper.find('.beam_metadata_arrow').exists()).toBe(true)
	})

	it('renders arrow with custom color', () => {
		const wrapper = mount(BeamArrow, {
			props: {
				color: '#ff0000',
			},
		})
		const body = wrapper.find('.beam_metadata_arrow-body')
		expect(body.attributes('style')).toContain('background: rgb(255, 0, 0)')
	})

	it('renders svg element', () => {
		const wrapper = mount(BeamArrow)
		expect(wrapper.find('svg').exists()).toBe(true)
	})

	it('svg polygon has correct fill color', () => {
		const wrapper = mount(BeamArrow, {
			props: {
				color: '#00ff00',
			},
		})
		const polygon = wrapper.find('polygon')
		expect(polygon.attributes('style')).toContain('rgb(0, 255, 0)')
	})
})
