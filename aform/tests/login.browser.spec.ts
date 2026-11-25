import { afterEach, describe, expect, it } from 'vite-plus/test'
import { userEvent } from 'vite-plus/test/browser'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'

import Login from '../src/components/utilities/Login.vue'
import { loginIdentities } from '../src/login/loginIdentity'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

const mountLogin = () => {
	let reject!: () => void
	const authenticate = () =>
		new Promise<void>((_, fail) => {
			reject = () => fail(new Error('invalid credentials'))
		})
	wrapper = mount(Login, { attachTo: document.body, props: { identity: loginIdentities.username, authenticate } })
	const password = wrapper.find('input[type="password"]').element as HTMLInputElement
	return { password, rejectSignIn: async () => (reject(), await flushPromises()) }
}

describe('login in a browser', { tags: ['browser'] }, () => {
	it.each([
		['pressing Enter in the password field', async () => userEvent.keyboard('{Enter}')],
		['clicking Login', async () => userEvent.click(wrapper!.find('button[type="submit"]').element)],
	])('puts the cursor back in the password field after a wrong password sent by %s', async (_, send) => {
		const { password, rejectSignIn } = mountLogin()
		await userEvent.type(wrapper!.find('#username').element, 'tyler')
		await userEvent.type(password, 'wrong')
		await send()
		await flushPromises()
		expect(password.disabled).toBe(true)

		await rejectSignIn()
		await userEvent.keyboard('password')

		expect(password.value).toBe('password')
	})
})
