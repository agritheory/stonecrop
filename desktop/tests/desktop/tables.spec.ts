import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { List } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, nextTick } from 'vue'

import { install as installAForm } from '@stonecrop/aform'
import { Doctype, Registry, Stonecrop, useOperationLogStore } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { makeStonecropPlugin } from './desktop.helpers'

// A table's rows are one of the record's fields: a cell typed into is saved, and undone, like any other.
function buildCrewDoctype() {
	const fields = List([
		{ kind: 'field' as const, fieldname: 'id', label: 'ID', component: 'ATextInput', primaryKey: true },
		{
			kind: 'table' as const,
			fieldname: 'contacts',
			label: 'Contacts',
			columns: [{ fieldname: 'person', label: 'Person', component: 'ATextInput', edit: true }],
		},
	])
	const workflow = { states: ['draft'], actions: { save: { label: 'Save', selfTransition: true } } }
	return new Doctype('crew', fields, workflow as any)
}

const routeAdapter: RouteAdapter = {
	getCurrentDoctype: () => 'crew',
	getCurrentRecordId: () => 'c-1',
	getCurrentView: () => 'record',
	navigate: vi.fn(),
}

async function typeIntoCell(wrapper: VueWrapper, text: string) {
	const cell = wrapper.find('td[data-editable="true"]')
	expect(cell.exists()).toBe(true)
	vi.useFakeTimers()
	await cell.trigger('click')
	cell.element.textContent = text
	await cell.trigger('input')
	// ACell's own debounce before it writes the cell.
	vi.advanceTimersByTime(300)
	vi.useRealTimers()
	await flushPromises()
}

async function savedData(wrapper: VueWrapper) {
	const elements = wrapper.findComponent({ name: 'ActionSet' }).props('elements') as any[]
	const save = elements.find(element => element.type === 'dropdown')?.actions.find((a: any) => a.label === 'Save')
	save.action()
	await nextTick()
	const [payload] = wrapper.emitted('action')!.at(-1) as [{ data: Record<string, unknown> }]
	return payload.data
}

describe('Desktop tables', { tags: ['component'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let pinia: ReturnType<typeof createPinia>

	beforeEach(() => {
		pinia = createPinia()
		setActivePinia(pinia)
		registry = new Registry()
		stonecrop = new Stonecrop(registry)
		registry.addDoctype(buildCrewDoctype())
		stonecrop.addRecord('crew', 'c-1', { id: 'c-1', contacts: [{ person: 'Bo' }] })
	})

	afterEach(() => {
		vi.useRealTimers()
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
	})

	const mountDesktop = async () => {
		const wrapper = mount(Desktop, {
			props: { routeAdapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), pinia, { install: installAForm }],
				stubs: { ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})
		await flushPromises()
		return wrapper
	}

	it('saves a cell typed into a table', async () => {
		const wrapper = await mountDesktop()
		await typeIntoCell(wrapper, 'Bob')

		expect((await savedData(wrapper)).contacts).toEqual([{ person: 'Bob' }])
	})

	it('saves a cell typed into a table after a save’s reply replaced the record', async () => {
		const wrapper = await mountDesktop()
		// As `dispatchAction` files a save's reply.
		stonecrop.addRecord('crew', 'c-1', { id: 'c-1', contacts: [{ person: 'Bo' }] })
		await flushPromises()
		await typeIntoCell(wrapper, 'Bob')

		expect((await savedData(wrapper)).contacts).toEqual([{ person: 'Bob' }])
	})

	it('undoes a cell typed into a table', async () => {
		const wrapper = await mountDesktop()
		await typeIntoCell(wrapper, 'Bob')

		const log = useOperationLogStore()
		expect(log.operations.at(-1)).toMatchObject({ path: 'crew.c-1.contacts' })
		log.undo(stonecrop.getStore())

		expect(stonecrop.getRecordById('crew', 'c-1')?.get('contacts')).toEqual([{ person: 'Bo' }])
	})
})

// An app's own line table that writes an edit straight into the row it was handed (#557).
const InPlaceLines = defineComponent({
	name: 'InPlaceLines',
	props: ['rows', 'schema', 'columns', 'config', 'data', 'mode', 'errors', 'uuid', 'label', 'fieldname', 'kind'],
	template: `<button class="in-place-lines" type="button" @click="rows[0].qty = 5">edit</button>`,
})

function buildOrderDoctype() {
	const fields = List([
		{ kind: 'field' as const, fieldname: 'id', label: 'ID', component: 'ATextInput', primaryKey: true },
		{ kind: 'field' as const, fieldname: 'shipping_address', label: 'Shipping Address', component: 'ATextInput' },
		{ kind: 'table' as const, fieldname: 'lines', label: 'Lines', component: 'InPlaceLines', columns: [] },
	])
	const workflow = { states: ['draft'], actions: { save: { label: 'Save', selfTransition: true } } }
	return new Doctype('order', fields, workflow as any)
}

describe('Desktop tables an app draws itself', { tags: ['component'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let pinia: ReturnType<typeof createPinia>

	beforeEach(() => {
		pinia = createPinia()
		setActivePinia(pinia)
		registry = new Registry()
		stonecrop = new Stonecrop(registry)
		registry.addDoctype(buildOrderDoctype())
		stonecrop.addRecord('order', 'o-1', { id: 'o-1', shipping_address: '1 Elm St', lines: [{ sku: 'A-1', qty: 1 }] })
	})

	afterEach(() => {
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
	})

	const mountDesktop = async () => {
		const orderRoute: RouteAdapter = {
			getCurrentDoctype: () => 'order',
			getCurrentRecordId: () => 'o-1',
			getCurrentView: () => 'record',
			navigate: vi.fn(),
		}
		const wrapper = mount(Desktop, {
			props: { routeAdapter: orderRoute },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), pinia, { install: installAForm }],
				components: { InPlaceLines },
				stubs: { ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})
		await flushPromises()
		return wrapper
	}

	it('undoes a line an app component writes straight into its row before the edit made ahead of it', async () => {
		const wrapper = await mountDesktop()
		const address = wrapper.findAll('input')[1]
		await address.setValue('2 Oak Ave')
		await flushPromises()
		await wrapper.find('.in-place-lines').trigger('click')
		await flushPromises()

		const record = () => stonecrop.getRecordById('order', 'o-1')!
		expect(record().get('lines')).toEqual([{ sku: 'A-1', qty: 5 }])
		const log = useOperationLogStore()
		expect(log.operations.at(-1)).toMatchObject({ path: 'order.o-1.lines' })

		log.undo(stonecrop.getStore())

		expect(record().get('lines')).toEqual([{ sku: 'A-1', qty: 1 }])
		expect(record().get('shipping_address')).toBe('2 Oak Ave')
	})
})
