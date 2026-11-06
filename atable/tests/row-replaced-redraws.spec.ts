import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vite-plus/test'
import type { ComponentPublicInstance } from 'vue'

import ACell from '../src/components/ACell.vue'
import ARow from '../src/components/ARow.vue'
import ATable from '../src/components/ATable.vue'
import type { TableColumn } from '../src/types'

/*
A host that edits one row hands the table a new list with that row replaced, as AForm does for an edit in an
expanded row. Every keystroke does this, so only the replaced row's cells may redraw: a cell that redraws
because the table rebuilt its row state makes typing cost grow with the table's size.
*/

const columns: TableColumn[] = [
	{ name: 'sku', label: 'SKU', edit: true },
	{ name: 'description', label: 'Description', edit: true },
]

const rowCount = 20
const rows: Record<string, unknown>[] = Array.from({ length: rowCount }, (_, index) => ({
	sku: `S-${index}`,
	description: `Item ${index}`,
}))

// The list with row 3 replaced, as a host hands it back after an edit to that row.
const withRow3 = (list: Record<string, unknown>[], change: Record<string, unknown>) => {
	const next = [...list]
	next[3] = { ...list[3], ...change }
	return next
}

describe('ATable given a list with one row replaced', { tags: ['component'] }, () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it("redraws only that row's cells", async () => {
		let cellRedraws = 0
		const wrapper = mount(ATable, {
			props: { id: 'lines', columns, rows, config: { view: 'list-expansion' } },
			global: {
				components: { ACell, ARow },
				mixins: [
					{
						updated(this: ComponentPublicInstance) {
							if (this.$.type === ACell) cellRedraws++
						},
					},
				],
			},
		})

		await wrapper.setProps({ rows: withRow3(rows, { sku: 'S-3x' }) })

		expect(wrapper.findAllComponents(ACell).map(cell => cell.text())).toContain('S-3x')
		expect(cellRedraws).toBeGreaterThanOrEqual(1)
		expect(cellRedraws).toBeLessThanOrEqual(columns.length)
	})

	it("still moves a cell whose row's indent changed", async () => {
		const indented = withRow3(rows, { indent: 2 })
		const wrapper = mount(ATable, {
			props: { id: 'lines', columns, rows: indented, config: { view: 'list-expansion' } },
			global: { components: { ACell, ARow } },
		})
		const firstCellOfRow3 = () => wrapper.findAllComponents(ACell)[3 * columns.length].element as HTMLElement
		expect(firstCellOfRow3().style.paddingLeft).toBe('2ch')

		await wrapper.setProps({ rows: withRow3(indented, { indent: 4 }) })

		expect(firstCellOfRow3().style.paddingLeft).toBe('4ch')
	})
})
