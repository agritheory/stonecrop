import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import ARowActions from '../src/components/ARowActions.vue'
import { createTableStore } from '../src/stores/table'
import type { RowActionsConfig, TableColumn } from '../src/types'

// Covers the two ATable additions behind the docbuilder "all actions in the menu" work: the
// directional moveUp/moveDown action types, and a per-row `disabled` predicate that greys an
// individual item (move-at-the-ends, lock-aware delete) which the global config alone can't.
describe('ARowActions dropdown: directional moves + per-row disable', { tags: ['component'] }, () => {
	const columns: TableColumn[] = [{ name: 'a', label: 'A', fieldtype: 'Data', edit: false }]
	const rows = [{ a: '1' }, { a: '2' }, { a: '3' }]

	const config: RowActionsConfig = {
		enabled: true,
		forceDropdown: true,
		actions: {
			moveUp: { enabled: true, disabled: rowIndex => rowIndex === 0 },
			moveDown: { enabled: true, disabled: (rowIndex, store) => rowIndex === store.rows.length - 1 },
			duplicate: { enabled: true },
			delete: { enabled: true },
		},
	}

	beforeEach(() => setActivePinia(createPinia()))

	const mountAt = (rowIndex: number) =>
		mount(ARowActions, {
			props: {
				rowIndex,
				store: createTableStore({ columns, rows: [...rows], config: { view: 'list' } }),
				config,
				position: 'end',
			},
		})

	const itemByLabel = (wrapper: ReturnType<typeof mountAt>, label: string) =>
		wrapper.findAll('.row-action-menu-item').find(b => b.text().includes(label))

	it('renders moveUp/moveDown as labelled menu items', () => {
		const wrapper = mountAt(1)
		const labels = wrapper.findAll('.row-action-menu-item .action-label').map(n => n.text())
		expect(labels).toContain('Move Up')
		expect(labels).toContain('Move Down')
	})

	it('greys Move Up on the first row but not Move Down', () => {
		const wrapper = mountAt(0)
		expect((itemByLabel(wrapper, 'Move Up')!.element as HTMLButtonElement).disabled).toBe(true)
		expect((itemByLabel(wrapper, 'Move Down')!.element as HTMLButtonElement).disabled).toBe(false)
	})

	it('greys Move Down on the last row but not Move Up', () => {
		const wrapper = mountAt(2)
		expect((itemByLabel(wrapper, 'Move Up')!.element as HTMLButtonElement).disabled).toBe(false)
		expect((itemByLabel(wrapper, 'Move Down')!.element as HTMLButtonElement).disabled).toBe(true)
	})

	it('emits the action type, row index, and originating event for an enabled item', async () => {
		const wrapper = mountAt(1)
		await itemByLabel(wrapper, 'Duplicate')!.trigger('click')
		expect(wrapper.emitted('action')?.[0]).toEqual(['duplicate', 1, expect.any(MouseEvent)])
	})
})
