import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ACheckbox from '@/components/form/ACheckbox.vue'

describe('checkbox component', () => {
	let wrapper = mount(ACheckbox, {
		props: { value: false },
	})

	it('emits checkbox value when changed', async () => {
		await wrapper.find('input').setValue(true)
		await wrapper.find('input').setValue(false)

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(2)
		expect(updateEvents![0]).toEqual([true])
		expect(updateEvents![1]).toEqual([false])
	})
})
