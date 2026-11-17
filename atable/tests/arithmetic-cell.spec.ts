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

	// No options: arithmetic is on by default.
	const mountTable = (options?: TableColumn['options']) =>
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
	const qtyCell = (wrapper: Table) => wrapper.find<HTMLTableCellElement>('td[data-colindex="0"]')

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

	it('reads a leading = or + as a spreadsheet does', async () => {
		const wrapper = mountTable()
		await typeInto(wrapper, '=12*3')
		await qtyCell(wrapper).trigger('focusout')
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.store.getCellData(0, 0)).toBe(36)

		await typeInto(wrapper, '+2*4')
		await qtyCell(wrapper).trigger('focusout')
		expect(wrapper.vm.store.getCellData(0, 0)).toBe(8)
		wrapper.unmount()
	})

	it('takes = only as the first character of the cell', async () => {
		const wrapper = mountTable()
		const cell = qtyCell(wrapper).element
		await qtyCell(wrapper).trigger('focus')
		cell.textContent = '12'
		const prevented = (start: number, end: number) => {
			const text = cell.firstChild!
			const range = document.createRange()
			range.setStart(text, start)
			range.setEnd(text, end)
			window.getSelection()!.removeAllRanges()
			window.getSelection()!.addRange(range)
			const event = new KeyboardEvent('keydown', { key: '=', cancelable: true, bubbles: true })
			cell.dispatchEvent(event)
			return event.defaultPrevented
		}
		expect(prevented(2, 2)).toBe(true)
		expect(prevented(0, 0)).toBe(false)
		// Typed over the whole cell, as Excel muscle memory does on a selected cell.
		expect(prevented(0, 2)).toBe(false)
		wrapper.unmount()
	})

	// The table has one row, so Enter has no row to move to and the cell is still being edited.
	it('carries on from the end of the result after Enter on the last row', async () => {
		const wrapper = mountTable()
		const cell = qtyCell(wrapper).element
		cell.focus()
		await typeInto(wrapper, '12*3+4')
		await qtyCell(wrapper).trigger('keydown', { key: 'Enter' })
		expect(wrapper.vm.store.getCellData(0, 0)).toBe(40)
		expect(cell.textContent).toBe('40')

		// The caret is at the end of "40", so "+1" typed next reads as 40+1, not +140.
		const range = window.getSelection()!.getRangeAt(0)
		expect(range.collapsed).toBe(true)
		const before = document.createRange()
		before.selectNodeContents(cell)
		before.setEnd(range.endContainer, range.endOffset)
		const caret = before.toString().length
		expect(caret).toBe(2)

		cell.textContent = cell.textContent.slice(0, caret) + '+1' + cell.textContent.slice(caret)
		await qtyCell(wrapper).trigger('focusout')
		expect(wrapper.vm.store.getCellData(0, 0)).toBe(41)
		wrapper.unmount()
	})

	// A database numeric reaches the table as text; 9007199254740993 is past what a number holds exactly.
	it('writes nothing when a cell is focused and left without an edit, even for a value held as text', async () => {
		const wrapper = mount(ATable, {
			props: {
				rows: [{ qty: '9007199254740993' }],
				columns: [{ name: 'qty', label: 'Qty', component: 'ANumericInput', edit: true }],
				config: { view: 'list' },
			},
			attachTo: document.body,
			global: { components: { ACell } },
		})
		const cell = wrapper.find('td[data-colindex="0"]')
		await cell.trigger('focus')
		await cell.trigger('keydown', { key: 'Enter' })
		await cell.trigger('focusout')
		expect(wrapper.vm.store.getCellData(0, 0)).toBe('9007199254740993')
		expect(cell.classes()).not.toContain('cell-modified')
		wrapper.unmount()
	})

	it("rounds to the column's options.precision", async () => {
		const wrapper = mountTable({ precision: 2 })
		await typeInto(wrapper, '10/3')
		await qtyCell(wrapper).trigger('focusout')
		expect(wrapper.vm.store.getCellData(0, 0)).toBe(3.33)
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

	it('leaves a number column with arithmetic: false as it was', async () => {
		const wrapper = mountTable({ arithmetic: false })
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

	// A doctype declares its format as a function's source, and a database numeric reaches the table as text at its
	// column's scale: '5.000000', shown as 5.
	const mountFormatted = () =>
		mount(ATable, {
			props: {
				rows: [{ qty: '5.000000' }],
				columns: [
					{
						name: 'qty',
						label: 'Qty',
						component: 'ANumericInput',
						edit: true,
						format: "(value) => (value == null || value === '' ? '' : String(Number(value)))",
					},
				],
				config: { view: 'list' },
			},
			attachTo: document.body,
			global: { components: { ACell } },
		})

	it.each([
		['9', 9],
		['12*3', 36],
	])('writes %s typed into a column with a format to the row as the number %d', async (typed, expected) => {
		const wrapper = mountFormatted()
		await typeInto(wrapper, typed)
		await qtyCell(wrapper).trigger('focusout')

		expect(wrapper.vm.store.getCellData(0, 0)).toBe(expected)
		expect(wrapper.emitted('update:rows')?.at(-1)?.[0]).toEqual([{ qty: expected }])
		wrapper.unmount()
	})

	it('leaves a value with a format held as text when its cell is focused and left without an edit', async () => {
		const wrapper = mountFormatted()
		await qtyCell(wrapper).trigger('focus')
		await qtyCell(wrapper).trigger('focusout')

		expect(qtyCell(wrapper).text()).toBe('5')
		expect(wrapper.vm.store.getCellData(0, 0)).toBe('5.000000')
		expect(wrapper.emitted('update:rows')).toBeUndefined()
		wrapper.unmount()
	})
})
