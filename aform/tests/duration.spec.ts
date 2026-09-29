import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick, defineComponent } from 'vue'
import ADuration from '../src/components/form/ADuration.vue'
import ADateSelection from '../src/components/form/ADateSelection.vue'
import ADatePicker from '../src/components/form/ADatePicker.vue'
import ADateTimeInput from '../src/components/form/ADateTimeInput.vue'

const ADateSelectionStub = defineComponent({
	name: 'ADateSelection',
	props: {
		selectRange: Boolean,
		showTime: Boolean,
		showEndTime: Boolean,
		allowMilitaryTime: Boolean,
		useSeconds: Boolean,
	},
	emits: ['get-range'],
	template: '<div class="stub-date-selection" />',
})

const global = { components: { ADateSelection: ADateSelectionStub } }

const mountAndEmitRange = async (start: Date, end: Date) => {
	const emitted: (string | null | undefined)[] = []
	const wrapper = mount(ADuration, {
		props: { 'onUpdate:modelValue': (v: string | null | undefined) => emitted.push(v) },
		global,
	})
	await wrapper.findComponent({ name: 'ADateSelection' }).vm.$emit('get-range', { start, end })
	await nextTick()
	return { emitted, wrapper }
}

describe('ADuration', () => {
	describe('rendering', () => {
		it('renders root .aduration div in edit mode', () => {
			const wrapper = mount(ADuration, { global })
			expect(wrapper.find('.aduration').exists()).toBe(true)
		})

		it('renders ADateSelection in edit mode', () => {
			const wrapper = mount(ADuration, { global })
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

		it('does not show summary strip before range is selected', () => {
			const wrapper = mount(ADuration, { global })
			expect(wrapper.find('.aduration__summary').exists()).toBe(false)
		})

		it('shows summary strip after range is selected', async () => {
			const { wrapper } = await mountAndEmitRange(new Date('2026-01-01T09:00:00'), new Date('2026-01-01T11:00:00'))
			expect(wrapper.find('.aduration__summary').exists()).toBe(true)
		})
	})

	describe('display mode', () => {
		it('renders .aform_display-value in display mode', () => {
			const wrapper = mount(ADuration, {
				props: { mode: 'display', modelValue: 'PT1H' },
				global,
			})
			expect(wrapper.find('.aform_display-value').exists()).toBe(true)
		})

		it('does not render ADateSelection in display mode', () => {
			const wrapper = mount(ADuration, {
				props: { mode: 'display', modelValue: 'PT1H' },
				global,
			})
			expect(wrapper.findComponent({ name: 'ADateSelection' }).exists()).toBe(false)
		})

		it('shows "1h" for PT1H in display mode', () => {
			const wrapper = mount(ADuration, {
				props: { mode: 'display', modelValue: 'PT1H' },
				global,
			})
			expect(wrapper.find('.aform_display-value').text()).toBe('1h')
		})

		it('shows "—" when modelValue is a zero duration in display mode', () => {
			const wrapper = mount(ADuration, {
				props: { mode: 'display', modelValue: 'PT0S' },
				global,
			})
			expect(wrapper.find('.aform_display-value').text()).toBe('—')
		})

		it('shows "—" when modelValue is null in display mode', () => {
			const wrapper = mount(ADuration, {
				props: { mode: 'display', modelValue: null },
				global,
			})
			expect(wrapper.find('.aform_display-value').text()).toBe('—')
		})

		// A backend may hold months, which no count of days or milliseconds can stand for.
		it('shows years, months and a fraction of a second', () => {
			const wrapper = mount(ADuration, {
				props: { mode: 'display', modelValue: 'P1Y2MT1.5S' },
				global,
			})
			expect(wrapper.find('.aform_display-value').text()).toBe('1y 2mo 1.5s')
		})

		it('shows a duration in the units it holds', () => {
			const wrapper = mount(ADuration, {
				props: { mode: 'display', modelValue: 'PT25H' },
				global,
			})
			expect(wrapper.find('.aform_display-value').text()).toBe('25h')
		})

		it('shows a value that is no ISO 8601 duration as invalid', () => {
			const wrapper = mount(ADuration, {
				props: { mode: 'display', modelValue: '3600000' },
				global,
			})
			expect(wrapper.find('.aform_display-value').text()).toBe('Invalid Duration')
		})

		it('shows "—" when modelValue is undefined in display mode', () => {
			const wrapper = mount(ADuration, {
				props: { mode: 'display' },
				global,
			})
			expect(wrapper.find('.aform_display-value').text()).toBe('—')
		})

		it('formats multi-unit duration correctly in display mode', () => {
			const wrapper = mount(ADuration, {
				props: { mode: 'display', modelValue: 'P1DT2H30M15S' },
				global,
			})
			expect(wrapper.find('.aform_display-value').text()).toBe('1d 2h 30m 15s')
		})

		it('does not render ADateSelection in read mode', () => {
			const wrapper = mount(ADuration, {
				props: { mode: 'read', modelValue: 'PT1H' },
				global,
			})
			expect(wrapper.findComponent({ name: 'ADateSelection' }).exists()).toBe(false)
		})
	})

	describe('duration computed', () => {
		it('holds the duration as ISO 8601', async () => {
			const start = new Date('2026-01-01T08:00:00')
			const end = new Date('2026-01-01T10:30:00')
			const { emitted } = await mountAndEmitRange(start, end)
			expect(emitted[emitted.length - 1]).toBe('PT2H30M')
		})

		it('clamps to 0 when end is before start', async () => {
			const start = new Date('2026-01-02T10:00:00')
			const end = new Date('2026-01-01T08:00:00') // earlier than start
			const { emitted } = await mountAndEmitRange(start, end)
			expect(emitted[emitted.length - 1]).toBe('PT0S')
		})

		it('clamps to 0 when start equals end', async () => {
			const date = new Date('2026-01-01T10:00:00')
			const { emitted } = await mountAndEmitRange(date, date)
			expect(emitted[emitted.length - 1]).toBe('PT0S')
		})

		it('handles multi-day spans correctly', async () => {
			const start = new Date('2026-01-01T00:00:00')
			const end = new Date('2026-01-03T00:00:00') // exactly 2 days
			const { emitted } = await mountAndEmitRange(start, end)
			expect(emitted[emitted.length - 1]).toBe('P2D')
		})

		it('handles same-day time-only duration', async () => {
			const start = new Date('2026-01-01T08:00:00')
			const end = new Date('2026-01-01T08:30:00') // 30 min
			const { emitted } = await mountAndEmitRange(start, end)
			expect(emitted[emitted.length - 1]).toBe('PT30M')
		})
	})

	describe('human-readable duration', () => {
		it('shows correct human duration in summary strip', async () => {
			const start = new Date('2026-01-01T09:00:00')
			const end = new Date('2026-01-01T11:30:45')
			const { wrapper } = await mountAndEmitRange(start, end)
			expect(wrapper.find('.aduration__value').text()).toBe('2h 30m 45s')
		})

		it('shows only hours when no minutes or seconds', async () => {
			const start = new Date('2026-01-01T08:00:00')
			const end = new Date('2026-01-01T10:00:00')
			const { wrapper } = await mountAndEmitRange(start, end)
			expect(wrapper.find('.aduration__value').text()).toBe('2h')
		})

		it('shows days in human duration for multi-day range', async () => {
			const start = new Date('2026-01-01T00:00:00')
			const end = new Date('2026-01-02T12:00:00')
			const { wrapper } = await mountAndEmitRange(start, end)
			expect(wrapper.find('.aduration__value').text()).toBe('1d 12h')
		})

		it('shows the value it holds in summary strip', async () => {
			const start = new Date('2026-01-01T08:00:00')
			const end = new Date('2026-01-01T09:00:00')
			const { wrapper } = await mountAndEmitRange(start, end)
			expect(wrapper.find('.aduration__held').text()).toBe('(PT1H)')
		})

		it('shows a fraction of a second', async () => {
			const start = new Date('2026-01-01T08:00:00.000')
			const end = new Date('2026-01-01T08:00:00.500')
			const { wrapper, emitted } = await mountAndEmitRange(start, end)
			expect(emitted[emitted.length - 1]).toBe('PT0.5S')
			expect(wrapper.find('.aduration__value').text()).toBe('0.5s')
		})
	})

	describe('props', () => {
		it('passes allowMilitaryTime to ADateSelection', () => {
			const wrapper = mount(ADuration, {
				props: { allowMilitaryTime: true },
				global,
			})
			const sel = wrapper.findComponent({ name: 'ADateSelection' })
			expect(sel.props('allowMilitaryTime')).toBe(true)
		})

		it('passes useSeconds to ADateSelection', () => {
			const wrapper = mount(ADuration, {
				props: { useSeconds: true },
				global,
			})
			const sel = wrapper.findComponent({ name: 'ADateSelection' })
			expect(sel.props('useSeconds')).toBe(true)
		})

		it('passes select-range=true to ADateSelection always', () => {
			const wrapper = mount(ADuration, { global })
			const sel = wrapper.findComponent({ name: 'ADateSelection' })
			expect(sel.props('selectRange')).toBe(true)
		})

		it('passes show-time=true to ADateSelection always', () => {
			const wrapper = mount(ADuration, { global })
			const sel = wrapper.findComponent({ name: 'ADateSelection' })
			expect(sel.props('showTime')).toBe(true)
		})

		it('passes show-end-time=true to ADateSelection always', () => {
			const wrapper = mount(ADuration, { global })
			const sel = wrapper.findComponent({ name: 'ADateSelection' })
			expect(sel.props('showEndTime')).toBe(true)
		})
	})

	describe('v-model', () => {
		it('emits update:modelValue on range change', async () => {
			const emitted: (string | null | undefined)[] = []
			const wrapper = mount(ADuration, {
				props: { 'onUpdate:modelValue': (v: string | null | undefined) => emitted.push(v) },
				global,
			})
			await wrapper.findComponent({ name: 'ADateSelection' }).vm.$emit('get-range', {
				start: new Date('2026-03-01T08:00:00'),
				end: new Date('2026-03-01T09:00:00'),
			})
			await nextTick()
			expect(emitted.length).toBeGreaterThan(0)
			expect(emitted[emitted.length - 1]).toBe('PT1H')
		})

		it('emits on every range change', async () => {
			const emitted: (string | null | undefined)[] = []
			let wrapper: ReturnType<typeof mount>
			wrapper = mount(ADuration, {
				props: { 'onUpdate:modelValue': (v: string | null | undefined) => emitted.push(v) },
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

			const last2 = emitted.slice(-2)
			expect(last2).toEqual(['PT1H', 'PT2H'])
		})

		it('calculates duration when only end time changes without selecting dates', async () => {
			const emitted: (string | null | undefined)[] = []
			const wrapper = mount(ADuration, {
				props: { 'onUpdate:modelValue': (v: string | null | undefined) => emitted.push(v) },
				global,
			})

			const today = new Date()
			today.setSeconds(0, 0)

			const start = new Date(today)
			start.setHours(0, 0, 0, 0)

			const end = new Date(today)
			end.setHours(13, 0, 0, 0)

			await wrapper.findComponent({ name: 'ADateSelection' }).vm.$emit('get-range', { start, end })
			await nextTick()

			expect(emitted[emitted.length - 1]).toBe('PT13H')
		})

		it('calculates duration when start is 12 AM and end is 2 PM', async () => {
			const emitted: (string | null | undefined)[] = []
			const wrapper = mount(ADuration, {
				props: { 'onUpdate:modelValue': (v: string | null | undefined) => emitted.push(v) },
				global,
			})

			const today = new Date()
			const start = new Date(today)
			start.setHours(0, 0, 0, 0)

			const end = new Date(today)
			end.setHours(14, 0, 0, 0)

			await wrapper.findComponent({ name: 'ADateSelection' }).vm.$emit('get-range', { start, end })
			await nextTick()

			expect(emitted[emitted.length - 1]).toBe('PT14H')
		})

		it('calculates duration when only hours change without AM/PM change', async () => {
			const emitted: (string | null | undefined)[] = []
			const wrapper = mount(ADuration, {
				props: { 'onUpdate:modelValue': (v: string | null | undefined) => emitted.push(v) },
				global,
			})

			const today = new Date()

			const start = new Date(today)
			start.setHours(9, 0, 0, 0)

			const end = new Date(today)
			end.setHours(11, 0, 0, 0)

			await wrapper.findComponent({ name: 'ADateSelection' }).vm.$emit('get-range', { start, end })
			await nextTick()

			expect(emitted[emitted.length - 1]).toBe('PT2H')
		})

		// Mounted against the REAL ADateSelection, not the stub above: the defect only exists in the
		// wiring the stub replaces. Both ADateTimeInput children announce their start value on mount,
		// ADateSelection turns that pair into a range, and ADuration wrote it — so simply rendering
		// the field emitted a duration of 0 that the user never entered.
		it('does not write the model on mount', async () => {
			const wrapper = mount(ADuration, {
				global: { components: { ADateSelection, ADatePicker, ADateTimeInput } },
			})

			await flushPromises()

			expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		})
	})
})
