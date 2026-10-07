import { flushPromises, mount } from '@vue/test-utils'
import { List } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { install as installAForm } from '@stonecrop/aform'
import { Doctype, Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { makeStonecropPlugin } from './desktop.helpers'

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
})

const usd = { id: 'USD', displayText: 'US Dollar', symbol: '$' }

const mountOrderList = async () => {
	const pinia = createPinia()
	setActivePinia(pinia)
	const registry = new Registry()
	registry.addDoctype(
		new Doctype(
			'order',
			List([
				{ kind: 'field' as const, fieldname: 'id', label: 'ID', component: 'ATextInput' },
				{ kind: 'field' as const, fieldname: 'orderNumber', label: 'Order Number', component: 'ATextInput' },
				{ kind: 'field' as const, fieldname: 'total', label: 'Total', component: 'ACurrencyInput' },
			]),
			{ id: 'order', initial: 'draft', states: { draft: {} } }
		)
	)
	const stonecrop = new Stonecrop(registry)
	stonecrop.addRecord('order', 'o-1', {
		id: 'o-1',
		orderNumber: 'ORD-1',
		total: { amount: 150, currency: usd, baseAmount: 150, baseCurrency: usd, exchangeRate: 1 },
	})

	const routeAdapter: RouteAdapter = {
		getCurrentDoctype: () => 'order',
		getCurrentRecordId: () => '',
		getCurrentView: () => 'records',
		navigate: vi.fn(),
	}
	const wrapper = mount(Desktop, {
		props: { routeAdapter, availableDoctypes: ['order'] },
		global: {
			plugins: [makeStonecropPlugin(registry, stonecrop), pinia, { install: installAForm }],
			stubs: { ActionSet: true, SheetNav: true, CommandPalette: true },
		},
	})
	await flushPromises()
	return wrapper
}

// The records list saves nothing typed into it: a cell it let you edit would show a change the record never gets.
// The doctype's fields declare no `edit`, as no list column does.
describe('records list', { tags: ['component'] }, () => {
	it('lets no cell be typed into', async () => {
		const wrapper = await mountOrderList()

		// The control: the list shows the record, so an empty answer below is about its cells, not a missing table.
		expect(wrapper.find('table').text()).toContain('ORD-1')
		expect(wrapper.findAll('td[data-editable="true"]').map(cell => cell.text())).toEqual([])
	})
})
