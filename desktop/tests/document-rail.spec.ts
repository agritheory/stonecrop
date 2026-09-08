import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { createDocumentRail } from '../../src/composables/useDocumentRail'
import DocumentRail from '../../src/components/DocumentRail.vue'
import Desktop from '../../src/components/Desktop.vue'
import { useDocumentRail } from '../../src/composables/useDocumentRail'
import type { DocumentRailSlot } from '../../src/types'

import { buildDoctype, makeStonecropPlugin } from './desktop/desktop.helpers'
import { Registry, Stonecrop } from '@stonecrop/stonecrop'
import type { RouteAdapter } from '../../src/types'

const StubPreview = defineComponent({
	props: { title: { type: String, default: 'Preview' } },
	setup(props) {
		return () => h('p', { class: 'stub-preview' }, props.title)
	},
})

const PresentFromSlot = defineComponent({
	setup() {
		const rail = useDocumentRail()
		return () =>
			h(
				'button',
				{
					class: 'present-trigger',
					onClick: () => rail.present({ id: 'file-1', view: StubPreview, props: { title: 'PO.pdf' } }),
				},
				'Present'
			)
	},
})

describe('createDocumentRail', { tags: ['unit'] }, () => {
	it('presents a subject and ignores duplicate ids', () => {
		const rail = createDocumentRail({
			doctype: computed(() => 'order'),
			recordId: computed(() => 'ord-1'),
		})

		rail.present({ id: 'same', view: StubPreview })
		expect(rail.isPreviewOpen.value).toBe(true)

		rail.present({ id: 'same', view: StubPreview })
		expect(rail.previewSubject.value?.id).toBe('same')

		rail.closePreview()
		expect(rail.isPreviewOpen.value).toBe(false)
	})

	it('closes drawer and preview together', () => {
		const rail = createDocumentRail({
			doctype: computed(() => 'order'),
			recordId: computed(() => 'ord-1'),
		})

		rail.openSlot('attachments')
		rail.present({ view: StubPreview })
		expect(rail.activeSlotId.value).toBe('attachments')
		expect(rail.isPreviewOpen.value).toBe(true)

		rail.close()
		expect(rail.activeSlotId.value).toBeNull()
		expect(rail.isPreviewOpen.value).toBe(false)
	})
})

describe('useDocumentRail', { tags: ['component'] }, () => {
	it('throws when called outside Desktop', () => {
		const Outside = defineComponent({
			setup() {
				expect(() => useDocumentRail()).toThrow(/must be called inside Desktop/)
				return () => null
			},
		})

		mount(Outside)
	})
})

describe('DocumentRail chrome', { tags: ['component'] }, () => {
	it('renders slot triggers with badges and opens an empty drawer', async () => {
		const badge = ref(3)
		const rail = createDocumentRail({
			doctype: computed(() => 'order'),
			recordId: computed(() => 'ord-1'),
		})

		const slots: DocumentRailSlot[] = [
			{ id: 'attachments', label: 'Attachments', badge },
			{ id: 'collaboration', label: 'Collaboration' },
		]

		const wrapper = mount(DocumentRail, {
			props: {
				slots,
				elements: [],
				rail,
			},
		})

		expect(wrapper.find('.document-rail__slot-badge').text()).toBe('3')
		expect(wrapper.findAll('.document-rail__slot-trigger')).toHaveLength(2)

		await wrapper.findAll('.document-rail__slot-trigger')[0].trigger('click')
		expect(wrapper.find('.document-rail__drawer').exists()).toBe(true)
		expect(wrapper.find('.document-rail__drawer-empty').exists()).toBe(true)
	})
})

describe('Desktop document rail', { tags: ['component'] }, () => {
	const makeAdapter = (view: RouteAdapter['getCurrentView']): RouteAdapter => ({
		getCurrentDoctype: () => 'task',
		getCurrentRecordId: () => (view === 'record' ? 'rec-1' : ''),
		getCurrentView: () => view,
		navigate: vi.fn(),
	})

	it('renders ActionSet when railSlots is omitted', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		registry.addDoctype(
			buildDoctype('task', 'draft', { draft: { on: { SUBMIT: 'submitted' } }, submitted: { type: 'final' } })
		)

		const wrapper = mount(Desktop, {
			props: { routeAdapter: makeAdapter('records') },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, SheetNav: true, CommandPalette: true },
			},
		})

		expect(wrapper.findComponent({ name: 'ActionSet' }).exists()).toBe(true)
		expect(wrapper.findComponent({ name: 'DocumentRail' }).exists()).toBe(false)
	})

	it('registers extra slots and mounts preview via present({ view })', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		registry.addDoctype(
			buildDoctype('task', 'draft', { draft: { on: { SUBMIT: 'submitted' } }, submitted: { type: 'final' } })
		)
		stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'My Task', status: 'draft' })

		const slots: DocumentRailSlot[] = [
			{ id: 'attachments', label: 'Attachments', component: PresentFromSlot },
			{ id: 'collaboration', label: 'Collaboration' },
			{ id: 'watchers', label: 'Watchers' },
		]

		const wrapper = mount(Desktop, {
			props: {
				routeAdapter: makeAdapter('record'),
				railSlots: slots,
			},
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, SheetNav: true, CommandPalette: true },
			},
		})

		expect(wrapper.findComponent({ name: 'DocumentRail' }).exists()).toBe(true)
		expect(wrapper.findAll('.document-rail__slot-trigger')).toHaveLength(3)

		await wrapper.findAll('.document-rail__slot-trigger')[0].trigger('click')
		expect(wrapper.classes()).toContain('desktop--rail-open')

		await wrapper.find('.present-trigger').trigger('click')
		expect(wrapper.classes()).toContain('desktop--preview-open')
		expect(wrapper.find('.stub-preview').text()).toBe('PO.pdf')

		await wrapper.find('.desktop__preview-close').trigger('click')
		expect(wrapper.classes()).not.toContain('desktop--preview-open')
	})
})
