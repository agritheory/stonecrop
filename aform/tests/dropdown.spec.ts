import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ADropdown from '@/components/form/ADropdown.vue'

describe('dropdown input component', () => {
	let dropdown_data = {
		items: ['Apple', 'Orange', 'Pear', 'Kiwi', 'Grape'],
		value: 'Orange',
		label: 'Fruit',
	}

	let wrapper = mount(ADropdown, {
		props: { modelValue: dropdown_data.value, label: dropdown_data.label, items: dropdown_data.items },
	})

	it('emits update event when li clicked', async () => {
		await wrapper.find('input').setValue('')
		const liElements = wrapper.findAll('li')

		const firstLiElement = liElements.at(0)

		firstLiElement.trigger('click')

		await wrapper.vm.$nextTick()

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(1)
		expect(updateEvents![0]).toEqual(['Apple'])
	})
})
