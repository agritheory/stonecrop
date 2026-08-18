import { describe, expect, it } from 'vitest'

import {
	hasBadgeOptions,
	isBadgeDescriptor,
	isSelectChoiceMap,
	isSelectOptions,
	lookupBadge,
	selectChoices,
} from '../src/badge'

describe('badge helpers', { tags: ['component'] }, () => {
	it('isBadgeDescriptor accepts valid descriptors', () => {
		expect(isBadgeDescriptor({ label: 'Open', variant: 'warning' })).toBe(true)
		expect(isBadgeDescriptor({ label: 'Custom', color: '#336699' })).toBe(true)
		expect(isBadgeDescriptor({ label: 'Custom', color: '#336699', variant: 'brand' })).toBe(true)
		expect(isBadgeDescriptor({ variant: 'success' })).toBe(false)
		expect(isBadgeDescriptor('Open')).toBe(false)
	})

	it('isSelectChoiceMap rejects quantity-style config bags', () => {
		expect(isSelectChoiceMap({ precision: 10, scale: 2 })).toBe(false)
		expect(isSelectChoiceMap({ language: 'python' })).toBe(false)
	})

	it('isSelectChoiceMap accepts bare value→variant maps', () => {
		expect(
			isSelectChoiceMap({
				Open: 'warning',
				Closed: 'success',
			})
		).toBe(true)
	})

	it('isSelectOptions recognizes structured select options', () => {
		expect(
			isSelectOptions({
				choices: ['A', 'B'],
				badges: { A: 'success' },
			})
		).toBe(true)
	})

	it('selectChoices returns string[] unchanged', () => {
		expect(selectChoices(['Draft', 'Submitted'])).toEqual(['Draft', 'Submitted'])
	})

	it('selectChoices returns choices from structured options', () => {
		expect(
			selectChoices({
				choices: ['Open', 'Closed'],
				badges: { Open: 'warning' },
			})
		).toEqual(['Open', 'Closed'])
	})

	it('selectChoices returns keys from bare badge maps', () => {
		expect(
			selectChoices({
				Open: 'warning',
				Closed: 'neutral',
			})
		).toEqual(['Open', 'Closed'])
	})

	it('lookupBadge resolves shorthand and object specs', () => {
		expect(lookupBadge({ Open: 'warning', Closed: { variant: 'success', label: 'Done' } }, 'Open')).toEqual({
			label: 'Open',
			variant: 'warning',
		})
		expect(lookupBadge({ Closed: { variant: 'success', label: 'Done' } }, 'Closed')).toEqual({
			label: 'Done',
			variant: 'success',
		})
	})

	it('lookupBadge reads structured badges', () => {
		expect(
			lookupBadge(
				{
					choices: ['Open', 'Closed'],
					badges: { Open: 'danger' },
				},
				'Open'
			)
		).toEqual({ label: 'Open', variant: 'danger' })
	})

	it('hasBadgeOptions is false for plain string[] selects', () => {
		expect(hasBadgeOptions(['A', 'B'])).toBe(false)
	})

	it('hasBadgeOptions is true for bare maps and structured badges', () => {
		expect(hasBadgeOptions({ Open: 'warning' })).toBe(true)
		expect(
			hasBadgeOptions({
				choices: ['Open'],
				badges: { Open: 'warning' },
			})
		).toBe(true)
	})
})
