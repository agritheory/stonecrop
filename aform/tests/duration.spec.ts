import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ADuration from '../src/components/form/ADuration.vue'

const ADateSelectionStub = {
	name: 'ADateSelection',
	template: '<div class="stub-date-selection" />',
	emits: ['get-range'],
}

const global = { components: { ADateSelection: ADateSelectionStub } }

// Helper: mount ADuration and emit get-range, returning emitted values and wrapper
const mountAndEmitRange = async (start: Date, end: Date) => {
	const emitted: (number | undefined)[] = []
	const wrapper = mount(ADuration, {
		props: { 'onUpdate:modelValue': (v: number | undefined) => emitted.push(v) },
		global,
	})
	await wrapper.findComponent({ name: 'ADateSelection' }).vm.$emit('get-range', { start, end })
	await nextTick()
	return { emitted, wrapper }
}

describe('ADuration', () => {
	it('renders in edit mode by default', () => {
		const wrapper = mount(ADuration, { global })
		expect(wrapper.find('.aduration').exists()).toBe(true)
		expect(wrapper.findComponent({ name: 'ADateSelection' }).exists()).toBe(true)
	})

	it('defaults label to "Duration"', () => {
		const wrapper = mount(ADuration, { global })
		expect(wrapper.find('label').text()).toBe('Duration')
	})

	it('renders a custom label', () => {
		const wrapper = mount(ADuration, {
			props: { label: 'Task Duration' },
			global,
		})
		expect(wrapper.find('label').text()).toBe('Task Duration')
	})

	describe('duration computed', () => {
		it('calculates the correct duration in milliseconds', async () => {
			const start = new Date('2026-01-01T08:00:00')
			const end = new Date('2026-01-01T10:30:00') // 2.5h = 9_000_000 ms
			const { emitted } = await mountAndEmitRange(start, end)
			expect(emitted[emitted.length - 1]).toBe(9_000_000)
		})

		it('emits 0 when end is before start (no negative durations)', async () => {
			const start = new Date('2026-01-02T10:00:00')
			const end = new Date('2026-01-01T08:00:00') // earlier than start
			const { emitted } = await mountAndEmitRange(start, end)
			expect(emitted[emitted.length - 1]).toBe(0)
		})

		it('handles multi-day spans correctly', async () => {
			const start = new Date('2026-01-01T00:00:00')
			const end = new Date('2026-01-03T00:00:00') // exactly 2 days
			const { emitted } = await mountAndEmitRange(start, end)
			expect(emitted[emitted.length - 1]).toBe(2 * 24 * 60 * 60 * 1000)
		})
	})

	describe('human-readable display', () => {
		it('shows the duration summary strip after range is selected', async () => {
			const start = new Date('2026-01-01T09:00:00')
			const end = new Date('2026-01-01T11:30:45')
			const emitted: (number | undefined)[] = []
			const wrapper = mount(ADuration, {
				props: { 'onUpdate:modelValue': (v: number | undefined) => emitted.push(v) },
				global,
			})

			await wrapper.findComponent({ name: 'ADateSelection' }).vm.$emit('get-range', { start, end })
			await nextTick()

			const summary = wrapper.find('.aduration__summary')
			expect(summary.exists()).toBe(true)
			expect(summary.find('.aduration__value').text()).toBe('2h 30m 45s')
		})
	})

	describe('display / read mode', () => {
		it('renders the display value from modelValue in display mode', () => {
			const oneHour = 3_600_000
			const wrapper = mount(ADuration, {
				props: { mode: 'display', modelValue: oneHour },
				global,
			})
			const el = wrapper.find('.aform_display-value')
			expect(el.exists()).toBe(true)
			expect(el.text()).toBe('1h')
		})

		it('renders "—" when modelValue is 0 in display mode', () => {
			const wrapper = mount(ADuration, {
				props: { mode: 'display', modelValue: 0 },
				global,
			})
			expect(wrapper.find('.aform_display-value').text()).toBe('—')
		})

		it('does not render ADateSelection in display mode', () => {
			const wrapper = mount(ADuration, {
				props: { mode: 'display', modelValue: 3_600_000 },
				global,
			})
			expect(wrapper.findComponent({ name: 'ADateSelection' }).exists()).toBe(false)
		})
	})

	describe('v-model emit', () => {
		it('emits update:modelValue whenever the range changes', async () => {
			const emitted: (number | undefined)[] = []

			// Use let + assignment to avoid TDZ error when wrapper is referenced in callback
			let wrapper: ReturnType<typeof mount>
			wrapper = mount(ADuration, {
				props: { 'onUpdate:modelValue': (v: number | undefined) => emitted.push(v) },
				global,
			})

			const sel = wrapper.findComponent({ name: 'ADateSelection' })

			await sel.vm.$emit('get-range', {
				start: new Date('2026-03-01T08:00:00'),
				end: new Date('2026-03-01T09:00:00'), // 1h
			})
			await nextTick()

			await sel.vm.$emit('get-range', {
				start: new Date('2026-03-01T08:00:00'),
				end: new Date('2026-03-01T10:00:00'), // 2h
			})
			await nextTick()

			// Use last two emitted values — ignore any init emit of 0
			const last2 = emitted.slice(-2)
			expect(last2).toEqual([3_600_000, 7_200_000])
		})
	})
})
