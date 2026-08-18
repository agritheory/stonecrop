import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ADropdown from '../src/components/form/ADropdown.vue'

describe('ADropdown badge display', { tags: ['component'] }, () => {
	const badgeOptions = {
		choices: ['Open', 'Working', 'Completed'],
		badges: {
			Open: 'warning',
			Working: 'brand',
			Completed: 'success',
		},
	}

	it('renders badge label with input accent in display mode', () => {
		const wrapper = mount(ADropdown, {
			props: {
				modelValue: 'Open',
				label: 'Status',
				options: badgeOptions,
				mode: 'display',
			},
		})
		const display = wrapper.find('.aform_display-value')
		expect(display.text()).toBe('Open')
		expect(display.attributes('style')).toContain('border-left-color')
		expect(display.attributes('style')).toContain('var(--sc-badge-warning-accent)')
	})

	it('applies input accent style in edit mode', () => {
		const wrapper = mount(ADropdown, {
			props: {
				modelValue: 'Completed',
				label: 'Status',
				options: badgeOptions,
				mode: 'edit',
			},
		})
		const input = wrapper.find('input')
		expect(input.attributes('style')).toContain('border-left-color')
		expect(input.attributes('style')).toContain('var(--sc-badge-success-accent)')
	})

	it('still uses choices for edit dropdown filtering', async () => {
		const wrapper = mount(ADropdown, {
			props: {
				modelValue: 'Open',
				label: 'Status',
				options: badgeOptions,
				mode: 'edit',
			},
		})
		await wrapper.find('input').trigger('focus')
		const items = wrapper.findAll('.autocomplete-result')
		expect(items.map(li => li.text())).toEqual(['Open', 'Working', 'Completed'])
	})
})
