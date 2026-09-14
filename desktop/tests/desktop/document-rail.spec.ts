import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import { useDocumentRail } from '../../src/composables/useDocumentRail'
import type { DocumentRailSlot, RouteAdapter } from '../../src/types'

import { buildDoctype, makeStonecropPlugin } from './desktop.helpers'

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
		const rail = useDocumentRail()
		return {
			open: () => rail.present({ id: 'preview-1', view: StubPreview, props: { title: 'Invoice.pdf' } }),
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

function mountDesktop(railSlots?: DocumentRailSlot[]) {
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
			...(railSlots ? { railSlots } : {}),
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

describe('Desktop document rail', { tags: ['component'] }, () => {
	it('renders the tile even when railSlots is omitted', async () => {
		const wrapper = mountDesktop()
		await nextTick()

		expect(wrapper.find('.document-rail').exists()).toBe(true)
		expect(wrapper.find('.document-rail__tile').exists()).toBe(true)
		expect(wrapper.find('.document-rail__toggle').exists()).toBe(true)
	})

	it('shows slot icons and Actions in the tile when expanded', async () => {
		const wrapper = mountDesktop([
			{ id: 'files', label: 'Files' },
			{ id: 'collaboration', label: 'Collaboration' },
		])
		await nextTick()

		const items = wrapper.findAll('.document-rail__item')
		// Files, Collaboration, and Actions (A)
		expect(items.length).toBe(3)
		expect(items[0].attributes('aria-label')).toBe('Files')
		expect(items[1].attributes('aria-label')).toBe('Collaboration')
		expect(items[2].attributes('aria-label')).toBe('Actions')
	})

	it('collapses and expands with the + toggle', async () => {
		const wrapper = mountDesktop([{ id: 'files', label: 'Files' }])
		await nextTick()

		expect(wrapper.find('.document-rail__item').exists()).toBe(true)

		await wrapper.find('.document-rail__toggle').trigger('click')
		await nextTick()

		expect(wrapper.find('.document-rail__item').exists()).toBe(false)

		await wrapper.find('.document-rail__toggle').trigger('click')
		await nextTick()

		expect(wrapper.find('.document-rail__item').exists()).toBe(true)
	})

	it('opens drawer with header tabs including Actions when slot icon is clicked', async () => {
		const wrapper = mountDesktop([
			{ id: 'files', label: 'Files' },
			{ id: 'collaboration', label: 'Collaboration' },
		])
		await nextTick()

		await wrapper.findAll('.document-rail__item')[0].trigger('click')
		await nextTick()

		expect(wrapper.find('.document-rail__drawer').exists()).toBe(true)
		expect(wrapper.find('.desktop').classes()).toContain('desktop--rail-open')

		const tabs = wrapper.findAll('.document-rail__tab')
		// Files, Collaboration, Actions
		expect(tabs).toHaveLength(3)
		expect(tabs[0].classes()).toContain('document-rail__tab--active')
		expect(tabs[2].attributes('aria-label')).toBe('Actions')
	})

	it('shows actions list in drawer body when Actions tab is clicked', async () => {
		const wrapper = mountDesktop([{ id: 'files', label: 'Files' }])
		await nextTick()

		// Click Actions in tile
		const actionsItem = wrapper.findAll('.document-rail__item').find(i => i.attributes('aria-label') === 'Actions')
		await actionsItem!.trigger('click')
		await nextTick()

		expect(wrapper.find('.document-rail__drawer').exists()).toBe(true)
		expect(wrapper.find('.document-rail__actions-list').exists()).toBe(true)
		expect(wrapper.find('.document-rail__actions-list-item').text()).toBe('SUBMIT')
	})

	it('switches to actions view when Actions tab is clicked in drawer header', async () => {
		const wrapper = mountDesktop([{ id: 'files', label: 'Files' }])
		await nextTick()

		// Open Files drawer
		await wrapper.findAll('.document-rail__item')[0].trigger('click')
		await nextTick()

		// Click Actions tab
		const actionsTab = wrapper.findAll('.document-rail__tab').find(t => t.attributes('aria-label') === 'Actions')
		await actionsTab!.trigger('click')
		await nextTick()

		expect(wrapper.find('.document-rail__actions-list').exists()).toBe(true)
		expect(actionsTab!.classes()).toContain('document-rail__tab--active')
	})

	it('paints a badge count and hides it when the count is 0', async () => {
		const count = ref(3)
		const wrapper = mountDesktop([
			{ id: 'files', label: 'Files', badge: count },
			{ id: 'collaboration', label: 'Collaboration' },
		])
		await nextTick()

		expect(wrapper.find('.document-rail__item-badge').text()).toBe('3')

		count.value = 0
		await nextTick()
		expect(wrapper.find('.document-rail__item-badge').exists()).toBe(false)
	})

	it('pushes content when Actions drawer is opened', async () => {
		const wrapper = mountDesktop([{ id: 'files', label: 'Files' }])
		await nextTick()

		// Click Actions
		const actionsItem = wrapper.findAll('.document-rail__item').find(i => i.attributes('aria-label') === 'Actions')
		await actionsItem!.trigger('click')
		await nextTick()

		expect(wrapper.find('.desktop').classes()).toContain('desktop--rail-open')
		expect(wrapper.find('.document-rail__actions-list').exists()).toBe(true)
	})

	it('mounts a presented host view in the 50% pane and clears it on close', async () => {
		const wrapper = mountDesktop([{ id: 'files', label: 'Files', component: PreviewSlot }])
		await nextTick()

		await wrapper.findAll('.document-rail__item')[0].trigger('click')
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

		const items = wrapper.findAll('.document-rail__item')
		const labels = items.map(i => i.attributes('aria-label'))
		expect(labels).not.toContain('Files')
		expect(labels).toContain('Email')
		expect(labels).toContain('Actions')
	})

	it('throws when useDocumentRail is called outside Desktop', () => {
		const Orphan = defineComponent({
			setup() {
				useDocumentRail()
				return () => null
			},
		})

		expect(() => mount(Orphan)).toThrow('useDocumentRail() must be called inside Desktop with railSlots configured')
	})
})
