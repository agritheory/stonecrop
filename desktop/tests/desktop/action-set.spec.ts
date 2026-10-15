import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, reactive, ref, type Component } from 'vue'

import { Registry, Stonecrop } from '@stonecrop/stonecrop'

import { resetActionSetLayoutSessionForTests } from '../../src/action-set-layout-session'
import Desktop from '../../src/components/Desktop.vue'
import { useActionSet } from '../../src/composables/useActionSet'
import type { ActionElements, ActionSetSlot, RouteAdapter } from '../../src/types'

import { buildDoctype, findActionSet, makeStonecropPlugin, openActionsDrawer } from './desktop.helpers'

const consoleWarn = vi.spyOn(console, 'warn')

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
	consoleWarn.mockClear()
	resetActionSetLayoutSessionForTests()
})

const reactiveComponentWarnings = () =>
	consoleWarn.mock.calls
		.map(([message]) => String(message))
		.filter(message => message.includes('made a reactive object'))

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

	it('replaces the drawer with the preview and brings it back when the preview closes', async () => {
		const wrapper = mountDesktop([{ id: 'files', label: 'Files', component: PreviewSlot }])
		await nextTick()

		const filesItem = wrapper.findAll('.action-set__item').find(i => i.attributes('aria-label') === 'Files')
		await filesItem!.trigger('click')
		await nextTick()
		await wrapper.find('.open-preview').trigger('click')
		await nextTick()

		expect(wrapper.find('.desktop').classes()).toContain('desktop--preview-open')
		expect(wrapper.find('.desktop').classes()).not.toContain('desktop--action-set-open')
		expect(wrapper.find('.open-preview').exists()).toBe(false)

		await wrapper.find('.desktop__preview-close').trigger('click')
		await nextTick()

		expect(wrapper.find('.desktop').classes()).toContain('desktop--action-set-open')
		expect(wrapper.find('.open-preview').exists()).toBe(true)
	})

	it('does not reopen the drawer when another tile takes over from the preview', async () => {
		const wrapper = mountDesktop([
			{ id: 'files', label: 'Files', component: PreviewSlot },
			{ id: 'email', label: 'Email' },
		])
		await nextTick()

		const tile = (label: string) =>
			wrapper.findAll('.action-set__item').find(i => i.attributes('aria-label') === label)!
		await tile('Files').trigger('click')
		await nextTick()
		await wrapper.find('.open-preview').trigger('click')
		await nextTick()
		await tile('Email').trigger('click')
		await nextTick()

		expect(wrapper.find('.desktop').classes()).not.toContain('desktop--preview-open')
		expect(wrapper.find('.open-preview').exists()).toBe(false)
	})

	it('resizes the preview from the keyboard within its bounds', async () => {
		const wrapper = mountDesktop([{ id: 'files', label: 'Files', component: PreviewSlot }])
		await nextTick()

		const filesItem = wrapper.findAll('.action-set__item').find(i => i.attributes('aria-label') === 'Files')
		await filesItem!.trigger('click')
		await nextTick()
		await wrapper.find('.open-preview').trigger('click')
		await nextTick()

		const handle = wrapper.find('.desktop__preview-resize')
		expect(handle.attributes('aria-valuenow')).toBe('50')

		await handle.trigger('keydown', { key: 'ArrowLeft' })
		expect(handle.attributes('aria-valuenow')).toBe('55')

		await handle.trigger('keydown', { key: 'Home' })
		expect(handle.attributes('aria-valuenow')).toBe('80')

		await handle.trigger('dblclick')
		expect(handle.attributes('aria-valuenow')).toBe('50')
	})

	// A host keeping its slots or views in reactive state hands Desktop proxies of its components.
	// Vue unwraps a proxy before rendering it, so its warning is the only trace of one.
	// Each test defines its own component: once marked raw, a shared one stays raw for later tests.
	it('renders a slot component from reactive state without making it reactive', async () => {
		const FilesPanel = defineComponent({ template: '<p class="files-panel">Files</p>' })
		const FilesIcon = defineComponent({ template: '<svg class="files-icon" />' })
		const slots = reactive([{ id: 'files', label: 'Files', icon: FilesIcon, component: FilesPanel }])
		const wrapper = mountDesktop(slots)
		await nextTick()

		const filesItem = wrapper.findAll('.action-set__item').find(i => i.attributes('aria-label') === 'Files')
		await filesItem!.trigger('click')
		await nextTick()

		expect(wrapper.find('.files-icon').exists()).toBe(true)
		expect(wrapper.find('.files-panel').exists()).toBe(true)
		expect(reactiveComponentWarnings()).toEqual([])
	})

	it('renders a presented view from reactive state without making it reactive', async () => {
		const InvoicePreview = defineComponent({ template: '<p class="invoice-preview">Invoice.pdf</p>' })
		const views = reactive({ preview: InvoicePreview })
		const ReactivePreviewSlot = defineComponent({
			setup() {
				const actionSet = useActionSet()
				return { open: () => actionSet.present({ id: 'preview-1', view: views.preview }) }
			},
			template: '<button type="button" class="open-preview" @click="open">Open preview</button>',
		})
		const wrapper = mountDesktop([{ id: 'files', label: 'Files', component: ReactivePreviewSlot }])
		await nextTick()

		const filesItem = wrapper.findAll('.action-set__item').find(i => i.attributes('aria-label') === 'Files')
		await filesItem!.trigger('click')
		await nextTick()
		await wrapper.find('.open-preview').trigger('click')
		await nextTick()

		expect(wrapper.find('.invoice-preview').exists()).toBe(true)
		expect(reactiveComponentWarnings()).toEqual([])
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

	it('opens the search drawer when the Search tile is clicked', async () => {
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
				},
			},
		})
		await nextTick()

		const searchItem = wrapper.findAll('.action-set__item').find(i => i.attributes('aria-label') === 'Search')
		await searchItem!.trigger('click')
		await nextTick()

		expect(wrapper.find('.action-set__drawer').exists()).toBe(true)
		expect(wrapper.find('.command-search-input').exists()).toBe(true)
	})

	it('throws when useActionSet is called outside Desktop', () => {
		// `render` stands in for the one `setup` never returns, so Vue reports only the throw.
		const Orphan = defineComponent({
			setup() {
				useActionSet()
			},
			render: () => null,
		})

		expect(() => mount(Orphan)).toThrow(/^useActionSet\(\) must be called inside a component rendered by Desktop$/)
	})

	it('exposes action elements on the ActionSet component', async () => {
		const wrapper = mountDesktop()
		await nextTick()

		const actionSet = findActionSet(wrapper)
		const elements = actionSet.props('elements') as { label: string }[]
		expect(elements.some(e => e.label === 'Actions')).toBe(true)
	})
})

describe('Desktop ActionSet drawer state', { tags: ['component'] }, () => {
	function mountOnRoute(
		options: { actionSetSlots?: ActionSetSlot[]; hostActions?: ActionElements[]; defaultSlot?: Component } = {}
	) {
		const recordId = ref('rec-1')
		const adapter: RouteAdapter = {
			getCurrentDoctype: () => 'task',
			getCurrentRecordId: () => recordId.value,
			getCurrentView: () => 'record',
			navigate: vi.fn(),
		}
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		registry.addDoctype(
			buildDoctype('task', 'draft', { draft: { on: { SUBMIT: 'submitted' } }, submitted: { type: 'final' } })
		)
		stonecrop.addRecord('task', 'rec-1', { id: 'rec-1', title: 'One', status: 'draft' })
		stonecrop.addRecord('task', 'rec-2', { id: 'rec-2', title: 'Two', status: 'draft' })

		const wrapper = mount(Desktop, {
			attachTo: document.body,
			props: {
				routeAdapter: adapter,
				...(options.actionSetSlots ? { actionSetSlots: options.actionSetSlots } : {}),
				...(options.hostActions ? { hostActions: options.hostActions } : {}),
			},
			slots: options.defaultSlot ? { default: options.defaultSlot } : {},
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, SheetNav: true, CommandPalette: true },
			},
		})
		return { wrapper, recordId }
	}

	const drawerState = (wrapper: VueWrapper) => ({
		drawer: wrapper.find('.action-set__drawer').exists(),
		workspacePushed: wrapper.find('.desktop').classes().includes('desktop--action-set-open'),
	})

	const escape = async () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
		await nextTick()
	}

	afterEach(() => {
		document.body.innerHTML = ''
	})

	it('closes the Actions drawer when the route moves to another record', async () => {
		const { wrapper, recordId } = mountOnRoute()
		await nextTick()
		await openActionsDrawer(wrapper)
		expect(drawerState(wrapper)).toEqual({ drawer: true, workspacePushed: true })

		recordId.value = 'rec-2'
		await nextTick()
		await nextTick()

		expect(drawerState(wrapper)).toEqual({ drawer: false, workspacePushed: false })
	})

	it('closes a slot drawer when the route moves to another record', async () => {
		const { wrapper, recordId } = mountOnRoute({ actionSetSlots: [{ id: 'files', label: 'Files' }] })
		await nextTick()
		await wrapper.find('.action-set__item[aria-label="Files"]').trigger('click')
		expect(drawerState(wrapper)).toEqual({ drawer: true, workspacePushed: true })

		recordId.value = 'rec-2'
		await nextTick()
		await nextTick()

		expect(drawerState(wrapper)).toEqual({ drawer: false, workspacePushed: false })
	})

	it('emits the workflow action when a transition is clicked in the drawer', async () => {
		const { wrapper } = mountOnRoute()
		await nextTick()
		await openActionsDrawer(wrapper)
		await wrapper.find('.action-set__actions-list-item').trigger('click')

		expect(wrapper.emitted('action')?.[0]?.[0]).toMatchObject({ name: 'SUBMIT', doctype: 'task', recordId: 'rec-1' })
	})

	it.each([
		['without', undefined],
		['with', defineComponent({ template: '<p>host page</p>' })],
	])('lists hostActions in place of derived actions %s a default slot', async (_, defaultSlot) => {
		const { wrapper } = mountOnRoute({
			hostActions: [{ type: 'button', label: 'Host action', action: () => {} }],
			defaultSlot,
		})
		await nextTick()

		const labels = (findActionSet(wrapper).props('elements') as { label: string }[]).map(e => e.label)
		expect(labels).toEqual(['Host action'])
	})

	it('treats an empty hostActions as a declaration of no actions', async () => {
		const { wrapper } = mountOnRoute({ hostActions: [] })
		await nextTick()
		expect(wrapper.find('.action-set__item[aria-label="Actions"]').exists()).toBe(false)
	})

	it('labels each dropdown group in the Actions drawer', async () => {
		const { wrapper } = mountOnRoute({
			hostActions: [
				{ type: 'dropdown', label: 'More', actions: [{ label: 'Duplicate', action: () => {} }] },
				{ type: 'dropdown', label: 'Export', actions: [{ label: 'CSV', action: () => {} }] },
			],
		})
		await nextTick()
		await openActionsDrawer(wrapper)

		const labels = wrapper.findAll('.action-set__actions-group-label').map(label => label.text())
		expect(labels).toEqual(['More', 'Export'])
	})

	it('renders an entry that carries only a link as a link', async () => {
		const { wrapper } = mountOnRoute({
			hostActions: [
				{ type: 'button', label: 'Guide', link: '/guide' },
				{ type: 'dropdown', label: 'More', actions: [{ label: 'Docs', link: '/docs' }] },
			],
		})
		await nextTick()
		await openActionsDrawer(wrapper)

		const links = wrapper.findAll('.action-set__drawer a').map(link => [link.text(), link.attributes('href')])
		expect(links).toEqual([
			['Guide', '/guide'],
			['Docs', '/docs'],
		])
	})

	it('does not announce the drawer as a modal dialog', async () => {
		const { wrapper } = mountOnRoute()
		await nextTick()
		await openActionsDrawer(wrapper)

		const drawer = wrapper.find('.action-set__drawer')
		expect(drawer.attributes('aria-modal')).toBeUndefined()
		expect(drawer.attributes('role')).not.toBe('dialog')
	})

	it('leaves Tab to the browser so focus can reach the page and the preview', async () => {
		const { wrapper } = mountOnRoute()
		await nextTick()
		await openActionsDrawer(wrapper)

		const items = wrapper.findAll('.action-set__drawer button')
		const last = items[items.length - 1].element as HTMLElement
		last.focus()
		const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
		last.dispatchEvent(tab)

		expect(tab.defaultPrevented).toBe(false)
	})

	it('closes the preview first, then the drawer, on successive Escapes', async () => {
		const { wrapper } = mountOnRoute({ actionSetSlots: [{ id: 'files', label: 'Files', component: PreviewSlot }] })
		await nextTick()
		await wrapper.find('.action-set__item[aria-label="Files"]').trigger('click')
		await wrapper.find('.open-preview').trigger('click')
		expect(wrapper.find('.stub-preview').exists()).toBe(true)

		await escape()
		expect(wrapper.find('.stub-preview').exists()).toBe(false)
		expect(drawerState(wrapper).drawer).toBe(true)

		await escape()
		expect(drawerState(wrapper)).toEqual({ drawer: false, workspacePushed: false })
	})

	it('provides useActionSet to default-slot content when no slots are configured', async () => {
		let context: ReturnType<typeof useActionSet> | undefined
		const HostPage = defineComponent({
			setup() {
				context = useActionSet()
				return () => null
			},
		})
		mountOnRoute({ hostActions: [], defaultSlot: HostPage })
		await nextTick()

		expect(context?.recordId.value).toBe('rec-1')
	})
})
