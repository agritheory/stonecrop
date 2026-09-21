import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'

import ADatePicker from '../src/components/form/ADatePicker.vue'
// For the shared field styles aform's stylesheet gives every app, which size the boxes' text at 1rem.
// oxlint-disable-next-line import/no-unassigned-import
import '../src/components/AForm.vue'

let wrapper: VueWrapper | undefined
let hostReset: HTMLStyleElement | undefined

afterEach(() => wrapper?.unmount())

describe('datepicker component in a browser', { tags: ['browser'] }, () => {
	// A host page styling table cells as the docs site does, collapsed and padded inside their own width,
	// which leaves the calendar's boxes the least room.
	beforeAll(() => {
		hostReset = document.createElement('style')
		hostReset.textContent =
			'table { border-collapse: collapse; border-spacing: 0 } td, th { padding: 8px 12px; box-sizing: border-box }'
		document.head.append(hostReset)
	})

	afterAll(() => hostReset?.remove())

	// Ten characters, as French and British English write a day.
	it('fits a ten-character day in each range box, inside the calendar', () => {
		wrapper = mount(ADatePicker, { props: { selectRange: true }, attachTo: document.body })
		const calendar = wrapper.find('table').element.getBoundingClientRect()
		for (const box of wrapper.findAll('.date-input > input').map(input => input.element as HTMLInputElement)) {
			box.value = '20/09/2026'
			expect(box.scrollWidth).toBeLessThanOrEqual(box.clientWidth)
			expect(box.getBoundingClientRect().right).toBeLessThanOrEqual(calendar.right)
		}
	})
})
