import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import ScanInput from '../src/components/ScanInput.vue'

type ScanInstance = { simulate: (target: Window, code: string) => unknown }
const isScanInstance = (v: unknown): v is ScanInstance =>
	typeof v === 'object' && v !== null && typeof (v as { simulate?: unknown }).simulate === 'function'

describe('scan input component', { tags: ['component'] }, () => {
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
		const raw = instanceEvent?.[0][0]
		if (!isScanInstance(raw)) {
			throw new Error('Expected scanInstance event payload to be a ScanInstance')
		}
		expect(raw.simulate(window, '1234567890')).toBe(raw)
		expect(wrapper.props().scanHandler).toHaveBeenCalledWith('1234567890', 1)
	})
})
