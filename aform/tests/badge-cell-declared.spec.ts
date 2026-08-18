import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { ACell, createTableStore } from '@stonecrop/atable'
import type { TableColumn } from '@stonecrop/atable'

import ABadge from '../src/components/form/ABadge.vue'

// ACell resolves 'ABadge' by name, so the component has to be registered the way aform's
// install() registers it. This lives in aform because atable cannot import it.
const mountCell = (column: Partial<TableColumn>, row: Record<string, unknown>) =>
	mount(ACell, {
		props: {
			colIndex: 0,
			rowIndex: 0,
			store: createTableStore({ columns: [column as TableColumn], rows: [row] }),
		},
		global: { components: { ABadge } },
	})

const badges = { choices: ['Open', 'Closed'], badges: { Open: 'warning', Closed: 'success' } }

describe('cellComponent: ABadge', { tags: ['component'] }, () => {
	beforeEach(() => setActivePinia(createPinia()))

	it('CONTROL — the options branch paints a badge', () => {
		const td = mountCell({ name: 'status', label: 'Status', options: badges }, { status: 'Open' })
		expect(td.text()).toBe('Open')
		expect(td.find('.abadge').classes()).toContain('abadge--warning')
	})

	it('the declared cellComponent route paints the same badge', () => {
		const td = mountCell(
			{ name: 'status', label: 'Status', cellComponent: 'ABadge', options: badges },
			{ status: 'Open' }
		)
		expect(td.text()).toBe('Open')
		expect(td.find('.abadge').classes()).toContain('abadge--warning')
	})

	it('hands ABadge the options it needs', () => {
		const td = mountCell(
			{ name: 'status', label: 'Status', cellComponent: 'ABadge', options: badges },
			{ status: 'Open' }
		)
		const badge = td.findComponent(ABadge)
		expect(badge.props('options')).toEqual(badges)
		expect(badge.props('presentation')).toBe('cell-fill')
	})

	it('hands ABadge the stored value, not the formatted text', () => {
		const td = mountCell(
			{ name: 'status', label: 'Status', cellComponent: 'ABadge', options: badges, format: '(v) => v.toUpperCase()' },
			{ status: 'Open' }
		)
		expect(td.findComponent(ABadge).props('value')).toBe('Open')
	})
})
