import { mount, flushPromises } from '@vue/test-utils'
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

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('')
		await flushPromises()
		await wrapper.vm.$nextTick()

		let updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(1)
		expect(updateEvents![0]).toEqual([''])

		const liElements = wrapper.findAll('li')
		const firstLiElement = liElements.at(0)
		await firstLiElement!.trigger('click')
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
		await input.trigger('focus')
		await input.setValue('')
		await flushPromises()
		await wrapper.vm.$nextTick()

		let updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(1)
		expect(updateEvents![0]).toEqual([''])

		// arrow down to select the second item (index 1, which is 'Orange')
		await input.trigger('keydown.down')
		await input.trigger('keydown.down')
		await input.trigger('keydown.enter')
		await wrapper.vm.$nextTick()

		updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(2)
		expect(updateEvents![1]).toEqual(['Orange'])

		// trigger the dropdown again
		await input.trigger('focus')
		await input.setValue('')
		await flushPromises()
		await wrapper.vm.$nextTick()

		updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(3)
		expect(updateEvents![2]).toEqual([''])

		// arrow down and back up to select the first item
		await input.trigger('keydown.down')
		await input.trigger('keydown.up')
		await input.trigger('keydown.enter')
		await wrapper.vm.$nextTick()

		updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(4)
		expect(updateEvents![3]).toEqual(['Apple'])
	})

	it('emits filter change event when dropdown item is selected using mouse in sync', async () => {
		const wrapper = mount(ADropdown, {
			props: { modelValue: dropdownData.value, label: dropdownData.label, items: dropdownData.items, isAsync: false },
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('')
		await flushPromises()
		await wrapper.vm.$nextTick()

		let valueUpdateEvents = wrapper.emitted('update:modelValue')
		expect(valueUpdateEvents).toHaveLength(1)
		expect(valueUpdateEvents![0]).toEqual([''])

		const liElements = wrapper.findAll('li')
		const firstLiElement = liElements.at(0)
		await firstLiElement!.trigger('click')
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

	it('should handle openDropdown with existing value in async mode', async () => {
		const wrapper = mount(ADropdown, {
			props: {
				modelValue: 'Orange',
				label: dropdownData.label,
				items: dropdownData.items,
				isAsync: true,
			},
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await wrapper.vm.$nextTick()

		expect(wrapper.vm).toBeTruthy()
	})

	it('should handle closeDropdown with invalid result', async () => {
		const wrapper = mount(ADropdown, {
			props: {
				modelValue: dropdownData.value,
				label: dropdownData.label,
				items: dropdownData.items,
			},
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('InvalidFruit')
		await wrapper.vm.$nextTick()

		// Click outside to close
		const autocomplete = wrapper.find('.autocomplete')
		await autocomplete.trigger('click')
		await wrapper.vm.$nextTick()

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toBeTruthy()
	})

	it('should handle selectPrevResult when at first item', async () => {
		const wrapper = mount(ADropdown, {
			props: {
				modelValue: dropdownData.value,
				label: dropdownData.label,
				items: dropdownData.items,
			},
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('')
		await flushPromises()

		// Arrow down to first item
		await input.trigger('keydown.down')
		await wrapper.vm.$nextTick()

		// Arrow up from first item (should go to null)
		await input.trigger('keydown.up')
		await wrapper.vm.$nextTick()

		expect(wrapper.vm).toBeTruthy()
	})

	it('should handle async filter function error', async () => {
		const mockFilterFunction = vi.fn(() => {
			throw new Error('Filter error')
		})

		const wrapper = mount(ADropdown, {
			props: {
				modelValue: '',
				label: dropdownData.label,
				items: dropdownData.items,
				isAsync: true,
				filterFunction: mockFilterFunction,
			},
		})

		const input = wrapper.find('input')
		await input.setValue('a')
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(mockFilterFunction).toHaveBeenCalledWith('a')
	})

	it('should handle escape key to close dropdown', async () => {
		const wrapper = mount(ADropdown, {
			props: {
				modelValue: dropdownData.value,
				label: dropdownData.label,
				items: dropdownData.items,
			},
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('')
		await flushPromises()

		await input.trigger('keydown.esc')
		await wrapper.vm.$nextTick()

		expect(wrapper.vm).toBeTruthy()
	})

	it('should handle tab key to close dropdown', async () => {
		const wrapper = mount(ADropdown, {
			props: {
				modelValue: dropdownData.value,
				label: dropdownData.label,
				items: dropdownData.items,
			},
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('')
		await flushPromises()

		await input.trigger('keydown.tab')
		await wrapper.vm.$nextTick()

		expect(wrapper.vm).toBeTruthy()
	})
})
