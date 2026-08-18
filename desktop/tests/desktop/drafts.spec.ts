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
		{ kind: 'field' as const, fieldname: 'status', label: 'Status', component: 'ATextInput', default: 'draft' },
	])
	const workflow = { states: ['draft'], actions: { save: { label: 'Save', selfTransition: true } } }
	return new Doctype('task', fields as any, workflow as any)
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
		await nextTick()

		const aform = wrapper.findComponent(AForm)
		await aform.vm.$emit('update:data', { title: 'Buy milk' })
		await flushPromises()

		stonecrop.addRecord('task', '999', { id: '999', title: 'unrelated' })
		await nextTick()

		expect(aform.props('data')).toMatchObject({ title: 'Buy milk' })
	})

	it('seeds a draft with the doctype declared defaults', async () => {
		const wrapper = mountAt('new')
		await nextTick()

		expect(wrapper.findComponent(AForm).props('data')).toMatchObject({ status: 'draft' })
	})

	it('writes no HST node for a draft, so it cannot appear as a list row', async () => {
		const wrapper = mountAt('new')
		await nextTick()

		const aform = wrapper.findComponent(AForm)
		await aform.vm.$emit('update:data', { title: 'Buy milk' })
		await flushPromises()

		expect(stonecrop.getRecordById('task', 'new')).toBeUndefined()
		// The list view reads every key under the doctype node, so any key here becomes a row.
		expect(Object.keys((stonecrop.records('task')?.get('') as Record<string, unknown>) ?? {})).toEqual([])
	})

	it('does not carry one draft into the next', async () => {
		// Every draft routes to the same `/task/new`, so a buffer left behind would open the next
		// New Record pre-filled with the abandoned one.
		const first = mountAt('new')
		await nextTick()
		await first.findComponent(AForm).vm.$emit('update:data', { title: 'Abandoned' })
		await flushPromises()
		first.unmount()

		const second = mountAt('new')
		await nextTick()

		expect(second.findComponent(AForm).props('data')).not.toMatchObject({ title: 'Abandoned' })
	})

	it('still reads a saved record from HST', async () => {
		// The control: the draft branch must not have taken over the normal path.
		stonecrop.addRecord('task', '7', { id: '7', title: 'Saved', status: 'draft' })
		const wrapper = mountAt('7')
		await nextTick()

		expect(wrapper.findComponent(AForm).props('data')).toMatchObject({ title: 'Saved' })
	})
})
