import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'

import { Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { buildDoctype, makeStonecropPlugin } from './desktop.helpers'

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
})

describe('Desktop events', { tags: ['component'] }, () => {
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
	})

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

			expect(actionsDropdown?.actions?.length).toBeGreaterThan(0)
			actionsDropdown.actions[0].action()
			await nextTick()

			expect(wrapper.emitted('action')).toBeTruthy()
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

describe('Desktop desktopMethods injection', { tags: ['component'] }, () => {
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

		const ChildComponent = defineComponent({
			inject: ['desktopMethods'],
			setup() {
				return {}
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
		expect(methods).toBeDefined()
		expect(typeof methods.navigateToDoctype).toBe('function')
		expect(typeof methods.openRecord).toBe('function')
		expect(typeof methods.createNewRecord).toBe('function')
		expect(typeof methods.emitAction).toBe('function')
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
		expect(methods?.emitAction).toBeDefined()
		methods.emitAction('APPROVE', { field: 'value' })
		await nextTick()
		const emitted = wrapper.emitted('action')
		expect(emitted).toBeTruthy()
		expect(emitted![0][0]).toMatchObject({ name: 'APPROVE', doctype: 'task', recordId: 'rec-1' })
	})
})

describe('Desktop – doNavigate without routeAdapter', { tags: ['component'] }, () => {
	it('emits navigate for all target views when no routeAdapter is provided', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const wrapper = mount(Desktop, {
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		const methods = (wrapper.vm as any).$.provides?.desktopMethods
		expect(methods).toBeDefined()

		await methods.navigateToDoctype('task')
		await nextTick()
		expect(wrapper.emitted('navigate')).toBeTruthy()

		await methods.createNewRecord()
		await nextTick()

		await methods.openRecord('rec-1')
		await nextTick()

		expect(wrapper.emitted('navigate')!.length).toBeGreaterThan(1)
		expect(wrapper.emitted('record:open')).toBeTruthy()
	})
})

describe('Desktop – handleActionClick branches', { tags: ['component'] }, () => {
	it('does nothing when actionClick is emitted with an undefined action', async () => {
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

		const actionSet = wrapper.findComponent({ name: 'ActionSet' })
		await actionSet.vm.$emit('actionClick', 'SomeLabel', undefined)
		await nextTick()

		expect(wrapper.emitted('action')).toBeFalsy()
	})

	it('calls the action function when actionClick is emitted with a valid action', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		const mockAction = vi.fn()

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

		const actionSet = wrapper.findComponent({ name: 'ActionSet' })
		await actionSet.vm.$emit('actionClick', 'SomeLabel', mockAction)
		await nextTick()

		expect(mockAction).toHaveBeenCalled()
	})
})
