import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, nextTick } from 'vue'

import { Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { buildDoctype, makeStonecropPlugin } from './desktop.helpers'

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
})

describe('Desktop command search', { tags: ['component'] }, () => {
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
				},
			},
		})

		await nextTick()

		const actionSet = wrapper.findComponent({ name: 'ActionSet' })
		const searchFn = actionSet.props('search') as (query: string) => any[]

		expect(typeof searchFn).toBe('function')

		const allCommands = searchFn('')
		expect(allCommands.length).toBeGreaterThan(0)

		const homeCommands = searchFn('home')
		expect(homeCommands.length).toBeGreaterThan(0)

		const noMatch = searchFn('zzzzzyyyy')
		expect(noMatch.length).toBe(0)
	})

	it('executes a command from the search drawer', async () => {
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
					SheetNav: true,
				},
			},
		})

		await nextTick()

		const actionSet = wrapper.findComponent({ name: 'ActionSet' })
		await actionSet.vm.$emit('searchSelect', {
			title: 'Go Home',
			description: 'Navigate to the home page',
			action: () => {},
		})
		await nextTick()

		expect(wrapper.find('.action-set__drawer').exists()).toBe(false)
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
				},
			},
		})

		await nextTick()

		const actionSet = wrapper.findComponent({ name: 'ActionSet' })
		const searchFn = actionSet.props('search') as (query: string) => any[]
		const commands = searchFn('View Task')

		expect(commands.length).toBeGreaterThan(0)

		await commands[0].action()
		await nextTick()
		expect(navigateFn).toHaveBeenCalled()
	})

	// An app that wants a create command in the palette passes `commandSearch`.
	it('offers no command to create a record', async () => {
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
				},
			},
		})

		await nextTick()

		const actionSet = wrapper.findComponent({ name: 'ActionSet' })
		const searchFn = actionSet.props('search') as (query: string) => { title: string }[]

		expect(searchFn('').map(command => command.title)).toEqual(['Go Home', 'Toggle Search', 'View Task Records'])
	})

	it("lists a host's commands in place of Desktop's own", async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		registry.addDoctype(buildDoctype('task', 'draft', { draft: {} }))

		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'task',
			getCurrentRecordId: () => '',
			getCurrentView: () => 'records',
			navigate: vi.fn(),
		}
		const newTask = { title: 'New Task', description: 'Create a task', action: vi.fn() }

		const wrapper = mount(Desktop, {
			props: { routeAdapter: adapter, commandSearch: () => [newTask] },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, ActionSet: true, SheetNav: true },
			},
		})
		await nextTick()

		const searchFn = wrapper.findComponent({ name: 'ActionSet' }).props('search') as (query: string) => unknown[]
		expect(searchFn('')).toEqual([newTask])
	})

	it('runs a command picked in the search drawer, and closes the drawer', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		registry.addDoctype(buildDoctype('task', 'draft', { draft: {} }))

		const navigate = vi.fn()
		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'task',
			getCurrentRecordId: () => '',
			getCurrentView: () => 'records',
			navigate,
		}

		const wrapper = mount(Desktop, {
			props: { routeAdapter: adapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, SheetNav: true, CommandPalette: true },
			},
		})
		await nextTick()

		const searchTile = wrapper.findAll('.action-set__item').find(item => item.attributes('aria-label') === 'Search')
		await searchTile!.trigger('click')
		await wrapper.find('.command-search-input').setValue('View Task')
		const result = wrapper.findAll('.command-search-result').find(item => item.text().includes('View Task Records'))
		await result!.trigger('click')
		await nextTick()

		expect(navigate.mock.calls).toEqual([[{ view: 'records', doctype: 'task' }]])
		expect(wrapper.find('.action-set__drawer').exists()).toBe(false)
	})
})

describe('Desktop – command search action closures', { tags: ['component'] }, () => {
	it('all searchCommands action closures are callable without error', async () => {
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
			props: { routeAdapter: adapter, availableDoctypes: ['task', 'note'] },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, ActionSet: true, SheetNav: true },
			},
		})

		await nextTick()

		const actionSet = wrapper.findComponent({ name: 'ActionSet' })
		const searchFn = actionSet.props('search') as ((query: string) => any[]) | undefined

		expect(typeof searchFn).toBe('function')

		const commands = (searchFn as (query: string) => any[])('')
		expect(commands.length).toBeGreaterThan(0)

		for (const cmd of commands) {
			// oxlint-disable-next-line eslint/no-await-in-loop -- sequential command execution; test asserts navigation after all commands run in order
			await cmd.action()
		}

		await nextTick()
		expect(navigateFn).toHaveBeenCalled()
	})
})

describe('Desktop – ActionSet search slot rendering', { tags: ['component'] }, () => {
	it('renders search title and content slots with result data', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const ActionSetSlotStub = defineComponent({
			props: ['search', 'searchPlaceholder', 'controller', 'slots', 'elements'],
			emits: ['searchSelect', 'actionClick'],
			template: `
				<div>
					<slot name="search-title" :result="{ title: 'Test Command', description: 'Test desc' }"></slot>
					<slot name="search-content" :result="{ title: 'Test Command', description: 'Test desc' }"></slot>
				</div>
			`,
		})

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
					SheetNav: true,
					ActionSet: ActionSetSlotStub,
				},
			},
		})

		await nextTick()

		expect(wrapper.text()).toContain('Test Command')
		expect(wrapper.text()).toContain('Test desc')
	})
})
