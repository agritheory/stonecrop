import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { List } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { nextTick } from 'vue'

import { install as installAForm } from '@stonecrop/aform'
import { Doctype, Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import DesktopRowLink from '../../src/components/DesktopRowLink.vue'
import type { RouteAdapter } from '../../src/types'

import { buildDoctype, makeStonecropPlugin } from './desktop.helpers'

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
})

// Renders the real form and table, so a click lands on the cells Desktop actually draws.
const mountWithTables = async (
	registry: Registry,
	stonecrop: Stonecrop,
	adapter: RouteAdapter,
	availableDoctypes?: string[]
) => {
	const pinia = createPinia()
	setActivePinia(pinia)
	const wrapper = mount(Desktop, {
		props: { routeAdapter: adapter, availableDoctypes },
		global: {
			plugins: [makeStonecropPlugin(registry, stonecrop), pinia, { install: installAForm }],
			stubs: { ActionSet: true, SheetNav: true, CommandPalette: true },
		},
	})
	await flushPromises()
	return wrapper
}

const rowLinks = (wrapper: VueWrapper) => {
	const links = wrapper.findAllComponents(DesktopRowLink)
	expect(links.length).toBeGreaterThan(0)
	return links
}

const taskDoctype = () =>
	buildDoctype('task', 'draft', {
		draft: { on: { SUBMIT: 'submitted' } },
		submitted: { type: 'final' },
	})

const tasksListAdapter = (navigate: RouteAdapter['navigate']): RouteAdapter => ({
	getCurrentDoctype: () => 'task',
	getCurrentRecordId: () => '',
	getCurrentView: () => 'records',
	navigate,
})

describe('Desktop user interactions', { tags: ['component'] }, () => {
	describe('keyboard shortcuts', () => {
		it('opens search drawer on Ctrl+K', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const adapter: RouteAdapter = {
				getCurrentDoctype: () => '',
				getCurrentRecordId: () => '',
				getCurrentView: () => 'doctypes',
				navigate: vi.fn(),
			}

			const wrapper = mount(Desktop, {
				props: { routeAdapter: adapter, availableDoctypes: [] },
				global: {
					plugins: [makeStonecropPlugin(registry, stonecrop)],
					stubs: {
						AForm: true,
						SheetNav: true,
					},
				},
				attachTo: document.body,
			})

			await nextTick()

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
			await nextTick()

			expect(wrapper.find('.action-set__drawer').exists()).toBe(true)
			expect(wrapper.find('.command-search-input').exists()).toBe(true)

			wrapper.unmount()
		})

		it('closes search drawer on Escape when open', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const adapter: RouteAdapter = {
				getCurrentDoctype: () => '',
				getCurrentRecordId: () => '',
				getCurrentView: () => 'doctypes',
				navigate: vi.fn(),
			}

			const wrapper = mount(Desktop, {
				props: { routeAdapter: adapter, availableDoctypes: [] },
				global: {
					plugins: [makeStonecropPlugin(registry, stonecrop)],
					stubs: {
						AForm: true,
						SheetNav: true,
					},
				},
				attachTo: document.body,
			})

			await nextTick()

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
			await nextTick()

			expect(wrapper.find('.action-set__drawer').exists()).toBe(true)

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
			await nextTick()

			expect(wrapper.find('.action-set__drawer').exists()).toBe(false)

			wrapper.unmount()
		})
	})

	describe('list links', () => {
		it('opens the record of the row the link is in', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)
			registry.addDoctype(taskDoctype())
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task' })
			stonecrop.addRecord('task', 'rec-2', { id: 'rec-2', title: 'Another Task' })

			const navigateFn = vi.fn()
			const wrapper = await mountWithTables(registry, stonecrop, tasksListAdapter(navigateFn))

			await rowLinks(wrapper)[1].trigger('click')
			await flushPromises()

			expect(navigateFn.mock.calls).toEqual([[{ view: 'record', doctype: 'task', recordId: 'rec-2' }]])
			expect(wrapper.emitted('record:open')).toEqual([[{ doctype: 'task', recordId: 'rec-2' }]])
		})

		it('opens its row whatever its label says', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)
			registry.addDoctype(taskDoctype())
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task' })

			const navigateFn = vi.fn()
			const wrapper = await mountWithTables(registry, stonecrop, tasksListAdapter(navigateFn))

			const link = rowLinks(wrapper)[0]
			link.element.textContent = 'Open'
			await link.trigger('click')
			await flushPromises()

			expect(navigateFn.mock.calls).toEqual([[{ view: 'record', doctype: 'task', recordId: 'rec-1' }]])
		})

		// A link must open the key the record is stored under, or the record view opens on an HST path
		// that does not exist. The declared `primaryKey` decides that key, and the surrogate `id` must not win.
		it('opens by the declared primaryKey, not the surrogate id', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)
			registry.addDoctype(
				buildDoctype(
					'task',
					'draft',
					{
						draft: { on: { SUBMIT: 'submitted' } },
						submitted: { type: 'final' },
					},
					[
						{
							kind: 'field' as const,
							fieldname: 'custom_id',
							label: 'Custom ID',
							component: 'ATextInput',
							primaryKey: true,
						},
					]
				)
			)
			stonecrop.addRecord('task', 'custom-123', { id: 'rec-1', custom_id: 'custom-123', title: 'My Task' })

			const navigateFn = vi.fn()
			const wrapper = await mountWithTables(registry, stonecrop, tasksListAdapter(navigateFn))

			await rowLinks(wrapper)[0].trigger('click')
			await flushPromises()

			expect(navigateFn.mock.calls).toEqual([[{ view: 'record', doctype: 'task', recordId: 'custom-123' }]])
		})

		it('opens the doctype of the row the link is in, on the doctypes list', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const navigateFn = vi.fn()
			const adapter: RouteAdapter = {
				getCurrentDoctype: () => '',
				getCurrentRecordId: () => '',
				getCurrentView: () => 'doctypes',
				navigate: navigateFn,
			}
			const wrapper = await mountWithTables(registry, stonecrop, adapter, ['sales-order', 'task'])

			await rowLinks(wrapper)[0].trigger('click')
			await flushPromises()

			expect(navigateFn.mock.calls).toEqual([[{ view: 'records', doctype: 'sales-order' }]])
		})

		it('ignores a data cell reading "Edit" in a list', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)
			registry.addDoctype(taskDoctype())
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'Edit' })

			const navigateFn = vi.fn()
			const wrapper = await mountWithTables(registry, stonecrop, tasksListAdapter(navigateFn))

			const link = rowLinks(wrapper)[0]
			const titleCell = wrapper
				.findAll('tbody td')
				.find(cell => cell.text() === 'Edit' && cell.element !== link.element)
			expect(titleCell?.exists()).toBe(true)
			await titleCell!.trigger('click')
			await flushPromises()

			expect(navigateFn).not.toHaveBeenCalled()
		})

		it('ignores a child-table cell reading "Edit" on a record form', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const fields = List([
				{ kind: 'field' as const, fieldname: 'id', label: 'ID', component: 'ATextInput', primaryKey: true },
				{
					kind: 'table' as const,
					fieldname: 'contacts',
					label: 'Contacts',
					columns: [{ fieldname: 'person', label: 'Person', component: 'ATextInput', edit: true }],
				},
			])
			registry.addDoctype(new Doctype('crew', fields, { states: ['draft'], actions: {} } as any))
			stonecrop.addRecord('crew', 'c-1', { id: 'c-1', contacts: [{ person: 'Bo' }, { person: 'Edit' }] })
			// A second crew record, so a click resolved by the child row's position has a record to open.
			stonecrop.addRecord('crew', 'c-2', { id: 'c-2', contacts: [] })

			const navigateFn = vi.fn()
			const adapter: RouteAdapter = {
				getCurrentDoctype: () => 'crew',
				getCurrentRecordId: () => 'c-1',
				getCurrentView: () => 'record',
				navigate: navigateFn,
			}
			const wrapper = await mountWithTables(registry, stonecrop, adapter)

			const editCell = wrapper.findAll('tbody td').find(cell => cell.text() === 'Edit')
			expect(editCell?.exists()).toBe(true)
			await editCell!.trigger('click')
			await flushPromises()

			expect(navigateFn).not.toHaveBeenCalled()
		})
	})
})
