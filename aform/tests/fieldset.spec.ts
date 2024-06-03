import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AFieldset from '@/components/form/AFieldset.vue'

describe('fieldset input component', () => {
	it('no change in collapse status when fieldset is uncollapsible', async () => {
		const wrapper = mount(AFieldset, {
			props: {
				label: 'Fieldset',
				collapsible: false,
				schema: [
					{
						fieldname: 'first_name',
						fieldtype: 'ATextInput',
						label: 'First Name',
					},
					{
						fieldname: 'middle_name',
						component: 'ATextInput',
						label: 'Middle Name',
					},
					{
						fieldname: 'last_name',
						component: 'ATextInput',
						label: 'Last Name',
					},
					{
						fieldname: 'age',
						component: 'ANumericInput',
						label: 'Age',
					},
				],
			},
		})

		expect(wrapper.vm.collapsed).toBe(false)
		await wrapper.find('legend').trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.collapsed).toBe(false)
	})

	it('toggle collapse status when fieldset is collapsible', async () => {
		const wrapper = mount(AFieldset, {
			props: {
				label: 'Fieldset',
				collapsible: true,
				schema: [
					{
						fieldname: 'first_name',
						fieldtype: 'ATextInput',
						label: 'First Name',
					},
					{
						fieldname: 'middle_name',
						component: 'ATextInput',
						label: 'Middle Name',
					},
					{
						fieldname: 'last_name',
						component: 'ATextInput',
						label: 'Last Name',
					},
					{
						fieldname: 'age',
						component: 'ANumericInput',
						label: 'Age',
					},
				],
			},
		})

		// check if a form is rendered inside the fieldset
		const form = wrapper.findComponent({ name: 'AForm' })
		expect(form.exists()).toBe(true)
		expect(wrapper.vm.collapsed).toBe(false)

		await wrapper.find('legend').trigger('click')
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.collapsed).toBe(true)
		expect(form.isVisible()).toBe(false)
	})
})
