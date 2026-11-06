import { describe, it, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h, type App, type Component } from 'vue'

import AForm from '../src/components/AForm.vue'
import ACurrencyInput from '../src/components/form/ACurrencyInput.vue'
import AQuantityInput from '../src/components/form/AQuantityInput.vue'
import ADate from '../src/components/form/ADate.vue'
import ADatePicker from '../src/components/form/ADatePicker.vue'
import ADateTime from '../src/components/form/ADateTime.vue'
import ADateRange from '../src/components/form/ADateRange.vue'
import ADropdown from '../src/components/form/ADropdown.vue'
import AFormLink from '../src/components/form/AFormLink.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import AFieldset from '../src/components/form/AFieldset.vue'
import { fieldErrorText } from '../src/composables/fieldErrorA11y'
import { install } from '../src/index'
import { wordErrors } from '../src/utils/fieldErrors'
import type { ResolvedField } from '../src/types'

describe('inline field errors', { tags: ['component'] }, () => {
	describe('field component (ATextInput)', () => {
		it('wires aria-invalid and aria-describedby when an error is present', () => {
			const w = mount(ATextInput, {
				props: { uuid: 'end_date', label: 'End date', modelValue: '', errors: ['End before start'] },
			})
			const input = w.find('input')
			const err = w.find('.aform_error')
			expect(input.attributes('aria-invalid')).toBe('true')
			expect(input.attributes('aria-describedby')).toBe('end_date-error')
			expect(err.attributes('id')).toBe('end_date-error')
			expect(err.attributes('role')).toBe('alert')
		})

		it('renders a dynamic error message from the errors prop', () => {
			const w = mount(ATextInput, {
				props: { label: 'End date', modelValue: '2020-01-01', errors: ['End before start'] },
			})
			const err = w.find('.aform_error')
			expect(err.exists()).toBe(true)
			expect(err.text()).toBe('End before start')
			// v-show keeps it visible (no inline display:none) when there is a real error
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('joins multiple errors', () => {
			const w = mount(ATextInput, { props: { label: 'x', modelValue: '', errors: ['A', 'B'] } })
			expect(w.find('.aform_error').text()).toBe('A; B')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ATextInput, { props: { label: 'x', modelValue: '' } })
			const err = w.find('.aform_error')
			expect(err.text()).toBe('')
			// present in the DOM (v-show), but hidden because there is no message
			expect(err.attributes('style') ?? '').toContain('display: none')
		})

		it('shows the errors it is handed, not a static validation.errorMessage', () => {
			const w = mount(ATextInput, {
				props: { label: 'x', modelValue: '', errors: ['dynamic'], validation: { errorMessage: 'static' } },
			})
			expect(w.find('.aform_error').text()).toBe('dynamic')
		})

		it('does not show a static validation.errorMessage when the host reports no error', () => {
			const w = mount(ATextInput, {
				props: { uuid: 'x', label: 'x', modelValue: '', validation: { errorMessage: 'static' } },
			})
			const err = w.find('.aform_error')
			expect(err.text()).toBe('')
			expect(err.attributes('style') ?? '').toContain('display: none')
			expect(w.find('input').attributes('aria-invalid')).toBeUndefined()
			expect(w.find('input').attributes('aria-describedby')).toBeUndefined()
		})

		it("shows nothing for an error handed to it without a message: wording is AForm's", () => {
			const w = mount(ATextInput, {
				props: { uuid: 'x', label: 'x', modelValue: '', errors: [''], validation: { errorMessage: 'static' } },
			})
			expect(w.find('.aform_error').text()).toBe('')
			expect(w.find('input').attributes('aria-invalid')).toBeUndefined()
		})
	})

	// Every registered component that takes `errors` is checked, so a field added later fails here until
	// someone decides whether it shows them. A field cannot tell that its value failed validation, so a
	// static message shown on its own would sit on every record, valid or not, and announce it as invalid.
	describe('every registered field that takes errors', () => {
		// Take `errors` without showing them: a form and a fieldset route them, a file attachment has no slot.
		const routesErrors = ['AForm', 'AFieldset', 'AFileAttach']
		// Shows its error but marks nothing invalid: a calendar grid has no one input to carry aria-invalid.
		const noInvalidState = ['ADatePicker']

		// Only the props a component cannot mount without; every other field mounts on the shared ones.
		const mountProps: Record<string, Record<string, unknown>> = {
			ADropdown: { options: ['A', 'B'] },
			ASegmentedControl: { options: ['A', 'B'], modelValue: 'A' },
			ACurrencyInput: {
				modelValue: { amount: 1, currency: { id: 'USD' }, baseAmount: 1, baseCurrency: { id: 'USD' }, exchangeRate: 1 },
				options: { baseCurrency: { id: 'USD' } },
			},
			AQuantityInput: {
				modelValue: { qty: 1, uom: 'Nos', stockQty: 1, stockUom: 'Nos', conversionFactor: 1 },
				options: { uoms: ['Nos'], stockUom: 'Nos' },
			},
		}

		const registered = new Map<string, Component>()
		const app = {
			component: (name: string, component: Component) => registered.set(name, component),
			use: () => app,
		}
		install(app as unknown as App)

		const takesErrors = (component: Component) => {
			const props = (component as { props?: string[] | Record<string, unknown> }).props ?? {}
			return (Array.isArray(props) ? props : Object.keys(props)).includes('errors')
		}
		const fields = [...registered].filter(([name, component]) => takesErrors(component) && !routesErrors.includes(name))

		const mountField = (name: string, component: Component, props: Record<string, unknown> = {}) =>
			mount(component, { props: { uuid: 'f', label: 'F', ...mountProps[name], ...props } })

		it('are found in install()', () => {
			expect(fields.map(([name]) => name)).toEqual(
				expect.arrayContaining(['ATextInput', 'AFormLink', 'ACurrencyInput'])
			)
		})

		it.each(routesErrors)('%s is still registered and still takes errors', name => {
			expect(takesErrors(registered.get(name)!)).toBe(true)
		})

		it.each(fields)('%s shows the errors it is handed', (name, component) => {
			const w = mountField(name, component, { errors: ['Bad'] })
			expect(w.find('.aform_error').text()).toBe('Bad')
			expect(w.find('[aria-invalid="true"]').exists()).toBe(!noInvalidState.includes(name))
		})

		it.each(fields)('%s shows nothing for a static validation.errorMessage alone', (name, component) => {
			const w = mountField(name, component, { validation: { errorMessage: 'static' } })
			const err = w.find('.aform_error')
			expect(err.text()).toBe('')
			expect(err.attributes('style') ?? '').toContain('display: none')
			expect(w.find('[aria-invalid]').exists()).toBe(false)
		})
	})

	describe('wordErrors', () => {
		it('words an error reported without a message with the static message, once', () => {
			expect(wordErrors(['', 'A', ''], { errorMessage: 'static' })).toEqual(['static', 'A'])
		})

		it("keeps the host's own messages as they are", () => {
			expect(wordErrors(['A', 'B'], { errorMessage: 'static' })).toEqual(['A', 'B'])
		})

		it('drops an error reported without a message when there is no wording for it', () => {
			expect(wordErrors([''], undefined)).toEqual([])
			expect(wordErrors(['', 'A'], { errorMessage: '' })).toEqual(['A'])
		})

		it('is empty when nothing is reported, whatever the static message', () => {
			expect(wordErrors([], { errorMessage: 'static' })).toEqual([])
		})
	})

	describe('fieldErrorText', () => {
		it('joins what it is handed, and is empty when handed nothing', () => {
			expect(fieldErrorText(['A', 'B'])).toBe('A; B')
			expect(fieldErrorText(undefined)).toBe('')
			expect(fieldErrorText([''])).toBe('')
		})
	})

	// AForm is the only place that knows which field an error was reported on, so it words them before routing.
	describe('AForm words errors by the field they were reported on', () => {
		const field = (fieldname: string, component: string, errorMessage?: string, extra: object = {}) =>
			({
				kind: 'field',
				fieldname,
				component,
				label: fieldname,
				...(errorMessage === undefined ? {} : { validation: { errorMessage } }),
				...extra,
			}) as ResolvedField

		const shown = (w: ReturnType<typeof mount>) => w.findAll('.aform_error').map(err => err.text())

		it("words an error reported without a message with that field's message", () => {
			const w = mount(AForm, {
				props: {
					schema: [field('name', 'ATextInput', 'Name is required'), field('city', 'ATextInput', 'City is required')],
					data: { name: '', city: 'Leeds' },
					errors: { name: [''] },
				},
				global: { components: { ATextInput } },
			})
			expect(shown(w)).toEqual(['Name is required', ''])
		})

		it("keeps a trigger's own message", () => {
			const w = mount(AForm, {
				props: {
					schema: [field('name', 'ATextInput', 'Name is required')],
					data: { name: 'x' },
					errors: { name: ['Too short'] },
				},
				global: { components: { ATextInput } },
			})
			expect(shown(w)).toEqual(['Too short'])
		})

		it('drops an error reported without a message on a field that has none to give it', () => {
			const w = mount(AForm, {
				props: { schema: [field('name', 'ATextInput')], data: { name: '' }, errors: { name: [''] } },
				global: { components: { ATextInput } },
			})
			expect(shown(w)).toEqual([''])
			expect(w.find('input').attributes('aria-invalid')).toBeUndefined()
		})

		it('words a link field, and shows nothing on a valid one', () => {
			const schema = [
				field('customer', 'AFormLink', 'Pick a customer'),
				field('supplier', 'AFormLink', 'Pick a supplier'),
			]
			const w = mount(AForm, {
				props: {
					schema,
					data: { customer: { id: 'C-1', displayText: 'Acme' }, supplier: null },
					errors: { supplier: [''] },
				},
				global: { components: { AFormLink } },
			})
			expect(shown(w)).toEqual(['', 'Pick a supplier'])
		})

		it("words a fieldset child's error with the child's own message", () => {
			const fieldset = {
				kind: 'fieldset',
				fieldname: 'address',
				label: 'Address',
				schema: [field('city', 'ATextInput', 'City is required')],
			} as ResolvedField
			const w = mount(AForm, {
				props: { schema: [fieldset], data: { city: '' }, errors: { city: [''] } },
				global: { components: { ATextInput, AFieldset } },
			})
			expect(shown(w)).toEqual(['City is required'])
		})

		// FAB's totals share one currency: an error on it is the currency's, worded the currency's way, wherever shown.
		it("words a shared part's error with that part's own field, in every field bound to it", () => {
			const total = (fieldname: string, message: string) =>
				field(fieldname, 'ACurrencyInput', message, {
					parts: { amount: fieldname, currency: 'currencyCode', exchangeRate: 'exchangeRate' },
					options: { baseCurrency: { id: 'USD' } },
				})
			const w = mount(AForm, {
				props: {
					schema: [
						total('netTotal', 'Net total is required'),
						total('grandTotal', 'Grand total is required'),
						field('currencyCode', 'AFormLink', 'Pick a currency', { hidden: true }),
					],
					data: { netTotal: 1, grandTotal: 1, currencyCode: null, exchangeRate: 1 },
					errors: { currencyCode: [''] },
				},
				global: { components: { ACurrencyInput, AFormLink } },
			})
			expect(shown(w)).toEqual(['Pick a currency', 'Pick a currency'])
		})
	})

	// Date-family field components (non-uniform: ADate/ADateRange/ADateTime own their error <p>; ADatePicker
	// is a calendar grid). Each must show the `errors` it is handed, never the static schema
	// `validation.errorMessage`, and hide the slot when there is no message.
	describe('field component (ADate)', () => {
		it('renders a dynamic error from the errors prop', () => {
			const w = mount(ADate, { props: { label: 'When', errors: ['End before start'] } })
			const err = w.find('.aform_error')
			expect(err.text()).toBe('End before start')
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ADate, { props: { label: 'When' } })
			expect(w.find('.aform_error').attributes('style') ?? '').toContain('display: none')
		})

		it('shows the errors it is handed, not a static validation.errorMessage', () => {
			const w = mount(ADate, { props: { label: 'When', errors: ['dyn'], validation: { errorMessage: 'stat' } } })
			expect(w.find('.aform_error').text()).toBe('dyn')
		})
	})

	describe('field component (ADateRange)', () => {
		it('renders a dynamic error from the errors prop', () => {
			const w = mount(ADateRange, { props: { label: 'Range', errors: ['End before start'] } })
			const err = w.find('.aform_error')
			expect(err.text()).toBe('End before start')
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ADateRange, { props: { label: 'Range' } })
			expect(w.find('.aform_error').attributes('style') ?? '').toContain('display: none')
		})

		it('shows the errors it is handed, not a static validation.errorMessage', () => {
			const w = mount(ADateRange, { props: { label: 'Range', errors: ['dyn'], validation: { errorMessage: 'stat' } } })
			expect(w.find('.aform_error').text()).toBe('dyn')
		})
	})

	describe('field component (ADateTime)', () => {
		it('renders a dynamic error from the errors prop', () => {
			const w = mount(ADateTime, { props: { label: 'Created', errors: ['Invalid datetime'] } })
			const err = w.find('.aform_error')
			expect(err.text()).toBe('Invalid datetime')
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ADateTime, { props: { label: 'Created' } })
			expect(w.find('.aform_error').attributes('style') ?? '').toContain('display: none')
		})

		it('shows the errors it is handed, not a static validation.errorMessage', () => {
			const w = mount(ADateTime, {
				props: { label: 'Created', errors: ['dyn'], validation: { errorMessage: 'stat' } },
			})
			expect(w.find('.aform_error').text()).toBe('dyn')
		})
	})

	describe('field component (ADatePicker)', () => {
		it('renders a dynamic error from the errors prop', () => {
			const w = mount(ADatePicker, { props: { errors: ['bad date'] } })
			const err = w.find('.aform_error')
			expect(err.exists()).toBe(true)
			expect(err.text()).toBe('bad date')
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ADatePicker, { props: {} })
			expect(w.find('.aform_error').attributes('style') ?? '').toContain('display: none')
		})
	})

	describe('date fields', () => {
		it.each([
			['ADate', ADate],
			['ADateRange', ADateRange],
			['ADateTime', ADateTime],
		])('%s wires aria-invalid and aria-describedby to its error', (_name, component) => {
			const w = mount(component, { props: { uuid: 'due', label: 'Due', errors: ['Due is required'] } })
			const input = w.find('input')
			const err = w.find('.aform_error')
			expect(input.attributes('aria-invalid')).toBe('true')
			expect(input.attributes('aria-describedby')).toBe('due-error')
			expect(err.attributes('id')).toBe('due-error')
			expect(err.attributes('role')).toBe('alert')
		})

		it.each([
			['ADate', ADate],
			['ADateRange', ADateRange],
			['ADateTime', ADateTime],
			['ADatePicker', ADatePicker],
		])('%s renders an error message as text, never as markup', (_name, component) => {
			const w = mount(component, { props: { uuid: 'due', label: 'Due', errors: ['<b>late</b>'] } })
			const err = w.find('.aform_error')
			expect(err.text()).toBe('<b>late</b>')
			expect(err.find('b').exists()).toBe(false)
		})
	})

	describe('grouped fields (ACurrencyInput, AQuantityInput)', () => {
		const grouped = [
			[
				'ACurrencyInput',
				ACurrencyInput,
				'.acurrency__amount',
				{
					amount: 1,
					currency: { id: 'USD' },
					baseAmount: 1,
					baseCurrency: { id: 'USD' },
					exchangeRate: 1,
				},
				{ baseCurrency: { id: 'USD' } },
			],
			[
				'AQuantityInput',
				AQuantityInput,
				'.aquantity__qty',
				{ qty: 1, uom: 'Nos', stockQty: 1, stockUom: 'Nos', conversionFactor: 1 },
				{ uoms: ['Nos'], stockUom: 'Nos' },
			],
		] as const

		// The two components take different value shapes, so the table's rows are mounted untyped.
		const mountGrouped = (component: Component, props: Record<string, unknown>) => mount(component, { props })

		it.each(grouped)('%s renders the errors prop, as text', (_name, component, _input, modelValue, options) => {
			const w = mountGrouped(component, { uuid: 'f', label: 'F', modelValue, options, errors: ['<b>late</b>'] })
			const err = w.find('.aform_error')
			expect(err.text()).toBe('<b>late</b>')
			expect(err.find('b').exists()).toBe(false)
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it.each(grouped)(
			'%s hides the error slot when there are no errors',
			(_name, component, _input, modelValue, options) => {
				const w = mountGrouped(component, { uuid: 'f', label: 'F', modelValue, options })
				expect(w.find('.aform_error').attributes('style') ?? '').toContain('display: none')
			}
		)

		it.each(grouped)(
			'%s does not show a static validation.errorMessage on its own',
			(_name, component, input, modelValue, options) => {
				const w = mountGrouped(component, {
					uuid: 'f',
					label: 'F',
					modelValue,
					options,
					validation: { errorMessage: 'static' },
				})
				expect(w.find('.aform_error').text()).toBe('')
				expect(w.find(input).attributes('aria-invalid')).toBeUndefined()
			}
		)

		it.each(grouped)(
			'%s wires aria-invalid and aria-describedby to its error',
			(_name, component, input, modelValue, options) => {
				const w = mountGrouped(component, { uuid: 'f', label: 'F', modelValue, options, errors: ['Required'] })
				expect(w.find(input).attributes('aria-invalid')).toBe('true')
				expect(w.find(input).attributes('aria-describedby')).toBe('f-error')
				expect(w.find('.aform_error').attributes('id')).toBe('f-error')
				expect(w.find('.aform_error').attributes('role')).toBe('alert')
			}
		)
	})

	describe('field component (ADropdown)', () => {
		it('renders a dynamic error from the errors prop', () => {
			const w = mount(ADropdown, { props: { label: 'Pick', errors: ['Required'] } })
			const err = w.find('.aform_error')
			expect(err.exists()).toBe(true)
			expect(err.text()).toBe('Required')
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ADropdown, { props: { label: 'Pick' } })
			expect(w.find('.aform_error').attributes('style') ?? '').toContain('display: none')
		})
	})

	describe('field component (AFormLink)', () => {
		it('renders a dynamic error and wires it to the input', () => {
			const w = mount(AFormLink, { props: { uuid: 'customer', label: 'Customer', errors: ['Required'] } })
			const input = w.find('input')
			const err = w.find('.aform_error')
			expect(err.text()).toBe('Required')
			expect(err.attributes('style') ?? '').not.toContain('display: none')
			expect(err.attributes('id')).toBe('customer-error')
			expect(err.attributes('role')).toBe('alert')
			expect(input.attributes('aria-invalid')).toBe('true')
			expect(input.attributes('aria-describedby')).toBe('customer-error')
		})

		it('joins multiple errors and shows them, not a static validation.errorMessage', () => {
			const w = mount(AFormLink, {
				props: { label: 'Customer', errors: ['A', 'B'], validation: { errorMessage: 'static' } },
			})
			expect(w.find('.aform_error').text()).toBe('A; B')
		})

		it('shows nothing for a static validation.errorMessage alone', () => {
			const w = mount(AFormLink, { props: { label: 'Customer', validation: { errorMessage: 'static' } } })
			expect(w.find('.aform_error').text()).toBe('')
		})

		it('hides the error slot and leaves the input valid when there are no errors', () => {
			const w = mount(AFormLink, { props: { uuid: 'customer', label: 'Customer' } })
			const input = w.find('input')
			expect(w.find('.aform_error').attributes('style') ?? '').toContain('display: none')
			expect(input.attributes('aria-invalid')).toBeUndefined()
			expect(input.attributes('aria-describedby')).toBeUndefined()
		})

		it('renders no error slot in embedded mode', () => {
			const w = mount(AFormLink, { props: { label: 'Currency', embedded: true, errors: ['Required'] } })
			expect(w.find('.aform_error').exists()).toBe(false)
			expect(w.find('input').attributes('aria-invalid')).toBeUndefined()
		})

		it('shows an error AForm routes to a link field', () => {
			const w = mount(AForm, {
				props: {
					schema: [{ fieldname: 'customer', component: 'AFormLink', label: 'Customer' }] as ResolvedField[],
					data: { customer: '' },
					errors: { customer: ['Required'] },
				},
				global: { components: { AFormLink } },
			})
			expect(w.findComponent(AFormLink).find('.aform_error').text()).toBe('Required')
		})
	})

	describe('AForm wiring', () => {
		it('routes errors to the correct field by fieldname', () => {
			const w = mount(AForm, {
				props: {
					schema: [
						{ fieldname: 'start_date', component: 'ATextInput', label: 'Start' },
						{ fieldname: 'end_date', component: 'ATextInput', label: 'End' },
					] as ResolvedField[],
					data: { start_date: '2020-01-02', end_date: '2020-01-01' },
					errors: { end_date: ['End before start'] },
				},
				global: { components: { ATextInput } },
			})
			const fields = w.findAllComponents(ATextInput)
			expect(fields[0].find('.aform_error').text()).toBe('') // start_date: no error
			expect(fields[1].find('.aform_error').text()).toBe('End before start') // end_date: flagged
		})

		it("ties every field's label and error to its input, with ids unique across forms", () => {
			const schema = [
				{ fieldname: 'start_date', component: 'ATextInput', label: 'Start' },
				{ fieldname: 'end_date', component: 'ATextInput', label: 'End' },
				{ fieldname: 'due', component: 'ADate', label: 'Due' },
			] as ResolvedField[]
			const twoForms = defineComponent({
				render: () => [
					h(AForm, { schema, data: {}, errors: { end_date: ['End before start'] } }),
					h(AForm, { schema, data: {} }),
				],
			})
			const w = mount(twoForms, { global: { components: { ATextInput, ADate } } })

			const inputs = w.findAll('.aform_form-element > input')
			expect(inputs).toHaveLength(6)
			const ids = inputs.map(input => input.attributes('id'))
			expect(ids.every(Boolean)).toBe(true)
			expect(new Set(ids).size).toBe(ids.length)
			for (const input of inputs) {
				expect(input.element.parentElement?.querySelector('label')?.htmlFor).toBe(input.attributes('id'))
			}
			const flagged = inputs[1]
			const error = flagged.element.parentElement?.querySelector('.aform_error')
			expect(error?.textContent).toBe('End before start')
			expect(flagged.attributes('aria-describedby')).toBe(error?.id)
		})
	})
})
