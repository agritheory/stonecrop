import { flushPromises, mount } from '@vue/test-utils'
import { List } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { install as installAForm } from '@stonecrop/aform'
import { Doctype, Registry, Stonecrop, useOperationLogStore } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { makeStonecropPlugin } from './desktop.helpers'

// An expanded row's form edits one of the record's rows, which the store holds: the edit is logged
// with the row as it was, so undo brings that back.
function buildOrderDoctype() {
	const fields = List([
		{ kind: 'field' as const, fieldname: 'id', label: 'ID', component: 'ATextInput', primaryKey: true },
		{
			kind: 'table' as const,
			fieldname: 'lines',
			label: 'Lines',
			config: { view: 'list-expansion' },
			columns: [{ fieldname: 'sku', label: 'SKU', component: 'ATextInput', edit: true }],
		},
	])
	const workflow = { states: ['draft'], actions: { save: { label: 'Save', selfTransition: true } } }
	return new Doctype('order', fields, workflow as any)
}

const routeAdapter: RouteAdapter = {
	getCurrentDoctype: () => 'order',
	getCurrentRecordId: () => 'o-1',
	getCurrentView: () => 'record',
	navigate: vi.fn(),
}

describe('Desktop expanded rows', { tags: ['component'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let pinia: ReturnType<typeof createPinia>

	beforeEach(() => {
		pinia = createPinia()
		setActivePinia(pinia)
		registry = new Registry()
		stonecrop = new Stonecrop(registry)
		registry.addDoctype(buildOrderDoctype())
		stonecrop.addRecord('order', 'o-1', { id: 'o-1', lines: [{ sku: 'A-1' }] })
	})

	afterEach(() => {
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
	})

	it('undoes an edit made in an expanded row', async () => {
		const wrapper = mount(Desktop, {
			props: { routeAdapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), pinia, { install: installAForm }],
				stubs: { ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})
		await flushPromises()
		await wrapper.find('.expansion-index').trigger('click')
		await flushPromises()
		await wrapper.find('.atable-expanded-content input').setValue('A-9')
		await flushPromises()

		const record = stonecrop.getRecordById('order', 'o-1')
		expect(record?.get('lines')).toEqual([{ sku: 'A-9' }])
		const log = useOperationLogStore()
		expect(log.operations.at(-1)).toMatchObject({ path: 'order.o-1.lines', beforeValue: [{ sku: 'A-1' }] })
		log.undo(stonecrop.getStore())

		expect(record?.get('lines')).toEqual([{ sku: 'A-1' }])
	})
})
