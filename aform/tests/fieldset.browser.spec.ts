import { afterEach, describe, expect, it } from 'vite-plus/test'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { defineComponent, h, nextTick } from 'vue'

import { install as installATable } from '@stonecrop/atable'

import AForm from '../src/components/AForm.vue'
import AFieldset from '../src/components/form/AFieldset.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { ResolvedField } from '../src/types'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

const email: ResolvedField = { kind: 'field', fieldname: 'email', component: 'ATextInput', label: 'Email' }
const fieldset = (fieldname: string, schema: ResolvedField[]) =>
	({ kind: 'fieldset', fieldname, label: fieldname, component: 'AFieldset', schema }) as ResolvedField

// Needs real layout: a fieldset's width is what the browser computes from its padding and border.
describe('a fieldset in a form', { tags: ['component'] }, () => {
	it('spans exactly the width it is given, nested or not, so its border stays inside the form', () => {
		const Host = defineComponent({
			setup: () => () =>
				h('div', { style: 'width: 800px' }, [
					h(AForm, {
						schema: [fieldset('outer', [email, fieldset('inner', [email])])],
						data: { email: 'ana@example.com' },
						'onUpdate:data': () => {},
					}),
				]),
		})
		wrapper = mount(Host, { attachTo: document.body, global: { components: { AFieldset, ATextInput } } })

		const fieldsets = [...document.querySelectorAll('fieldset')]
		expect(fieldsets).toHaveLength(2)
		for (const element of fieldsets) {
			const box = element.getBoundingClientRect()
			const space = element.parentElement!.getBoundingClientRect()
			expect(box.left).toBeCloseTo(space.left, 0)
			expect(box.right).toBeCloseTo(space.right, 0)
		}
	})
})

// Needs real layout: the indent is a margin the browser applies through a stylesheet selector.
describe('a table in a fieldset', { tags: ['component'] }, () => {
	const lines = {
		kind: 'table',
		fieldname: 'lines',
		component: 'ATable',
		label: 'Lines',
		config: { view: 'list-expansion' },
		schema: [{ fieldname: 'sku', label: 'SKU', component: 'ATextInput' }],
	} as unknown as ResolvedField

	// How far an expanded row's field starts from its table's left edge.
	const expandedFieldOffset = async (schema: ResolvedField[]) => {
		const Host = defineComponent({
			setup: () => () =>
				h('div', { style: 'width: 800px' }, [
					h(AForm, { schema, data: { lines: [{ sku: 'A-1' }] }, 'onUpdate:data': () => {} }),
				]),
		})
		wrapper = mount(Host, {
			attachTo: document.body,
			global: {
				plugins: [createPinia(), { install: installATable }],
				components: { AForm, AFieldset, ATextInput },
			},
		})
		await wrapper.find('.expansion-index').trigger('click')
		await nextTick()
		const table = wrapper.find('.atable-expanded-content').element.closest('table') ?? wrapper.find('.atable').element
		const input = wrapper.find('.atable-expanded-content input').element
		const offset = input.getBoundingClientRect().left - table.getBoundingClientRect().left
		wrapper.unmount()
		wrapper = undefined
		return offset
	}

	it("indents only the fieldset's own form, not an expanded row's form inside it", async () => {
		const outside = await expandedFieldOffset([lines])
		const inside = await expandedFieldOffset([fieldset('group', [lines])])
		expect(inside).toBeCloseTo(outside, 0)
	})

	it("still indents the fieldset's own form", () => {
		wrapper = mount(AForm, {
			attachTo: document.body,
			props: { schema: [fieldset('group', [email])], data: {}, 'onUpdate:data': () => {} },
			global: { components: { AFieldset, ATextInput } },
		})
		const inner = wrapper.find('fieldset > .aform').element
		expect(getComputedStyle(inner).marginLeft).toBe('8px')
	})
})
