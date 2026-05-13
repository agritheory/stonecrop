import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import AFormLink from '../src/components/form/AFormLink.vue'
import type { AFormLinkValue } from '../src/types'

describe('AFormLink component', () => {
	const validValue: AFormLinkValue = { id: 'CUST-001', displayText: 'Acme Corp' }

	it('renders label and display text', () => {
		const wrapper = mount(AFormLink, {
			props: { label: 'Customer', modelValue: validValue },
		})
		expect(wrapper.find('.aform_field-label').text()).toBe('Customer')
		expect(wrapper.find('input').element.value).toBe('Acme Corp')
	})

	it('falls back to id when displayText is omitted and no filterFunction is provided', () => {
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: 'CUST-001' } },
		})
		expect(wrapper.find('input').element.value).toBe('CUST-001')
	})

	it('resolves display text on mount when id is set but displayText is absent', async () => {
		const filterFunction = vi.fn(async (_: string) => [{ id: 'PP-001', displayText: 'Q1 2026' }])
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: 'PP-001' }, filterFunction },
		})

		await flushPromises()

		expect(filterFunction).toHaveBeenCalledWith('PP-001')
		expect(wrapper.find('input').element.value).toBe('Q1 2026')
	})

	it('does not call filterFunction on mount when displayText is already present', async () => {
		const filterFunction = vi.fn(async (_: string) => [{ id: 'CUST-001', displayText: 'Acme Corp' }])
		mount(AFormLink, {
			props: { modelValue: { id: 'CUST-001', displayText: 'Acme Corp' }, filterFunction },
		})

		await flushPromises()

		expect(filterFunction).not.toHaveBeenCalled()
	})

	it('resolves display text when modelValue id changes after mount', async () => {
		const filterFunction = vi.fn(async (id: string) => [{ id, displayText: `Name for ${id}` }])
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, filterFunction },
		})

		await flushPromises()
		expect(filterFunction).not.toHaveBeenCalled()

		await wrapper.setProps({ modelValue: { id: 'NEW-001' } })
		await flushPromises()

		expect(filterFunction).toHaveBeenCalledWith('NEW-001')
		expect(wrapper.find('input').element.value).toBe('Name for NEW-001')
	})

	it('shows empty input when id is falsy', () => {
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' } },
		})
		expect(wrapper.find('input').element.value).toBe('')
	})

	it('defineModel emits update:modelValue on option selection', async () => {
		const filterFunction = vi.fn((_: string) => [{ id: 'CUST-001', displayText: 'Acme Corp' }])
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '', displayText: '' }, filterFunction },
		})

		await wrapper.find('input').trigger('focus')
		await flushPromises()
		await wrapper.vm.$nextTick()

		await wrapper.find('li').trigger('mousedown')
		await wrapper.vm.$nextTick()

		const events = wrapper.emitted('update:modelValue')
		expect(events).toBeTruthy()
		expect(events![0][0]).toEqual({ id: 'CUST-001', displayText: 'Acme Corp' })
	})

	it('renders arrow button when hasValidId', () => {
		const wrapper = mount(AFormLink, {
			props: { modelValue: validValue },
		})
		expect(wrapper.find('button').exists()).toBe(true)
	})

	it('does not render arrow button when id is falsy', () => {
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' } },
		})
		expect(wrapper.find('button').exists()).toBe(false)
	})

	it('disabled prop hides arrow and disables input', () => {
		const wrapper = mount(AFormLink, {
			props: { modelValue: validValue, disabled: true },
		})
		expect(wrapper.find('input').attributes('disabled')).toBeDefined()
		expect(wrapper.find('button').exists()).toBe(false)
	})

	it('read mode disables input but keeps arrow visible', () => {
		const wrapper = mount(AFormLink, {
			props: { modelValue: validValue, mode: 'read' },
		})
		expect(wrapper.find('input').attributes('disabled')).toBeDefined()
		expect(wrapper.find('button').exists()).toBe(true)
	})

	it('display mode shows plain text only — no input, no arrow', () => {
		const wrapper = mount(AFormLink, {
			props: { modelValue: validValue, mode: 'display' },
		})
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.find('button').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').text()).toBe('Acme Corp')
	})

	it('dropdown opens on focus in edit mode when filterFunction provided', async () => {
		const filterFunction = vi.fn((_: string) => [{ id: 'CUST-001', displayText: 'Acme Corp' }])
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, filterFunction },
		})

		await wrapper.find('input').trigger('focus')
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.autocomplete-results').exists()).toBe(true)
	})

	it('filterFunction is called with the typed search text', async () => {
		const filterFunction = vi.fn((_: string): AFormLinkValue[] => [])
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, filterFunction },
		})

		await wrapper.find('input').setValue('Acme')
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(filterFunction).toHaveBeenCalledWith('Acme')
	})

	it('dropdown renders displayText for each option', async () => {
		const filterFunction = vi.fn((_: string) => [
			{ id: 'CUST-001', displayText: 'Acme Corp' },
			{ id: 'CUST-002', displayText: 'Globex Corp' },
		])
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, filterFunction },
		})

		await wrapper.find('input').trigger('focus')
		await flushPromises()
		await wrapper.vm.$nextTick()

		const items = wrapper.findAll('li')
		expect(items).toHaveLength(2)
		expect(items[0].text()).toBe('Acme Corp')
		expect(items[1].text()).toBe('Globex Corp')
	})

	it('selecting an option emits correct AFormLinkValue', async () => {
		const filterFunction = vi.fn((_: string) => [
			{ id: 'CUST-001', displayText: 'Acme Corp' },
			{ id: 'CUST-002', displayText: 'Globex Corp' },
		])
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, filterFunction },
		})

		await wrapper.find('input').trigger('focus')
		await flushPromises()
		await wrapper.vm.$nextTick()

		await wrapper.findAll('li')[1].trigger('mousedown')
		await wrapper.vm.$nextTick()

		const events = wrapper.emitted('update:modelValue')
		expect(events).toBeTruthy()
		expect(events![0][0]).toEqual({ id: 'CUST-002', displayText: 'Globex Corp' })
	})

	it('input reverts to last committed value on Esc when search has no match', async () => {
		const filterFunction = vi.fn((_: string): AFormLinkValue[] => [])
		const wrapper = mount(AFormLink, {
			props: { modelValue: validValue, filterFunction },
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('XYZ')
		await wrapper.vm.$nextTick()

		await input.trigger('keydown.esc')
		await wrapper.vm.$nextTick()

		expect(input.element.value).toBe('Acme Corp')
	})

	it('async filterFunction shows loading state while pending', async () => {
		let resolveResults!: (val: AFormLinkValue[]) => void
		const pending = new Promise<AFormLinkValue[]>(r => {
			resolveResults = r
		})
		const filterFunction = vi.fn((_: string) => pending)

		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, filterFunction, isAsync: true },
		})

		await wrapper.find('input').trigger('focus')
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.loading').exists()).toBe(true)

		resolveResults([{ id: 'CUST-001', displayText: 'Acme Corp' }])
		await flushPromises()

		expect(wrapper.find('.loading').exists()).toBe(false)
	})

	it('arrow click calls navigator.navigate with doctype and id', async () => {
		const navigate = vi.fn()
		const wrapper = mount(AFormLink, {
			props: { modelValue: validValue, doctype: 'customer' },
			global: { provide: { aformLinkNavigator: { navigate } } },
		})

		await wrapper.find('button').trigger('click')

		expect(navigate).toHaveBeenCalledWith('customer', 'CUST-001')
	})

	it('navigation does not occur when id is falsy (arrow is hidden)', () => {
		const navigate = vi.fn()
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, doctype: 'customer' },
			global: { provide: { aformLinkNavigator: { navigate } } },
		})

		expect(wrapper.find('button').exists()).toBe(false)
		expect(navigate).not.toHaveBeenCalled()
	})

	it('Enter key on focused arrow button triggers navigation', async () => {
		const navigate = vi.fn()
		const wrapper = mount(AFormLink, {
			props: { modelValue: validValue, doctype: 'customer' },
			global: { provide: { aformLinkNavigator: { navigate } } },
		})

		await wrapper.find('button').trigger('keydown.enter')

		expect(navigate).toHaveBeenCalledWith('customer', 'CUST-001')
	})

	it('doctype prop is the sole source for navigation target', async () => {
		const navigate = vi.fn()
		const wrapper = mount(AFormLink, {
			props: { modelValue: validValue, doctype: 'customer' },
			global: { provide: { aformLinkNavigator: { navigate } } },
		})

		await wrapper.find('button').trigger('click')

		expect(navigate).toHaveBeenCalledWith('customer', 'CUST-001')
	})

	it('formatter prop transforms the displayed text', () => {
		const formatter = vi.fn((v: AFormLinkValue) => `#${String(v.id)}`)
		const wrapper = mount(AFormLink, {
			props: { modelValue: validValue, formatter },
		})

		expect(wrapper.find('input').element.value).toBe('#CUST-001')
		expect(formatter).toHaveBeenCalledWith(validValue)
	})

	it('read mode: focus does not open the dropdown', async () => {
		const filterFunction = vi.fn((_: string) => [{ id: 'CUST-001', displayText: 'Acme Corp' }])
		const wrapper = mount(AFormLink, {
			props: { modelValue: validValue, filterFunction, mode: 'read' },
		})

		await wrapper.find('input').trigger('focus')
		await flushPromises()

		expect(wrapper.find('.autocomplete-results').exists()).toBe(false)
		expect(filterFunction).not.toHaveBeenCalled()
	})

	it('filterFunction error: dropdown shows no results', async () => {
		const filterFunction = vi.fn((_: string): AFormLinkValue[] => {
			throw new Error('search failed')
		})
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, filterFunction },
		})

		await wrapper.find('input').trigger('focus')
		await flushPromises()

		expect(wrapper.find('.loading').exists()).toBe(false)
		expect(wrapper.findAll('li')).toHaveLength(0)
	})

	it('arrow-down and Enter select an item from the dropdown', async () => {
		const filterFunction = vi.fn((_: string) => [
			{ id: 'CUST-001', displayText: 'Acme Corp' },
			{ id: 'CUST-002', displayText: 'Globex Corp' },
		])
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, filterFunction },
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await flushPromises()

		await input.trigger('keydown.down')
		await input.trigger('keydown.down')
		await input.trigger('keydown.enter')
		await wrapper.vm.$nextTick()

		const events = wrapper.emitted('update:modelValue')
		expect(events![0][0]).toEqual({ id: 'CUST-002', displayText: 'Globex Corp' })
	})

	it('arrow-up from first item clears the active selection', async () => {
		const filterFunction = vi.fn((_: string) => [
			{ id: 'CUST-001', displayText: 'Acme Corp' },
			{ id: 'CUST-002', displayText: 'Globex Corp' },
		])
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, filterFunction },
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await flushPromises()

		await input.trigger('keydown.down')
		await input.trigger('keydown.up')

		// no item should be active
		expect(wrapper.findAll('.is-active')).toHaveLength(0)
	})

	it('arrow-down then arrow-up selects the correct item via Enter', async () => {
		const filterFunction = vi.fn((_: string) => [
			{ id: 'CUST-001', displayText: 'Acme Corp' },
			{ id: 'CUST-002', displayText: 'Globex Corp' },
		])
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, filterFunction },
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await flushPromises()

		await input.trigger('keydown.down')
		await input.trigger('keydown.down')
		await input.trigger('keydown.up')
		await input.trigger('keydown.enter')
		await wrapper.vm.$nextTick()

		const events = wrapper.emitted('update:modelValue')
		expect(events![0][0]).toEqual({ id: 'CUST-001', displayText: 'Acme Corp' })
	})

	it('Enter with no active item does not emit', async () => {
		const filterFunction = vi.fn((_: string) => [{ id: 'CUST-001', displayText: 'Acme Corp' }])
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, filterFunction },
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await flushPromises()

		// press Enter without pressing Down first
		await input.trigger('keydown.enter')
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})

	it('selectOption falls back to String(id) when displayText is absent', async () => {
		const filterFunction = vi.fn((_: string) => [{ id: 42 }])
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, filterFunction },
		})

		await wrapper.find('input').trigger('focus')
		await flushPromises()

		await wrapper.find('li').trigger('mousedown')
		await wrapper.vm.$nextTick()

		expect(wrapper.find('input').element.value).toBe('42')
		const events = wrapper.emitted('update:modelValue')
		expect(events![0][0]).toEqual({ id: 42 })
	})

	it('arrow-down and Up do nothing when dropdown has no results', async () => {
		const filterFunction = vi.fn((_: string): AFormLinkValue[] => [])
		const wrapper = mount(AFormLink, {
			props: { modelValue: { id: '' }, filterFunction },
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await flushPromises()

		await input.trigger('keydown.down')
		await input.trigger('keydown.up')

		expect(wrapper.findAll('.is-active')).toHaveLength(0)
	})

	it('navigation is silent when no doctype is configured', async () => {
		const navigate = vi.fn()
		const wrapper = mount(AFormLink, {
			props: { modelValue: validValue },
			global: { provide: { aformLinkNavigator: { navigate } } },
		})

		await wrapper.find('button').trigger('click')

		expect(navigate).not.toHaveBeenCalled()
	})

	describe('serialized string filterFunction', () => {
		it('deserializes a string filterFunction and populates the dropdown', async () => {
			const serialized = `(search) => [{ id: 'R1', displayText: 'Result One' }]`
			const wrapper = mount(AFormLink, {
				props: { modelValue: { id: '' }, filterFunction: serialized },
			})

			await wrapper.find('input').trigger('focus')
			await flushPromises()
			await wrapper.vm.$nextTick()

			expect(wrapper.find('.autocomplete-results').exists()).toBe(true)
			expect(wrapper.find('li').text()).toBe('Result One')
		})

		it('deserializes an async string filterFunction and populates the dropdown', async () => {
			const serialized = `async (search) => [{ id: 'A1', displayText: 'Async Result' }]`
			const wrapper = mount(AFormLink, {
				props: { modelValue: { id: '' }, filterFunction: serialized },
			})

			await wrapper.find('input').trigger('focus')
			await flushPromises()
			await wrapper.vm.$nextTick()

			expect(wrapper.find('li').text()).toBe('Async Result')
		})

		it('does not crash when string filterFunction is invalid and shows empty dropdown', async () => {
			const serialized = `THIS IS NOT VALID JS %%%`
			const wrapper = mount(AFormLink, {
				props: { modelValue: { id: '' }, filterFunction: serialized },
			})

			await wrapper.find('input').trigger('focus')
			await flushPromises()
			await wrapper.vm.$nextTick()

			expect(wrapper.find('.loading').exists()).toBe(false)
			expect(wrapper.findAll('li')).toHaveLength(0)
		})
	})
})
