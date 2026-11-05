import { afterEach, describe, expect, it } from 'vite-plus/test'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import AForm from '../src/components/AForm.vue'
import AFormLink from '../src/components/form/AFormLink.vue'
import type { ResolvedField } from '../src/types'

let wrapper: VueWrapper | undefined

// The theme's offset for a field's label and error above its input; unset, the shared rule has none to apply.
const labelOffset = '--sc-form-label-offset: 8px'

afterEach(() => wrapper?.unmount())

const mountLink = (data: Record<string, unknown>) => {
	const Host = defineComponent({
		setup: () => () =>
			h('div', { style: `width: 600px; ${labelOffset}` }, [
				h(AForm, {
					schema: [{ fieldname: 'customer', component: 'AFormLink', label: 'Customer' }] as ResolvedField[],
					data,
					errors: { customer: ['Must be empty while the method is Cash'] },
				}),
			]),
	})
	wrapper = mount(Host, { attachTo: document.body, global: { components: { AFormLink } } })
}

// Needs real layout: whether the message and the button overlap is a matter of where the browser puts them.
describe('a link field error', { tags: ['component'] }, () => {
	it('ends before the navigate button when the link holds a record', () => {
		mountLink({ customer: { id: 'C-001', displayText: 'Acme' } })

		const error = document.querySelector('p.aform_error')!.getBoundingClientRect()
		const button = document.querySelector('.aform_form-btn')!.getBoundingClientRect()
		expect(error.width).toBeGreaterThan(0)
		expect(error.right).toBeLessThan(button.left)
	})

	it("sits on the input's top border, like a text input's", () => {
		mountLink({ customer: { id: 'C-001', displayText: 'Acme' } })

		const error = document.querySelector('p.aform_error')!.getBoundingClientRect()
		const input = document.querySelector('.aform_input-field')!.getBoundingClientRect()
		expect(error.top + error.height / 2).toBeCloseTo(input.top, 0)
	})
})
