import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { buildDoctype, makeStonecropPlugin } from './desktop.helpers'

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
})

describe('Desktop views', { tags: ['component'] }, () => {
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

describe('Desktop FSM state reading', { tags: ['component'] }, () => {
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

describe('Desktop – breadcrumb edge cases', { tags: ['component'] }, () => {
	it('shows "New Record" breadcrumb for a new record', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const doctype = buildDoctype('task', 'draft', {
			draft: { on: { SUBMIT: 'submitted' } },
			submitted: { type: 'final' },
		})
		registry.addDoctype(doctype)

		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'task',
			getCurrentRecordId: () => 'new-abc123',
			getCurrentView: () => 'record',
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

		const sheetNav = wrapper.findComponent({ name: 'SheetNav' })
		const breadcrumbs = sheetNav.props('breadcrumbs') as any[]
		expect(breadcrumbs?.some((b: any) => b.title === 'New Record')).toBe(true)
	})
})

// =============================================================================
// currentViewData — data prop correctness for each view
// These tests verify that rows reach AForm through the `data` prop (formData),
// not through the schema object (the regression introduced by Phase 3).
// =============================================================================

describe('currentViewData — doctypes view', { tags: ['component'] }, () => {
	it('populates data.doctypes_table from availableDoctypes prop', async () => {
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
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		const aform = wrapper.findComponent({ name: 'AForm' })
		const data = aform.props('data') as Record<string, any>
		const rows = data['doctypes_table'] as any[]

		expect(Array.isArray(rows)).toBe(true)
		expect(rows.length).toBe(2)
		expect(rows.some(r => r.doctype === 'task')).toBe(true)
		expect(rows.some(r => r.doctype === 'note')).toBe(true)
	})

	it('schema uses kind: "table" with schema: ColumnSchema[] (not columns)', async () => {
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
				availableDoctypes: ['task'],
			},
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		const aform = wrapper.findComponent({ name: 'AForm' })
		const schema = aform.props('schema') as any[]
		const table = schema[0]

		expect(table.kind).toBe('table')
		expect(Array.isArray(table.schema)).toBe(true)
		expect(table.schema[0]).toHaveProperty('fieldname')
		expect(table).not.toHaveProperty('columns')
		expect(table).not.toHaveProperty('rows')
	})
})

describe('currentViewData — records view', { tags: ['component'] }, () => {
	it('populates data.records_table from HST records', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const doctype = buildDoctype('task', 'draft', {
			draft: { on: { SUBMIT: 'submitted' } },
			submitted: { type: 'final' },
		})
		registry.addDoctype(doctype)
		stonecrop.addRecord('task', 'r-1', { id: 'r-1', title: 'Task One' })
		stonecrop.addRecord('task', 'r-2', { id: 'r-2', title: 'Task Two' })

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
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		const aform = wrapper.findComponent({ name: 'AForm' })
		const data = aform.props('data') as Record<string, any>
		const rows = data['records_table'] as any[]

		expect(Array.isArray(rows)).toBe(true)
		expect(rows.length).toBe(2)
	})

	it('updates data.records_table reactively when records are added to HST after mount', async () => {
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
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		const aform = wrapper.findComponent({ name: 'AForm' })
		const dataBefore = aform.props('data') as Record<string, any>
		expect((dataBefore['records_table'] as any[]).length).toBe(0)

		// Add a record after mount — currentViewData should update reactively via HST
		stonecrop.addRecord('task', 'r-1', { id: 'r-1', title: 'New Task' })
		await nextTick()

		const dataAfter = aform.props('data') as Record<string, any>
		expect((dataAfter['records_table'] as any[]).length).toBe(1)
	})

	it('schema does not include rows property', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const doctype = buildDoctype('task', 'draft', {
			draft: { on: { SUBMIT: 'submitted' } },
			submitted: { type: 'final' },
		})
		registry.addDoctype(doctype)
		stonecrop.addRecord('task', 'r-1', { id: 'r-1', title: 'Task One' })

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
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		const aform = wrapper.findComponent({ name: 'AForm' })
		const schema = aform.props('schema') as any[]
		const table = schema[0]

		expect(table.kind).toBe('table')
		expect(table).not.toHaveProperty('rows')
	})
})

describe('Desktop lifecycle — event listener cleanup', { tags: ['component'] }, () => {
	it('removes keydown event listener on unmount', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const removeListenerSpy = vi.spyOn(document, 'removeEventListener')

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
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()
		wrapper.unmount()

		expect(removeListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
		removeListenerSpy.mockRestore()
	})
})
