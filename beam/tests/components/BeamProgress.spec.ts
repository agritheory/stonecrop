import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BeamProgress from '../../src/components/BeamProgress.vue'

describe('BeamProgress', { tags: ['component'] }, () => {
	it('renders with default props', () => {
		const wrapper = mount(BeamProgress)
		expect(wrapper.text()).toContain('Status')
		expect(wrapper.text()).toContain('In Progress')
	})

	it('shows custom label', () => {
		const wrapper = mount(BeamProgress, {
			props: {
				label: 'Custom Status',
			},
		})
		expect(wrapper.text()).toContain('Custom Status')
	})

	it('shows progress message when not complete', () => {
		const wrapper = mount(BeamProgress, {
			props: {
				complete: false,
				progressMessage: 'Working on it',
			},
		})
		expect(wrapper.text()).toContain('Working on it')
	})

	it('shows complete message when complete', () => {
		const wrapper = mount(BeamProgress, {
			props: {
				complete: true,
				completeMessage: 'All Done',
			},
		})
		expect(wrapper.text()).toContain('All Done')
	})

	it('applies alert class when not complete', () => {
		const wrapper = mount(BeamProgress, {
			props: {
				complete: false,
			},
		})
		expect(wrapper.find('.beam--alert').exists()).toBe(true)
	})

	it('does not apply alert class when complete', () => {
		const wrapper = mount(BeamProgress, {
			props: {
				complete: true,
			},
		})
		expect(wrapper.find('.beam--alert').exists()).toBe(false)
	})
})
