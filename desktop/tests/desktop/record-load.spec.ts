import { mount, flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { List } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'

import { AForm } from '@stonecrop/aform'
import { Doctype, Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { makeStonecropPlugin } from './desktop.helpers'

const SERVER_MESSAGE = 'Doctype "Task" declares a field for column "version_major", which table "task" does not have.'

function buildTaskDoctype() {
	const fields = List([
		{ kind: 'field' as const, fieldname: 'id', label: 'ID', component: 'ATextInput', primaryKey: true },
		{ kind: 'field' as const, fieldname: 'title', label: 'Title', component: 'ATextInput' },
		{ kind: 'field' as const, fieldname: 'status', label: 'Status', component: 'ATextInput' },
	])
	const workflow = { states: ['draft'], actions: { save: { label: 'Save', selfTransition: true } } }
	return new Doctype('task', fields as any, workflow as any)
}

describe('Desktop reading a record', { tags: ['component'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let pinia: ReturnType<typeof createPinia>
	const recordId = ref('t-404')

	const adapter: RouteAdapter = {
		getCurrentDoctype: () => 'task',
		getCurrentRecordId: () => recordId.value,
		getCurrentView: () => 'record',
		navigate: vi.fn(),
	}

	const useClient = (getRecord: ReturnType<typeof vi.fn>) =>
		stonecrop.setClient({
			getMeta: vi.fn(),
			getRecord,
			getRecords: vi.fn().mockResolvedValue({ data: [], hasMore: false }),
			runAction: vi.fn(),
		} as any)

	beforeEach(() => {
		pinia = createPinia()
		setActivePinia(pinia)
		registry = new Registry()
		stonecrop = new Stonecrop(registry)
		registry.addDoctype(buildTaskDoctype())
		recordId.value = 't-404'
	})

	afterEach(() => {
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
	})

	const mountDesktop = () =>
		mount(Desktop, {
			props: { routeAdapter: adapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), pinia],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

	const mainText = (wrapper: ReturnType<typeof mountDesktop>) =>
		wrapper.find('.desktop__main').text().replace(/\s+/g, ' ')

	const recordActions = (wrapper: ReturnType<typeof mountDesktop>) =>
		(wrapper.findComponent({ name: 'ActionSet' }).props('elements') as { label: string }[]).map(e => e.label)

	it('shows that the record is loading, with no form or actions, until it arrives', async () => {
		let answer!: (value: unknown) => void
		useClient(vi.fn(() => new Promise(resolve => (answer = resolve))))

		const wrapper = mountDesktop()
		await flushPromises()

		expect(wrapper.findComponent(AForm).exists()).toBe(false)
		expect(mainText(wrapper)).toContain('Loading record data...')
		expect(recordActions(wrapper)).toEqual([])

		answer({ record: { id: 't-404', title: 'Arrived', status: 'draft' }, unknownLinks: [] })
		await flushPromises()

		expect(wrapper.findComponent(AForm).props('data')).toMatchObject({ title: 'Arrived' })
		expect(recordActions(wrapper)).toEqual(['Actions'])
	})

	it('says a record the server does not find was not found, with no form or actions', async () => {
		useClient(vi.fn().mockResolvedValue({ record: null, unknownLinks: [] }))

		const wrapper = mountDesktop()
		await flushPromises()

		expect(wrapper.findComponent(AForm).exists()).toBe(false)
		expect(mainText(wrapper)).toContain('Task t-404 was not found.')
		expect(mainText(wrapper)).toContain('It may have been deleted, or the link may be wrong.')
		expect(recordActions(wrapper)).toEqual([])
	})

	it('shows why a record could not load, with no form or actions, and reads it again on Try again', async () => {
		const getRecord = vi
			.fn()
			.mockRejectedValueOnce(new Error(SERVER_MESSAGE))
			.mockResolvedValueOnce({ record: { id: 't-404', title: 'Second time', status: 'draft' }, unknownLinks: [] })
		useClient(getRecord)

		const wrapper = mountDesktop()
		await flushPromises()

		expect(wrapper.findComponent(AForm).exists()).toBe(false)
		expect(mainText(wrapper)).toContain("Couldn't load Task t-404.")
		expect(mainText(wrapper)).toContain(SERVER_MESSAGE)
		expect(recordActions(wrapper)).toEqual([])

		await wrapper.get('button.desktop__load-retry').trigger('click')
		await flushPromises()

		expect(getRecord).toHaveBeenCalledTimes(2)
		expect(wrapper.findComponent(AForm).props('data')).toMatchObject({ title: 'Second time' })
	})

	it("never lets a read the user has moved on from replace the current record's state", async () => {
		// The first record's read fails only after the second record's has, which is when a stale
		// answer would land on top of the right one.
		let failFirst!: (reason: unknown) => void
		useClient(
			vi.fn((_doctype: unknown, id: string) =>
				id === 't-404'
					? new Promise((_, reject) => (failFirst = reject))
					: Promise.reject(new Error('The second record failed'))
			)
		)

		const wrapper = mountDesktop()
		await flushPromises()
		recordId.value = 't-2'
		await flushPromises()
		failFirst(new Error(SERVER_MESSAGE))
		await flushPromises()

		expect(mainText(wrapper)).toContain("Couldn't load Task t-2.")
		expect(mainText(wrapper)).toContain('The second record failed')
		expect(mainText(wrapper)).not.toContain(SERVER_MESSAGE)
	})

	it('waits for a host without a client to put the record in the store', async () => {
		// Such a host fills the store itself, on `load-record` or otherwise; Desktop reads nothing.
		const wrapper = mountDesktop()
		await flushPromises()

		expect(wrapper.findComponent(AForm).exists()).toBe(false)
		expect(mainText(wrapper)).toContain('Loading record data...')

		stonecrop.addRecord('task', 't-404', { id: 't-404', title: 'Host supplied', status: 'draft' })
		await flushPromises()

		expect(wrapper.findComponent(AForm).props('data')).toMatchObject({ title: 'Host supplied' })
	})
})
