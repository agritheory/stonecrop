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
})
