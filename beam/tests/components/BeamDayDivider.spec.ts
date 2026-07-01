import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BeamDayDivider from '../../src/components/BeamDayDivider.vue'

describe('BeamDayDivider', { tags: ['component'] }, () => {
	it('renders day divider', () => {
		const wrapper = mount(BeamDayDivider, {
			props: {
				item: {
					date: '2024-01-15',
					label: 'Test Day',
				},
			},
		})
		expect(wrapper.find('.beam_day-divider').exists()).toBe(true)
	})

	it('formats date with toDateString by default', () => {
		const wrapper = mount(BeamDayDivider, {
			props: {
				item: {
					date: '2024-01-15',
					label: 'Test Day',
				},
			},
		})
		expect(wrapper.text()).toContain('Mon Jan 15 2024')
	})

	it('formats date to ISO when dateFormat is iso', () => {
		const wrapper = mount(BeamDayDivider, {
			props: {
				item: {
					date: '2024-01-15',
					dateFormat: 'iso',
					label: 'Test Day',
				},
			},
		})
		expect(wrapper.text()).toContain('2024-01-15')
	})

	it('displays raw date when invalid date', () => {
		const wrapper = mount(BeamDayDivider, {
			props: {
				item: {
					date: 'not-a-date',
					label: 'Test Day',
				},
			},
		})
		expect(wrapper.text()).toContain('not-a-date')
	})

	it('renders as div element', () => {
		const wrapper = mount(BeamDayDivider, {
			props: {
				item: {
					date: '2024-01-15',
					label: 'Test Day',
				},
			},
		})
		expect(wrapper.find('.beam_day-divider').element.tagName).toBe('DIV')
	})

	it('renders h2 for date', () => {
		const wrapper = mount(BeamDayDivider, {
			props: {
				item: {
					date: '2024-01-15',
					label: 'Test Day',
				},
			},
		})
		expect(wrapper.find('h2').exists()).toBe(true)
	})
})
