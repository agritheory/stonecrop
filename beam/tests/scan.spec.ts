import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import ScanInput from '@/components/ScanInput.vue'

describe('scan input component', () => {
	it('call scan handler prop function when barcode scanner is used', async () => {
		const wrapper = mount(ScanInput, {
			props: {
				scanHandler: vi.fn(),
			},
		})

		// test that the onscan.js instance is created
		expect(wrapper.emitted()).toHaveProperty('scanInstance')
		const instanceEvent = wrapper.emitted('scanInstance')
		expect(instanceEvent).toHaveLength(1)

		// simulate a barcode scanner and test that the scanHandler prop function is called
		const instance = (instanceEvent as any)[0][0] as any
		expect(instance.simulate(window, '1234567890')).toBe(instance)
		expect(wrapper.props().scanHandler).toHaveBeenCalledWith('1234567890', 1)
	})
})
