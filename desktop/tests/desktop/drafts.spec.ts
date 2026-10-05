import { mount, flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { List } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'

import { AForm } from '@stonecrop/aform'
import { Doctype, Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { makeStonecropPlugin } from './desktop.helpers'

function buildTaskDoctype() {
	const fields = List([
		{ kind: 'field' as const, fieldname: 'id', label: 'ID', component: 'ATextInput', primaryKey: true },
		{ kind: 'field' as const, fieldname: 'title', label: 'Title', component: 'ATextInput' },
		{ kind: 'field' as const, fieldname: 'status', label: 'Status', component: 'ATextInput' },
		{ kind: 'field' as const, fieldname: 'estimate', label: 'Estimate', component: 'ANumericInput' },
		{ kind: 'field' as const, fieldname: 'billable', label: 'Billable', component: 'ACheckbox' },
		{ kind: 'field' as const, fieldname: 'due', label: 'Due', component: 'ADate' },
	])
	const workflow = { states: ['draft'], actions: { save: { label: 'Save', selfTransition: true } } }
	return new Doctype('task', fields as any, workflow as any, undefined, undefined, undefined, { status: 'draft' })
}

const adapterFor = (recordId: string, view: 'record' | 'records' = 'record'): RouteAdapter => ({
	getCurrentDoctype: () => 'task',
	getCurrentRecordId: () => recordId,
	getCurrentView: () => view,
	navigate: vi.fn(),
})

describe('Desktop draft records', { tags: ['component'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let pinia: ReturnType<typeof createPinia>

	beforeEach(() => {
		pinia = createPinia()
		setActivePinia(pinia)
		registry = new Registry()
		stonecrop = new Stonecrop(registry)
		registry.addDoctype(buildTaskDoctype())
	})

	afterEach(() => {
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
	})

	const mountAt = (recordId: string, view: 'record' | 'records' = 'record') =>
		mount(Desktop, {
			props: { routeAdapter: adapterFor(recordId, view) },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), pinia],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

	it('keeps what was typed into a draft, and hands it to the action', async () => {
		// The regression this exists for: a draft's edits were written to an HST path whose ancestor
		// never existed, so every write threw and the data survived only in the object Vue had
		// cached from the getter. `addRecord` for any record invalidated that cache and the typed
		// fields were silently dropped — a create then persisted an empty record.
		const wrapper = mountAt('new')
		await flushPromises()

		const aform = wrapper.findComponent(AForm)
		aform.vm.$emit('update:data', { title: 'Buy milk' })
		await flushPromises()

		stonecrop.addRecord('task', '999', { id: '999', title: 'unrelated' })
		await flushPromises()

		expect(aform.props('data')).toMatchObject({ title: 'Buy milk' })
	})

	it('sends no value on create for a field nobody filled in', async () => {
		// An insert gives a column its database default only when it leaves the column out: `''` in an
		// identity column fails the insert, `0` creates a row keyed 0, and false or null overrides the default.
		const wrapper = mountAt('new')
		await flushPromises()
		wrapper.findComponent(AForm).vm.$emit('update:data', { title: 'Buy milk' })
		await flushPromises()

		const elements = wrapper.findComponent({ name: 'ActionSet' }).props('elements') as any[]
		const save = elements.find(element => element.type === 'dropdown')?.actions.find((a: any) => a.label === 'Save')
		save.action()
		await nextTick()

		const [payload] = wrapper.emitted('action')!.at(-1) as [{ data: Record<string, unknown> }]
		expect(payload.data).toStrictEqual({ title: 'Buy milk', status: 'draft' })
	})

	it('seeds a draft with the doctype declared defaults', async () => {
		const wrapper = mountAt('new')
		await flushPromises()

		expect(wrapper.findComponent(AForm).props('data')).toMatchObject({ status: 'draft' })
	})

	it('writes no HST node for a draft, so it cannot appear as a list row', async () => {
		const wrapper = mountAt('new')
		await flushPromises()

		const aform = wrapper.findComponent(AForm)
		aform.vm.$emit('update:data', { title: 'Buy milk' })
		await flushPromises()

		expect(stonecrop.getRecordById('task', 'new')).toBeUndefined()
		// The list view reads every key under the doctype node, so any key here becomes a row.
		expect(Object.keys((stonecrop.records('task')?.get('') as Record<string, unknown>) ?? {})).toEqual([])
	})

	it('does not carry one draft into the next', async () => {
		// Every draft routes to the same `/task/new`, so a buffer left behind would open the next
		// New Record pre-filled with the abandoned one.
		const first = mountAt('new')
		await flushPromises()
		first.findComponent(AForm).vm.$emit('update:data', { title: 'Abandoned' })
		await flushPromises()
		first.unmount()

		const second = mountAt('new')
		await flushPromises()

		expect(second.findComponent(AForm).props('data')).not.toMatchObject({ title: 'Abandoned' })
	})

	it('still reads a saved record from HST', async () => {
		// The control: the draft branch must not have taken over the normal path.
		stonecrop.addRecord('task', '7', { id: '7', title: 'Saved', status: 'draft' })
		const wrapper = mountAt('7')
		await nextTick()

		expect(wrapper.findComponent(AForm).props('data')).toMatchObject({ title: 'Saved' })
	})

	// A new form is filled once, with every starting value. Until then Desktop shows its loading state rather
	// than a form whose typing a late value could overwrite, and offers no action on a record not yet there.
	it('shows the loading state, not the form, until the starting values arrive', async () => {
		let release!: () => void
		registry.registerDefaults(
			'task',
			() => new Promise(resolve => (release = () => resolve({ title: 'Call the supplier' })))
		)
		const wrapper = mountAt('new')
		await flushPromises()

		expect(wrapper.findComponent(AForm).exists()).toBe(false)
		expect(wrapper.find('.loading').text()).toBe('Preparing new Task...')
		expect(wrapper.findComponent({ name: 'ActionSet' }).props('elements')).toEqual([])

		release()
		await flushPromises()
		expect(wrapper.findComponent(AForm).props('data')).toMatchObject({ title: 'Call the supplier', status: 'draft' })
	})

	it("opens the form with the doctype's defaults when the app's fail", async () => {
		registry.registerDefaults('task', () => Promise.reject(new Error('defaults endpoint 500')))
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
		const wrapper = mountAt('new')
		await flushPromises()
		warn.mockRestore()

		expect(wrapper.findComponent(AForm).props('data')).toMatchObject({ status: 'draft' })
	})
})
