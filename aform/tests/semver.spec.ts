import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ASemverInput from '../src/components/form/ASemverInput.vue'

/** A field bound the way `v-model` binds it, so each value it reports comes back in as its prop. */
const mountBound = (modelValue: string | null, props: Record<string, unknown> = {}) => {
	const wrapper = mount(ASemverInput, {
		props: {
			label: 'Version',
			uuid: 'semver-test',
			modelValue,
			'onUpdate:modelValue': (value: string | null | undefined): Promise<void> =>
				wrapper.setProps({ modelValue: value }),
			...props,
		},
	})
	return wrapper
}

const box = (wrapper: ReturnType<typeof mountBound>) => wrapper.find('input').element

describe('ASemverInput', { tags: ['component'] }, () => {
	it('holds a version once the box holds a whole one', async () => {
		const wrapper = mountBound(null)
		await wrapper.find('input').setValue('1.2.3-pre.1')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['1.2.3-pre.1'])
	})

	it('holds null while the version is still being typed, keeping the draft in the box', async () => {
		const wrapper = mountBound('1.2.3')
		await wrapper.find('input').setValue('1.2.')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
		expect(wrapper.props('modelValue')).toBeNull()
		expect(box(wrapper).value).toBe('1.2.')
	})

	it('holds null for an emptied box', async () => {
		const wrapper = mountBound('2.0.0')
		await wrapper.find('input').setValue('')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
	})

	it.each(['v1.2.3', '1.2.3.4', '1.2.3b1', '01.2.3', 'apple'])('refuses an edit to %j', async text => {
		const wrapper = mountBound('1.2.3')
		await wrapper.find('input').setValue(text)
		expect(box(wrapper).value).toBe('1.2.3')
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})

	it('puts the caret back where a refused key was typed', async () => {
		const wrapper = mountBound('1.2.3')
		const input = box(wrapper)
		input.value = '1x.2.3'
		input.setSelectionRange(2, 2)
		await wrapper.find('input').trigger('input')
		expect(input.value).toBe('1.2.3')
		expect(input.selectionStart).toBe(1)
	})

	it('reports nothing when a record loads into it', async () => {
		const wrapper = mountBound(null)
		await wrapper.setProps({ modelValue: '1.2.3' })
		expect(box(wrapper).value).toBe('1.2.3')
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})

	it('replaces a draft with a version arriving from outside', async () => {
		const wrapper = mountBound('1.2.3')
		await wrapper.find('input').setValue('1.2.')
		await wrapper.setProps({ modelValue: '2.0.0' })
		expect(box(wrapper).value).toBe('2.0.0')
	})

	it('shows text saved before the field checked it, and lets it be fixed', async () => {
		const wrapper = mountBound('v1.2')
		expect(box(wrapper).value).toBe('v1.2')
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()

		await wrapper.find('input').setValue('v1.')
		expect(box(wrapper).value).toBe('v1.')
		await wrapper.find('input').setValue('1.2.0')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['1.2.0'])
	})

	it('is disabled in read mode', () => {
		const wrapper = mountBound('1.0.0', { mode: 'read' })
		expect(wrapper.find('input').attributes()).toHaveProperty('disabled')
	})

	it('shows the version in display mode without an input', () => {
		const wrapper = mountBound('3.1.4', { mode: 'display' })
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').text()).toBe('3.1.4')
	})

	it('marks the box invalid when the host reports an error', () => {
		const wrapper = mountBound('1.0.0', { errors: ['Version is required'] })
		expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
		expect(wrapper.find('.aform_error').text()).toBe('Version is required')
	})
})
