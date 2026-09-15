import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import SheetNav from '../src/components/SheetNav.vue'
import { SHEET_NAV_TOOLBAR_SELECTOR } from '../src/sheet-nav-toolbar'

// Stub router-link since SheetNav uses it but we don't want a full router in tests
const RouterLinkStub = {
	name: 'RouterLink',
	props: ['to'],
	template: '<a :href="to"><slot /></a>',
}

describe('SheetNav', { tags: ['component'] }, () => {
	const globalConfig = {
		components: { RouterLink: RouterLinkStub },
	}

	it('renders the footer', () => {
		const wrapper = mount(SheetNav, { global: globalConfig })
		expect(wrapper.find('footer').exists()).toBe(true)
	})

	it('renders breadcrumbs when provided', () => {
		const wrapper = mount(SheetNav, {
			props: {
				breadcrumbs: [
					{ title: 'Home', to: '/' },
					{ title: 'Tasks', to: '/tasks' },
				],
			},
			global: globalConfig,
		})

		expect(wrapper.text()).toContain('Home')
		expect(wrapper.text()).toContain('Tasks')
	})

	it('renders without breadcrumbs (defaults to empty array)', () => {
		const wrapper = mount(SheetNav, { global: globalConfig })
		// Just the control elements — no breadcrumb entries
		expect(wrapper.find('ul').exists()).toBe(true)
	})

	it('toggles breadcrumb visibility when hide tab is clicked', async () => {
		const wrapper = mount(SheetNav, {
			props: {
				breadcrumbs: [{ title: 'Home', to: '/' }],
			},
			global: globalConfig,
		})

		const hometab = wrapper.find('.hometab')
		expect(hometab.attributes('style')).toContain('display: flex')

		// Click the hide/show toggle
		await wrapper.find('.hidebreadcrumbs-btn').trigger('click')

		expect(wrapper.find('.hometab').attributes('style')).toContain('display: none')

		// Click again to restore
		await wrapper.find('.hidebreadcrumbs-btn').trigger('click')
		expect(wrapper.find('.hometab').attributes('style')).toContain('display: flex')
	})

	it('names the hide-breadcrumbs control for assistive tech', () => {
		const wrapper = mount(SheetNav, { global: globalConfig })
		const btn = wrapper.find('.hidebreadcrumbs-btn')
		expect(btn.attributes('aria-label')).toBe('Hide breadcrumbs')
		expect(btn.attributes('aria-expanded')).toBe('true')
	})

	it('changes the rotate class when breadcrumbs are hidden', async () => {
		const wrapper = mount(SheetNav, { global: globalConfig })

		// Initially unrotated
		expect(wrapper.find('.hidebreadcrumbs-btn span').classes()).toContain('unrotated')

		await wrapper.find('.hidebreadcrumbs-btn').trigger('click')

		expect(wrapper.find('.hidebreadcrumbs-btn span').classes()).toContain('rotated')
	})

	it('toggles breadcrumb visibility on Enter keydown', async () => {
		const wrapper = mount(SheetNav, {
			props: {
				breadcrumbs: [{ title: 'Home', to: '/' }],
			},
			global: globalConfig,
		})

		const hometabBefore = wrapper.find('.hometab').attributes('style')
		expect(hometabBefore).toContain('display: flex')

		await wrapper.find('.hidebreadcrumbs-btn').trigger('keydown.enter')
		expect(wrapper.find('.hometab').attributes('style')).toContain('display: none')
	})

	it('does not render a search tab', () => {
		const wrapper = mount(SheetNav, { global: globalConfig })
		expect(wrapper.find('.searchtab').exists()).toBe(false)
		expect(wrapper.find('input[type="text"]').exists()).toBe(false)
	})

	it('navigateHome does not throw when clicked', async () => {
		const wrapper = mount(SheetNav, { global: globalConfig })
		// navigateHome is a no-op — just verify no errors
		await wrapper.find('.hometab').trigger('click')
		expect(wrapper.find('footer').exists()).toBe(true)
	})

	it('renders toolbar slot content inside the exported toolbar selector', () => {
		const wrapper = mount(SheetNav, {
			slots: {
				toolbar: '<div class="test-toolbar">Plan controls</div>',
			},
			global: globalConfig,
		})

		const toolbar = wrapper.find(SHEET_NAV_TOOLBAR_SELECTOR)
		expect(toolbar.exists()).toBe(true)
		expect(toolbar.text()).toContain('Plan controls')
		expect(wrapper.find('.tabs').exists()).toBe(true)
	})

	it('accepts content teleported to the exported toolbar selector', async () => {
		const sheetNav = mount(SheetNav, {
			props: {
				breadcrumbs: [{ title: 'Plan', to: '/plan' }],
			},
			global: globalConfig,
			attachTo: document.body,
		})
		await nextTick()

		const teleporter = mount(
			{
				template: `
					<Teleport :to="selector">
						<div class="teleported-toolbar">Teleported controls</div>
					</Teleport>
				`,
				data: () => ({ selector: SHEET_NAV_TOOLBAR_SELECTOR }),
			},
			{ attachTo: document.body }
		)
		await nextTick()

		expect(document.querySelector(SHEET_NAV_TOOLBAR_SELECTOR)?.textContent).toContain('Teleported controls')

		teleporter.unmount()
		sheetNav.unmount()
	})

	describe('toolbar anchor uniqueness', () => {
		it('does not warn when one SheetNav is mounted', () => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
			const only = mount(SheetNav, { global: globalConfig, attachTo: document.body })

			expect(warn).not.toHaveBeenCalled()

			only.unmount()
			warn.mockRestore()
		})

		it('warns when a second SheetNav mounts, since teleported content lands in the first', () => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
			const first = mount(SheetNav, { global: globalConfig, attachTo: document.body })
			const second = mount(SheetNav, { global: globalConfig, attachTo: document.body })

			expect(warn).toHaveBeenCalledTimes(1)
			expect(warn.mock.calls[0][0]).toContain(SHEET_NAV_TOOLBAR_SELECTOR)

			second.unmount()
			first.unmount()
			warn.mockRestore()
		})
	})
})
