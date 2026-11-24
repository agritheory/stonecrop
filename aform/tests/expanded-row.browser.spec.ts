import { afterEach, describe, expect, it } from 'vite-plus/test'
import { userEvent } from 'vite-plus/test/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { defineComponent, h, nextTick, ref } from 'vue'

import { install as installATable } from '@stonecrop/atable'

import AForm from '../src/components/AForm.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { ResolvedField } from '../src/types'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

// An expanded row's form reports each keystroke as a new record, which reaches ATable as new rows; the
// field being typed into keeps focus through that, so every keystroke lands.
describe('AForm expanded row', { tags: ['component'] }, () => {
	it('keeps every keystroke typed into an expanded row', async () => {
		const record = ref<Record<string, any>>({ lines: [{ sku: 'A-1' }, { sku: 'B-2' }] })
		const schema = [
			{
				kind: 'table',
				fieldname: 'lines',
				component: 'ATable',
				label: 'Lines',
				config: { view: 'list-expansion' },
				schema: [{ fieldname: 'sku', label: 'SKU', component: 'ATextInput' }],
			},
		] as unknown as ResolvedField[]
		const Host = defineComponent({
			setup: () => () =>
				h(AForm, {
					schema,
					data: record.value,
					'onUpdate:data': (next: Record<string, any>) => (record.value = next),
				}),
		})
		wrapper = mount(Host, {
			attachTo: document.body,
			global: { plugins: [createPinia(), { install: installATable }], components: { AForm, ATextInput } },
		})

		await wrapper.findAll('.expansion-index').at(1)!.trigger('click')
		await nextTick()
		const input = wrapper.find('.atable-expanded-content input').element as HTMLInputElement
		await userEvent.click(input)
		await userEvent.keyboard('xyz')

		expect(record.value.lines).toEqual([{ sku: 'A-1' }, { sku: 'B-2xyz' }])
		expect(document.activeElement).toBe(wrapper.find('.atable-expanded-content input').element)
	})
})
