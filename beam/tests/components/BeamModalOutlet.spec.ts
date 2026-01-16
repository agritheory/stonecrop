import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BeamModalOutlet from '../../src/components/BeamModalOutlet.vue'

describe('BeamModalOutlet', () => {
	it('renders portal target', () => {
		const wrapper = mount(BeamModalOutlet, {
			global: {
				stubs: {
					'portal-target': {
						template: '<div class="portal-target"><slot /></div>',
					},
				},
			},
		})
		expect(wrapper.find('.portal-target').exists()).toBe(true)
	})

	it('has portal-target component with name attribute', () => {
		const wrapper = mount(BeamModalOutlet, {
			global: {
				stubs: {
					'portal-target': {
						template: '<div class="portal-target" :name="name"><slot /></div>',
						props: ['name'],
					},
				},
			},
		})
		expect(wrapper.html()).toContain('beam_modal_outlet')
	})
})
