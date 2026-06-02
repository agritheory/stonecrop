import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AComboBox from '../src/components/form/AComboBox.vue'

describe('combobox component', { tags: ['component'] }, () => {
	it('renders with three input fields', () => {
		const wrapper = mount(AComboBox, {
			global: {
				stubs: {
					ATableModal: {
						template: '<div class="amodal"><slot /></div>',
						props: ['event', 'cellData'],
					},
				},
			},
			props: {
				event: {},
				cellData: {},
				tableID: 'test-table',
			},
		})

		expect(wrapper.find('.amodal').exists()).toBe(true)
		const inputs = wrapper.findAll('input')
		expect(inputs.length).toBe(3)
	})

	it('passes props to ATableModal', () => {
		const eventData = { target: {} }
		const cellData = { value: 'test' }

		const wrapper = mount(AComboBox, {
			global: {
				stubs: {
					ATableModal: {
						template: '<div class="amodal"><slot /></div>',
						props: ['event', 'cellData'],
					},
				},
			},
			props: {
				event: eventData,
				cellData: cellData,
				tableID: 'test-table',
			},
		})

		expect(wrapper.find('.amodal').exists()).toBe(true)
	})
})
