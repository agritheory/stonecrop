import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SegmentedDisplay from '../../src/components/SegmentedDisplay.vue'

describe('SegmentedDisplay', { tags: ['component'] }, () => {
	it('renders with default value', () => {
		const wrapper = mount(SegmentedDisplay)
		expect(wrapper.text()).toBe('120.26')
	})

	it('formats number to specified decimal places', () => {
		const wrapper = mount(SegmentedDisplay, {
			props: {
				displayInput: 123.456789,
				decimalPlaces: 3,
			},
		})
		expect(wrapper.text()).toBe('123.457')
	})

	it('handles zero value correctly', () => {
		const wrapper = mount(SegmentedDisplay, {
			props: {
				displayInput: 0,
				decimalPlaces: 2,
			},
		})
		expect(wrapper.text()).toBe('0.00')
	})

	it('applies custom display background color', () => {
		const wrapper = mount(SegmentedDisplay, {
			props: {
				displayColor: '#ff0000',
			},
		})
		const display = wrapper.find('.segmented-display')
		expect(display.attributes('style')).toContain('background: rgb(255, 0, 0)')
	})

	it('applies custom text color', () => {
		const wrapper = mount(SegmentedDisplay, {
			props: {
				textColor: '#00ff00',
			},
		})
		const output = wrapper.find('.segmented-display-output')
		expect(output.attributes('style')).toContain('color: rgb(0, 255, 0)')
	})

	it('handles CSS variable colors', () => {
		const wrapper = mount(SegmentedDisplay, {
			props: {
				displayColor: '--sc-primary',
			},
		})
		const display = wrapper.find('.segmented-display')
		expect(display.attributes('style')).toContain('background: var(--sc-primary)')
	})

	it('formats with 0 decimal places', () => {
		const wrapper = mount(SegmentedDisplay, {
			props: {
				displayInput: 123.456,
				decimalPlaces: 0,
			},
		})
		expect(wrapper.text()).toBe('123')
	})
})
