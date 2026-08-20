import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ASegmentedControl from '../src/components/form/ASegmentedControl.vue'

const intervalOptions = {
	'1 day': { label: 'Day' },
	'1 week': { label: 'Week' },
	'1 month': { label: 'Month' },
}

describe('ASegmentedControl', { tags: ['component'] }, () => {
	it('emits update:modelValue when a segment is selected', async () => {
		const wrapper = mount(ASegmentedControl, {
			props: {
				modelValue: '1 day',
				label: 'Time bucket',
				uuid: 'bucket',
				options: intervalOptions,
			},
		})

		const weekInput = wrapper.find('input[value="1 week"]')
		await weekInput.setValue(true)

		const updates = wrapper.emitted('update:modelValue')
		expect(updates).toHaveLength(1)
		expect(updates![0]).toEqual(['1 week'])
	})

	it('shares one radio name and marks the current value checked', () => {
		const wrapper = mount(ASegmentedControl, {
			props: {
				modelValue: '1 week',
				label: 'Time bucket',
				uuid: 'bucket',
				options: intervalOptions,
			},
		})

		const inputs = wrapper.findAll('input[type="radio"]')
		expect(inputs).toHaveLength(3)
		expect(inputs.every(i => i.attributes('name') === 'bucket')).toBe(true)
		expect((wrapper.find('input[value="1 week"]').element as HTMLInputElement).checked).toBe(true)
	})

	it('does not render a fieldset', () => {
		const wrapper = mount(ASegmentedControl, {
			props: { modelValue: '1 day', label: 'Time bucket', options: intervalOptions },
		})
		expect(wrapper.find('fieldset').exists()).toBe(false)
	})

	it('exposes a labelled radiogroup', () => {
		const wrapper = mount(ASegmentedControl, {
			props: { modelValue: '1 day', label: 'Time bucket', uuid: 'bucket', options: intervalOptions },
		})

		const group = wrapper.find('[role="radiogroup"]')
		expect(group.exists()).toBe(true)
		expect(group.attributes('aria-labelledby')).toBe('bucket-label')
	})

	it('disables radios in read mode', () => {
		const wrapper = mount(ASegmentedControl, {
			props: {
				modelValue: '1 day',
				label: 'Time bucket',
				mode: 'read',
				options: intervalOptions,
			},
		})
		expect(wrapper.findAll('input[type="radio"]').every(i => i.attributes('disabled') !== undefined)).toBe(true)
	})

	it('renders the selected label in display mode', () => {
		const wrapper = mount(ASegmentedControl, {
			props: {
				modelValue: '1 month',
				label: 'Time bucket',
				mode: 'display',
				options: intervalOptions,
			},
		})
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').text()).toBe('Month')
	})

	it('shows choice-map labels while storing choice values', () => {
		const wrapper = mount(ASegmentedControl, {
			props: {
				modelValue: '1 day',
				label: 'Time bucket',
				options: intervalOptions,
			},
		})
		expect(wrapper.text()).toContain('Day')
		expect(wrapper.text()).toContain('Week')
		expect(wrapper.find('[data-segment-value="1 day"]').exists()).toBe(true)
	})

	it('drops the 20ch min-width at xs size', () => {
		const wrapper = mount(ASegmentedControl, {
			props: {
				modelValue: '1 day',
				label: 'Time bucket',
				size: 'xs',
				hideLabel: true,
				options: intervalOptions,
			},
		})
		expect(wrapper.classes()).toContain('aform_segmented-control--xs')
	})

	it('applies badge variant class to the selected segment', () => {
		const wrapper = mount(ASegmentedControl, {
			props: {
				modelValue: 'Submitted',
				label: 'Status',
				options: { Draft: 'neutral', Submitted: 'success', Cancelled: 'danger' },
			},
		})

		const selected = wrapper.find('[data-segment-value="Submitted"]')
		expect(selected.classes()).toContain('aform_segmented-segment--badge')
		expect(selected.classes()).toContain('aform_segmented-segment--success')
	})

	it('renders ABadge in display mode when options carry badges', () => {
		const wrapper = mount(ASegmentedControl, {
			props: {
				modelValue: 'Cancelled',
				label: 'Status',
				mode: 'display',
				options: { Draft: 'neutral', Submitted: 'success', Cancelled: 'danger' },
			},
		})

		expect(wrapper.find('.abadge').exists()).toBe(true)
		expect(wrapper.find('.abadge').text()).toBe('Cancelled')
		expect(wrapper.find('.abadge').classes()).toContain('abadge--danger')
	})
})
