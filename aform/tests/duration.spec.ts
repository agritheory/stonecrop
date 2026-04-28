import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ADuration from '../src/components/form/ADuration.vue'

const ADateSelectionStub = {
	name: 'ADateSelection',
	template: '<div class="stub-date-selection" />',
	emits: ['get-range'],
}

describe('ADuration', () => {
	const global = { components: { ADateSelection: ADateSelectionStub } }

	it('renders in edit mode by default', () => {
		const wrapper = mount(ADuration, { global })
		expect(wrapper.find('.aduration').exists()).toBe(true)
	})

	it('defaults label to "Duration"', () => {
		const wrapper = mount(ADuration, { global })
		expect(wrapper.find('label').text()).toBe('Duration')
	})

	it('calculates the correct duration in milliseconds', async () => {
		const emitted: number[] = []
		const wrapper = mount(ADuration, {
			props: { 'onUpdate:modelValue': (v: number) => emitted.push(v) },
			global,
		})
		const start = new Date('2026-01-01T08:00:00')
		const end = new Date('2026-01-01T10:30:00') // 2.5h = 9_000_000 ms
		await wrapper.findComponent({ name: 'ADateSelection' }).vm.$emit('get-range', { start, end })
		await nextTick()
		expect(emitted[0]).toBe(9_000_000)
	})

	it('emits 0 when end is before start', async () => {
		const emitted: number[] = []
		const wrapper = mount(ADuration, {
			props: { 'onUpdate:modelValue': (v: number) => emitted.push(v) },
			global,
		})
		await wrapper.findComponent({ name: 'ADateSelection' }).vm.$emit('get-range', {
			start: new Date('2026-01-02T10:00:00'),
			end: new Date('2026-01-01T08:00:00'),
		})
		await nextTick()
		expect(emitted[0]).toBe(0)
	})

	it('handles multi-day spans', async () => {
		const emitted: number[] = []
		const wrapper = mount(ADuration, {
			props: { 'onUpdate:modelValue': (v: number) => emitted.push(v) },
			global,
		})
		await wrapper.findComponent({ name: 'ADateSelection' }).vm.$emit('get-range', {
			start: new Date('2026-01-01T00:00:00'),
			end: new Date('2026-01-03T00:00:00'),
		})
		await nextTick()
		expect(emitted[0]).toBe(2 * 24 * 60 * 60 * 1000)
	})

	it('shows human-readable summary after range is set', async () => {
		const wrapper = mount(ADuration, {
			props: { 'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }) },
			global,
		})
		await wrapper.findComponent({ name: 'ADateSelection' }).vm.$emit('get-range', {
			start: new Date('2026-01-01T09:00:00'),
			end: new Date('2026-01-01T11:30:45'),
		})
		await nextTick()
		expect(wrapper.find('.aduration__value').text()).toBe('2h 30m 45s')
	})

	it('renders display mode from a saved modelValue', () => {
		const wrapper = mount(ADuration, {
			props: { mode: 'display', modelValue: 3_600_000 },
			global,
		})
		expect(wrapper.find('.aform_display-value').text()).toBe('1h')
	})

	it('emits on every range change', async () => {
		const emitted: number[] = []
		const wrapper = mount(ADuration, {
			props: { 'onUpdate:modelValue': (v: number) => emitted.push(v) },
			global,
		})
		const sel = wrapper.findComponent({ name: 'ADateSelection' })
		await sel.vm.$emit('get-range', {
			start: new Date('2026-03-01T08:00:00'),
			end: new Date('2026-03-01T09:00:00'),
		})
		await nextTick()
		await sel.vm.$emit('get-range', {
			start: new Date('2026-03-01T08:00:00'),
			end: new Date('2026-03-01T10:00:00'),
		})
		await nextTick()
		expect(emitted).toEqual([3_600_000, 7_200_000])
	})
})
