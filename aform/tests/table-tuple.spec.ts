import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { ATable, install as installATable } from '@stonecrop/atable'

import ATableTupleCurrencyPicker from '../src/components/table/ATableTupleCurrencyPicker.vue'
import ATableTupleQuantityPicker from '../src/components/table/ATableTupleQuantityPicker.vue'
import ATupleCellEditor from '../src/components/table/ATupleCellEditor.vue'

let wrapper: VueWrapper | undefined

afterEach(() => {
	wrapper?.unmount()
	wrapper = undefined
})

// A quantity column with a stock unit and no other units to pick from, so its unit picker opens empty.
const mountQuantityTable = async () => {
	wrapper = mount(ATable, {
		props: {
			columns: [{ name: 'qty', label: 'Qty', component: 'AQuantityInput', edit: true, options: { stockUom: 'Nos' } }],
			rows: [{ qty: { qty: 2, uom: 'Nos', stockQty: 2, stockUom: 'Nos', conversionFactor: 1 } }],
			config: { view: 'list' },
		},
		attachTo: document.body,
		global: {
			plugins: [createPinia(), { install: installATable }],
			components: { ATupleCellEditor, ATableTupleQuantityPicker, ATableTupleCurrencyPicker },
		},
	})
	await nextTick()
	return wrapper
}

describe('a table quantity cell', { tags: ['component'] }, () => {
	it('closes its unit picker on Escape when the picker has no units to show', async () => {
		const table = await mountQuantityTable()
		await table.find('td.atable-cell--tuple').trigger('click')
		await nextTick()
		await table.find('input.atable-tuple-shell__input').trigger('keydown', { key: 'ArrowDown', shiftKey: true })
		await nextTick()

		// The control: the picker opened, so the Escape below goes to it.
		const picker = document.querySelector('.atable-tuple-picker-modal')
		expect(picker).not.toBeNull()

		const errors: unknown[] = []
		const onError = (event: ErrorEvent) => errors.push(String(event.error ?? event.message))
		window.addEventListener('error', onError)
		picker!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
		window.removeEventListener('error', onError)
		await nextTick()

		expect(errors).toEqual([])
		expect(document.querySelector('.atable-tuple-picker-modal')).toBeNull()
	})
})
