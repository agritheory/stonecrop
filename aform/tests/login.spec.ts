import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Login from '../src/components/utilities/Login.vue'

describe('login component', { tags: ['component'] }, () => {
	it('mount the login component', async () => {
		const wrapper = mount(Login)
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.headerTitle).toBeTruthy()
		expect(wrapper.vm.headerSubtitle).toBeTruthy()
	})

	it('login button should be disabled by default', async () => {
		const wrapper = mount(Login)
		await wrapper.vm.$nextTick()

		const $submitBtn = wrapper.find('.btn')
		expect($submitBtn.attributes()).toHaveProperty('disabled')
	})

	it('emits login success event when form is submitted', async () => {
		const wrapper = mount(Login)
		await wrapper.vm.$nextTick()

		const $submitBtn = wrapper.find('button[type="submit"]')
		const emailInput = wrapper.find('input[type="email"]')
		const passwordInput = wrapper.find('input[type="password"]')
		await emailInput.setValue('support@agritheory.dev')
		await passwordInput.setValue('password')
		await $submitBtn.trigger('click')

		const loginEvents = wrapper.emitted('loginSuccess')
		expect(loginEvents).toBeTruthy()
	})

	it('uses platform autocomplete attributes on email and password', () => {
		const wrapper = mount(Login)
		expect(wrapper.find('input[type="email"]').attributes('autocomplete')).toBe('email')
		expect(wrapper.find('input[type="password"]').attributes('autocomplete')).toBe('current-password')
	})

	it('does not submit the form from the forgot-password button', async () => {
		const wrapper = mount(Login)
		await wrapper.find('input[type="email"]').setValue('a@b.c')
		await wrapper.find('input[type="password"]').setValue('secret')
		await wrapper.find('button[type="button"]').trigger('click')
		expect(wrapper.emitted('loginSuccess')).toBeFalsy()
	})
})
