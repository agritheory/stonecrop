import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ListItem from '../../src/components/ListItem.vue'
import ItemCheck from '../../src/components/ItemCheck.vue'
import ItemCount from '../../src/components/ItemCount.vue'

describe('ListItem', { tags: ['component'] }, () => {
	it('renders label', () => {
		const wrapper = mount(ListItem, {
			props: {
				item: {
					label: 'Test Label',
					description: 'Test Description',
				},
			},
			global: {
				components: { ItemCheck, ItemCount },
			},
		})
		expect(wrapper.text()).toContain('Test Label')
	})

	it('renders description', () => {
		const wrapper = mount(ListItem, {
			props: {
				item: {
					label: 'Test Label',
					description: 'Test Description',
				},
			},
			global: {
				components: { ItemCheck, ItemCount },
			},
		})
		expect(wrapper.text()).toContain('Test Description')
	})

	it('renders ItemCheck when checked property exists', () => {
		const wrapper = mount(ListItem, {
			props: {
				item: {
					label: 'Test Label',
					description: 'Test Description',
					checked: false,
				},
			},
			global: {
				components: { ItemCheck, ItemCount },
			},
		})
		expect(wrapper.findComponent(ItemCheck).exists()).toBe(true)
	})

	it('renders ItemCount when count property exists', () => {
		const wrapper = mount(ListItem, {
			props: {
				item: {
					label: 'Test Label',
					description: 'Test Description',
					count: {
						count: 5,
						of: 10,
						uom: 'kg',
					},
				},
			},
			global: {
				components: { ItemCheck, ItemCount },
			},
		})
		expect(wrapper.findComponent(ItemCount).exists()).toBe(true)
	})

	it('emits update event when item changes', async () => {
		const wrapper = mount(ListItem, {
			props: {
				item: {
					label: 'Test Label',
					description: 'Test Description',
					checked: false,
				},
			},
			global: {
				components: { ItemCheck, ItemCount },
			},
		})
		const itemCheck = wrapper.findComponent(ItemCheck)
		await itemCheck.vm.$emit('update:modelValue', true)
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update')).toBeTruthy()
	})

	it('applies correct classes to list item', () => {
		const wrapper = mount(ListItem, {
			props: {
				item: {
					label: 'Test Label',
					description: 'Test Description',
				},
			},
			global: {
				components: { ItemCheck, ItemCount },
			},
		})
		expect(wrapper.find('.beam_list-item').exists()).toBe(true)
	})
})
