import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import { Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { buildDoctype, makeStonecropPlugin } from './desktop.helpers'

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
})

const routerTestRoutes = [
	{ path: '/', name: 'home', component: { template: '<div/>' } },
	{ path: '/:doctype', name: 'list', component: { template: '<div/>' } },
	{ path: '/:doctype/:recordId', name: 'form', component: { template: '<div/>' } },
	{
		path: '/custom-view',
		name: 'meta-form',
		component: { template: '<div/>' },
		meta: { actualDoctype: 'project', doctype: 'proj' },
	},
	{ path: '/:pathMatch(.*)*', name: 'catch-all', component: { template: '<div/>' } },
]

describe('Desktop – internal router (no routeAdapter)', { tags: ['component'] }, () => {
	it('falls back gracefully with no router and no routeAdapter', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const wrapper = mount(Desktop, {
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		// No routeAdapter → exercises the !props.routeAdapter false paths in all computeds.
		// No registry router → route.value = undefined → all doctypes computed return early.
		expect(wrapper.find('.desktop').exists()).toBe(true)
		const sheetNav = wrapper.findComponent({ name: 'SheetNav' })
		expect(sheetNav.props('breadcrumbs')).toEqual([])
	})

	it('reads doctype and view from internal router for list view', async () => {
		const testRouter = createRouter({ history: createMemoryHistory(), routes: routerTestRoutes })
		const registry = new Registry(testRouter)
		const stonecrop = new Stonecrop(registry)

		const doctype = buildDoctype('task', 'draft', {
			draft: { on: { SUBMIT: 'submitted' } },
			submitted: { type: 'final' },
		})
		registry.addDoctype(doctype)
		stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task' })

		await testRouter.push('/task')
		await testRouter.isReady()

		const wrapper = mount(Desktop, {
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), testRouter],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		// '/task' → name 'list' → currentView='records', currentDoctype='task'
		const sheetNav = wrapper.findComponent({ name: 'SheetNav' })
		const breadcrumbs = sheetNav.props('breadcrumbs') as any[]
		expect(breadcrumbs?.some((b: any) => b.title === 'Task')).toBe(true)
		expect(wrapper.emitted('load-records')).toBeTruthy()
	})

	it('reads doctype and recordId from internal router for form view', async () => {
		const testRouter = createRouter({ history: createMemoryHistory(), routes: routerTestRoutes })
		const registry = new Registry(testRouter)
		const stonecrop = new Stonecrop(registry)

		const doctype = buildDoctype('task', 'draft', {
			draft: { on: { SUBMIT: 'submitted' } },
			submitted: { type: 'final' },
		})
		registry.addDoctype(doctype)
		stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task' })

		await testRouter.push('/task/rec-1')
		await testRouter.isReady()

		const wrapper = mount(Desktop, {
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), testRouter],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		// '/task/rec-1' → name 'form' → currentView='record', currentRecordId='rec-1'
		expect(wrapper.emitted('load-record')).toBeTruthy()
		expect(wrapper.emitted('load-record')![0][0]).toMatchObject({ doctype: 'task', recordId: 'rec-1' })
		const sheetNav = wrapper.findComponent({ name: 'SheetNav' })
		const breadcrumbs = sheetNav.props('breadcrumbs') as any[]
		expect(breadcrumbs?.some((b: any) => b.title === 'Edit Record')).toBe(true)
	})

	it('returns doctypes view for home route', async () => {
		const testRouter = createRouter({ history: createMemoryHistory(), routes: routerTestRoutes })
		const registry = new Registry(testRouter)
		const stonecrop = new Stonecrop(registry)

		await testRouter.push('/')
		await testRouter.isReady()

		const wrapper = mount(Desktop, {
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), testRouter],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		// '/' → name 'home' → currentView='doctypes'
		expect(wrapper.emitted('load-records')).toBeFalsy()
		expect(wrapper.emitted('load-record')).toBeFalsy()
	})

	it('reads actualDoctype and doctype from route meta', async () => {
		const testRouter = createRouter({ history: createMemoryHistory(), routes: routerTestRoutes })
		const registry = new Registry(testRouter)
		const stonecrop = new Stonecrop(registry)

		await testRouter.push('/custom-view')
		await testRouter.isReady()

		const wrapper = mount(Desktop, {
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), testRouter],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		// '/custom-view' → meta.actualDoctype='project', meta.doctype='proj'
		// Exercises the meta.actualDoctype and meta.doctype branches in currentDoctype/routeDoctype
		expect(wrapper.find('.desktop').exists()).toBe(true)
	})

	it('fetches record directly when navigating to record URL without prior list visit', async () => {
		const mockGetRecord = vi
			.fn()
			.mockResolvedValue({ record: { id: 'rec-1', title: 'Fetched', status: 'draft' }, unknownLinks: [] })
		const mockClient = {
			getRecord: mockGetRecord,
			getRecords: vi.fn().mockResolvedValue([]),
			dispatchAction: vi.fn(),
		}

		const testRouter = createRouter({ history: createMemoryHistory(), routes: routerTestRoutes })
		const registry = new Registry(testRouter)
		const stonecrop = new Stonecrop(registry, undefined, { client: mockClient as any })

		const doctype = buildDoctype('task', 'draft', {
			draft: { on: { SUBMIT: 'submitted' } },
			submitted: { type: 'final' },
		})
		registry.addDoctype(doctype)
		// Deliberately NO stonecrop.addRecord() — simulates direct URL navigation without prior list visit

		await testRouter.push('/task/rec-1')
		await testRouter.isReady()

		mount(Desktop, {
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), testRouter],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()
		await nextTick() // allow async loadRecordData to settle

		// Desktop must have attempted a direct fetch for the missing record
		expect(mockGetRecord).toHaveBeenCalled()
		// Record should now be in HST
		const record = stonecrop.getRecordById('task', 'rec-1')
		expect(record).toBeDefined()
		expect(record?.get('title')).toBe('Fetched')
	})

	it('reads doctype and recordId from catch-all pathMatch params', async () => {
		const testRouter = createRouter({ history: createMemoryHistory(), routes: routerTestRoutes })
		const registry = new Registry(testRouter)
		const stonecrop = new Stonecrop(registry)

		await testRouter.push('/some-doctype/some-record')
		await testRouter.isReady()

		const wrapper = mount(Desktop, {
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), testRouter],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		// catch-all route → pathMatch=['some-doctype','some-record']
		// currentDoctype='some-doctype', currentRecordId='some-record', currentView='record'
		expect(wrapper.find('.desktop').exists()).toBe(true)
	})
})

describe('Desktop – currentViewData setter', { tags: ['component'] }, () => {
	it('updates HST store when AForm emits update:data', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const doctype = buildDoctype('task', 'draft', {
			draft: { on: { SUBMIT: 'submitted' } },
			submitted: { type: 'final' },
		})
		registry.addDoctype(doctype)
		stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'Original', status: 'draft' })

		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'task',
			getCurrentRecordId: () => 'rec-1',
			getCurrentView: () => 'record',
			navigate: vi.fn(),
		}

		const wrapper = mount(Desktop, {
			props: { routeAdapter: adapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		const aform = wrapper.findComponent({ name: 'AForm' })
		expect(aform.exists()).toBe(true)
		await aform.vm.$emit('update:data', { id: 'rec-1', title: 'Updated', status: 'draft' })
		await nextTick()

		const store = stonecrop.getStore()
		expect(store.get('task.rec-1.title')).toBe('Updated')
	})

	it('setter returns early when currentDoctype or currentRecordId is empty', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const adapter: RouteAdapter = {
			getCurrentDoctype: () => '',
			getCurrentRecordId: () => '',
			getCurrentView: () => 'doctypes',
			navigate: vi.fn(),
		}

		const wrapper = mount(Desktop, {
			props: { routeAdapter: adapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		// Trigger the setter with empty doctype/recordId – must not throw
		expect(() => {
			;(wrapper.vm as any).currentViewData = { some: 'data' }
		}).not.toThrow()
	})

	it('fetches a list through Stonecrop.getRecords, not through the host', async () => {
		// The list read used to be the host's alone — Desktop only emitted and waited. Three of the
		// four in-repo hosts then hand-rolled the body of getRecords, and all three keyed rows the
		// same wrong way at once. This asserts Desktop now asks for the list itself.
		const mockGetRecords = vi.fn().mockResolvedValue({
			data: [
				{ id: 'rec-1', title: 'First' },
				{ id: 'rec-2', title: 'Second' },
			],
			hasMore: false,
		})
		const mockClient = { getRecord: vi.fn(), getRecords: mockGetRecords, dispatchAction: vi.fn() }

		const testRouter = createRouter({ history: createMemoryHistory(), routes: routerTestRoutes })
		const registry = new Registry(testRouter)
		const stonecrop = new Stonecrop(registry, undefined, { client: mockClient as any })
		registry.addDoctype(buildDoctype('task', 'draft', { draft: {} }))

		await testRouter.push('/task')
		await testRouter.isReady()

		const wrapper = mount(Desktop, {
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), testRouter],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()
		await nextTick()

		expect(mockGetRecords).toHaveBeenCalledOnce()
		// No row limit is passed: that is the server's call, not a shell prop's.
		expect(mockGetRecords).toHaveBeenCalledWith(expect.anything(), undefined)
		expect(stonecrop.getRecordIds('task')).toEqual(['rec-1', 'rec-2'])
		// The event survives as a notification, so a host can still hang analytics off it.
		expect(wrapper.emitted('load-records')).toBeTruthy()
	})

	it.each([
		{ hasMore: true, shown: true, label: 'says so when the backend reports a partial list' },
		{ hasMore: false, shown: false, label: 'stays silent when the list is complete' },
	])('$label', async ({ hasMore, shown }) => {
		// Both directions, because the failure this guards against is a banner that never renders
		// (truncation stays invisible) *and* one that always renders (every list looks truncated).
		// No in-repo dataset exceeds the default 200-row cap, so this state is unreachable in a
		// browser and a test is the only oracle.
		const mockClient = {
			getRecord: vi.fn(),
			getRecords: vi.fn().mockResolvedValue({ data: [{ id: 'rec-1', title: 'First' }], hasMore }),
			dispatchAction: vi.fn(),
		}

		const testRouter = createRouter({ history: createMemoryHistory(), routes: routerTestRoutes })
		const registry = new Registry(testRouter)
		const stonecrop = new Stonecrop(registry, undefined, { client: mockClient as any })
		registry.addDoctype(buildDoctype('task', 'draft', { draft: {} }))

		await testRouter.push('/task')
		await testRouter.isReady()

		const wrapper = mount(Desktop, {
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), testRouter],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()
		await nextTick()

		expect(stonecrop.getPageInfo('task')?.hasMore).toBe(hasMore)
		expect(wrapper.find('.truncation-note').exists()).toBe(shown)
	})

	it('reads nothing when no client is configured, leaving a host-populated store alone', async () => {
		// A host that fills HST some other way keeps working: the loaders no-op rather than throwing
		// "No data client configured" on every navigation.
		const testRouter = createRouter({ history: createMemoryHistory(), routes: routerTestRoutes })
		const registry = new Registry(testRouter)
		const stonecrop = new Stonecrop(registry)
		registry.addDoctype(buildDoctype('task', 'draft', { draft: {} }))
		stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'Host supplied' })

		await testRouter.push('/task')
		await testRouter.isReady()

		const wrapper = mount(Desktop, {
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), testRouter],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()
		await nextTick()

		expect(wrapper.emitted('load-records')).toBeTruthy()
		expect(stonecrop.getRecordById('task', 'rec-1')?.get('title')).toBe('Host supplied')
	})
})
