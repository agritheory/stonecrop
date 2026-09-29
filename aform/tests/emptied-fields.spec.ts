import { mount } from '@vue/test-utils'
import { COMPONENT_CATEGORY, type ComponentCategory } from '@stonecrop/schema'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'

import * as aform from '../src'

// A field in these categories holds text, where an emptied box's `''` is a real value.
const TEXT_CATEGORIES = new Set<ComponentCategory>(['text', 'code', 'select'])

// A value for each field holding something else, with no part already empty.
const SAMPLE_VALUES: Record<string, unknown> = {
	ACheckbox: true,
	ACurrencyInput: {
		amount: 5,
		currency: { id: 'EUR', displayText: 'Euro' },
		baseAmount: 5.5,
		baseCurrency: { id: 'USD', displayText: 'US Dollar' },
		exchangeRate: 1.1,
	},
	ADate: '2026-01-15',
	ADatePicker: '2026-01-15',
	ADateRange: { start_date: '2026-01-10', end_date: '2026-01-20' },
	ADateSelection: undefined,
	ADateTime: '2026-01-15T10:30:00.000Z',
	ADuration: 'PT1H',
	AFileAttach: undefined,
	AFormLink: { id: 'EUR', displayText: 'Euro' },
	ANumericInput: 5,
	AQuantityInput: { qty: 5, uom: 'Box', stockQty: 50, stockUom: 'Nos', conversionFactor: 10 },
}

const typedFields = Object.entries(COMPONENT_CATEGORY)
	.filter(([, category]) => !TEXT_CATEGORIES.has(category))
	.map(([name]) => name)

const mountField = (name: string) => {
	const component = (aform as Record<string, unknown>)[name] as Component
	return mount(component, { props: { modelValue: SAMPLE_VALUES[name], mode: 'edit', label: name, uuid: name } })
}

/** The boxes a user can empty: enabled, editable, and holding text. */
const emptiableInputs = (wrapper: ReturnType<typeof mountField>) =>
	wrapper.findAll('input').filter(({ element }) => {
		const input = element as HTMLInputElement
		return !input.disabled && !input.readOnly && !['checkbox', 'radio', 'button', 'file', 'hidden'].includes(input.type)
	})

/** Each part of `emptied` that is neither what `sample` held there nor null. */
const partsNotEmptiedToNull = (sample: unknown, emptied: unknown, path = 'value'): string[] => {
	if (emptied === null || Object.is(emptied, sample)) return []
	if (sample && emptied && typeof sample === 'object' && typeof emptied === 'object') {
		const parts = new Set([...Object.keys(sample), ...Object.keys(emptied)])
		return [...parts].flatMap(part =>
			partsNotEmptiedToNull(
				(sample as Record<string, unknown>)[part],
				(emptied as Record<string, unknown>)[part],
				`${path}.${part}`
			)
		)
	}
	return [`${path}: ${JSON.stringify(emptied)}`]
}

describe('fields holding something other than text', { tags: ['component'] }, () => {
	it.each(typedFields)('%s holds null for a box the user empties', async name => {
		expect(name in SAMPLE_VALUES, `no sample value for ${name}`).toBe(true)
		expect((aform as Record<string, unknown>)[name], `aform exports no ${name}`).toBeDefined()

		const problems: string[] = []
		const boxCount = emptiableInputs(mountField(name)).length
		for (let box = 0; box < boxCount; box++) {
			// Each box is emptied on a fresh mount, so one box's change never masks another's.
			const wrapper = mountField(name)
			// oxlint-disable-next-line eslint/no-await-in-loop -- one mount at a time, each checked before the next
			await emptiableInputs(wrapper)[box].setValue('')
			for (const [emitted] of wrapper.emitted('update:modelValue') ?? []) {
				problems.push(...partsNotEmptiedToNull(SAMPLE_VALUES[name], emitted))
			}
		}
		expect(problems).toEqual([])
	})

	const boxTexts = (name: string, modelValue: unknown) => {
		const component = (aform as Record<string, unknown>)[name] as Component
		const wrapper = mount(component, { props: { modelValue, mode: 'edit', label: name, uuid: name } })
		return emptiableInputs(wrapper).map(({ element }) => (element as HTMLInputElement).value)
	}

	// `ADuration`'s boxes are its picker's start and end times, which show where picking starts
	// whatever the field holds, so they never show its value, null or not.
	const BOXES_NOT_SHOWING_THE_VALUE = new Set(['ADuration'])

	// `initializeRecord` starts these fields at null, so a new record hands them null.
	it.each(
		typedFields.filter(
			name =>
				!BOXES_NOT_SHOWING_THE_VALUE.has(name) &&
				'modelValue' in (((aform as Record<string, unknown>)[name] as { props?: object }).props ?? {})
		)
	)('%s shows null as empty boxes', name => {
		expect(boxTexts(name, null).filter(text => text !== '')).toEqual([])
	})

	// The range's empty start and end days, then the start and end times.
	it("ADuration's boxes show the picker's starting times, whether it holds null or a duration", () => {
		expect(boxTexts('ADuration', null)).toEqual(['', '', '12', '00', '12', '00'])
		expect(boxTexts('ADuration', 'PT1H')).toEqual(['', '', '12', '00', '12', '00'])
	})

	it('has a sample value for exactly the fields holding something other than text', () => {
		expect(Object.keys(SAMPLE_VALUES).toSorted()).toEqual(typedFields.toSorted())
	})

	it('finds a box to empty in each field that has one', () => {
		const withBoxes = typedFields.filter(name => emptiableInputs(mountField(name)).length > 0)
		expect(withBoxes.toSorted()).toEqual([
			'ACurrencyInput',
			'ADate',
			'ADateSelection',
			'ADuration',
			'AFormLink',
			'ANumericInput',
			'AQuantityInput',
		])
	})
})
