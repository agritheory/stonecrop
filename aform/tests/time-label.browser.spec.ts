import { afterEach, describe, expect, it } from 'vite-plus/test'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import AForm from '../src/components/AForm.vue'
import ADateTimeInput from '../src/components/form/ADateTimeInput.vue'
import type { ResolvedField } from '../src/types'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

// Needs real layout. A field's label straddles its input's top border, the form colour masking the border
// above the label's middle; set lower, the border runs through the label's text (#548).
describe("a time field's label", { tags: ['component'] }, () => {
	it("straddles the time boxes' top border", () => {
		const schema = [
			{ kind: 'field', fieldname: 'start_time', label: 'Start Time', component: 'ADateTimeInput' },
		] as ResolvedField[]
		const Host = defineComponent({
			setup: () => () =>
				h('div', { style: 'width: 800px; --sc-form-label-offset: 8px; --sc-input-border-color: gray' }, [
					h(AForm, { schema, data: { start_time: '09:30' }, 'onUpdate:data': () => {} }),
				]),
		})
		wrapper = mount(Host, { attachTo: document.body, global: { components: { ADateTimeInput } } })

		const label = document.querySelector('.adate_time .aform_field-label')!.getBoundingClientRect()
		const hours = document.querySelector('.adate_time input')!.getBoundingClientRect()
		expect(label.top + label.height / 2).toBeCloseTo(hours.top, 0)
	})
})
