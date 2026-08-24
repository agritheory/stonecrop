import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ExpandButton from '../src/components/base/ExpandButton.vue'

describe('ExpandButton', { tags: ['component'] }, () => {
	it('exposes aria-expanded and the ATable expand symbols', async () => {
		const wrapper = mount(ExpandButton, {
			props: { expanded: false },
		})

		const button = wrapper.find('button')
		expect(button.attributes('aria-expanded')).toBe('false')
		expect(button.text()).toBe('►')

		await wrapper.setProps({ expanded: true })
		expect(button.attributes('aria-expanded')).toBe('true')
		expect(button.text()).toBe('▼')
	})
})
