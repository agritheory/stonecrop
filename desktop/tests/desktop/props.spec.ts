import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick } from 'vue'

import { Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import StonecropDesktop from '../../src/plugins'
import type { RouteAdapter } from '../../src/types'

import { buildDoctype, makeStonecropPlugin } from './desktop.helpers'

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
})

describe('StonecropDesktop plugin', { tags: ['component'] }, () => {
	it('registers all desktop components globally', () => {
		const app = createApp({ template: '<div />' })
		app.use(StonecropDesktop)

		expect(app.component('ActionSet')).toBeDefined()
		expect(app.component('CommandPalette')).toBeDefined()
		expect(app.component('Desktop')).toBeDefined()
		expect(app.component('SheetNav')).toBeDefined()
	})
})

describe('Desktop props', { tags: ['component'] }, () => {
	describe('routeAdapter', () => {
		let registry: Registry
		let stonecrop: Stonecrop

		beforeEach(() => {
			registry = new Registry()
			stonecrop = new Stonecrop(registry)

			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { SUBMIT: 'submitted' } },
				submitted: { type: 'final' },
			})
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task', status: 'draft' })
		})

		it('uses the adapter to read doctype, recordId, and view', async () => {
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
					stubs: {
						AForm: true,
						ActionSet: true,
						SheetNav: true,
						CommandPalette: true,
					},
				},
			})

			await nextTick()
			// AForm should be rendered because currentViewSchema is non-empty for 'record' + valid doctype
			// The stub renders, so just check it doesn't show the "Loading" fallback
			expect(wrapper.text()).not.toContain('Initializing Stonecrop')
		})

		it('calls adapter.navigate when createNewRecord is triggered via data-action', async () => {
			const navigateFn = vi.fn()
			const adapter: RouteAdapter = {
				getCurrentDoctype: () => 'task',
				getCurrentRecordId: () => '',
				getCurrentView: () => 'records',
				navigate: navigateFn,
			}

			const wrapper = mount(Desktop, {
				props: { routeAdapter: adapter },
				global: {
					plugins: [makeStonecropPlugin(registry, stonecrop)],
					stubs: {
						AForm: true,
						ActionSet: true,
						SheetNav: true,
						CommandPalette: true,
					},
				},
			})

			await nextTick()

			// Simulate a data-action="create" click
			const div = wrapper.find('.desktop')
			const btn = document.createElement('button')
			btn.setAttribute('data-action', 'create')
			;(div.element as HTMLElement).appendChild(btn)
			btn.click()

			await nextTick()

			// navigate should have been called with a 'record' target
			expect(navigateFn).toHaveBeenCalledWith(expect.objectContaining({ view: 'record' }))
		})
	})

	describe('confirmFn', () => {
		it('uses the provided confirmFn instead of native confirm()', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)
			const doctype = buildDoctype('task', 'draft', { draft: { on: { DELETE: 'deleted' } }, deleted: {} })
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'T' })

			const confirmFn = vi.fn().mockResolvedValue(false)
			const adapter: RouteAdapter = {
				getCurrentDoctype: () => 'task',
				getCurrentRecordId: () => 'rec-1',
				getCurrentView: () => 'record',
				navigate: vi.fn(),
			}

			const wrapper = mount(Desktop, {
				props: { routeAdapter: adapter, confirmFn },
				global: {
					plugins: [makeStonecropPlugin(registry, stonecrop)],
					stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
				},
			})

			await nextTick()

			// Inject desktopMethods and call handleDelete
			const provided = (wrapper.vm as any).$.provides
			if (provided?.desktopMethods?.handleDelete) {
				await provided.desktopMethods.handleDelete('rec-1')
			} else {
				await (wrapper.vm as any).handleDelete?.('rec-1')
			}

			await nextTick()

			// confirmFn returned false → no 'action' event
			expect(confirmFn).toHaveBeenCalledWith('Are you sure you want to delete this record?')
			expect(wrapper.emitted('action')).toBeFalsy()
		})
	})

	describe('recordIdField', () => {
		it('uses custom recordIdField for table row ID', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const doctype = buildDoctype(
				'task',
				'draft',
				{
					draft: { on: { SUBMIT: 'submitted' } },
					submitted: { type: 'final' },
				},
				[{ fieldname: 'uuid', fieldtype: 'Data', label: 'UUID', component: 'ATextInput' }]
			)
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'task-1', { id: 1, uuid: 'uuid-abc-123', title: 'My Task' })

			const adapter: RouteAdapter = {
				getCurrentDoctype: () => 'task',
				getCurrentRecordId: () => '',
				getCurrentView: () => 'records',
				navigate: vi.fn(),
			}

			const wrapper = mount(Desktop, {
				props: { routeAdapter: adapter, recordIdField: 'uuid' },
				global: {
					plugins: [makeStonecropPlugin(registry, stonecrop)],
					stubs: {
						AForm: true,
						ActionSet: true,
						SheetNav: true,
						CommandPalette: true,
					},
				},
			})

			await nextTick()

			const aform = wrapper.findComponent({ name: 'AForm' })
			const schema = aform.props('schema') as any[]
			expect(schema).toBeTruthy()
			expect(schema.length).toBeGreaterThan(0)

			const tableSchema = schema[0]
			expect(tableSchema.component).toBe('ATable')
			expect(tableSchema.kind).toBe('table')
			const schemaFields = tableSchema.schema as any[]
			expect(schemaFields.some((f: any) => f.fieldname === 'uuid')).toBe(true)

			const rows = tableSchema.rows as any[]
			expect(rows[0].id).toBe('uuid-abc-123')
		})

		it('defaults recordIdField to "id" when not specified', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { SUBMIT: 'submitted' } },
				submitted: { type: 'final' },
			})
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'task-1', { id: 'task-1', title: 'My Task' })

			const adapter: RouteAdapter = {
				getCurrentDoctype: () => 'task',
				getCurrentRecordId: () => '',
				getCurrentView: () => 'records',
				navigate: vi.fn(),
			}

			const wrapper = mount(Desktop, {
				props: { routeAdapter: adapter },
				global: {
					plugins: [makeStonecropPlugin(registry, stonecrop)],
					stubs: {
						AForm: true,
						ActionSet: true,
						SheetNav: true,
						CommandPalette: true,
					},
				},
			})

			await nextTick()

			const aform = wrapper.findComponent({ name: 'AForm' })
			const schema = aform.props('schema') as any[]
			expect(schema).toBeTruthy()

			const tableSchema = schema[0]
			expect(tableSchema.kind).toBe('table')
			const schemaFields = tableSchema.schema as any[]
			expect(schemaFields.some((f: any) => f.fieldname === 'id')).toBe(true)
		})
	})
})
