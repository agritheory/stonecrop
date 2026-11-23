import { describe, it, expect, vi } from 'vite-plus/test'
import { mount, flushPromises } from '@vue/test-utils'

import { useLoginPreset } from '../src/composables/useLoginPreset'
import { loginIdentities } from '../src/login/loginIdentity'
import Login from '../src/components/utilities/Login.vue'

function mountLogin(
	props: Partial<{
		identity: (typeof loginIdentities)[keyof typeof loginIdentities]
		authenticate: (identity: string, password: string) => Promise<void>
		headerSubtitle: string
	}> = {},
	slots?: Record<string, string>
) {
	const authenticate = props.authenticate ?? vi.fn().mockResolvedValue(undefined)
	return mount(Login, {
		props: {
			identity: loginIdentities.email,
			authenticate,
			...props,
		},
		slots,
	})
}

describe('login component', { tags: ['component'] }, () => {
	it('renders header copy from props', async () => {
		const wrapper = mountLogin({ headerSubtitle: 'Sign in' })
		await wrapper.vm.$nextTick()

		expect(wrapper.find('#account-title').text()).toBe('Login')
		expect(wrapper.find('#account-subtitle').text()).toBe('Sign in')
	})

	it('login button should be disabled by default', async () => {
		const wrapper = mountLogin()
		await wrapper.vm.$nextTick()

		const $submitBtn = wrapper.find('button[type="submit"]')
		expect($submitBtn.attributes()).toHaveProperty('disabled')
	})

	it('email preset wires identity field attributes', () => {
		const wrapper = mountLogin()
		const identityInput = wrapper.find(`#${loginIdentities.email.name}`)

		expect(identityInput.attributes('type')).toBe('email')
		expect(identityInput.attributes('autocomplete')).toBe('email')
		expect(wrapper.find(`label[for="${loginIdentities.email.name}"]`).text()).toBe('Email')
	})

	it('username preset wires identity field attributes', () => {
		const wrapper = mountLogin({ identity: loginIdentities.username })
		const identityInput = wrapper.find(`#${loginIdentities.username.name}`)

		expect(identityInput.attributes('type')).toBe('text')
		expect(identityInput.attributes('autocomplete')).toBe('username')
		expect(wrapper.find(`label[for="${loginIdentities.username.name}"]`).text()).toBe('Username')
	})

	it('emits loginSuccess when authenticate resolves', async () => {
		const authenticate = vi.fn().mockResolvedValue(undefined)
		const wrapper = mountLogin({ authenticate })

		await wrapper.find(`#${loginIdentities.email.name}`).setValue('support@agritheory.dev')
		await wrapper.find('input[type="password"]').setValue('password')
		await wrapper.find('form').trigger('submit')
		await flushPromises()

		expect(authenticate).toHaveBeenCalledWith('support@agritheory.dev', 'password')
		expect(wrapper.emitted('loginSuccess')).toHaveLength(1)
		expect(wrapper.emitted('loginFailed')).toBeFalsy()
	})

	it('emits loginFailed when authenticate rejects', async () => {
		const authenticate = vi.fn().mockRejectedValue(new Error('invalid credentials'))
		const wrapper = mountLogin({ authenticate })

		await wrapper.find(`#${loginIdentities.email.name}`).setValue('a@b.c')
		await wrapper.find('input[type="password"]').setValue('wrong')
		await wrapper.find('form').trigger('submit')
		await flushPromises()

		expect(wrapper.emitted('loginFailed')).toHaveLength(1)
		expect(wrapper.emitted('loginSuccess')).toBeFalsy()
		const submitBtn = wrapper.find('button[type="submit"]')
		expect(submitBtn.attributes('disabled')).toBeUndefined()
	})

	it('shows loading while authenticate is in flight', async () => {
		let resolveAuth!: () => void
		const authenticate = vi.fn(
			() =>
				new Promise<void>(resolve => {
					resolveAuth = resolve
				})
		)
		const wrapper = mountLogin({ authenticate })

		await wrapper.find(`#${loginIdentities.email.name}`).setValue('a@b.c')
		await wrapper.find('input[type="password"]').setValue('secret')
		await wrapper.find('form').trigger('submit')
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.loading-icon').exists()).toBe(true)
		expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()

		resolveAuth()
		await flushPromises()

		expect(wrapper.find('.loading-icon').exists()).toBe(false)
	})

	it('renders alternateSignIn slot content', () => {
		const wrapper = mountLogin(
			{},
			{
				alternateSignIn: '<button type="button" id="sso-btn" class="btn">Sign in with SSO</button>',
			}
		)

		expect(wrapper.find('#sso-btn').exists()).toBe(true)
	})

	it('alternateSignIn control does not submit the password form', async () => {
		const authenticate = vi.fn().mockResolvedValue(undefined)
		const wrapper = mountLogin(
			{ authenticate },
			{
				alternateSignIn: '<button type="button" id="sso-btn" class="btn">Sign in with SSO</button>',
			}
		)

		await wrapper.find(`#${loginIdentities.email.name}`).setValue('a@b.c')
		await wrapper.find('input[type="password"]').setValue('secret')
		await wrapper.find('#sso-btn').trigger('click')
		await flushPromises()

		expect(authenticate).not.toHaveBeenCalled()
		expect(wrapper.emitted('loginSuccess')).toBeFalsy()
	})

	it('useLoginPreset returns identity and subtitle for username', () => {
		expect(useLoginPreset('username')).toEqual({
			identity: loginIdentities.username,
			headerSubtitle: 'Enter your username and password to login',
		})
	})
})
