import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

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
