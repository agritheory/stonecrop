import { mount } from '@vue/test-utils'
import { List } from 'immutable'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { Doctype, Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { makeStonecropPlugin } from './desktop.helpers'

/**
 * Which resolved fields become columns in the records list.
 *
 * A list cell renders one value. An expanding link resolves to `kind: 'link'` or `kind: 'table'`,
 * whose value is a nested record or an array of them — `ACell` has no `cellComponent` for either,
 * so it falls through to `<span>{{ renderedValue }}</span>` and stringifies the child rows. No
 * error, no log: the column is simply wrong.
 *
 * `Registry.buildTableConfig` already answers this question for a child table (`kind === 'field'`);
 * the records list must not answer it a second, different way.
 */

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
})

const workflow = { id: 'order', initial: 'draft', states: { draft: {} } }

const mountRecordsView = (registry: Registry, stonecrop: Stonecrop, doctype: string) => {
	const adapter: RouteAdapter = {
		getCurrentDoctype: () => doctype,
		getCurrentRecordId: () => '',
		getCurrentView: () => 'records',
		navigate: vi.fn(),
	}

	return mount(Desktop, {
		props: { routeAdapter: adapter, availableDoctypes: [doctype] },
		global: {
			plugins: [makeStonecropPlugin(registry, stonecrop)],
			stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
		},
	})
}

const columnsOf = (wrapper: ReturnType<typeof mountRecordsView>): string[] => {
	const schema = wrapper.findComponent({ name: 'AForm' }).props('schema') as any[]
	return (schema[0].schema as any[]).map(c => c.fieldname)
}

describe('records list columns', { tags: ['component'] }, () => {
	it('omits an expanding link, which has no single value to put in a cell', async () => {
		const registry = new Registry()
		registry.addDoctype(
			new Doctype(
				'order-item',
				List([
					{ kind: 'field' as const, fieldname: 'id', label: 'ID', component: 'ATextInput' },
					{ kind: 'field' as const, fieldname: 'qty', label: 'Qty', component: 'AInt' },
				]),
				{ id: 'order-item', initial: 'draft', states: { draft: {} } }
			)
		)
		registry.addDoctype(
			new Doctype(
				'order',
				List([
					{ kind: 'field' as const, fieldname: 'id', label: 'ID', component: 'ATextInput' },
					{ kind: 'field' as const, fieldname: 'items', label: 'Items', component: 'ATable' },
				]),
				workflow,
				undefined,
				{ items: { target: 'order-item', cardinality: 'noneOrMany' } }
			)
		)
		const stonecrop = new Stonecrop(registry)
		stonecrop.addRecord('order', 'o-1', { id: 'o-1', items: [] })

		const wrapper = mountRecordsView(registry, stonecrop, 'order')
		await nextTick()

		expect(columnsOf(wrapper)).toEqual(['id', 'actions'])
	})

	it('still flattens a fieldset, whose children are real columns', async () => {
		// The control: dropping every non-scalar wholesale would take the fieldset's children with
		// it, which is the opposite defect and equally silent.
		const registry = new Registry()
		registry.addDoctype(
			new Doctype(
				'order',
				List([
					{ kind: 'field' as const, fieldname: 'id', label: 'ID', component: 'ATextInput' },
					{
						kind: 'fieldset' as const,
						fieldname: 'totals',
						component: 'AFieldset',
						schema: [{ kind: 'field' as const, fieldname: 'grandTotal', label: 'Total', component: 'AFloat' }],
					},
				]),
				workflow
			)
		)
		const stonecrop = new Stonecrop(registry)
		stonecrop.addRecord('order', 'o-1', { id: 'o-1' })

		const wrapper = mountRecordsView(registry, stonecrop, 'order')
		await nextTick()

		expect(columnsOf(wrapper)).toEqual(['id', 'grandTotal', 'actions'])
	})
})
