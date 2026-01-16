import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ActionFooter from '../../src/components/ActionFooter.vue'
import BeamBtn from '../../src/components/BeamBtn.vue'

describe('ActionFooter', () => {
	it('renders footer element', () => {
		const wrapper = mount(ActionFooter, {
			slots: {
				default: 'Footer content',
			},
			global: {
				components: { BeamBtn },
			},
		})
		expect(wrapper.find('footer').exists()).toBe(true)
	})

	it('renders slot content', () => {
		const wrapper = mount(ActionFooter, {
			slots: {
				default: 'Footer content',
			},
			global: {
				components: { BeamBtn },
			},
		})
		expect(wrapper.text()).toContain('Footer content')
	})

	it('emits click event when button is clicked', async () => {
		const wrapper = mount(ActionFooter, {
			slots: {
				default: 'Footer content',
			},
			global: {
				components: { BeamBtn },
			},
		})
		await wrapper.findComponent(BeamBtn).trigger('click')
		expect(wrapper.emitted('click')).toBeTruthy()
	})

	it('applies correct class', () => {
		const wrapper = mount(ActionFooter, {
			slots: {
				default: 'Footer content',
			},
			global: {
				components: { BeamBtn },
			},
		})
		expect(wrapper.find('footer').classes()).toContain('beam_action-footer')
	})

	it('contains footer action wrapper', () => {
		const wrapper = mount(ActionFooter, {
			slots: {
				default: 'Footer content',
			},
			global: {
				components: { BeamBtn },
			},
		})
		expect(wrapper.find('.footer-action-wrapper').exists()).toBe(true)
	})
})
