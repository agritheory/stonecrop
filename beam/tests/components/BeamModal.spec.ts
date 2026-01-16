import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import BeamModal from '../../src/components/BeamModal.vue'
import BeamBtn from '../../src/components/BeamBtn.vue'

describe('BeamModal', () => {
	it('renders when showModal is true', () => {
		const wrapper = mount(BeamModal, {
			props: {
				showModal: true,
			},
			global: {
				components: { BeamBtn },
				stubs: {
					portal: {
						template: '<div><slot /></div>',
					},
				},
			},
		})
		expect(wrapper.find('.beam_modal').isVisible()).toBe(true)
	})

	it('hides when showModal is false', () => {
		const wrapper = mount(BeamModal, {
			props: {
				showModal: false,
			},
			global: {
				components: { BeamBtn },
				stubs: {
					portal: {
						template: '<div><slot /></div>',
					},
				},
			},
		})
		expect(wrapper.find('.beam_modal').isVisible()).toBe(false)
	})

	it('emits closemodal when close button is clicked', async () => {
		const wrapper = mount(BeamModal, {
			props: {
				showModal: true,
			},
			global: {
				components: { BeamBtn },
				stubs: {
					portal: {
						template: '<div><slot /></div>',
					},
				},
			},
		})
		await wrapper.findComponent(BeamBtn).trigger('click')
		expect(wrapper.emitted('closemodal')).toBeTruthy()
	})

	it('renders slot content', () => {
		const wrapper = mount(BeamModal, {
			props: {
				showModal: true,
			},
			slots: {
				default: '<div class="test-content">Modal Content</div>',
			},
			global: {
				components: { BeamBtn },
				stubs: {
					portal: {
						template: '<div><slot /></div>',
					},
				},
			},
		})
		expect(wrapper.find('.test-content').exists()).toBe(true)
		expect(wrapper.find('.test-content').text()).toBe('Modal Content')
	})
})
