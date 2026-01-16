import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Navbar from '../../src/components/Navbar.vue'
import BeamBtn from '../../src/components/BeamBtn.vue'
import BeamHeading from '../../src/components/BeamHeading.vue'

describe('Navbar', () => {
	it('renders nav element', () => {
		const wrapper = mount(Navbar, {
			global: {
				components: { BeamBtn, BeamHeading },
			},
		})
		expect(wrapper.find('nav').exists()).toBe(true)
	})

	it('renders default title when no slot provided', () => {
		const wrapper = mount(Navbar, {
			global: {
				components: { BeamBtn, BeamHeading },
			},
		})
		expect(wrapper.text()).toContain('TITLE')
	})

	it('renders custom title slot', () => {
		const wrapper = mount(Navbar, {
			slots: {
				title: 'My App',
			},
			global: {
				components: { BeamBtn, BeamHeading },
			},
		})
		expect(wrapper.text()).toContain('My App')
	})

	it('renders default action button text', () => {
		const wrapper = mount(Navbar, {
			global: {
				components: { BeamBtn, BeamHeading },
			},
		})
		expect(wrapper.text()).toContain('Action')
	})

	it('renders custom action slot', () => {
		const wrapper = mount(Navbar, {
			slots: {
				navbaraction: 'Custom Action',
			},
			global: {
				components: { BeamBtn, BeamHeading },
			},
		})
		expect(wrapper.text()).toContain('Custom Action')
	})

	it('emits click event when button is clicked', async () => {
		const wrapper = mount(Navbar, {
			global: {
				components: { BeamBtn, BeamHeading },
			},
		})
		await wrapper.findComponent(BeamBtn).trigger('click')
		expect(wrapper.emitted('click')).toBeTruthy()
	})

	it('applies correct classes', () => {
		const wrapper = mount(Navbar, {
			global: {
				components: { BeamBtn, BeamHeading },
			},
		})
		expect(wrapper.find('.beam_navbar').exists()).toBe(true)
	})
})
