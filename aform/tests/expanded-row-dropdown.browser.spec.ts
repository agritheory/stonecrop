import { afterEach, describe, expect, it } from 'vite-plus/test'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { defineComponent, h, nextTick, ref } from 'vue'

import { install as installATable } from '@stonecrop/atable'

import AForm from '../src/components/AForm.vue'
import ADropdown from '../src/components/form/ADropdown.vue'
import type { ResolvedField } from '../src/types'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

const warehouses = [
	'Stores',
	'Finished Goods',
	'Work In Progress',
	'Scrap',
	'Transit',
	'Goods In',
	'Returns',
	'QA Hold',
]

// A table with one row ends just under that row's expanded panel; a dropdown opened in the panel
// runs past the table's bottom edge and must still show every option (#522).
describe('A dropdown in an expanded row', { tags: ['component'] }, () => {
	it('shows its whole list past the bottom of the table', async () => {
		const record = ref<Record<string, any>>({ lines: [{ location: '' }] })
		const schema = [
			{
				kind: 'table',
				fieldname: 'lines',
				component: 'ATable',
				label: 'Lines',
				config: { view: 'list-expansion' },
				schema: [{ fieldname: 'location', label: 'Location', component: 'ADropdown', options: warehouses }],
			},
		] as unknown as ResolvedField[]
		const Host = defineComponent({
			setup: () => () =>
				h('div', { style: 'width: 800px; padding-bottom: 600px' }, [
					h(AForm, {
						schema,
						data: record.value,
						'onUpdate:data': (next: Record<string, any>) => (record.value = next),
					}),
				]),
		})
		wrapper = mount(Host, {
			attachTo: document.body,
			global: { plugins: [createPinia(), { install: installATable }], components: { AForm, ADropdown } },
		})

		await wrapper.find('.expansion-index').trigger('click')
		await nextTick()
		document.querySelector('.atable-expanded-content input')!.dispatchEvent(new FocusEvent('focus'))
		await nextTick()
		await nextTick()
		await new Promise(requestAnimationFrame)

		const table = document.querySelector('.atable')!.getBoundingClientRect()
		const options = [...document.querySelectorAll<HTMLElement>('.atable-expanded-content [role="option"]')]
		expect(options).toHaveLength(warehouses.length)
		const last = options.at(-1)!.getBoundingClientRect()
		// The list does run past the table: that is the case under test.
		expect(last.bottom).toBeGreaterThan(table.bottom)
		// What is drawn at the last option's centre is that option, not whatever lies past the table.
		const hit = document.elementFromPoint(last.left + last.width / 2, last.top + last.height / 2)
		expect(options.at(-1)!.contains(hit)).toBe(true)
	})

	// The rows below the expanded one come later in the DOM; their pinned cells must not be drawn
	// over a list that crosses them (#576).
	it('is drawn over the pinned cells of the rows below', async () => {
		const record = ref<Record<string, any>>({
			lines: [
				{ item: 'Widget', location: '' },
				{ item: 'Gadget', location: '' },
				{ item: 'Sprocket', location: '' },
				{ item: 'Flange', location: '' },
			],
		})
		const schema = [
			{
				kind: 'table',
				fieldname: 'lines',
				component: 'ATable',
				label: 'Lines',
				config: { view: 'list-expansion' },
				schema: [
					{ fieldname: 'item', label: 'Item', component: 'ATextInput', pinned: true, width: '80ch' },
					{ fieldname: 'location', label: 'Location', component: 'ADropdown', options: warehouses },
				],
			},
		] as unknown as ResolvedField[]
		const Host = defineComponent({
			setup: () => () =>
				h('div', { style: 'width: 800px; padding-bottom: 600px' }, [
					h(AForm, {
						schema,
						data: record.value,
						'onUpdate:data': (next: Record<string, any>) => (record.value = next),
					}),
				]),
		})
		wrapper = mount(Host, {
			attachTo: document.body,
			global: { plugins: [createPinia(), { install: installATable }], components: { AForm, ADropdown } },
		})

		await wrapper.find('.expansion-index').trigger('click')
		await nextTick()
		document.querySelector('.atable-expanded-content input')!.dispatchEvent(new FocusEvent('focus'))
		await nextTick()
		await nextTick()
		await new Promise(requestAnimationFrame)

		const options = [...document.querySelectorAll<HTMLElement>('.atable-expanded-content [role="option"]')]
		expect(options).toHaveLength(warehouses.length)
		// The pinned cells of the rows below the expanded one.
		const pinned = [...document.querySelectorAll<HTMLElement>('.atable-expanded-row ~ .atable-row td.sticky-column')]
		expect(pinned.length).toBeGreaterThan(0)

		// Every point where an option crosses a lower row's pinned cell must show that option.
		let crossings = 0
		for (const option of options) {
			const o = option.getBoundingClientRect()
			for (const cell of pinned) {
				const c = cell.getBoundingClientRect()
				const left = Math.max(o.left, c.left)
				const right = Math.min(o.right, c.right)
				const top = Math.max(o.top, c.top)
				const bottom = Math.min(o.bottom, c.bottom)
				if (right - left < 2 || bottom - top < 2) continue
				crossings++
				const hit = document.elementFromPoint((left + right) / 2, (top + bottom) / 2)
				expect(option.contains(hit), `"${option.textContent?.trim()}" is drawn under a pinned cell`).toBe(true)
			}
		}
		// The list does cross the pinned column: that is the case under test.
		expect(crossings).toBeGreaterThan(0)
	})
})
