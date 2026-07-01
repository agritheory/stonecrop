import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BeamFilterOption from '../../src/components/BeamFilterOption.vue'
import BeamHeading from '../../src/components/BeamHeading.vue'

describe('BeamFilterOption', { tags: ['component'] }, () => {
	const mockChoices = [
		{ label: 'Option 1', value: 'opt1' },
		{ label: 'Option 2', value: 'opt2' },
		{ label: 'Option 3', value: 'opt3' },
	]

	it('renders with choices', () => {
		const wrapper = mount(BeamFilterOption, {
			props: {
				choices: mockChoices,
			},
			global: {
				components: { BeamHeading },
			},
		})
		expect(wrapper.find('.beam_filter-option').exists()).toBe(true)
	})

	it('displays first choice by default', () => {
		const wrapper = mount(BeamFilterOption, {
			props: {
				choices: mockChoices,
			},
			global: {
				components: { BeamHeading },
			},
		})
		expect(wrapper.text()).toContain('Option 1')
	})

	it('shows title when provided', () => {
		const wrapper = mount(BeamFilterOption, {
			props: {
				choices: mockChoices,
				title: 'Select Option',
			},
			global: {
				components: { BeamHeading },
			},
		})
		expect(wrapper.text()).toContain('Select Option')
	})

	it('menu is closed by default', () => {
		const wrapper = mount(BeamFilterOption, {
			props: {
				choices: mockChoices,
			},
			global: {
				components: { BeamHeading },
			},
		})
		const menu = wrapper.find('.beam_filter-select-menu')
		expect(menu.exists()).toBe(false)
	})

	it('opens menu when select div is clicked', async () => {
		const wrapper = mount(BeamFilterOption, {
			props: {
				choices: mockChoices,
			},
			global: {
				components: { BeamHeading },
			},
		})
		await wrapper.find('.beam_filter-option').trigger('click')
		const menu = wrapper.find('.beam_filter-select-menu')
		expect(menu.exists()).toBe(true)
	})

	it('emits select event when choice is clicked', async () => {
		const wrapper = mount(BeamFilterOption, {
			props: {
				choices: mockChoices,
			},
			global: {
				components: { BeamHeading },
			},
		})
		await wrapper.find('.beam_filter-option').trigger('click')
		const options = wrapper.findAll('.beam_filter-select-option')
		await options[1].trigger('click')
		expect(wrapper.emitted('select')).toBeTruthy()
		expect(wrapper.emitted('select')?.[0]).toEqual([mockChoices[1]])
	})

	it('updates label when choice is selected', async () => {
		const wrapper = mount(BeamFilterOption, {
			props: {
				choices: mockChoices,
			},
			global: {
				components: { BeamHeading },
			},
		})
		await wrapper.find('.beam_filter-option').trigger('click')
		const options = wrapper.findAll('.beam_filter-select-option')
		await options[2].trigger('click')
		expect(wrapper.text()).toContain('Option 3')
	})

	it('renders SVG arrow icon', () => {
		const wrapper = mount(BeamFilterOption, {
			props: {
				choices: mockChoices,
			},
			global: {
				components: { BeamHeading },
			},
		})
		expect(wrapper.find('.beam_filter-arrow svg').exists()).toBe(true)
	})
})
