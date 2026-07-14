import { describe, it, expect } from 'vitest'
import {
	getDefaultComponent,
	TYPE_MAP,
	StonecropFieldType,
	BUILTIN_FIELD_TYPES,
	isBuiltinFieldType,
	resolveComponent,
	type BuiltinFieldType,
} from '../src/fieldtype'

describe('fieldtype', { tags: ['unit'] }, () => {
	describe('getDefaultComponent', () => {
		it('should return correct component for Data field', () => {
			expect(getDefaultComponent('Data')).toBe('ATextInput')
		})

		it('should return correct component for Int field', () => {
			expect(getDefaultComponent('Int')).toBe('ANumericInput')
		})

		it('should return correct component for Select field', () => {
			expect(getDefaultComponent('Select')).toBe('ADropdown')
		})

		it('should return correct component for Link field', () => {
			expect(getDefaultComponent('Link')).toBe('AFormLink')
		})

		it('should fallback to ATextInput for unknown builtin fieldtype', () => {
			// getDefaultComponent accepts BuiltinFieldType; use resolveComponent for open strings
			const unknown = 'NonExistentType' as any
			expect(getDefaultComponent(unknown)).toBe('ATextInput')
		})
	})

	describe('TYPE_MAP', () => {
		it('should have entries for all field types', () => {
			const expectedTypes = [
				'Data',
				'Text',
				'Int',
				'Float',
				'Decimal',
				'Check',
				'Date',
				'Time',
				'Datetime',
				'Duration',
				'DateRange',
				'JSON',
				'Code',
				'Link',
				'Attach',
				'Currency',
				'Quantity',
				'Select',
			]

			for (const type of expectedTypes) {
				expect(TYPE_MAP[type as BuiltinFieldType]).toBeDefined()
				expect(TYPE_MAP[type as BuiltinFieldType].component).toBeTruthy()
				expect(TYPE_MAP[type as BuiltinFieldType].fieldtype).toBe(type)
			}
		})

		it('should map each fieldtype to itself', () => {
			for (const [key, value] of Object.entries(TYPE_MAP)) {
				expect(value.fieldtype).toBe(key)
			}
		})

		// The canonical set of components that actually exist as registered SFCs
		// (aform/src/index.ts, plus ACodeEditor in code_editor and ATable in atable).
		// TYPE_MAP must never reference an aspirational component that has no SFC.
		const REAL_COMPONENTS = new Set([
			'ATextInput',
			'ATextarea',
			'ANumericInput',
			'ACheckbox',
			'ADate',
			'ADateTime',
			'ADuration',
			'ADateRange',
			'ADatePicker',
			'ADropdown',
			'AComboBox',
			'AFormLink',
			'AFileAttach',
			'AFieldset',
			'ACodeEditor',
			'ATable',
		])

		it('maps every fieldtype to a real registered component (no aspirational names)', () => {
			const offenders = Object.entries(TYPE_MAP)
				.filter(([, value]) => !REAL_COMPONENTS.has(value.component))
				.map(([key, value]) => `${key} → ${value.component}`)
			expect(offenders).toEqual([])
		})

		it('maps builtin fieldtypes to their corrected canonical components', () => {
			const expected: Record<string, string> = {
				Data: 'ATextInput',
				Text: 'ATextarea',
				Int: 'ANumericInput',
				Float: 'ANumericInput',
				Decimal: 'ANumericInput',
				Currency: 'ANumericInput',
				Quantity: 'ANumericInput',
				Check: 'ACheckbox',
				Date: 'ADate',
				Datetime: 'ADateTime',
				Duration: 'ADuration',
				DateRange: 'ADateRange',
				JSON: 'ACodeEditor',
				Code: 'ACodeEditor',
				Link: 'AFormLink',
				Attach: 'AFileAttach',
				Select: 'ADropdown',
				Fieldset: 'AFieldset',
				Display: 'ATextInput',
				PrimaryKey: 'ATextInput',
			}
			const actual: Record<string, string> = {}
			for (const type of Object.keys(expected)) {
				actual[type] = TYPE_MAP[type as BuiltinFieldType].component
			}
			expect(actual).toEqual(expected)
		})
	})

	describe('open fieldtype support', () => {
		it('accepts custom fieldtypes not in the builtin list', () => {
			expect(StonecropFieldType.safeParse('Phone').success).toBe(true)
			expect(StonecropFieldType.safeParse('HTML').success).toBe(true)
			expect(StonecropFieldType.safeParse('').success).toBe(false) // empty string still invalid
		})

		it('exports BUILTIN_FIELD_TYPES const listing all builtin types', () => {
			expect(BUILTIN_FIELD_TYPES).toBeDefined()
			expect(Array.isArray(BUILTIN_FIELD_TYPES)).toBe(true)
			expect(BUILTIN_FIELD_TYPES).toContain('Data')
			expect(BUILTIN_FIELD_TYPES).toContain('Link')
			expect(BUILTIN_FIELD_TYPES).toContain('Select')
			expect(BUILTIN_FIELD_TYPES).not.toContain('Phone')
			expect(BUILTIN_FIELD_TYPES).not.toContain('HTML')
		})

		it('exports isBuiltinFieldType type guard', () => {
			expect(typeof isBuiltinFieldType).toBe('function')
			expect(isBuiltinFieldType('Data')).toBe(true)
			expect(isBuiltinFieldType('Link')).toBe(true)
			expect(isBuiltinFieldType('Phone')).toBe(false)
			expect(isBuiltinFieldType('HTML')).toBe(false)
		})

		it('exports resolveComponent that falls back to ATextInput for unknown fieldtypes', () => {
			expect(typeof resolveComponent).toBe('function')
			expect(resolveComponent('Data')).toBe('ATextInput')
			expect(resolveComponent('Select')).toBe('ADropdown')
			expect(resolveComponent('Phone')).toBe('ATextInput') // unknown → fallback
			expect(resolveComponent('HTML')).toBe('ATextInput') // unknown → fallback
		})
	})

	describe('Fieldset fieldtype', () => {
		it('is in BUILTIN_FIELD_TYPES', () => {
			expect(BUILTIN_FIELD_TYPES).toContain('Fieldset')
			expect(isBuiltinFieldType('Fieldset')).toBe(true)
		})

		it('maps to AFieldset component', () => {
			expect(getDefaultComponent('Fieldset')).toBe('AFieldset')
			expect(resolveComponent('Fieldset')).toBe('AFieldset')
		})

		it('has a TYPE_MAP entry that maps to itself', () => {
			expect(TYPE_MAP['Fieldset']).toBeDefined()
			expect(TYPE_MAP['Fieldset'].fieldtype).toBe('Fieldset')
			expect(TYPE_MAP['Fieldset'].component).toBe('AFieldset')
		})
	})

	describe('Display fieldtype', () => {
		it('is in BUILTIN_FIELD_TYPES', () => {
			expect(BUILTIN_FIELD_TYPES).toContain('Display')
			expect(isBuiltinFieldType('Display')).toBe(true)
		})

		it('has a TYPE_MAP entry that maps to itself', () => {
			expect(TYPE_MAP['Display']).toBeDefined()
			expect(TYPE_MAP['Display'].fieldtype).toBe('Display')
		})
	})
})
