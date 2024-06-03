import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import CollapseButton from '@/components/base/CollapseButton.vue'

describe('numeric input component', () => {
	it('apply specific class based on collapsed input', async () => {
		const wrapper = mount(CollapseButton, {
			props: { collapsed: true },
		})

		const button = wrapper.find('button')
		expect(button.classes()).toContain('rotated')

		await wrapper.setProps({ collapsed: false })
		expect(button.classes()).toContain('unrotated')
	})
})
