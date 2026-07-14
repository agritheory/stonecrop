import { describe, it, expect } from 'vitest'
import { componentCategory, COMPONENT_CATEGORY } from '../src/component-meta'

describe('component-meta', { tags: ['unit'] }, () => {
	it('categorizes the canonical components', () => {
		expect(componentCategory('ATextInput')).toBe('text')
		expect(componentCategory('ATextarea')).toBe('text')
		expect(componentCategory('ANumericInput')).toBe('number')
		expect(componentCategory('ACheckbox')).toBe('boolean')
		expect(componentCategory('ADate')).toBe('date')
		expect(componentCategory('ADateTime')).toBe('datetime')
		expect(componentCategory('ADropdown')).toBe('select')
		expect(componentCategory('AComboBox')).toBe('select')
		expect(componentCategory('ACodeEditor')).toBe('code')
		expect(componentCategory('AFormLink')).toBe('link')
	})

	it('returns undefined for unknown or absent components (so callers can fall back)', () => {
		expect(componentCategory('ASomethingCustom')).toBeUndefined()
		expect(componentCategory(undefined)).toBeUndefined()
		expect(componentCategory('')).toBeUndefined()
	})

	it('every canonical component maps to a category via the public helper', () => {
		for (const name of Object.keys(COMPONENT_CATEGORY)) {
			expect(componentCategory(name)).toBe(COMPONENT_CATEGORY[name])
		}
	})
})
