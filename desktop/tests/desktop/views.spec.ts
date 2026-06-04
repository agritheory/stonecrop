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

describe('Desktop – fieldset flattening in records view', { tags: ['component'] }, () => {
	it('flattens fieldset children into flat columns when rendering the records table schema', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		// Doctype with a Fieldset container wrapping the data fields
		const doctype = buildDoctype('widget', 'draft', { draft: {} }, [
			{
				fieldname: 'info_fieldset',
				fieldtype: 'Fieldset',
				label: 'Info',
				component: 'AFieldset',
				schema: [
					{ fieldname: 'color', fieldtype: 'Data', label: 'Color', component: 'ATextInput' },
					{ fieldname: 'weight', fieldtype: 'Data', label: 'Weight', component: 'ATextInput' },
				],
			} as any,
		])
		registry.addDoctype(doctype)

		// Row data has flat keys (matching the fieldset children), not the container fieldname
		stonecrop.addRecord('widget', 'w-1', { id: 'w-1', title: 'Widget', color: 'red', weight: '10g' })

		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'widget',
			getCurrentRecordId: () => '',
			getCurrentView: () => 'records',
			navigate: vi.fn(),
		}

		const wrapper = mount(Desktop, {
			props: { routeAdapter: adapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: {
					SheetNav: true,
					CommandPalette: true,
					ActionSet: true,
				},
			},
		})

		await nextTick()

		// AForm receives currentViewSchema as :schema; inspect through AForm's props
		const aform = wrapper.findComponent({ name: 'AForm' })
		const schema = aform.props('schema') as any[]
		expect(schema).toBeDefined()
		expect(schema.length).toBeGreaterThan(0)

		// The records_table schema should NOT contain the fieldset container
		const tableField = schema[0]
		const tableSchema: any[] = tableField?.schema ?? []
		const fieldnames = tableSchema.map((c: any) => c.fieldname)

		expect(fieldnames).not.toContain('info_fieldset')
		expect(fieldnames).toContain('color')
		expect(fieldnames).toContain('weight')
	})
})

describe('Desktop – currentViewData fieldset nesting', { tags: ['component'] }, () => {
	it('nests flat HST data under fieldset keys so AForm can bind to them', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const doctype = buildDoctype('gadget', 'draft', { draft: {} }, [
			{
				fieldname: 'info_fieldset',
				fieldtype: 'Fieldset',
				label: 'Info',
				component: 'AFieldset',
				schema: [
					{ fieldname: 'color', fieldtype: 'Data', label: 'Color', component: 'ATextInput' },
					{ fieldname: 'weight', fieldtype: 'Data', label: 'Weight', component: 'ATextInput' },
				],
			} as any,
		])
		registry.addDoctype(doctype)

		// Record stored with FLAT data — as the server returns it
		stonecrop.addRecord('gadget', 'g-1', { id: 'g-1', color: 'red', weight: '10g' })

		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'gadget',
			getCurrentRecordId: () => 'g-1',
			getCurrentView: () => 'record',
			navigate: vi.fn(),
		}

		const wrapper = mount(Desktop, {
			props: { routeAdapter: adapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, SheetNav: true, CommandPalette: true, ActionSet: true },
			},
		})

		await nextTick()

		const aform = wrapper.findComponent({ name: 'AForm' })
		const data = aform.props('data') as Record<string, any>

		// AFieldset receives data[fieldsetKey] — must be a nested object with the children
		expect(data['info_fieldset']).toEqual({ color: 'red', weight: '10g' })
	})

	it('flattens nested fieldset data back to flat HST keys on set, with fieldset values winning over stale flat copies', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const doctype = buildDoctype('gadget', 'draft', { draft: {} }, [
			{
				fieldname: 'info_fieldset',
				fieldtype: 'Fieldset',
				label: 'Info',
				component: 'AFieldset',
				schema: [
					{ fieldname: 'color', fieldtype: 'Data', label: 'Color', component: 'ATextInput' },
					{ fieldname: 'weight', fieldtype: 'Data', label: 'Weight', component: 'ATextInput' },
				],
			} as any,
		])
		registry.addDoctype(doctype)
		stonecrop.addRecord('gadget', 'g-1', { id: 'g-1', color: 'red', weight: '10g' })

		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'gadget',
			getCurrentRecordId: () => 'g-1',
			getCurrentView: () => 'record',
			navigate: vi.fn(),
		}

		const wrapper = mount(Desktop, {
			props: { routeAdapter: adapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, SheetNav: true, CommandPalette: true, ActionSet: true },
			},
		})

		await nextTick()

		// Simulate what AForm emits after the user changes color inside the fieldset:
		// it emits the full data including stale flat copy ('red') alongside the updated
		// nested value ('blue'). The nested value must win.
		const aform = wrapper.findComponent({ name: 'AForm' })
		await aform.vm.$emit('update:data', {
			id: 'g-1',
			color: 'red', // stale flat copy
			weight: '10g', // stale flat copy
			info_fieldset: { color: 'blue', weight: '10g' }, // updated nested value
		})
		await nextTick()

		// HST must store the NESTED value ('blue'), not the stale flat copy ('red')
		const record = stonecrop.getRecordById('gadget', 'g-1')
		expect(record?.get('color')).toBe('blue')
		expect(record?.get('weight')).toBe('10g')

		// Use HSTNode.has() to distinguish "key absent" from "key present with undefined value".
		// record?.get('info_fieldset') would return undefined for both — has() is unambiguous.
		const store = stonecrop.getStore()
		expect(store.has('gadget.g-1.info_fieldset')).toBe(false) // truly absent
		expect(store.has('gadget.g-1.color')).toBe(true) // present with correct value
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
