import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'

import ADropdown from '../src/components/form/ADropdown.vue'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

// A status, and a box outside the field to move focus to.
const mountStatus = (status: string) => {
	const model = ref(status)
	const Host = defineComponent({
		setup: () => () =>
			h('div', [
				h(ADropdown, {
					label: 'Status',
					options: ['Pending', 'Approved', 'Rejected'],
					modelValue: model.value,
					'onUpdate:modelValue': (value: string | undefined) => (model.value = value ?? ''),
				}),
				h('input', { id: 'outside', 'aria-label': 'Outside the field' }),
			]),
	})
	wrapper = mount(Host, { attachTo: document.body })
	return { model }
}

const statusBox = () => document.querySelector<HTMLInputElement>('input[role="combobox"]')!
const isListOpen = () => statusBox().getAttribute('aria-expanded') === 'true'

describe('a dropdown', { tags: ['browser'] }, () => {
	it('lists its choices when clicked', async () => {
		mountStatus('Pending')
		await userEvent.click(statusBox())

		await expect.poll(isListOpen).toBe(true)
	})

	// Neither key has a choice to move to or pick, and leaving the box puts back what was chosen.
	it('keeps its choice when an arrow key and Enter are pressed on a typo', async () => {
		const { model } = mountStatus('Pending')
		await userEvent.click(statusBox())
		await userEvent.keyboard('{Control>}a{/Control}Aproved{ArrowUp}{Enter}')
		await userEvent.click(document.querySelector<HTMLElement>('#outside')!)

		expect(model.value).toBe('Pending')
		expect(statusBox().value).toBe('Pending')
	})
})
