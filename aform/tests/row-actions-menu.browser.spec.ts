import { afterEach, describe, expect, it } from 'vite-plus/test'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { defineComponent, h, nextTick } from 'vue'

import { ATable, install as installATable } from '@stonecrop/atable'

let wrapper: VueWrapper | undefined
let bar: HTMLElement | undefined

afterEach(() => {
	wrapper?.unmount()
	bar?.remove()
})

// An app draws its own bars over the page, as Desktop's bottom bar does at z-index 100. A row's open actions menu
// must still be drawn over them, or its items sit behind the bar and a click on one lands on the bar instead.
describe("A row's open actions menu", { tags: ['component'] }, () => {
	it("is drawn over an app's own bar", async () => {
		const Host = defineComponent({
			setup: () => () =>
				h(ATable, {
					rows: [{ id: '1', product: 'Widget A' }],
					columns: [{ label: 'Product', name: 'product', align: 'left', edit: false, width: '20ch' }],
					config: {
						view: 'list',
						rowActions: { enabled: true, forceDropdown: true, actions: { duplicate: true, delete: true } },
					},
				}),
		})
		wrapper = mount(Host, { attachTo: document.body, global: { plugins: [createPinia(), { install: installATable }] } })
		await nextTick()

		bar = document.createElement('div')
		bar.style.cssText = 'position: fixed; inset: 0; z-index: 100; background: transparent'
		document.body.appendChild(bar)

		document.querySelector<HTMLButtonElement>('.row-actions-toggle')!.click()
		await nextTick()
		await new Promise(requestAnimationFrame)

		const items = [...document.querySelectorAll<HTMLElement>('.row-action-menu-item')]
		expect(items).toHaveLength(2)
		for (const item of items) {
			const box = item.getBoundingClientRect()
			const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)
			expect(item.contains(hit), `${item.textContent?.trim()} is drawn under the bar`).toBe(true)
		}
	})
})
