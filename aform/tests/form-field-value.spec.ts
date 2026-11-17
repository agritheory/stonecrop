import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'

import ABadge from '../src/components/form/ABadge.vue'
import ADateTimeInput from '../src/components/form/ADateTimeInput.vue'
import type { ResolvedField } from '../src/types'
import { mountBound } from './mount-bound'

// #548: a doctype may draw a field with ADateTimeInput or ABadge. Each shows the value its record
// holds, and an edit to the time reaches the record.
const global = { components: { ABadge, ADateTimeInput } }

const timeField = (overrides: Partial<ResolvedField> = {}) =>
	[
		{ kind: 'field', fieldname: 'start_time', label: 'Start Time', component: 'ADateTimeInput', ...overrides },
	] as ResolvedField[]

const timeInputs = (wrapper: ReturnType<typeof mountBound>) =>
	wrapper.findAll<HTMLInputElement>('input[type="text"]').map(input => input.element.value)

describe('ADateTimeInput as a form field', { tags: ['component'] }, () => {
	it("shows the record's time and the field's label", () => {
		const wrapper = mountBound({ props: { schema: timeField(), data: { start_time: '09:30' } }, global })
		expect(timeInputs(wrapper)).toEqual(['09', '30', '00'])
		expect(wrapper.find<HTMLSelectElement>('select').element.value).toBe('AM')
		expect(wrapper.find('label').text()).toBe('Start Time')
	})

	it('shows an afternoon time as PM', () => {
		const wrapper = mountBound({ props: { schema: timeField(), data: { start_time: '17:00:00' } }, global })
		expect(timeInputs(wrapper)).toEqual(['05', '00', '00'])
		expect(wrapper.find<HTMLSelectElement>('select').element.value).toBe('PM')
	})

	it('writes an edit to the record', async () => {
		const wrapper = mountBound({ props: { schema: timeField(), data: { start_time: '09:30' } }, global })
		const hours = wrapper.findAll('input[type="text"]')[0]
		await hours.setValue('11')
		await hours.trigger('blur')
		expect(wrapper.props('data')).toEqual({ start_time: '11:30:00' })

		await wrapper.find('select').setValue('PM')
		expect(wrapper.props('data')).toEqual({ start_time: '23:30:00' })
	})

	it('leaves the record alone when it mounts, or when a field is left unchanged', async () => {
		const wrapper = mountBound({ props: { schema: timeField(), data: { start_time: '09:30' } }, global })
		await wrapper.findAll('input[type="text"]')[1].trigger('blur')
		expect(wrapper.emitted('update:data')).toBeUndefined()
	})

	it('shows an empty time as empty boxes, and leaving them writes nothing', async () => {
		const wrapper = mountBound({ props: { schema: timeField(), data: { start_time: null } }, global })
		expect(timeInputs(wrapper)).toEqual(['', '', ''])
		for (const input of wrapper.findAll('input[type="text"]')) await input.trigger('blur')
		await wrapper.find('select').trigger('change')
		expect(wrapper.emitted('update:data')).toBeUndefined()
	})

	it('writes the time once someone types into an empty field', async () => {
		const wrapper = mountBound({ props: { schema: timeField(), data: { start_time: null } }, global })
		const hours = wrapper.findAll('input[type="text"]')[0]
		await hours.setValue('9')
		await hours.trigger('blur')
		expect(wrapper.props('data')).toEqual({ start_time: '09:00:00' })
	})

	it("empties its boxes when the record's time is cleared or another record comes in", async () => {
		const wrapper = mountBound({ props: { schema: timeField(), data: { start_time: '09:30' } }, global })
		await wrapper.setProps({ data: { start_time: null } })
		expect(timeInputs(wrapper)).toEqual(['', '', ''])

		await wrapper.setProps({ data: { start_time: '14:15:00' } })
		await wrapper.setProps({ data: {} })
		expect(timeInputs(wrapper)).toEqual(['', '', ''])
		for (const input of wrapper.findAll('input[type="text"]')) await input.trigger('blur')
		expect(wrapper.emitted('update:data')).toBeUndefined()
	})

	it('crosses noon with an arrow key without writing a minute of 60', async () => {
		const wrapper = mountBound({ props: { schema: timeField(), data: { start_time: '11:59:00' } }, global })
		await wrapper.findAll('input[type="text"]')[1].trigger('keydown', { key: 'ArrowUp' })
		const written = (wrapper.emitted('update:data') ?? []).map(([record]) => record)
		expect(written).toEqual([{ start_time: '12:00:00' }])
		expect(timeInputs(wrapper)).toEqual(['12', '00', '00'])
		expect(wrapper.find<HTMLSelectElement>('select').element.value).toBe('PM')
	})

	it('shows the time as text in display mode', () => {
		const wrapper = mountBound({
			props: { schema: timeField({ mode: 'display' }), data: { start_time: '17:00:00' } },
			global,
		})
		expect(wrapper.find('.aform_display-value').text()).toBe('05:00:00 PM')
	})
})

describe('ABadge as a form field', { tags: ['component'] }, () => {
	const badgeField = (options?: Record<string, unknown>) =>
		[{ kind: 'field', fieldname: 'status', label: 'Status', component: 'ABadge', options }] as ResolvedField[]

	it("shows the record's value, not the field's label", () => {
		const wrapper = mountBound({ props: { schema: badgeField(), data: { status: 'Open' } }, global })
		expect(wrapper.find('.abadge').text()).toBe('Open')
		expect(wrapper.find('label').text()).toBe('Status')
	})

	it("paints the value's badge from the field's options", () => {
		const wrapper = mountBound({
			props: { schema: badgeField({ Open: 'warning', Closed: 'success' }), data: { status: 'Closed' } },
			global,
		})
		const badge = wrapper.find('.abadge')
		expect(badge.text()).toBe('Closed')
		expect(badge.classes()).toContain('abadge--success')
	})

	it('leaves a badge drawn on its own reading its label', () => {
		const wrapper = mount(ABadge, { props: { label: 'Open', value: 'Closed', options: { Closed: 'success' } } })
		expect(wrapper.text()).toBe('Open')
		expect(wrapper.classes()).toContain('abadge--cell-fill')
	})

	it('shows no badge for an empty value', () => {
		const wrapper = mountBound({ props: { schema: badgeField(), data: { status: null } }, global })
		expect(wrapper.find('.abadge').exists()).toBe(false)
		expect(wrapper.find('label').text()).toBe('Status')
	})
})
