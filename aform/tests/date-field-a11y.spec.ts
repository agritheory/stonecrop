import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ADate from '../src/components/form/ADate.vue'
import ADateRange from '../src/components/form/ADateRange.vue'
import ADateTime from '../src/components/form/ADateTime.vue'

describe('date field popup a11y', { tags: ['component'] }, () => {
	it('ADate exposes aria-expanded and aria-controls when the picker opens', async () => {
		const w = mount(ADate, { props: { uuid: 'ship_date', label: 'Ship date' } })
		const input = w.find('input')
		expect(input.attributes('aria-expanded')).toBe('false')
		expect(input.attributes('aria-haspopup')).toBe('dialog')

		await input.trigger('click')
		expect(input.attributes('aria-expanded')).toBe('true')
		expect(input.attributes('aria-controls')).toBe('ship_date-picker')
	})

	it('ADateRange opens the picker on ArrowDown', async () => {
		const w = mount(ADateRange, { props: { uuid: 'range', label: 'Range' } })
		const input = w.find('input')
		await input.trigger('keydown', { key: 'ArrowDown' })
		expect(input.attributes('aria-expanded')).toBe('true')
	})

	it('ADateTime wires error aria when present', () => {
		const w = mount(ADateTime, {
			props: { uuid: 'created', label: 'Created', errors: ['Invalid datetime'] },
		})
		const input = w.find('input')
		expect(input.attributes('aria-invalid')).toBe('true')
		expect(input.attributes('aria-describedby')).toBe('created-error')
	})
})
