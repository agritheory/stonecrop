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

describe('Desktop – handleDelete edge cases', () => {
	it('returns early when no recordId is available', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

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

		const methods = (wrapper.vm as any).$.provides?.desktopMethods
		if (methods?.handleDelete) {
			await methods.handleDelete()
			await nextTick()
			expect(wrapper.emitted('action')).toBeFalsy()
		}
	})

	it('uses native confirm when no confirmFn is provided', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const doctype = buildDoctype('task', 'draft', {
			draft: { on: { DELETE: 'deleted' } },
			deleted: { type: 'final' },
		})
		registry.addDoctype(doctype)
		stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'T' })

		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'task',
			getCurrentRecordId: () => 'rec-1',
			getCurrentView: () => 'record',
			navigate: vi.fn(),
		}

		// Stub window.confirm to return false
		const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

		const wrapper = mount(Desktop, {
			props: { routeAdapter: adapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		const methods = (wrapper.vm as any).$.provides?.desktopMethods
		if (methods?.handleDelete) {
			await methods.handleDelete('rec-1')
			await nextTick()
			expect(confirmSpy).toHaveBeenCalled()
			expect(wrapper.emitted('action')).toBeFalsy()
		}

		confirmSpy.mockRestore()
	})
})
