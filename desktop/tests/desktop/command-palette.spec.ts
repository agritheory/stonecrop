import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'

import { Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { buildDoctype, makeStonecropPlugin } from './desktop.helpers'

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
})

describe('Desktop command palette', { tags: ['component'] }, () => {
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

		expect(typeof searchFn).toBe('function')

		const allCommands = searchFn('')
		expect(allCommands.length).toBeGreaterThan(0)

		const homeCommands = searchFn('home')
		expect(homeCommands.length).toBeGreaterThan(0)

		const noMatch = searchFn('zzzzzyyyy')
		expect(noMatch.length).toBe(0)
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

		expect(commands.length).toBeGreaterThan(0)

		await commands[0].action()
		await nextTick()
		expect(navigateFn).toHaveBeenCalled()
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

		expect(commands.length).toBeGreaterThan(0)

		await commands[0].action()
		await nextTick()
		expect(navigateFn).toHaveBeenCalledWith(expect.objectContaining({ view: 'record' }))
	})
})

describe('Desktop – command palette action closures', { tags: ['component'] }, () => {
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
				stubs: { AForm: true, ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})

		await nextTick()

		const commandPalette = wrapper.findComponent({ name: 'CommandPalette' })
		const searchFn = commandPalette.props('search') as ((query: string) => any[]) | undefined

		expect(typeof searchFn).toBe('function')

		const commands = (searchFn as (query: string) => any[])('')
		expect(commands.length).toBeGreaterThan(0)

		for (const cmd of commands) {
			await cmd.action()
		}

		await nextTick()
		expect(navigateFn).toHaveBeenCalled()
	})
})

describe('Desktop – CommandPalette slot rendering', { tags: ['component'] }, () => {
	it('renders title and content slots with result data', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const CommandPaletteSlotStub = defineComponent({
			props: ['isOpen', 'search', 'placeholder'],
			emits: ['select', 'close'],
			template: `
				<div>
					<slot name="title" :result="{ title: 'Test Command', description: 'Test desc' }"></slot>
					<slot name="content" :result="{ title: 'Test Command', description: 'Test desc' }"></slot>
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
					ActionSet: true,
					SheetNav: true,
					CommandPalette: CommandPaletteSlotStub,
				},
			},
		})

		await nextTick()

		expect(wrapper.text()).toContain('Test Command')
		expect(wrapper.text()).toContain('Test desc')
	})
})
