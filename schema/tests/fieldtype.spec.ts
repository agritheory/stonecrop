import { describe, it, expect } from 'vitest'
import { getDefaultComponent, TYPE_MAP, StonecropFieldType } from '../src/fieldtype'

describe('fieldtype', () => {
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
			expect(getDefaultComponent('Link')).toBe('ALink')
		})

		it('should fallback to ATextInput for invalid fieldtype', () => {
			// Use type assertion to bypass TypeScript checking
			const invalid = 'NonExistentType' as StonecropFieldType
			expect(getDefaultComponent(invalid)).toBe('ATextInput')
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
				expect(TYPE_MAP[type as StonecropFieldType]).toBeDefined()
				expect(TYPE_MAP[type as StonecropFieldType].component).toBeTruthy()
				expect(TYPE_MAP[type as StonecropFieldType].fieldtype).toBe(type)
			}
		})

		it('should map each fieldtype to itself', () => {
			for (const [key, value] of Object.entries(TYPE_MAP)) {
				expect(value.fieldtype).toBe(key)
			}
		})
	})
})
