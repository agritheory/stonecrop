import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ACheckbox from '@/components/form/ACheckbox.vue'

describe('checkbox component', () => {
	let wrapper = mount(ACheckbox, {
		props: {
			label: 'Test Label',
			value: false,
			'onUpdate:value': (value: boolean) => {
				wrapper.setProps({ value })
			},
		},
	})

	it('emits input value when changed', async () => {
		await wrapper.find('input').setValue(true)
		expect(wrapper.props('value')).toBe(true)
	})
})
