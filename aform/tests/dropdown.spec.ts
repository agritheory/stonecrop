import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'

import ADropdown from '../src/components/form/ADropdown.vue'

describe('dropdown input component', () => {
	const dropdownData = {
		items: ['Apple', 'Orange', 'Pear', 'Kiwi', 'Grape'],
		value: 'Orange',
		label: 'Fruit',
	}

	it('emits update event when dropdown is cleared', async () => {
		const wrapper = mount(ADropdown, {
			props: { modelValue: dropdownData.value, label: dropdownData.label, items: dropdownData.items },
		})

		await wrapper.find('input').setValue('')
		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(1)
		expect(updateEvents![0]).toEqual([''])
	})

	it('emits value update event when dropdown item is selected using mouse', async () => {
		const wrapper = mount(ADropdown, {
			props: { modelValue: dropdownData.value, label: dropdownData.label, items: dropdownData.items },
		})

		await wrapper.find('input').setValue('')
		let updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(1)
		expect(updateEvents![0]).toEqual([''])

		const liElements = wrapper.findAll('li')
		const firstLiElement = liElements.at(0)
		firstLiElement!.trigger('click')
		await wrapper.vm.$nextTick()

		updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(2)
		expect(updateEvents![1]).toEqual(['Apple'])
	})

	it('emits value update event when dropdown item is selected using keys', async () => {
		const wrapper = mount(ADropdown, {
			props: { modelValue: dropdownData.value, label: dropdownData.label, items: dropdownData.items },
		})

		const input = wrapper.find('input')

		// trigger the dropdown
		await input.setValue('')
		let updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(1)
		expect(updateEvents![0]).toEqual([''])

		// arrow down to select the second item
		await input.trigger('keydown', { key: 'ArrowDown' })
		await input.trigger('keydown', { key: 'ArrowDown' })
		await input.trigger('keydown', { key: 'Enter' })

		updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(2)
		expect(updateEvents![1]).toEqual(['Orange'])

		// trigger the dropdown again
		await input.setValue('')
		updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(3)
		expect(updateEvents![2]).toEqual([''])

		// arrow down and back up to select the first item
		await input.trigger('keydown', { key: 'ArrowDown' })
		await input.trigger('keydown', { key: 'ArrowUp' })
		await input.trigger('keydown', { key: 'Enter' })

		updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(4)
		expect(updateEvents![3]).toEqual(['Apple'])
	})

	it('emits filter change event when dropdown item is selected using mouse in sync', async () => {
		const wrapper = mount(ADropdown, {
			props: { modelValue: dropdownData.value, label: dropdownData.label, items: dropdownData.items, isAsync: false },
		})

		await wrapper.find('input').setValue('')
		let valueUpdateEvents = wrapper.emitted('update:modelValue')
		expect(valueUpdateEvents).toHaveLength(1)
		expect(valueUpdateEvents![0]).toEqual([''])

		const liElements = wrapper.findAll('li')
		const firstLiElement = liElements.at(0)
		firstLiElement!.trigger('click')
		await wrapper.vm.$nextTick()

		valueUpdateEvents = wrapper.emitted('update:modelValue')
		expect(valueUpdateEvents).toHaveLength(2)
		expect(valueUpdateEvents![1]).toEqual(['Apple'])
	})

	it('emits filter change event when dropdown item is selected using mouse in async', async () => {
		const mockFilterFunction = vi.fn(search => {
			if (search === 'a') {
				return ['Apple', 'Orange', 'Pear']
			}
			return []
		})

		const wrapper = mount(ADropdown, {
			props: {
				modelValue: dropdownData.value,
				label: dropdownData.label,
				items: dropdownData.items,
				isAsync: true,
				filterFunction: mockFilterFunction,
			},
		})

		const input = wrapper.find('input')
		await input.setValue('a')
		await wrapper.vm.$nextTick()

		expect(mockFilterFunction).toHaveBeenCalledWith('a')
		expect(mockFilterFunction).toHaveBeenCalledTimes(1)

		const liElements = wrapper.findAll('li')
		expect(liElements).toHaveLength(3)
		expect(liElements.at(0)?.text()).toBe('Apple')
		expect(liElements.at(1)?.text()).toBe('Orange')
		expect(liElements.at(2)?.text()).toBe('Pear')
	})
})
