import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import ACell from '../src/components/ACell.vue'
import ATable from '../src/components/ATable.vue'
import type { TableColumn } from '../src/types'

describe('arithmetic number cells', { tags: ['component'] }, () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	const mountTable = (options: TableColumn['options'] = { arithmetic: true }) =>
		mount(ATable, {
			props: {
				rows: [{ qty: 5, note: 'Fragile' }],
				columns: [
					{ name: 'qty', label: 'Qty', component: 'ANumericInput', edit: true, options },
					{ name: 'note', label: 'Note', edit: true },
				],
				config: { view: 'list' },
			},
			attachTo: document.body,
			global: { components: { ACell } },
		})

	type Table = ReturnType<typeof mountTable>
	const qtyCell = (wrapper: Table) => wrapper.find('td[data-colindex="0"]')

	// Focuses the cell, types `text` over its contents and returns the keydown's default-prevented flag per key.
	const typeInto = async (wrapper: Table, text: string) => {
		const cell = qtyCell(wrapper)
		await cell.trigger('focus')
		cell.element.textContent = text
		await cell.trigger('input')
	}

	it('evaluates the typed expression once the cell is left', async () => {
		const wrapper = mountTable()
		await typeInto(wrapper, '12*3+4')
		// Not while typing: the cell holds the expression.
		expect(wrapper.vm.store.getCellData(0, 0)).toBe(5)

		await qtyCell(wrapper).trigger('focusout')
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.store.getCellData(0, 0)).toBe(40)
		expect(qtyCell(wrapper).text()).toBe('40')
		wrapper.unmount()
	})

	it('evaluates the typed expression on Enter', async () => {
		const wrapper = mountTable()
		await typeInto(wrapper, '(2+3)*4')
		await qtyCell(wrapper).trigger('keydown', { key: 'Enter' })
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.store.getCellData(0, 0)).toBe(20)
		wrapper.unmount()
	})

	it('leaves the cell at its last number when the expression is unfinished', async () => {
		const wrapper = mountTable()
		await typeInto(wrapper, '12*')
		await qtyCell(wrapper).trigger('focusout')
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.store.getCellData(0, 0)).toBe(5)
		expect(qtyCell(wrapper).text()).toBe('5')
		wrapper.unmount()
	})

	it('holds null once emptied', async () => {
		const wrapper = mountTable()
		await typeInto(wrapper, '')
		await qtyCell(wrapper).trigger('focusout')

		expect(wrapper.vm.store.getCellData(0, 0)).toBeNull()
		wrapper.unmount()
	})

	it('refuses exponent keys and letters, and takes operators', async () => {
		const wrapper = mountTable()
		const cell = qtyCell(wrapper)
		await cell.trigger('focus')

		const prevented = (key: string) => {
			const event = new KeyboardEvent('keydown', { key, cancelable: true, bubbles: true })
			cell.element.dispatchEvent(event)
			return event.defaultPrevented
		}
		for (const key of ['e', 'E', '^', 'a']) expect(prevented(key), key).toBe(true)
		for (const key of ['1', '+', '-', '*', '/', '%', '(', ')', '.']) expect(prevented(key), key).toBe(false)
		wrapper.unmount()
	})

	it('leaves a number column without the option as it was', async () => {
		const wrapper = mountTable({})
		await typeInto(wrapper, '12*3')
		await qtyCell(wrapper).trigger('focusout')

		const prevented = (() => {
			const event = new KeyboardEvent('keydown', { key: 'e', cancelable: true, bubbles: true })
			qtyCell(wrapper).element.dispatchEvent(event)
			return event.defaultPrevented
		})()
		expect(prevented).toBe(false)
		expect(wrapper.vm.store.getCellData(0, 0)).not.toBe(36)
		wrapper.unmount()
	})
})
