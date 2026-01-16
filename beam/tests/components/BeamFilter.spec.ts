import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BeamFilter from '../../src/components/BeamFilter.vue'
import BeamHeading from '../../src/components/BeamHeading.vue'
import ToggleArrow from '../../src/components/ToggleArrow.vue'

describe('BeamFilter', () => {
	it('renders filter heading', () => {
		const wrapper = mount(BeamFilter, {
			global: {
				components: { BeamHeading, ToggleArrow },
			},
		})
		expect(wrapper.text()).toContain('Filter')
	})

	it('starts with filters collapsed', () => {
		const wrapper = mount(BeamFilter, {
			global: {
				components: { BeamHeading, ToggleArrow },
			},
		})
		const options = wrapper.find('.beam_filters-options')
		expect(options.isVisible()).toBe(false)
	})

	it('expands filters when heading is clicked', async () => {
		const wrapper = mount(BeamFilter, {
			global: {
				components: { BeamHeading, ToggleArrow },
			},
		})
		const heading = wrapper.find('.beam_filters-heading')
		await heading.trigger('click')
		const options = wrapper.find('.beam_filters-options')
		expect(options.isVisible()).toBe(true)
	})

	it('toggles arrow icon when expanded', async () => {
		const wrapper = mount(BeamFilter, {
			global: {
				components: { BeamHeading, ToggleArrow },
			},
		})
		const heading = wrapper.find('.beam_filters-heading')
		const toggleArrow = wrapper.findComponent(ToggleArrow)

		expect(toggleArrow.props('open')).toBe(false)
		await heading.trigger('click')
		expect(toggleArrow.props('open')).toBe(true)
	})

	it('renders slot content', async () => {
		const wrapper = mount(BeamFilter, {
			slots: {
				default: '<div class="test-filter">Test Filter</div>',
			},
			global: {
				components: { BeamHeading, ToggleArrow },
			},
		})
		const heading = wrapper.find('.beam_filters-heading')
		await heading.trigger('click')
		expect(wrapper.find('.test-filter').exists()).toBe(true)
	})
})
