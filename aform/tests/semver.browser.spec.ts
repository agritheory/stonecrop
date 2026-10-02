import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'

import ASemverInput from '../src/components/form/ASemverInput.vue'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

const mountSemver = (initial: string | null) => {
	const model = ref<string | null | undefined>(initial)
	const reported: (string | null | undefined)[] = []
	const Host = defineComponent({
		setup: () => () =>
			h(ASemverInput, {
				modelValue: model.value,
				'onUpdate:modelValue': (next: string | null | undefined) => {
					reported.push(next)
					model.value = next
				},
				mode: 'edit',
				label: 'Version',
				uuid: 'semver',
			}),
	})
	wrapper = mount(Host, { attachTo: document.body })
	const input = wrapper.find('input#semver').element as HTMLInputElement
	return { model, reported, input }
}

const selectAll = (input: HTMLInputElement) => {
	input.focus()
	input.setSelectionRange(0, input.value.length)
}

describe('semver component in a browser', { tags: ['browser'] }, () => {
	it('holds a version typed one key at a time', async () => {
		const { input, model } = mountSemver(null)
		input.focus()
		await userEvent.keyboard('1.4.0-beta.2')

		await expect
			.poll(() => ({ box: input.value, model: model.value }))
			.toEqual({
				box: '1.4.0-beta.2',
				model: '1.4.0-beta.2',
			})
	})

	it('refuses each key no version could take', async () => {
		const { input, model, reported } = mountSemver('1.2.3')
		selectAll(input)
		await userEvent.keyboard('apple')
		input.setSelectionRange(0, 0)
		await userEvent.keyboard('v')

		await expect
			.poll(() => ({ box: input.value, model: model.value, reported }))
			.toEqual({
				box: '1.2.3',
				model: '1.2.3',
				reported: [],
			})
	})

	it('keeps the caret where a refused key was typed', async () => {
		const { input, model } = mountSemver('1.2.3')
		input.focus()
		input.setSelectionRange(1, 1)
		await userEvent.keyboard('x0')

		await expect.poll(() => ({ box: input.value, model: model.value })).toEqual({ box: '10.2.3', model: '10.2.3' })
	})

	it('refuses a pasted text no version starts with', async () => {
		const { input, model } = mountSemver('1.2.3')
		await userEvent.fill(input, 'v2.0.0')

		await expect.poll(() => ({ box: input.value, model: model.value })).toEqual({ box: '1.2.3', model: '1.2.3' })
	})

	it('holds null once emptied, and the next version typed once retyped', async () => {
		const { input, model } = mountSemver('1.2.3')
		selectAll(input)
		await userEvent.keyboard('{Backspace}')
		await expect.poll(() => ({ box: input.value, model: model.value })).toEqual({ box: '', model: null })

		await userEvent.keyboard('2.0.0')
		await expect.poll(() => ({ box: input.value, model: model.value })).toEqual({ box: '2.0.0', model: '2.0.0' })
	})

	it('reports nothing when a value arrives from outside', async () => {
		const { input, model, reported } = mountSemver(null)
		model.value = '3.1.4'

		await expect.poll(() => ({ box: input.value, reported })).toEqual({ box: '3.1.4', reported: [] })
	})
})
