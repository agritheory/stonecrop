import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import ADateRange from '../src/components/form/ADateRange.vue'
import ADateSelection from '../src/components/form/ADateSelection.vue'
import ADatePicker from '../src/components/form/ADatePicker.vue'
import ADateTimeInput from '../src/components/form/ADateTimeInput.vue'

const globalComponents = {
	global: {
		components: {
			ADateSelection,
			ADatePicker,
			ADateTimeInput,
		},
	},
}

describe('date range component', () => {
	it('renders a single trigger input in edit mode', () => {
		const wrapper = mount(ADateRange, globalComponents)
		const $input = wrapper.find('input')
		expect($input.exists()).toBe(true)
		expect($input.attributes('type')).toBe('text')
	})

	it('renders with default label', () => {
		const wrapper = mount(ADateRange, globalComponents)
		expect(wrapper.find('label').text()).toBe('Date Range')
	})

	it('renders with a custom label', () => {
		const wrapper = mount(ADateRange, {
			...globalComponents,
			props: { label: 'Booking Period' },
		})
		expect(wrapper.find('label').text()).toBe('Booking Period')
	})

	it('trigger input is disabled in read mode', () => {
		const wrapper = mount(ADateRange, {
			...globalComponents,
			props: { mode: 'read' },
		})
		expect(wrapper.find('input').attributes()).toHaveProperty('disabled')
	})

	it('trigger input is readonly', () => {
		const wrapper = mount(ADateRange, globalComponents)
		expect(wrapper.find('input').attributes()).toHaveProperty('readonly')
	})

	it('shows placeholder when no value is set', () => {
		const wrapper = mount(ADateRange, globalComponents)
		expect(wrapper.find('input').attributes('placeholder')).toBe('Select date range')
	})

	it('renders in display mode without an input', () => {
		const wrapper = mount(ADateRange, {
			...globalComponents,
			props: {
				mode: 'display',
				modelValue: { start_date: '2026-01-01', end_date: '2026-01-31' },
			},
		})
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').exists()).toBe(true)
	})

	it('renders display mode with empty span when no value', () => {
		const wrapper = mount(ADateRange, {
			...globalComponents,
			props: { mode: 'display' },
		})
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').text()).toBe('')
	})

	it('shows the calendar picker when trigger input is clicked', async () => {
		const wrapper = mount(ADateRange, globalComponents)
		expect(wrapper.findComponent(ADateSelection).exists()).toBe(false)
		await wrapper.find('input').trigger('click')
		await nextTick()
		expect(wrapper.findComponent(ADateSelection).exists()).toBe(true)
	})

	it('does not open the picker in read mode', async () => {
		const wrapper = mount(ADateRange, {
			...globalComponents,
			props: { mode: 'read' },
		})
		await wrapper.find('input').trigger('click')
		await nextTick()
		expect(wrapper.findComponent(ADateSelection).exists()).toBe(false)
	})

	it('passes selectRange=true to ADateSelection', async () => {
		const wrapper = mount(ADateRange, globalComponents)
		await wrapper.find('input').trigger('click')
		await nextTick()
		const selection = wrapper.findComponent(ADateSelection)
		expect(selection.props('selectRange')).toBe(true)
	})

	it('passes showTime=false to ADateSelection', async () => {
		const wrapper = mount(ADateRange, globalComponents)
		await wrapper.find('input').trigger('click')
		await nextTick()
		const selection = wrapper.findComponent(ADateSelection)
		expect(selection.props('showTime')).toBe(false)
	})

	it('v-model shape has start_date and end_date keys', async () => {
		const emitted: object[] = []
		const wrapper = mount(ADateRange, {
			...globalComponents,
			props: { 'onUpdate:modelValue': (v: object) => emitted.push(v) },
		})

		await wrapper.find('input').trigger('click')
		await nextTick()

		await wrapper.findComponent(ADateSelection).vm.$emit('get-date', {
			selected: new Date('2026-04-01'),
			start: new Date('2026-04-01'),
			end: new Date('2026-04-30'),
		})
		await nextTick()

		const last = emitted[emitted.length - 1] as any
		expect(last).toHaveProperty('start_date')
		expect(last).toHaveProperty('end_date')
	})

	it('shows placeholder when both dates are null', () => {
		const wrapper = mount(ADateRange, globalComponents)
		expect(wrapper.find('input').element.value).toBe('')
	})

	it('renders "From ..." in display mode when only start_date is set', () => {
		const wrapper = mount(ADateRange, {
			...globalComponents,
			props: {
				mode: 'display',
				modelValue: { start_date: '2026-01-01', end_date: null },
			},
		})
		const text = wrapper.find('.aform_display-value').text()
		expect(text).toContain('From')
	})

	it('renders "Until ..." in display mode when only end_date is set', () => {
		const wrapper = mount(ADateRange, {
			...globalComponents,
			props: {
				mode: 'display',
				modelValue: { start_date: null, end_date: '2026-01-31' },
			},
		})
		const text = wrapper.find('.aform_display-value').text()
		expect(text).toContain('Until')
	})

	// Pinned zones, because the runner's own zone hides these: CI runs in UTC, where all of them pass.
	// Hand-emitted days are local midnight, which is what ADatePicker emits.
	describe.each(['Asia/Kolkata', 'America/New_York'])('in %s', zone => {
		beforeEach(() => {
			vi.stubEnv('TZ', zone)
			vi.useFakeTimers({ toFake: ['Date'] })
			vi.setSystemTime(new Date(2026, 0, 15, 12))
		})

		afterEach(() => {
			vi.useRealTimers()
			vi.unstubAllEnvs()
		})

		const clickDay = async (wrapper: ReturnType<typeof mount>, day: string) => {
			const cells = wrapper.findAll('td.date-cell').filter(cell => cell.text() === day)
			expect(cells).toHaveLength(1)
			await cells[0].trigger('click')
		}

		it('saves the range picked in the calendar and closes it', async () => {
			const emitted: object[] = []
			const wrapper = mount(ADateRange, {
				...globalComponents,
				props: { 'onUpdate:modelValue': (v: object) => emitted.push(v) },
			})
			await wrapper.find('input').trigger('click')
			await clickDay(wrapper, '10')
			await clickDay(wrapper, '20')

			expect(emitted).toEqual([
				{ start_date: '2026-01-10', end_date: null },
				{ start_date: '2026-01-10', end_date: '2026-01-20' },
			])
			expect(wrapper.findComponent(ADateSelection).exists()).toBe(false)
		})

		it('updates start_date when picker emits a start date', async () => {
			const emitted: object[] = []
			const wrapper = mount(ADateRange, {
				...globalComponents,
				props: { 'onUpdate:modelValue': (v: object) => emitted.push(v) },
			})

			await wrapper.find('input').trigger('click')
			await nextTick()

			const start = new Date(2026, 2, 1)
			await wrapper.findComponent(ADateSelection).vm.$emit('get-date', {
				selected: start,
				start,
				end: null,
			})
			await nextTick()

			expect(emitted.at(-1)).toEqual({ start_date: '2026-03-01', end_date: null })
		})

		it('auto-swaps start and end when end is before start', async () => {
			const emitted: object[] = []
			const wrapper = mount(ADateRange, {
				...globalComponents,
				props: { 'onUpdate:modelValue': (v: object) => emitted.push(v) },
			})

			await wrapper.find('input').trigger('click')
			await nextTick()

			const start = new Date(2026, 2, 15)
			const end = new Date(2026, 2, 1)
			await wrapper.findComponent(ADateSelection).vm.$emit('get-date', {
				selected: end,
				start,
				end,
			})
			await nextTick()

			expect(emitted.at(-1)).toEqual({ start_date: '2026-03-01', end_date: '2026-03-15' })
		})

		it('displays formatted range in trigger input', () => {
			const wrapper = mount(ADateRange, {
				...globalComponents,
				props: {
					modelValue: { start_date: '2026-03-01', end_date: '2026-03-15' },
				},
			})
			expect(wrapper.find('input').element.value).toBe('3/1/2026 — 3/15/2026')
		})

		it('shows partial range in trigger input when only start is set', () => {
			const wrapper = mount(ADateRange, {
				...globalComponents,
				props: {
					modelValue: { start_date: '2026-03-01', end_date: null },
				},
			})
			expect(wrapper.find('input').element.value).toBe('3/1/2026 — ...')
		})

		it('syncs internal state when modelValue changes externally', async () => {
			const wrapper = mount(ADateRange, {
				...globalComponents,
				props: {
					modelValue: { start_date: '2026-01-01', end_date: '2026-01-31' },
				},
			})

			await wrapper.setProps({
				modelValue: { start_date: '2026-06-01', end_date: '2026-06-30' },
			})

			expect(wrapper.find('input').element.value).toBe('6/1/2026 — 6/30/2026')
		})

		it('renders display mode with formatted date range', () => {
			const wrapper = mount(ADateRange, {
				...globalComponents,
				props: {
					mode: 'display',
					modelValue: { start_date: '2026-01-01', end_date: '2026-01-31' },
				},
			})
			expect(wrapper.find('.aform_display-value').text()).toBe(
				`${new Date(2026, 0, 1).toLocaleDateString()} — ${new Date(2026, 0, 31).toLocaleDateString()}`
			)
		})
	})
})
