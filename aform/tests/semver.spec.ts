import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ASemverInput from '../src/components/form/ASemverInput.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { SemverValue } from '../src/types'

const empty: SemverValue = { raw: '', major: 0, minor: 0, patch: 0 }

describe('ASemverInput', { tags: ['component'] }, () => {
	it('composes ATextInput', () => {
		const wrapper = mount(ASemverInput, {
			props: { label: 'Version', uuid: 'semver-test', modelValue: empty },
		})
		expect(wrapper.findComponent(ATextInput).exists()).toBe(true)
	})

	it('emits a parsed SemverValue when the draft is valid', async () => {
		const wrapper = mount(ASemverInput, {
			props: { label: 'Version', uuid: 'semver-test', modelValue: empty },
		})
		await wrapper.find('input').setValue('1.2.3-pre.1')
		await wrapper.vm.$nextTick()

		const updates = wrapper.emitted('update:modelValue')
		expect(updates).toBeTruthy()
		const last = updates!.at(-1)![0] as SemverValue
		expect(last).toEqual({ raw: '1.2.3-pre.1', major: 1, minor: 2, patch: 3 })
	})

	it('keeps the last valid model when the draft is incomplete', async () => {
		const modelValue: SemverValue = { raw: '1.2.3', major: 1, minor: 2, patch: 3 }
		const wrapper = mount(ASemverInput, {
			props: { label: 'Version', uuid: 'semver-test', modelValue },
		})
		await wrapper.find('input').setValue('1.')
		await wrapper.vm.$nextTick()

		const updates = wrapper.emitted('update:modelValue') ?? []
		expect(updates.at(-1)?.[0]).toBeUndefined()
		expect(wrapper.props('modelValue')).toEqual(modelValue)
		expect(wrapper.find('input').element.value).toBe('1.')
	})

	it('clears to the empty default when the draft is emptied', async () => {
		const wrapper = mount(ASemverInput, {
			props: {
				label: 'Version',
				uuid: 'semver-test',
				modelValue: { raw: '2.0.0', major: 2, minor: 0, patch: 0 },
			},
		})
		await wrapper.find('input').setValue('')
		await wrapper.vm.$nextTick()

		const last = wrapper.emitted('update:modelValue')!.at(-1)![0] as SemverValue
		expect(last).toEqual(empty)
	})

	it('synthesizes raw from major/minor/patch when raw is absent on the model', async () => {
		const wrapper = mount(ASemverInput, {
			props: {
				label: 'Version',
				uuid: 'semver-test',
				modelValue: { raw: '', major: 4, minor: 5, patch: 6 },
			},
		})
		expect(wrapper.find('input').element.value).toBe('4.5.6')
	})

	it('uses the semver named mask by default and does not set maxlength', () => {
		const wrapper = mount(ASemverInput, {
			props: { label: 'Version', uuid: 'semver-test', modelValue: empty },
		})
		const textInput = wrapper.findComponent(ATextInput)
		expect(textInput.props('mask')).toBe('semver')
		expect(wrapper.find('input').attributes().maxlength).toBeUndefined()
	})

	it('passes a schema mask override to ATextInput', () => {
		const wrapper = mount(ASemverInput, {
			props: {
				label: 'Version',
				uuid: 'semver-test',
				mask: '###.###.###',
				modelValue: empty,
			},
		})
		expect(wrapper.findComponent(ATextInput).props('mask')).toBe('###.###.###')
	})

	it('is disabled in read mode', () => {
		const wrapper = mount(ASemverInput, {
			props: {
				label: 'Version',
				uuid: 'semver-test',
				mode: 'read',
				modelValue: { raw: '1.0.0', major: 1, minor: 0, patch: 0 },
			},
		})
		expect(wrapper.find('input').attributes()).toHaveProperty('disabled')
	})

	it('renders raw in display mode without an input', () => {
		const wrapper = mount(ASemverInput, {
			props: {
				label: 'Version',
				uuid: 'semver-test',
				mode: 'display',
				modelValue: { raw: '3.1.4', major: 3, minor: 1, patch: 4 },
			},
		})
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').text()).toBe('3.1.4')
	})
})
