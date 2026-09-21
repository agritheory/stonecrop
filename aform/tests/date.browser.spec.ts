import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'

import ADate from '../src/components/form/ADate.vue'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

const mountDate = (initial: string) => {
	const model = ref<string | null | undefined>(initial)
	const renderErrors: unknown[] = []
	const Host = defineComponent({
		setup: () => () =>
			h('div', { style: 'position: relative; padding: 40px; width: 300px' }, [
				h(ADate, {
					modelValue: model.value,
					'onUpdate:modelValue': (next: string | null | undefined) => (model.value = next),
					mode: 'edit',
					uuid: 'date',
				}),
			]),
	})
	wrapper = mount(Host, {
		attachTo: document.body,
		global: { config: { errorHandler: error => void renderErrors.push(error) } },
	})
	const input = wrapper.find('input').element as HTMLInputElement
	return { model, input, renderErrors }
}

describe('date component in a browser', { tags: ['browser'] }, () => {
	it('keeps a month typed with a leading zero', async () => {
		const { input, model, renderErrors } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('03')

		await expect
			.poll(() => ({ model: model.value, renderErrors: renderErrors.map(String) }))
			.toEqual({ model: '2026-03-10', renderErrors: [] })
	})

	// Chrome reports a date input with any part missing as `''`, and keeps the parts still typed.
	it('holds null once a part of its day is cleared, and the day again once it is retyped', async () => {
		const { input, model, renderErrors } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('{Backspace}')
		await expect.poll(() => model.value).toBeNull()

		await userEvent.keyboard('03')
		await expect
			.poll(() => ({ model: model.value, renderErrors: renderErrors.map(String) }))
			.toEqual({ model: '2026-03-10', renderErrors: [] })
	})
})
