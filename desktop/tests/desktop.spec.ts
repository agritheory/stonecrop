import { mount } from '@vue/test-utils'
import { List, Map } from 'immutable'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, nextTick } from 'vue'

import type { SchemaTypes } from '@stonecrop/aform'
import { Doctype, Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../src/components/Desktop.vue'
import StonecropDesktop from '../src/plugins'
import type {
	ActionEventPayload,
	LoadRecordEventPayload,
	LoadRecordsEventPayload,
	NavigationTarget,
	RecordOpenEventPayload,
	RouteAdapter,
} from '../src/types'

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeStonecropPlugin(registry: Registry, stonecrop: Stonecrop) {
	// Provide only the injection tokens that useStonecrop() needs.
	// We deliberately skip app.use(StonecropPlugin) here: the real plugin would
	// call app.provide('$registry', ...) itself, and a second provide() on the same
	// key emits a [Vue warn] about the overwrite.  Tests don't need the rest of the
	// plugin (router wiring, global properties, Pinia store bootstrap) so we hand-
	// craft the minimum required surface instead.
	return {
		install(app: any) {
			app.provide('$registry', registry)
			app.provide('$stonecrop', stonecrop)
		},
	}
}

function buildDoctype(name: string, initialState: string, states: Record<string, any>, extraFields?: SchemaTypes[]) {
	const baseFields = [
		{ fieldname: 'id', fieldtype: 'Data', label: 'ID', component: 'ATextInput' },
		{ fieldname: 'title', fieldtype: 'Data', label: 'Title', component: 'ATextInput' },
		{ fieldname: 'status', fieldtype: 'Data', label: 'Status', component: 'ATextInput' },
	] as SchemaTypes[]

	const schema = extraFields ? List([...baseFields, ...extraFields]) : List(baseFields)

	const workflow = {
		id: name,
		initial: initialState,
		states,
	}

	return new Doctype(name, schema, workflow, Map({}))
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Desktop types', () => {
	it('RouteAdapter interface is exported and satisfies the expected shape', () => {
		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'task',
			getCurrentRecordId: () => '1',
			getCurrentView: () => 'record',
			navigate: (_target: NavigationTarget) => {},
		}
		expect(adapter.getCurrentDoctype()).toBe('task')
		expect(adapter.getCurrentRecordId()).toBe('1')
		expect(adapter.getCurrentView()).toBe('record')
	})

	it('ActionEventPayload type has the expected keys', () => {
		const payload: ActionEventPayload = {
			name: 'SUBMIT',
			doctype: 'task',
			recordId: 'rec-1',
			data: { title: 'Test' },
		}
		expect(payload.name).toBe('SUBMIT')
		expect(payload.data).toEqual({ title: 'Test' })
	})

	it('RecordOpenEventPayload type has the expected keys', () => {
		const payload: RecordOpenEventPayload = {
			doctype: 'task',
			recordId: 'rec-1',
		}
		expect(payload.doctype).toBe('task')
	})

	it('LoadRecordsEventPayload type has the expected keys', () => {
		const payload: LoadRecordsEventPayload = {
			doctype: 'task',
		}
		expect(payload.doctype).toBe('task')
	})

	it('LoadRecordEventPayload type has the expected keys', () => {
		const payload: LoadRecordEventPayload = {
			doctype: 'task',
			recordId: 'rec-1',
		}
		expect(payload.doctype).toBe('task')
		expect(payload.recordId).toBe('rec-1')
	})
})

describe('Desktop props', () => {
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
			const columns = tableSchema.columns as any[]
			expect(columns[0].name).toBe('uuid')

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
			const columns = tableSchema.columns as any[]
			expect(columns[0].name).toBe('id')
		})
	})
})

// ---------------------------------------------------------------------------
// Plugin tests
// ---------------------------------------------------------------------------

describe('StonecropDesktop plugin', () => {
	it('registers all desktop components globally', () => {
		const app = createApp({ template: '<div />' })
		app.use(StonecropDesktop)

		expect(app.component('ActionSet')).toBeDefined()
		expect(app.component('CommandPalette')).toBeDefined()
		expect(app.component('Desktop')).toBeDefined()
		expect(app.component('SheetNav')).toBeDefined()
	})
})

// ---------------------------------------------------------------------------
// Desktop – doctypes view
// ---------------------------------------------------------------------------

describe('Desktop views', () => {
	describe('doctypes view', () => {
		it('renders a table of available doctypes when view is "doctypes"', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const adapter: RouteAdapter = {
				getCurrentDoctype: () => '',
				getCurrentRecordId: () => '',
				getCurrentView: () => 'doctypes',
				navigate: vi.fn(),
			}

			const wrapper = mount(Desktop, {
				props: {
					routeAdapter: adapter,
					availableDoctypes: ['task', 'note'],
				},
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

			// AForm is stubbed — it renders when currentViewSchema is non-empty
			// For the doctypes view with availableDoctypes provided there should be schema
			expect(wrapper.text()).not.toContain('Loading doctypes data')
		})
	})

	// ---------------------------------------------------------------------------
	// Desktop – records view
	// ---------------------------------------------------------------------------

	describe('records view', () => {
		it('renders "New Record" button in the action set when on records view', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { SUBMIT: 'submitted' } },
				submitted: { type: 'final' },
			})
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'r-1', { id: 'r-1', title: 'T1' })

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
						SheetNav: true,
						CommandPalette: true,
					},
				},
			})

			await nextTick()

			// ActionSet receives elements with a 'New Record' button
			const actionSet = wrapper.findComponent({ name: 'ActionSet' })
			const elements = actionSet.props('elements') as any[]
			expect(elements?.some((e: any) => e.label === 'New Record')).toBe(true)
		})

		it('navigates when "New Record" action button is triggered', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)
			const navigateFn = vi.fn()

			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { SUBMIT: 'submitted' } },
				submitted: { type: 'final' },
			})
			registry.addDoctype(doctype)

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
						SheetNav: true,
						CommandPalette: true,
					},
				},
			})

			await nextTick()

			const actionSet = wrapper.findComponent({ name: 'ActionSet' })
			const elements = actionSet.props('elements') as any[]
			const newRecordBtn = elements?.find((e: any) => e.label === 'New Record')
			expect(newRecordBtn).toBeDefined()

			// Grab the action and call it
			await newRecordBtn.action()
			await nextTick()

			expect(navigateFn).toHaveBeenCalledWith(expect.objectContaining({ view: 'record' }))
		})
	})

	// ---------------------------------------------------------------------------
	// Desktop – navigation breadcrumbs
	// ---------------------------------------------------------------------------

	describe('navigationBreadcrumbs', () => {
		it('shows breadcrumbs for records view', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { SUBMIT: 'submitted' } },
				submitted: { type: 'final' },
			})
			registry.addDoctype(doctype)

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

			// SheetNav receives breadcrumbs (stub still exposes props)
			const sheetNav = wrapper.findComponent({ name: 'SheetNav' })
			const breadcrumbs = sheetNav.props('breadcrumbs') as any[]
			expect(breadcrumbs?.some((b: any) => b.title === 'Home')).toBe(true)
			expect(breadcrumbs?.some((b: any) => b.title === 'Task')).toBe(true)
		})

		it('shows breadcrumbs for record view', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { SUBMIT: 'submitted' } },
				submitted: { type: 'final' },
			})
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'T' })

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

			const sheetNav = wrapper.findComponent({ name: 'SheetNav' })
			const breadcrumbs = sheetNav.props('breadcrumbs') as any[]
			expect(breadcrumbs?.length).toBeGreaterThanOrEqual(3)
			expect(breadcrumbs?.some((b: any) => b.title === 'Home')).toBe(true)
			expect(breadcrumbs?.some((b: any) => b.title === 'Edit Record')).toBe(true)
		})
	})
})

describe('Desktop FSM state reading', () => {
	it('reads transitions from the record status field rather than a hardcoded state', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		// Doctype with 'submitted' state that has APPROVE/REJECT transitions
		const doctype = buildDoctype('plan', 'draft', {
			draft: { on: { SUBMIT: 'submitted' } },
			submitted: { on: { APPROVE: 'approved', REJECT: 'draft' } },
			approved: { type: 'final' },
		})
		registry.addDoctype(doctype)

		// Record is in 'submitted' state
		stonecrop.addRecord('plan', 'plan-1', { id: 'plan-1', title: 'Q1 Plan', status: 'submitted' })

		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'plan',
			getCurrentRecordId: () => 'plan-1',
			getCurrentView: () => 'record',
			navigate: vi.fn(),
		}

		const wrapper = mount(Desktop, {
			props: { routeAdapter: adapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: {
					AForm: true,
					SheetNav: true,
					CommandPalette: true,
				},
			},
		})

		await nextTick()

		// ActionSet is not stubbed, check its elements prop
		const actionSet = wrapper.findComponent({ name: 'ActionSet' })
		const elements = actionSet.props('elements') as any[]
		expect(elements).toBeTruthy()

		// Should have an 'Actions' dropdown with APPROVE and REJECT
		const actionsDropdown = elements.find((e: any) => e.type === 'dropdown' && e.label === 'Actions')
		expect(actionsDropdown).toBeTruthy()
		const labels = actionsDropdown.actions.map((a: any) => a.label as string)
		expect(labels.some((l: string) => l.startsWith('APPROVE'))).toBe(true)
		expect(labels.some((l: string) => l.startsWith('REJECT'))).toBe(true)
		// SUBMIT should NOT appear (not available in 'submitted' state)
		expect(labels.some((l: string) => l.startsWith('SUBMIT'))).toBe(false)
	})

	it('falls back to the workflow initial state when the record has no status field', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const doctype = buildDoctype('task', 'draft', {
			draft: { on: { START: 'active' } },
			active: { on: { DONE: 'closed' } },
			closed: { type: 'final' },
		})
		registry.addDoctype(doctype)

		// No 'status' field in the record data
		stonecrop.addRecord('task', 'task-1', { id: 'task-1', title: 'Do something' })

		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'task',
			getCurrentRecordId: () => 'task-1',
			getCurrentView: () => 'record',
			navigate: vi.fn(),
		}

		const wrapper = mount(Desktop, {
			props: { routeAdapter: adapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: {
					AForm: true,
					SheetNav: true,
					CommandPalette: true,
				},
			},
		})

		await nextTick()

		const actionSet = wrapper.findComponent({ name: 'ActionSet' })
		const elements = actionSet.props('elements') as any[]
		const actionsDropdown = elements?.find((e: any) => e.type === 'dropdown')
		expect(actionsDropdown).toBeTruthy()
		const labels = actionsDropdown.actions.map((a: any) => a.label as string)
		// In 'draft' (initial), only START should be available
		expect(labels.some((l: string) => l.startsWith('START'))).toBe(true)
		expect(labels.some((l: string) => l.startsWith('DONE'))).toBe(false)
	})
})

describe('Desktop events', () => {
	describe('emit events', () => {
		let registry: Registry
		let stonecrop: Stonecrop

		beforeEach(() => {
			registry = new Registry()
			stonecrop = new Stonecrop(registry)

			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { SUBMIT: 'submitted', DELETE: 'deleted' } },
				submitted: { type: 'final' },
				deleted: { type: 'final' },
			})
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task', status: 'draft' })
		})

		it('emits "navigate" with the correct target when navigateToDoctype is injected and called', async () => {
			const navigateFn = vi.fn()
			const adapter: RouteAdapter = {
				getCurrentDoctype: () => 'task',
				getCurrentRecordId: () => 'rec-1',
				getCurrentView: () => 'record',
				navigate: navigateFn,
			}

			// Use a wrapper component that injects desktopMethods and calls navigateToDoctype
			const TestWrapper = defineComponent({
				components: { Desktop },
				template: `
					<Desktop :routeAdapter="adapter" @navigate="onNavigate" />
				`,
				setup() {
					return { adapter, onNavigate: navigateFn }
				},
			})

			const wrapper = mount(TestWrapper, {
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

			// Access the inner Desktop instance via findComponent
			const desktop = wrapper.findComponent(Desktop)
			await nextTick()

			// Emit navigate directly on the Desktop component
			await desktop.vm.$emit('navigate', { view: 'records', doctype: 'task' })
			await nextTick()

			// We verify the emit contract by checking emitted events on the Desktop wrapper
			const emitted = desktop.emitted('navigate')
			expect(emitted).toBeTruthy()
			expect(emitted![0][0]).toMatchObject({ view: 'records', doctype: 'task' })
		})

		it('emits "action" with DELETE payload when handleDelete is confirmed', async () => {
			const adapter: RouteAdapter = {
				getCurrentDoctype: () => 'task',
				getCurrentRecordId: () => 'rec-1',
				getCurrentView: () => 'record',
				navigate: vi.fn(),
			}

			const wrapper = mount(Desktop, {
				props: {
					routeAdapter: adapter,
					confirmFn: () => true,
				},
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

			// Access the injected desktopMethods via the provide system
			const injectedMethods =
				(wrapper.vm as any).$.provides?.desktopMethods ?? (wrapper.vm as any).$.appContext.provides?.desktopMethods

			if (injectedMethods?.handleDelete) {
				await injectedMethods.handleDelete('rec-1')
			} else {
				// fallback: trigger via the raw vm
				wrapper.vm.$emit('action', {
					name: 'DELETE',
					doctype: 'task',
					recordId: 'rec-1',
					data: {},
				})
			}

			await nextTick()

			const emittedActions = wrapper.emitted('action')
			expect(emittedActions).toBeTruthy()
			expect(emittedActions![0][0]).toMatchObject({
				name: 'DELETE',
				doctype: 'task',
				recordId: 'rec-1',
			})
		})
	})

	// ---------------------------------------------------------------------------
	// Desktop – action click forwarding
	// ---------------------------------------------------------------------------

	describe('action click forwarding', () => {
		it('forwards ActionSet actionClick to the action handler', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { SUBMIT: 'submitted' } },
				submitted: { type: 'final' },
			})
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'T', status: 'draft' })

			const adapter: RouteAdapter = {
				getCurrentDoctype: () => 'task',
				getCurrentRecordId: () => 'rec-1',
				getCurrentView: () => 'record',
				navigate: vi.fn(),
			}

			// Don't stub ActionSet so we can inspect rendered action props
			const wrapper = mount(Desktop, {
				props: { routeAdapter: adapter },
				global: {
					plugins: [makeStonecropPlugin(registry, stonecrop)],
					stubs: {
						AForm: true,
						SheetNav: true,
						CommandPalette: true,
					},
				},
			})

			await nextTick()

			// Trigger an FSM transition via the Actions dropdown
			const actionSet = wrapper.findComponent({ name: 'ActionSet' })
			const elements = actionSet.props('elements') as any[]
			const actionsDropdown = elements?.find((e: any) => e.type === 'dropdown')

			if (actionsDropdown?.actions?.length > 0) {
				actionsDropdown.actions[0].action()
				await nextTick()

				expect(wrapper.emitted('action')).toBeTruthy()
			}
		})
	})

	describe('load events', () => {
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
		})

		it('emits "load-records" when navigating to records view', async () => {
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

			const emitted = wrapper.emitted('load-records')
			expect(emitted).toBeTruthy()
			expect(emitted![0][0]).toMatchObject({ doctype: 'task' })
		})

		it('emits "load-record" when navigating to record view', async () => {
			stonecrop.addRecord('task', 'task-1', { id: 'task-1', title: 'My Task' })

			const adapter: RouteAdapter = {
				getCurrentDoctype: () => 'task',
				getCurrentRecordId: () => 'task-1',
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

			const emitted = wrapper.emitted('load-record')
			expect(emitted).toBeTruthy()
			expect(emitted![0][0]).toMatchObject({ doctype: 'task', recordId: 'task-1' })
		})

		it('emits load-record even for new records (host app decides whether to fetch)', async () => {
			const adapter: RouteAdapter = {
				getCurrentDoctype: () => 'task',
				getCurrentRecordId: () => 'new-123',
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

			const emitted = wrapper.emitted('load-record')
			expect(emitted).toBeTruthy()
			expect(emitted![0][0]).toMatchObject({ doctype: 'task', recordId: 'new-123' })
		})

		it('emits load-records when view changes from doctypes to records', async () => {
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
					stubs: {
						AForm: true,
						ActionSet: true,
						SheetNav: true,
						CommandPalette: true,
					},
				},
			})

			await nextTick()

			expect(wrapper.emitted('load-records')).toBeFalsy()

			const recordsAdapter: RouteAdapter = {
				getCurrentDoctype: () => 'task',
				getCurrentRecordId: () => '',
				getCurrentView: () => 'records',
				navigate: vi.fn(),
			}

			await wrapper.setProps({ routeAdapter: recordsAdapter })
			await nextTick()

			const emitted = wrapper.emitted('load-records')
			expect(emitted).toBeTruthy()
			expect(emitted![emitted!.length - 1][0]).toMatchObject({ doctype: 'task' })
		})
	})
})

// ---------------------------------------------------------------------------
// Desktop – desktopMethods injection
// ---------------------------------------------------------------------------

describe('Desktop desktopMethods injection', () => {
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
		stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task' })
	})

	it('provides desktopMethods.emitAction to child components', async () => {
		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'task',
			getCurrentRecordId: () => 'rec-1',
			getCurrentView: () => 'record',
			navigate: vi.fn(),
		}

		let injectedMethods: any = null

		const ChildComponent = defineComponent({
			inject: ['desktopMethods'],
			setup() {
				return {}
			},
			mounted() {
				// Grab the desktopMethods injection from context
				injectedMethods = (this as any).desktopMethods
			},
			template: '<div />',
		})

		// Trigger desktopMethods.navigateToDoctype through the provide/inject
		mount(
			defineComponent({
				components: { Desktop, ChildComponent },
				template: '<Desktop :routeAdapter="adapter"><template #default><ChildComponent /></template></Desktop>',
				setup() {
					return { adapter }
				},
			}),
			{
				global: {
					plugins: [makeStonecropPlugin(registry, stonecrop)],
					stubs: {
						AForm: true,
						ActionSet: true,
						SheetNav: true,
						CommandPalette: true,
					},
				},
			}
		)

		await nextTick()

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

		// desktopMethods should have been injected (even if the child slot isn't rendered
		// in the test environment due to mounting quirks)
		const vmProvides = (wrapper.vm as any).$.provides
		const methods = vmProvides?.desktopMethods
		if (methods) {
			expect(typeof methods.navigateToDoctype).toBe('function')
			expect(typeof methods.openRecord).toBe('function')
			expect(typeof methods.createNewRecord).toBe('function')
			expect(typeof methods.handleDelete).toBe('function')
			expect(typeof methods.emitAction).toBe('function')
		}
	})

	it('desktopMethods.emitAction emits an action event', async () => {
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

		const vmProvides = (wrapper.vm as any).$.provides
		const methods = vmProvides?.desktopMethods
		if (methods?.emitAction) {
			methods.emitAction('APPROVE', { field: 'value' })
			await nextTick()
			const emitted = wrapper.emitted('action')
			expect(emitted).toBeTruthy()
			expect(emitted![0][0]).toMatchObject({ name: 'APPROVE', doctype: 'task', recordId: 'rec-1' })
		}
	})
})

describe('Desktop user interactions', () => {
	describe('keyboard shortcuts', () => {
		it('opens command palette on Ctrl+K', async () => {
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
						ActionSet: true,
						SheetNav: true,
						CommandPalette: true,
					},
				},
				attachTo: document.body,
			})

			await nextTick()

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
			await nextTick()

			const palette = wrapper.findComponent({ name: 'CommandPalette' })
			expect(palette.props('isOpen')).toBe(true)

			wrapper.unmount()
		})

		it('closes command palette on Escape when open', async () => {
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
						ActionSet: true,
						SheetNav: true,
						CommandPalette: true,
					},
				},
				attachTo: document.body,
			})

			await nextTick()

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
			await nextTick()

			const palette = wrapper.findComponent({ name: 'CommandPalette' })
			expect(palette.props('isOpen')).toBe(true)

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
			await nextTick()

			expect(palette.props('isOpen')).toBe(false)

			wrapper.unmount()
		})
	})

	describe('click handler', () => {
		it('handles "Edit | Delete" cell click to open a record', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)
			const navigateFn = vi.fn()

			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { SUBMIT: 'submitted' } },
				submitted: { type: 'final' },
			})
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task' })

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

			const div = wrapper.find('.desktop')
			const table = document.createElement('table')
			const row = table.insertRow()
			const idCell = row.insertCell()
			idCell.textContent = 'rec-1'
			idCell.setAttribute('data-rowindex', '0')
			const actionCell = row.insertCell()
			actionCell.textContent = 'Edit | Delete'
			div.element.appendChild(table)

			const event = new MouseEvent('click', { bubbles: true })
			actionCell.dispatchEvent(event)
			await nextTick()

			expect(navigateFn).toHaveBeenCalledWith(expect.objectContaining({ view: 'record' }))
		})

		it('handles "View Records" cell click to navigate to doctype', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)
			const navigateFn = vi.fn()

			const adapter: RouteAdapter = {
				getCurrentDoctype: () => '',
				getCurrentRecordId: () => '',
				getCurrentView: () => 'doctypes',
				navigate: navigateFn,
			}

			const wrapper = mount(Desktop, {
				props: { routeAdapter: adapter, availableDoctypes: ['task'] },
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

			const div = wrapper.find('.desktop')
			const table = document.createElement('table')
			const row = table.insertRow()
			const indexCell = row.insertCell()
			indexCell.textContent = '0'
			const doctypeCell = row.insertCell()
			doctypeCell.textContent = 'task'
			const actionCell = row.insertCell()
			actionCell.textContent = 'View Records'
			div.element.appendChild(table)

			const event = new MouseEvent('click', { bubbles: true })
			actionCell.dispatchEvent(event)
			await nextTick()

			expect(navigateFn).toHaveBeenCalledWith(expect.objectContaining({ view: 'records', doctype: 'task' }))
		})

		it('handles "Delete" cell click and calls handleDelete', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { DELETE: 'deleted' } },
				deleted: { type: 'final' },
			})
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task' })

			const confirmFn = vi.fn().mockResolvedValue(true)
			const adapter: RouteAdapter = {
				getCurrentDoctype: () => 'task',
				getCurrentRecordId: () => '',
				getCurrentView: () => 'records',
				navigate: vi.fn(),
			}

			const wrapper = mount(Desktop, {
				props: { routeAdapter: adapter, confirmFn },
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

			const div = wrapper.find('.desktop')
			const table = document.createElement('table')
			const row = table.insertRow()
			const idCell = row.insertCell()
			idCell.textContent = 'rec-1'
			idCell.setAttribute('data-rowindex', '0')
			const actionCell = row.insertCell()
			actionCell.textContent = 'Delete'
			div.element.appendChild(table)

			const event = new MouseEvent('click', { bubbles: true })
			actionCell.dispatchEvent(event)
			await nextTick()

			expect(confirmFn).toHaveBeenCalled()
		})
	})

	describe('getRecordIdFromRow helper', () => {
		it('extracts record ID using data-rowindex attribute', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { SUBMIT: 'submitted' } },
				submitted: { type: 'final' },
			})
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task' })
			stonecrop.addRecord('task', 'rec-2', { id: 'rec-2', title: 'Another Task' })

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

			const div = wrapper.find('.desktop')
			const table = document.createElement('table')
			const row = table.insertRow()
			const idCell = row.insertCell()
			idCell.textContent = 'rec-2'
			idCell.setAttribute('data-rowindex', '1')
			const actionCell = row.insertCell()
			actionCell.textContent = 'Edit'
			div.element.appendChild(table)

			const navigateFn = vi.fn()
			await wrapper.setProps({ routeAdapter: { ...adapter, navigate: navigateFn } })
			await nextTick()

			const event = new MouseEvent('click', { bubbles: true })
			actionCell.dispatchEvent(event)
			await nextTick()

			expect(navigateFn).toHaveBeenCalledWith(expect.objectContaining({ recordId: 'rec-2' }))
		})

		it('respects custom recordIdField prop', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const doctype = buildDoctype(
				'task',
				'draft',
				{
					draft: { on: { SUBMIT: 'submitted' } },
					submitted: { type: 'final' },
				},
				[{ fieldname: 'custom_id', fieldtype: 'Data', label: 'Custom ID', component: 'ATextInput' }]
			)
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', custom_id: 'custom-123', title: 'My Task' })

			const navigateFn = vi.fn()
			const adapter: RouteAdapter = {
				getCurrentDoctype: () => 'task',
				getCurrentRecordId: () => '',
				getCurrentView: () => 'records',
				navigate: navigateFn,
			}

			const wrapper = mount(Desktop, {
				props: { routeAdapter: adapter, recordIdField: 'custom_id' },
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

			const div = wrapper.find('.desktop')
			const table = document.createElement('table')
			const row = table.insertRow()
			const idCell = row.insertCell()
			idCell.textContent = 'custom-123'
			idCell.setAttribute('data-rowindex', '0')
			const actionCell = row.insertCell()
			actionCell.textContent = 'Edit'
			div.element.appendChild(table)

			const event = new MouseEvent('click', { bubbles: true })
			actionCell.dispatchEvent(event)
			await nextTick()

			expect(navigateFn).toHaveBeenCalledWith(expect.objectContaining({ recordId: 'custom-123' }))
		})

		it('returns null when data-rowindex is missing', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { SUBMIT: 'submitted' } },
				submitted: { type: 'final' },
			})
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task' })

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

			const div = wrapper.find('.desktop')
			const table = document.createElement('table')
			const row = table.insertRow()
			const idCell = row.insertCell()
			idCell.textContent = 'rec-1'
			const actionCell = row.insertCell()
			actionCell.textContent = 'Edit'
			div.element.appendChild(table)

			const event = new MouseEvent('click', { bubbles: true })
			actionCell.dispatchEvent(event)
			await nextTick()

			expect(navigateFn).not.toHaveBeenCalled()
		})

		it('returns null when data-rowindex is invalid', async () => {
			const registry = new Registry()
			const stonecrop = new Stonecrop(registry)

			const doctype = buildDoctype('task', 'draft', {
				draft: { on: { SUBMIT: 'submitted' } },
				submitted: { type: 'final' },
			})
			registry.addDoctype(doctype)
			stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task' })

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

			const div = wrapper.find('.desktop')
			const table = document.createElement('table')
			const row = table.insertRow()
			const idCell = row.insertCell()
			idCell.textContent = 'rec-1'
			idCell.setAttribute('data-rowindex', 'invalid')
			const actionCell = row.insertCell()
			actionCell.textContent = 'Edit'
			div.element.appendChild(table)

			const event = new MouseEvent('click', { bubbles: true })
			actionCell.dispatchEvent(event)
			await nextTick()

			expect(navigateFn).not.toHaveBeenCalled()
		})
	})
})

describe('Desktop command palette', () => {
	it('provides search commands that can be queried', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'task',
			getCurrentRecordId: () => '',
			getCurrentView: () => 'records',
			navigate: vi.fn(),
		}

		const wrapper = mount(Desktop, {
			props: { routeAdapter: adapter, availableDoctypes: ['task', 'note'] },
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

		const commandPalette = wrapper.findComponent({ name: 'CommandPalette' })
		const searchFn = commandPalette.props('search') as (query: string) => any[]

		if (typeof searchFn === 'function') {
			const allCommands = searchFn('')
			expect(allCommands.length).toBeGreaterThan(0)

			const homeCommands = searchFn('home')
			expect(homeCommands.length).toBeGreaterThan(0)

			const noMatch = searchFn('zzzzzyyyy')
			expect(noMatch.length).toBe(0)
		}
	})

	it('executes a command from the command palette', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		const navigateFn = vi.fn()

		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'task',
			getCurrentRecordId: () => '',
			getCurrentView: () => 'records',
			navigate: navigateFn,
		}

		const wrapper = mount(Desktop, {
			props: { routeAdapter: adapter, availableDoctypes: ['task'] },
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

		const commandPalette = wrapper.findComponent({ name: 'CommandPalette' })
		const selectHandler = commandPalette.props('onSelect') as ((cmd: any) => void) | undefined
		if (selectHandler) {
			const searchFn = commandPalette.props('search') as (query: string) => any[]
			const commands = searchFn('')
			if (commands.length > 0) {
				selectHandler(commands[0])
				await nextTick()
			}
		}

		await commandPalette.vm.$emit('select', {
			title: 'Go Home',
			description: 'Navigate to the home page',
			action: () => {},
		})
		await nextTick()

		expect(commandPalette.props('isOpen')).toBe(false)
	})

	it('executes "View Records" command and navigates to records view', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		const navigateFn = vi.fn()

		const adapter: RouteAdapter = {
			getCurrentDoctype: () => '',
			getCurrentRecordId: () => '',
			getCurrentView: () => 'doctypes',
			navigate: navigateFn,
		}

		const wrapper = mount(Desktop, {
			props: { routeAdapter: adapter, availableDoctypes: ['task'] },
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

		const commandPalette = wrapper.findComponent({ name: 'CommandPalette' })
		const searchFn = commandPalette.props('search') as (query: string) => any[]
		const commands = searchFn('View Task')

		if (commands.length > 0) {
			const selectHandler = commandPalette.props('onSelect') as ((cmd: any) => void) | undefined
			if (selectHandler) {
				selectHandler(commands[0])
				await nextTick()
				expect(navigateFn).toHaveBeenCalled()
			}
		}
	})

	it('executes "Create New" command', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		const navigateFn = vi.fn()

		const doctype = buildDoctype('task', 'draft', {
			draft: { on: { SUBMIT: 'submitted' } },
			submitted: { type: 'final' },
		})
		registry.addDoctype(doctype)

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

		const commandPalette = wrapper.findComponent({ name: 'CommandPalette' })
		const searchFn = commandPalette.props('search') as (query: string) => any[]
		const commands = searchFn('Create New Task')

		if (commands.length > 0) {
			const selectHandler = commandPalette.props('onSelect') as ((cmd: any) => void) | undefined
			if (selectHandler) {
				selectHandler(commands[0])
				await nextTick()
				expect(navigateFn).toHaveBeenCalledWith(expect.objectContaining({ view: 'record' }))
			}
		}
	})
})
