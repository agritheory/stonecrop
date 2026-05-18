import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import ListView from '../../src/components/ListView.vue'
import ListItem from '../../src/components/ListItem.vue'
import BeamDayDivider from '../../src/components/BeamDayDivider.vue'

describe('ListView', { tags: ['component'] }, () => {
	const mockItems = [
		{
			label: 'Item 1',
			description: 'Description 1',
		},
		{
			label: 'Item 2',
			description: 'Description 2',
		},
	]

	it('renders list of items', () => {
		const wrapper = mount(ListView, {
			props: {
				items: mockItems,
			},
			global: {
				components: { ListItem, BeamDayDivider },
			},
		})
		const listItems = wrapper.findAllComponents(ListItem)
		expect(listItems).toHaveLength(2)
	})

	it('emits update event when item is updated', async () => {
		const wrapper = mount(ListView, {
			props: {
				items: mockItems,
			},
			global: {
				components: { ListItem, BeamDayDivider },
			},
		})
		const listItem = wrapper.findComponent(ListItem)
		await listItem.vm.$emit('update', mockItems[0])
		expect(wrapper.emitted('update')).toBeTruthy()
		expect(wrapper.emitted('update')?.[0]).toEqual([mockItems[0]])
	})

	it('renders day divider when linkComponent is BeamDayDivider', () => {
		const itemsWithDivider = [
			{
				linkComponent: 'BeamDayDivider',
				date: '2024-01-01',
				label: 'Day 1',
			},
			...mockItems,
		]
		const wrapper = mount(ListView, {
			props: {
				items: itemsWithDivider,
			},
			global: {
				components: { ListItem, BeamDayDivider },
			},
		})
		expect(wrapper.findComponent(BeamDayDivider).exists()).toBe(true)
	})

	it('emits scrollbottom when scrolled to bottom', async () => {
		const wrapper = mount(ListView, {
			props: {
				items: mockItems,
			},
			global: {
				components: { ListItem, BeamDayDivider },
			},
		})

		// Mock scroll position
		Object.defineProperty(document.documentElement, 'scrollHeight', {
			writable: true,
			configurable: true,
			value: 1000,
		})
		Object.defineProperty(window, 'innerHeight', {
			writable: true,
			configurable: true,
			value: 500,
		})
		Object.defineProperty(document.documentElement, 'scrollTop', {
			writable: true,
			configurable: true,
			value: 499,
		})

		window.dispatchEvent(new Event('scroll'))
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('scrollbottom')).toBeTruthy()
	})

	it('renders with linkComponent router link', () => {
		const itemsWithLink = [
			{
				label: 'Item 1',
				description: 'Description 1',
				linkComponent: 'router-link',
				route: '/test',
			},
		]
		const wrapper = mount(ListView, {
			props: {
				items: itemsWithLink,
			},
			global: {
				components: { ListItem, BeamDayDivider },
				stubs: {
					'router-link': {
						template: '<a><slot /></a>',
					},
				},
			},
		})
		expect(wrapper.find('a').exists()).toBe(true)
	})
})
