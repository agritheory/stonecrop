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

/** Mount a records view over one doctype and return the rows AForm renders. */
const renderRows = async (doctype: ReturnType<typeof buildDoctype>, recordId: string, record: object) => {
	const registry = new Registry()
	const stonecrop = new Stonecrop(registry)
	registry.addDoctype(doctype)
	stonecrop.addRecord('task', recordId, record)

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
	expect(schema[0].component).toBe('ATable')
	expect(schema[0].kind).toBe('table')

	// Rows live in formData (the data prop), not in the schema.
	return (aform.props('data') as Record<string, any>)['records_table'] as any[]
}

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

	// A row's id is the key its link resolves to, so it has to be the key the record was stored
	// under. Both cases below assert exactly that, against the two ways identity is declared.
	describe('row identity', () => {
		it('keys a row by the declared primaryKey, matching the key the record is stored under', async () => {
			const doctype = buildDoctype(
				'task',
				'draft',
				{
					draft: { on: { SUBMIT: 'submitted' } },
					submitted: { type: 'final' },
				},
				[{ kind: 'field' as const, fieldname: 'uuid', label: 'UUID', component: 'ATextInput', primaryKey: true }]
			)
			// Stored under the natural key, and carrying a surrogate `id` that must NOT win.
			const rows = await renderRows(doctype, 'uuid-abc-123', { id: 1, uuid: 'uuid-abc-123', title: 'My Task' })

			expect(rows[0].id).toBe('uuid-abc-123')
		})

		it('falls back to `id` when the doctype declares no primaryKey', async () => {
			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { SUBMIT: 'submitted' } },
				submitted: { type: 'final' },
			})
			const rows = await renderRows(doctype, 'task-1', { id: 'task-1', title: 'My Task' })

			expect(rows[0].id).toBe('task-1')
		})
	})
})
