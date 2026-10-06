import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import AForm from '../src/components/AForm.vue'
import ADropdown from '../src/components/form/ADropdown.vue'
import AQuantityInput from '../src/components/form/AQuantityInput.vue'
import type { ResolvedField } from '../src/types'

describe('dropdown input component', { tags: ['component'] }, () => {
	const dropdownData = {
		options: ['Apple', 'Orange', 'Pear', 'Kiwi', 'Grape'],
		value: 'Orange',
		label: 'Fruit',
	}

	it('emits update event when dropdown is cleared', async () => {
		const wrapper = mount(ADropdown, {
			props: { modelValue: dropdownData.value, label: dropdownData.label, options: dropdownData.options },
		})

		await wrapper.find('input').setValue('')
		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(1)
		expect(updateEvents![0]).toEqual([''])
	})

	it('emits value update event when dropdown item is selected using mouse', async () => {
		const wrapper = mount(ADropdown, {
			props: { modelValue: dropdownData.value, label: dropdownData.label, options: dropdownData.options },
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
		await firstLiElement!.trigger('mousedown')
		await wrapper.vm.$nextTick()

		updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(2)
		expect(updateEvents![1]).toEqual(['Apple'])
	})

	it('emits value update event when dropdown item is selected using keys', async () => {
		const wrapper = mount(ADropdown, {
			props: { modelValue: dropdownData.value, label: dropdownData.label, options: dropdownData.options },
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
			props: {
				modelValue: dropdownData.value,
				label: dropdownData.label,
				options: dropdownData.options,
				isAsync: false,
			},
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
		await firstLiElement!.trigger('mousedown')
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
				options: dropdownData.options,
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
				options: dropdownData.options,
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
				options: dropdownData.options,
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

		// Text that is not a choice is a search, never a value
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})

	it('outside-click reverts to last committed value instead of clearing', async () => {
		const wrapper = mount(ADropdown, {
			props: {
				modelValue: 'Orange',
				label: dropdownData.label,
				options: dropdownData.options,
			},
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		// type something that is not a valid option
		await input.setValue('Xyz')
		await wrapper.vm.$nextTick()

		// Escape is wired to onClickOutside → closeDropdown with no result
		await input.trigger('keydown.esc')
		await wrapper.vm.$nextTick()

		// should revert to the last committed value ('Orange'), not clear to '', and never send the text typed
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		expect(input.element.value).toBe('Orange')
	})

	it('should handle selectPrevResult when at first item', async () => {
		const wrapper = mount(ADropdown, {
			props: {
				modelValue: dropdownData.value,
				label: dropdownData.label,
				options: dropdownData.options,
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
				options: dropdownData.options,
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
				options: dropdownData.options,
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
				options: dropdownData.options,
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

	it('pressing up with no selection jumps to last item', async () => {
		const wrapper = mount(ADropdown, {
			props: { modelValue: '', label: dropdownData.label, options: dropdownData.options },
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('')
		await flushPromises()
		await wrapper.vm.$nextTick()

		// activeItemIndex is null; pressing Up should set it to last index
		await input.trigger('keydown.up')
		await input.trigger('keydown.enter')
		await wrapper.vm.$nextTick()

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toBeTruthy()
		// last item in ['Apple', 'Orange', 'Pear', 'Kiwi', 'Grape'] is 'Grape'
		const lastEvent = updateEvents![updateEvents!.length - 1]
		expect(lastEvent).toEqual(['Grape'])
	})

	it('renders in display mode as text without input', () => {
		const wrapper = mount(ADropdown, {
			props: { modelValue: 'Apple', label: dropdownData.label, options: dropdownData.options, mode: 'display' },
		})
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').text()).toBe('Apple')
	})

	it('selectPrevResult decrements index when currentIndex > 0', async () => {
		const wrapper = mount(ADropdown, {
			props: { modelValue: '', label: dropdownData.label, options: dropdownData.options },
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('')
		await flushPromises()
		await wrapper.vm.$nextTick()

		await input.trigger('keydown.down')
		await input.trigger('keydown.down')
		await input.trigger('keydown.up')
		await input.trigger('keydown.enter')
		await wrapper.vm.$nextTick()

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toBeTruthy()
		const lastEvent = updateEvents![updateEvents!.length - 1]
		expect(lastEvent).toEqual(['Apple'])
	})

	it('exposes combobox semantics tying the input to its listbox', async () => {
		const wrapper = mount(ADropdown, {
			props: { uuid: 'fruit', modelValue: 'Orange', label: 'Fruit', options: dropdownData.options },
		})
		const input = wrapper.find('input')

		expect(input.attributes('role')).toBe('combobox')
		expect(input.attributes('aria-expanded')).toBe('false')
		expect(input.attributes('for')).toBeUndefined()

		await input.trigger('focus')
		await flushPromises()

		expect(input.attributes('aria-expanded')).toBe('true')
		const list = wrapper.find('ul[role="listbox"]')
		expect(input.attributes('aria-controls')).toBe(list.attributes('id'))
		expect(wrapper.findAll('li[role="option"]')).toHaveLength(dropdownData.options.length)
		expect(wrapper.find('label').attributes('for')).toBe('fruit')
	})
})

describe('a dropdown in a form', { tags: ['component'] }, () => {
	// The record holds one of the field's choices. Text typed to find one is a search, and reaches the record only as
	// the choice it picks.
	it('sends the record the choice picked, not the text typed to find it', async () => {
		const status = {
			kind: 'field',
			fieldname: 'status',
			label: 'Status',
			component: 'ADropdown',
			options: ['Open', 'Pending', 'Closed'],
		} as ResolvedField
		const wrapper = mount(AForm, {
			props: { schema: [status], data: { status: 'Open' } },
			global: { components: { ADropdown } },
		})
		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('Pend')
		await input.trigger('keydown', { key: 'Enter' })
		await flushPromises()

		const sent = (wrapper.emitted('update:data') ?? []).map(([data]) => (data as { status?: string }).status)
		expect(sent).toEqual(['Pending'])
	})
})

// `aria-controls` names the open list by its id, so that id must belong to the list alone. The field's own box
// already carries the field's id.
describe('dropdown list ids', { tags: ['component'] }, () => {
	it("gives a dropdown's list an id that names only the list", async () => {
		const wrapper = mount(ADropdown, {
			props: { uuid: 'fruit', modelValue: 'Orange', label: 'Fruit', options: ['Apple', 'Orange'] },
		})
		const input = wrapper.find('input')
		await input.trigger('focus')
		await flushPromises()

		const controlled = input.attributes('aria-controls')
		expect(wrapper.findAll(`[id="${controlled}"]`).map(element => element.element.tagName)).toEqual(['UL'])
	})

	it("gives a quantity field's unit list an id that names only the list", async () => {
		const wrapper = mount(AQuantityInput, {
			props: { uuid: 'qty', modelValue: null, label: 'Qty', options: { uoms: ['Nos', 'Box'] } },
		})
		const button = wrapper.find('button.aform_dropdown-button')
		await button.trigger('click')
		await flushPromises()

		const controlled = button.attributes('aria-controls')
		expect(wrapper.findAll(`[id="${controlled}"]`).map(element => element.element.tagName)).toEqual(['UL'])
	})

	// A field given no id has none to build on, so two of them on one form must not share one.
	it('gives two quantity fields without an id their own unit lists', async () => {
		const options = { uoms: ['Nos', 'Box'] }
		const wrapper = mount(
			defineComponent({
				setup: () => () =>
					h('div', [
						h(AQuantityInput, { label: 'Ordered', options }),
						h(AQuantityInput, { label: 'Received', options }),
					]),
			})
		)
		const ids = wrapper.findAll('[id]').map(element => element.attributes('id'))

		expect(ids).toEqual([...new Set(ids)])
	})
})
