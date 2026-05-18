import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import SheetNav from '../src/components/SheetNav.vue'

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
		expect(hometab.attributes('style')).toContain('display: block')

		// Click the hide/show toggle
		await wrapper.find('.hidebreadcrumbs').trigger('click')

		expect(wrapper.find('.hometab').attributes('style')).toContain('display: none')

		// Click again to restore
		await wrapper.find('.hidebreadcrumbs').trigger('click')
		expect(wrapper.find('.hometab').attributes('style')).toContain('display: block')
	})

	it('changes the rotate class when breadcrumbs are hidden', async () => {
		const wrapper = mount(SheetNav, { global: globalConfig })

		// Initially unrotated
		expect(wrapper.find('.hidebreadcrumbs a div').classes()).toContain('unrotated')

		await wrapper.find('.hidebreadcrumbs').trigger('click')

		expect(wrapper.find('.hidebreadcrumbs a div').classes()).toContain('rotated')
	})

	it('toggles breadcrumb visibility on Enter keydown', async () => {
		const wrapper = mount(SheetNav, {
			props: {
				breadcrumbs: [{ title: 'Home', to: '/' }],
			},
			global: globalConfig,
		})

		const hometabBefore = wrapper.find('.hometab').attributes('style')
		expect(hometabBefore).toContain('display: block')

		await wrapper.find('.hidebreadcrumbs').trigger('keydown.enter')
		expect(wrapper.find('.hometab').attributes('style')).toContain('display: none')
	})

	it('shows search input when search icon is clicked', async () => {
		const wrapper = mount(SheetNav, { global: globalConfig })

		// Search input initially hidden via v-show (display: none)
		const inputEl = wrapper.find('input[type="text"]')
		expect(inputEl.element.style.display).toBe('none')

		// Click search icon (svg with role=button); toggleSearch is async (calls nextTick)
		await wrapper.find('svg[role="button"]').trigger('click')
		await nextTick()
		await nextTick() // extra tick for the async toggleSearch

		// After toggling search visible, the input should no longer have display:none
		expect(wrapper.find('input[type="text"]').element.style.display).not.toBe('none')
	})

	it('hides search input on Escape keydown', async () => {
		const wrapper = mount(SheetNav, { global: globalConfig })

		// Open search first (need extra tick for the async toggleSearch)
		await wrapper.find('svg[role="button"]').trigger('click')
		await nextTick()
		await nextTick()

		// Press Escape to close
		await wrapper.find('input[type="text"]').trigger('keydown.escape')
		await nextTick()
		await nextTick()

		expect(wrapper.find('input[type="text"]').element.style.display).toBe('none')
	})

	it('calls handleSearchInput on input event (stops propagation)', async () => {
		const wrapper = mount(SheetNav, { global: globalConfig })

		// Open search
		await wrapper.find('svg[role="button"]').trigger('click')
		await nextTick()
		await nextTick()

		// Trigger input event — should not throw
		await wrapper.find('input[type="text"]').trigger('input')
		expect(wrapper.find('input[type="text"]').element.style.display).not.toBe('none')
	})

	it('closes search on blur (handleSearch)', async () => {
		const wrapper = mount(SheetNav, { global: globalConfig })

		// Open search
		await wrapper.find('svg[role="button"]').trigger('click')
		await nextTick()
		await nextTick()

		// Trigger blur
		await wrapper.find('input[type="text"]').trigger('blur')
		await nextTick()
		await nextTick()

		expect(wrapper.find('input[type="text"]').element.style.display).toBe('none')
	})

	it('closes search on Enter keydown (handleSearch)', async () => {
		const wrapper = mount(SheetNav, { global: globalConfig })

		// Open search
		await wrapper.find('svg[role="button"]').trigger('click')
		await nextTick()
		await nextTick()

		// Trigger Enter keydown
		await wrapper.find('input[type="text"]').trigger('keydown.enter')
		await nextTick()
		await nextTick()

		expect(wrapper.find('input[type="text"]').element.style.display).toBe('none')
	})

	it('navigateHome does not throw when clicked', async () => {
		const wrapper = mount(SheetNav, { global: globalConfig })
		// navigateHome is a no-op — just verify no errors
		await wrapper.find('.hometab').trigger('click')
		expect(wrapper.find('footer').exists()).toBe(true)
	})
})
