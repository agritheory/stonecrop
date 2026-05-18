import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BeamMetadata from '../../src/components/BeamMetadata.vue'

describe('BeamMetadata', { tags: ['component'] }, () => {
	const mockOrder = {
		orderNumber: '123',
		product: 'Test Product',
		quantity: 10,
		total: 100,
		complete: false,
	}

	it('renders metadata container', () => {
		const wrapper = mount(BeamMetadata, {
			props: {
				order: mockOrder,
			},
		})
		expect(wrapper.find('.beam_metadata').exists()).toBe(true)
	})

	it('renders slot content when provided', () => {
		const wrapper = mount(BeamMetadata, {
			props: {
				order: mockOrder,
			},
			slots: {
				default: 'Metadata content',
			},
		})
		expect(wrapper.text()).toContain('Metadata content')
	})

	it('renders default content when no slot provided', () => {
		const wrapper = mount(BeamMetadata, {
			props: {
				order: mockOrder,
			},
		})
		expect(wrapper.text()).toContain('Status')
		expect(wrapper.text()).toContain('In Progress')
	})

	it('shows Complete status when order is complete', () => {
		const wrapper = mount(BeamMetadata, {
			props: {
				order: { ...mockOrder, complete: true },
			},
		})
		expect(wrapper.text()).toContain('Complete')
	})

	it('shows In Progress status when order is not complete', () => {
		const wrapper = mount(BeamMetadata, {
			props: {
				order: mockOrder,
			},
		})
		expect(wrapper.text()).toContain('In Progress')
	})

	it('applies alert class when order is not complete', () => {
		const wrapper = mount(BeamMetadata, {
			props: {
				order: mockOrder,
			},
		})
		expect(wrapper.find('.alert').exists()).toBe(true)
	})

	it('renders as div element', () => {
		const wrapper = mount(BeamMetadata, {
			props: {
				order: mockOrder,
			},
		})
		expect(wrapper.element.tagName).toBe('DIV')
	})
})
