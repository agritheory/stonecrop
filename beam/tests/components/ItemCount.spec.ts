import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import ItemCount from '../../src/components/ItemCount.vue'

describe('ItemCount', { tags: ['component'] }, () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	it('renders count value', () => {
		const wrapper = mount(ItemCount, {
			props: {
				modelValue: 5,
			},
		})
		expect(wrapper.text()).toContain('5')
	})

	it('renders count with denominator', () => {
		const wrapper = mount(ItemCount, {
			props: {
				modelValue: 5,
				denominator: 10,
			},
		})
		expect(wrapper.text()).toContain('5')
		expect(wrapper.text()).toContain('/10')
	})

	it('renders count with unit of measure', () => {
		const wrapper = mount(ItemCount, {
			props: {
				modelValue: 5,
				uom: 'kg',
			},
		})
		expect(wrapper.text()).toContain('5')
		expect(wrapper.text()).toContain('kg')
	})

	it('applies alert class when count is incomplete', () => {
		const wrapper = mount(ItemCount, {
			props: {
				modelValue: 5,
				denominator: 10,
			},
		})
		expect(wrapper.find('.beam--alert').exists()).toBe(true)
	})

	it('does not apply alert class when count is complete', () => {
		const wrapper = mount(ItemCount, {
			props: {
				modelValue: 10,
				denominator: 10,
			},
		})
		expect(wrapper.find('.beam--alert').exists()).toBe(false)
	})

	it('makes count editable by default', () => {
		const wrapper = mount(ItemCount, {
			props: {
				modelValue: 5,
			},
		})
		const span = wrapper.find('.beam_item-count span')
		expect(span.attributes('contenteditable')).toBe('true')
	})

	it('respects editable prop', () => {
		const wrapper = mount(ItemCount, {
			props: {
				modelValue: 5,
				editable: false,
			},
		})
		const span = wrapper.find('.beam_item-count span')
		expect(span.attributes('contenteditable')).toBe('false')
	})

	it('validates and caps value at denominator', async () => {
		const wrapper = mount(ItemCount, {
			props: {
				modelValue: 5,
				denominator: 10,
			},
		})
		const span = wrapper.find('.beam_item-count span')
		const element = span.element as HTMLElement
		element.innerHTML = '15'
		await span.trigger('click')
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
	})
})
