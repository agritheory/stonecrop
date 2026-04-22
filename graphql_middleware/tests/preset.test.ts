import { describe, it, expect } from 'vitest'

import { createStonecropPreset, StonecropPreset } from '../src/preset'
import { FieldCasing } from '../src/types/preset'

// ===========================================================================
// createStonecropPreset — structure validation
// ===========================================================================

describe('createStonecropPreset', () => {
	it('returns a valid object with extends and plugins', () => {
		const preset = createStonecropPreset()
		expect(preset).toBeDefined()
		expect(preset).toHaveProperty('extends')
		expect(preset).toHaveProperty('plugins')
	})

	it('extends contains PostGraphileAmberPreset', () => {
		const preset = createStonecropPreset()
		expect(preset.extends).toBeDefined()
		expect(Array.isArray(preset.extends)).toBe(true)
		expect(preset.extends!.length).toBeGreaterThan(0)
	})

	it('returns no plugins by default (camelCase)', () => {
		const preset = createStonecropPreset()
		expect(preset.plugins).toEqual([])
	})

	it('returns no plugins when fieldCasing is camel', () => {
		const preset = createStonecropPreset({ fieldCasing: 'camel' })
		expect(preset.plugins).toEqual([])
	})

	it('returns StonecropFieldCasingPlugin when fieldCasing is pascal', () => {
		const preset = createStonecropPreset({ fieldCasing: 'pascal' })
		expect(preset.plugins).toBeDefined()
		expect(Array.isArray(preset.plugins)).toBe(true)
		expect(preset.plugins!.length).toBe(1)
		expect(preset.plugins![0]).toHaveProperty('name', 'StonecropFieldCasingPlugin')
		expect(preset.plugins![0]).toHaveProperty('version', '0.0.0')
	})
})

// ===========================================================================
// StonecropPreset — convenience alias
// ===========================================================================

describe('StonecropPreset', () => {
	it('is the zero-options default preset', () => {
		expect(StonecropPreset).toBeDefined()
		expect(StonecropPreset).toEqual(createStonecropPreset())
	})

	it('has no plugins (camelCase default)', () => {
		expect(StonecropPreset.plugins).toEqual([])
	})
})

// ===========================================================================
// FieldCasing type
// ===========================================================================

describe('FieldCasing type', () => {
	it('accepts camel and pascal values', () => {
		const camelPreset = createStonecropPreset({ fieldCasing: 'camel' as FieldCasing })
		const pascalPreset = createStonecropPreset({ fieldCasing: 'pascal' as FieldCasing })
		expect(camelPreset.plugins).toEqual([])
		expect(pascalPreset.plugins!.length).toBe(1)
	})
})
