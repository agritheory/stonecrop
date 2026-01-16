import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Confirm from '../../src/components/Confirm.vue'
import BeamBtn from '../../src/components/BeamBtn.vue'

describe('Confirm', () => {
	it('renders confirmation message', () => {
		const wrapper = mount(Confirm, {
			global: {
				components: { BeamBtn },
			},
		})
		expect(wrapper.text()).toContain('Would you like to continue?')
	})

	it('renders two buttons', () => {
		const wrapper = mount(Confirm, {
			global: {
				components: { BeamBtn },
			},
		})
		const buttons = wrapper.findAllComponents(BeamBtn)
		expect(buttons).toHaveLength(2)
	})

	it('emits confirmmodal when Yes button is clicked', async () => {
		const wrapper = mount(Confirm, {
			global: {
				components: { BeamBtn },
			},
		})
		const buttons = wrapper.findAllComponents(BeamBtn)
		await buttons[0].trigger('click')
		expect(wrapper.emitted('confirmmodal')).toBeTruthy()
	})

	it('emits confirmmodal when No button is clicked', async () => {
		const wrapper = mount(Confirm, {
			global: {
				components: { BeamBtn },
			},
		})
		const buttons = wrapper.findAllComponents(BeamBtn)
		await buttons[1].trigger('click')
		expect(wrapper.emitted('confirmmodal')).toBeTruthy()
	})
})
