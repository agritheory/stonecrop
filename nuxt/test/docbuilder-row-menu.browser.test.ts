import { afterEach, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { defineComponent, h, nextTick } from 'vue'
import '@stonecrop/themes/default.css'

import DocBuilderFieldsPanel from '../src/runtime/app/components/DocBuilderFieldsPanel.vue'

let wrapper: VueWrapper | undefined

afterEach(() => {
	wrapper?.unmount()
	document.documentElement.removeAttribute('style')
})

// The row menu is atable's; it is measured here, where a real table in a real browser opens it.
it('DocBuilder’s row menu takes the colour and shadow a host sets for overlays', { tags: ['component'] }, async () => {
	document.documentElement.style.cssText =
		'--sc-overlay-background: rgb(1, 2, 3); --sc-overlay-shadow: rgb(4, 5, 6) 0px 0px 7px 0px'
	const Host = defineComponent({
		setup: () => () =>
			h('div', { style: 'width: 900px' }, [
				h(DocBuilderFieldsPanel, { modelValue: [{ fieldname: 'name', label: 'Name', component: 'ATextInput' }] }),
			]),
	})
	wrapper = mount(Host, { attachTo: document.body, global: { plugins: [createPinia()] } })

	document.querySelector<HTMLButtonElement>('.row-actions-toggle')!.click()
	await nextTick()
	const style = getComputedStyle(document.querySelector('.row-actions-menu')!)

	expect(style.display).not.toBe('none')
	expect(style.backgroundColor).toBe('rgb(1, 2, 3)')
	expect(style.boxShadow).toBe('rgb(4, 5, 6) 0px 0px 7px 0px')
})
