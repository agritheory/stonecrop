import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Login from '@/components/utilities/Login.vue'

describe('login component', () => {
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

		const $submitBtn = wrapper.find('.btn')
		const emailInput = wrapper.find('input[type="email"]')
		const passwordInput = wrapper.find('input[type="password"]')
		await emailInput.setValue('support@agritheory.dev')
		await passwordInput.setValue('password')
		await $submitBtn.trigger('click')

		const loginEvents = wrapper.emitted('loginSuccess')
		expect(loginEvents).toBeTruthy()
	})
})
