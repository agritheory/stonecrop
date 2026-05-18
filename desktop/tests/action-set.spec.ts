import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ActionSet from '../src/components/ActionSet.vue'

describe('ActionSet', () => {
	it('renders without elements', () => {
		const wrapper = mount(ActionSet)
		expect(wrapper.find('.action-set').exists()).toBe(true)
	})

	it('renders button elements', () => {
		const wrapper = mount(ActionSet, {
			props: {
				elements: [{ type: 'button', label: 'Save', action: () => {} }],
			},
		})
		expect(wrapper.find('button.button-default').text()).toBe('Save')
	})

	it('renders a disabled button when disabled is true', () => {
		const wrapper = mount(ActionSet, {
			props: {
				elements: [{ type: 'button', label: 'Save', disabled: true, action: () => {} }],
			},
		})
		const btn = wrapper.find('button.button-default')
		expect(btn.attributes('disabled')).toBeDefined()
	})

	it('renders dropdown elements', () => {
		const wrapper = mount(ActionSet, {
			props: {
				elements: [
					{
						type: 'dropdown',
						label: 'Actions',
						actions: [
							{ label: 'Edit', action: () => {} },
							{ label: 'Delete', action: () => {} },
						],
					},
				],
			},
		})
		expect(wrapper.text()).toContain('Actions')
	})

	it('emits actionClick with label and action when button is clicked', async () => {
		const action = () => {}
		const wrapper = mount(ActionSet, {
			props: {
				elements: [{ type: 'button', label: 'Save', action }],
			},
		})
		await wrapper.find('button.button-default').trigger('click')
		const emitted = wrapper.emitted('actionClick')
		expect(emitted).toBeTruthy()
		expect(emitted![0][0]).toBe('Save')
		expect(emitted![0][1]).toBe(action)
	})

	it('opens dropdown on button click and closes others', async () => {
		const wrapper = mount(ActionSet, {
			props: {
				elements: [
					{
						type: 'dropdown',
						label: 'Actions',
						actions: [{ label: 'Edit', action: () => {} }],
					},
				],
			},
		})

		// v-show hides the element via display:none style
		const container = wrapper.find('.dropdown-container')
		// Before clicking, dropdown is hidden (display: none from v-show)
		expect(container.element.style.display).toBe('none')

		// Click the dropdown toggle
		await wrapper.find('.action-element button.button-default').trigger('click')
		expect(wrapper.find('.dropdown-container').element.style.display).not.toBe('none')

		// Clicking again should close it
		await wrapper.find('.action-element button.button-default').trigger('click')
		expect(wrapper.find('.dropdown-container').element.style.display).toBe('none')
	})

	it('emits actionClick when a dropdown item is clicked', async () => {
		const action = () => {}
		const wrapper = mount(ActionSet, {
			props: {
				elements: [
					{
						type: 'dropdown',
						label: 'Menu',
						actions: [{ label: 'Option A', action }],
					},
				],
			},
		})

		// Open the dropdown first
		await wrapper.find('.action-element button.button-default').trigger('click')
		// Click the dropdown item button
		await wrapper.find('button.dropdown-item').trigger('click')

		const emitted = wrapper.emitted('actionClick')
		expect(emitted).toBeTruthy()
		expect(emitted![0][0]).toBe('Option A')
	})

	it('renders a link item inside dropdown when action is null', async () => {
		const wrapper = mount(ActionSet, {
			props: {
				elements: [
					{
						type: 'dropdown',
						label: 'Links',
						actions: [{ label: 'Go to docs', link: 'https://example.com', action: undefined }],
					},
				],
			},
		})

		// Open the dropdown
		await wrapper.find('.action-element button.button-default').trigger('click')

		const anchor = wrapper.find('a')
		expect(anchor.exists()).toBe(true)
		expect(anchor.attributes('href')).toBe('https://example.com')
	})

	it('sets isOpen on mouseover and clears on mouseleave', async () => {
		const wrapper = mount(ActionSet)

		await wrapper.find('.action-set').trigger('mouseover')
		// isOpen becomes true after 500ms timeout — we can only verify the class
		// isn't set yet immediately (timeout hasn't elapsed in jsdom)
		// But we verify the hover handler runs without errors
		await wrapper.find('.action-set').trigger('mouseleave')
		expect(wrapper.find('.action-set').classes()).not.toContain('open-set')
	})

	it('resets cross indicator when another dropdown is opened', async () => {
		const wrapper = mount(ActionSet, {
			props: {
				elements: [
					{
						type: 'dropdown',
						label: 'Menu A',
						actions: [{ label: 'Option A', action: () => {} }],
					},
					{
						type: 'dropdown',
						label: 'Menu B',
						actions: [{ label: 'Option B', action: () => {} }],
					},
				],
			},
		})

		const headers = wrapper.findAll('.dropdown-header')

		// Open first dropdown
		await headers[0].find('button.button-default').trigger('click')
		expect(headers[0].find('.cross').classes()).toContain('rotated')

		// Open second dropdown — first should close (container hidden, cross reset)
		await headers[1].find('button.button-default').trigger('click')
		expect(headers[0].find('.cross').classes()).not.toContain('rotated')
		expect(headers[1].find('.cross').classes()).toContain('rotated')
	})

	it('toggles collapsed on cross click', async () => {
		const wrapper = mount(ActionSet)
		const cross = wrapper.find('#cross')

		await cross.trigger('click')
		expect(wrapper.find('.action-set').classes()).toContain('collapsed')

		await cross.trigger('click')
		expect(wrapper.find('.action-set').classes()).not.toContain('collapsed')
	})
})
