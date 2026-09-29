import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import AForm from '../src/components/AForm.vue'
import AFieldset from '../src/components/form/AFieldset.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { ResolvedField } from '../src/types'

describe('fieldset input component', { tags: ['component'] }, () => {
	it('no change in collapse status when fieldset is uncollapsible', async () => {
		const wrapper = mount(AFieldset, {
			props: {
				label: 'Fieldset',
				collapsible: false,
				schema: [
					{
						fieldname: 'first_name',
						component: 'ATextInput',
						label: 'First Name',
					},
					{
						fieldname: 'middle_name',
						component: 'ATextInput',
						label: 'Middle Name',
					},
					{
						fieldname: 'last_name',
						component: 'ATextInput',
						label: 'Last Name',
					},
					{
						fieldname: 'age',
						component: 'ANumericInput',
						label: 'Age',
					},
				] as ResolvedField[],
			},
		})

		expect(wrapper.vm.collapsed).toBe(false)
		await wrapper.find('legend').trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.collapsed).toBe(false)
	})

	it('toggle collapse status when fieldset is collapsible', async () => {
		const wrapper = mount(AFieldset, {
			props: {
				label: 'Fieldset',
				collapsible: true,
				schema: [
					{
						fieldname: 'first_name',
						component: 'ATextInput',
						label: 'First Name',
					},
					{
						fieldname: 'middle_name',
						component: 'ATextInput',
						label: 'Middle Name',
					},
					{
						fieldname: 'last_name',
						component: 'ATextInput',
						label: 'Last Name',
					},
					{
						fieldname: 'age',
						component: 'ANumericInput',
						label: 'Age',
					},
				] as ResolvedField[],
			},
		})

		// check if a form is rendered inside the fieldset
		const form = wrapper.findComponent({ name: 'AForm' })
		expect(form.exists()).toBe(true)
		expect(wrapper.vm.collapsed).toBe(false)

		await wrapper.find('legend').trigger('click')
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.collapsed).toBe(true)
		expect(form.isVisible()).toBe(false)
	})
})

// A fieldset is layout: its fields are the record's own, so a form reads and writes them at the
// record's top level, exactly as the store and the server hold them.
describe('a fieldset inside a form', { tags: ['component'] }, () => {
	const contact = (schema: ResolvedField[]): ResolvedField =>
		({ kind: 'fieldset', fieldname: 'contact', component: 'AFieldset', label: 'Contact', schema }) as ResolvedField
	const email: ResolvedField = { kind: 'field', fieldname: 'email', component: 'ATextInput', label: 'Email' }

	const mountForm = (schema: ResolvedField[], data: Record<string, any>) =>
		mount(AForm, { props: { schema, data }, global: { components: { AFieldset, ATextInput } } })

	it("shows the record's own value in a field inside a fieldset", async () => {
		const wrapper = mountForm([contact([email])], { email: 'ana@example.com' })
		await flushPromises()

		expect((wrapper.find('fieldset input').element as HTMLInputElement).value).toBe('ana@example.com')
	})

	it('hands an edit inside a fieldset up as a change to the record itself', async () => {
		const wrapper = mountForm([contact([email])], { email: 'ana@example.com' })
		await flushPromises()

		await wrapper.find('fieldset input').setValue('bo@example.com')
		await flushPromises()

		expect(wrapper.emitted('update:data')?.at(-1)?.[0]).toEqual({ email: 'bo@example.com' })
	})

	it('shows the next record handed to the form', async () => {
		const wrapper = mountForm([contact([email])], { email: 'ana@example.com' })
		await flushPromises()

		await wrapper.setProps({ data: { email: 'cy@example.com' } })
		await flushPromises()

		expect((wrapper.find('fieldset input').element as HTMLInputElement).value).toBe('cy@example.com')
	})

	it('reads and writes the record itself from a fieldset inside a fieldset', async () => {
		const inner = { kind: 'fieldset', fieldname: 'inner', component: 'AFieldset', schema: [email] } as ResolvedField
		const wrapper = mountForm([contact([inner])], { email: 'ana@example.com' })
		await flushPromises()

		const input = wrapper.find('fieldset fieldset input')
		expect((input.element as HTMLInputElement).value).toBe('ana@example.com')

		await input.setValue('di@example.com')
		await flushPromises()

		expect(wrapper.emitted('update:data')?.at(-1)?.[0]).toEqual({ email: 'di@example.com' })
	})

	it('renders a fieldset that declares no component as an AFieldset, legend included', async () => {
		const bare = { kind: 'fieldset', fieldname: 'contact', label: 'Contact', schema: [email] } as ResolvedField
		const wrapper = mountForm([bare], { email: 'ana@example.com' })
		await flushPromises()

		expect(wrapper.findComponent(AFieldset).exists()).toBe(true)
		expect(wrapper.find('legend').text()).toBe('Contact')
	})

	it('shows a validation error on a field inside a fieldset', async () => {
		const wrapper = mount(AForm, {
			props: { schema: [contact([email])], data: { email: 'ana' }, errors: { email: ['Enter a valid email'] } },
			global: { components: { AFieldset, ATextInput } },
		})
		await flushPromises()

		expect(wrapper.find('fieldset .aform_error').text()).toBe('Enter a valid email')
	})
})
