import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import { useActionSet } from '../../src/composables/useActionSet'
import type { ActionSetSlot, RouteAdapter } from '../../src/types'

import { buildDoctype, findActionSet, makeStonecropPlugin, openActionsDrawer } from './desktop.helpers'

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
})

const StubPreview = defineComponent({
	props: { title: { type: String, default: 'Preview' } },
	template: '<p class="stub-preview">{{ title }}</p>',
})

const PreviewSlot = defineComponent({
	setup() {
		const actionSet = useActionSet()
		return {
			open: () => actionSet.present({ id: 'preview-1', view: StubPreview, props: { title: 'Invoice.pdf' } }),
		}
	},
	template: '<button type="button" class="open-preview" @click="open">Open preview</button>',
})

function recordAdapter(): RouteAdapter {
	return {
		getCurrentDoctype: () => 'task',
		getCurrentRecordId: () => 'rec-1',
		getCurrentView: () => 'record',
		navigate: vi.fn(),
	}
}

function mountDesktop(actionSetSlots?: ActionSetSlot[]) {
	const registry = new Registry()
	const stonecrop = new Stonecrop(registry)
	const doctype = buildDoctype('task', 'draft', {
		draft: { on: { SUBMIT: 'submitted' } },
		submitted: { type: 'final' },
	})
	registry.addDoctype(doctype)
	stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task', status: 'draft' })

	return mount(Desktop, {
		props: {
			routeAdapter: recordAdapter(),
			...(actionSetSlots ? { actionSetSlots } : {}),
		},
		global: {
			plugins: [makeStonecropPlugin(registry, stonecrop)],
			stubs: {
				AForm: true,
				SheetNav: true,
				CommandPalette: true,
			},
		},
	})
}

describe('Desktop ActionSet', { tags: ['component'] }, () => {
	it('renders the tile even when actionSetSlots is omitted', async () => {
		const wrapper = mountDesktop()
		await nextTick()

		expect(wrapper.find('.action-set').exists()).toBe(true)
		expect(wrapper.find('.action-set__tile').exists()).toBe(true)
		expect(wrapper.find('.action-set__toggle').exists()).toBe(true)
	})

	it('shows Search, slot icons, and Actions in the tile when expanded', async () => {
		const wrapper = mountDesktop([
			{ id: 'files', label: 'Files' },
			{ id: 'collaboration', label: 'Collaboration' },
		])
		await nextTick()

		const items = wrapper.findAll('.action-set__item')
		expect(items.length).toBe(4)
		expect(items[0].attributes('aria-label')).toBe('Search')
		expect(items[1].attributes('aria-label')).toBe('Files')
		expect(items[2].attributes('aria-label')).toBe('Collaboration')
		expect(items[3].attributes('aria-label')).toBe('Actions')
		expect(items[0].find('.action-set__item-icon').exists()).toBe(true)
		expect(items[3].find('.action-set__item-icon').exists()).toBe(true)
		expect(items[3].find('.action-set__item-fallback').exists()).toBe(false)
	})

	it('collapses and expands with the + toggle', async () => {
		const wrapper = mountDesktop([{ id: 'files', label: 'Files' }])
		await nextTick()

		expect(wrapper.find('.action-set__item').exists()).toBe(true)

		await wrapper.find('.action-set__toggle').trigger('click')
		await nextTick()

		expect(wrapper.find('.action-set__item').exists()).toBe(false)

		await wrapper.find('.action-set__toggle').trigger('click')
		await nextTick()

		expect(wrapper.find('.action-set__item').exists()).toBe(true)
	})

	it('opens drawer when a slot tile is clicked and keeps tiles visible', async () => {
		const wrapper = mountDesktop([
			{ id: 'files', label: 'Files' },
			{ id: 'collaboration', label: 'Collaboration' },
		])
		await nextTick()

		const filesItem = wrapper.findAll('.action-set__item').find(i => i.attributes('aria-label') === 'Files')
		await filesItem!.trigger('click')
		await nextTick()

		expect(wrapper.find('.action-set__drawer').exists()).toBe(true)
		expect(wrapper.find('.desktop').classes()).toContain('desktop--action-set-open')
		expect(wrapper.findAll('.action-set__item')).toHaveLength(4)
		expect(filesItem!.classes()).toContain('action-set__item--active')
		expect(wrapper.find('.action-set__tab').exists()).toBe(false)
	})

	it('shows actions list in drawer body when Actions tab is clicked', async () => {
		const wrapper = mountDesktop([{ id: 'files', label: 'Files' }])
		await nextTick()

		await openActionsDrawer(wrapper)

		expect(wrapper.find('.action-set__drawer').exists()).toBe(true)
		expect(wrapper.find('.action-set__actions-list').exists()).toBe(true)
		expect(wrapper.find('.action-set__actions-list-item').text()).toBe('SUBMIT')
	})

	it('switches to actions view when the Actions tile is clicked while drawer is open', async () => {
		const wrapper = mountDesktop([{ id: 'files', label: 'Files' }])
		await nextTick()

		const filesItem = wrapper.findAll('.action-set__item').find(i => i.attributes('aria-label') === 'Files')
		await filesItem!.trigger('click')
		await nextTick()

		const actionsItem = wrapper.findAll('.action-set__item').find(i => i.attributes('aria-label') === 'Actions')
		await actionsItem!.trigger('click')
		await nextTick()

		expect(wrapper.find('.action-set__actions-list').exists()).toBe(true)
		expect(actionsItem!.classes()).toContain('action-set__item--active')
	})

	it('paints a badge count and hides it when the count is 0', async () => {
		const count = ref(3)
		const wrapper = mountDesktop([
			{ id: 'files', label: 'Files', badge: count },
			{ id: 'collaboration', label: 'Collaboration' },
		])
		await nextTick()

		expect(wrapper.find('.action-set__item-badge').text()).toBe('3')

		count.value = 0
		await nextTick()
		expect(wrapper.find('.action-set__item-badge').exists()).toBe(false)
	})

	it('pushes content when Actions drawer is opened', async () => {
		const wrapper = mountDesktop([{ id: 'files', label: 'Files' }])
		await nextTick()

		await openActionsDrawer(wrapper)

		expect(wrapper.find('.desktop').classes()).toContain('desktop--action-set-open')
		expect(wrapper.find('.action-set__actions-list').exists()).toBe(true)
	})

	it('mounts a presented host view in the 50% pane and clears it on close', async () => {
		const wrapper = mountDesktop([{ id: 'files', label: 'Files', component: PreviewSlot }])
		await nextTick()

		const filesItem = wrapper.findAll('.action-set__item').find(i => i.attributes('aria-label') === 'Files')
		await filesItem!.trigger('click')
		await nextTick()
		await wrapper.find('.open-preview').trigger('click')
		await nextTick()

		expect(wrapper.find('.desktop').classes()).toContain('desktop--preview-open')
		expect(wrapper.find('.stub-preview').text()).toBe('Invoice.pdf')

		await wrapper.find('.desktop__preview-close').trigger('click')
		await nextTick()

		expect(wrapper.find('.stub-preview').exists()).toBe(false)
		expect(wrapper.find('.desktop').classes()).not.toContain('desktop--preview-open')
	})

	it('hides a slot when show is false', async () => {
		const wrapper = mountDesktop([
			{ id: 'files', label: 'Files', show: false },
			{ id: 'collaboration', label: 'Email' },
		])
		await nextTick()

		const items = wrapper.findAll('.action-set__item')
		const labels = items.map(i => i.attributes('aria-label'))
		expect(labels).not.toContain('Files')
		expect(labels).toContain('Search')
		expect(labels).toContain('Email')
		expect(labels).toContain('Actions')
	})

	it('opens the command palette when the Search tile is clicked', async () => {
		const CommandPaletteStub = defineComponent({
			name: 'CommandPalette',
			props: { isOpen: { type: Boolean, default: false } },
			template: '<div class="command-palette-stub" v-if="isOpen" />',
		})

		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		const doctype = buildDoctype('task', 'draft', {
			draft: { on: { SUBMIT: 'submitted' } },
			submitted: { type: 'final' },
		})
		registry.addDoctype(doctype)
		stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task', status: 'draft' })

		const wrapper = mount(Desktop, {
			props: {
				routeAdapter: recordAdapter(),
				actionSetSlots: [{ id: 'files', label: 'Files' }],
			},
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: {
					AForm: true,
					SheetNav: true,
					CommandPalette: CommandPaletteStub,
				},
			},
		})
		await nextTick()

		const searchItem = wrapper.findAll('.action-set__item').find(i => i.attributes('aria-label') === 'Search')
		await searchItem!.trigger('click')
		await nextTick()

		expect(wrapper.find('.command-palette-stub').exists()).toBe(true)
		expect(wrapper.find('.action-set__drawer').exists()).toBe(false)
	})

	it('throws when useActionSet is called outside Desktop', () => {
		const Orphan = defineComponent({
			setup() {
				useActionSet()
				return () => null
			},
		})

		expect(() => mount(Orphan)).toThrow('useActionSet() must be called inside Desktop with actionSetSlots configured')
	})

	it('exposes action elements on the ActionSet component', async () => {
		const wrapper = mountDesktop()
		await nextTick()

		const actionSet = findActionSet(wrapper)
		const elements = actionSet.props('elements') as { label: string }[]
		expect(elements.some(e => e.label === 'Actions')).toBe(true)
	})
})
