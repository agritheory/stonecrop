import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import { SHEET_NAV_TOOLBAR_SELECTOR } from '../../src/sheet-nav-toolbar'

import { makeStonecropPlugin } from './desktop.helpers'

const RouterLinkStub = {
	name: 'RouterLink',
	props: ['to'],
	template: '<a :href="to"><slot /></a>',
}

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
})

describe('Desktop – sheetnav-toolbar slot', { tags: ['component'] }, () => {
	it("renders the host's sheetnav-toolbar slot inside SheetNav's toolbar", async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)

		const wrapper = mount(Desktop, {
			slots: { 'sheetnav-toolbar': '<button class="host-control">Plan view</button>' },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, ActionSet: true, CommandPalette: true, RouterLink: RouterLinkStub },
			},
		})
		await nextTick()

		expect(wrapper.find(`${SHEET_NAV_TOOLBAR_SELECTOR} .host-control`).exists()).toBe(true)
	})
})
