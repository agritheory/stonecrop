import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { describe, it, expect } from 'vitest'

import { createStonecropPreset, StonecropPreset, makePgService } from '../src/index'

describe('createStonecropPreset', { tags: ['unit', 'graphql'] }, () => {
	it('returns a valid GraphileConfig.Preset', () => {
		const preset = createStonecropPreset()
		expect(preset).toBeDefined()
		expect(Array.isArray(preset.extends)).toBe(true)
	})

	it('extends array contains PostGraphileAmberPreset', () => {
		const preset = createStonecropPreset()
		expect(preset.extends).toContain(PostGraphileAmberPreset)
	})

	it('StonecropPreset is structurally equivalent to createStonecropPreset()', () => {
		expect(StonecropPreset).toEqual(createStonecropPreset())
	})

	it('default (no options) includes no plugins', () => {
		const preset = createStonecropPreset()
		expect(preset.plugins).toEqual([])
	})

	it("fieldCasing: 'camel' includes no plugins", () => {
		const preset = createStonecropPreset({ fieldCasing: 'camel' })
		expect(preset.plugins).toEqual([])
	})

	it("fieldCasing: 'pascal' adds StonecropFieldCasingPlugin", () => {
		const preset = createStonecropPreset({ fieldCasing: 'pascal' })
		expect(preset.plugins).toHaveLength(1)
		const plugin = preset.plugins![0] as any
		expect(plugin.name).toBe('StonecropFieldCasingPlugin')
	})

	it("fieldCasing: 'pascal' plugin defines a replace.attribute inflector", () => {
		const preset = createStonecropPreset({ fieldCasing: 'pascal' })
		const plugin = preset.plugins![0] as any
		expect(typeof plugin.inflection?.replace?.attribute).toBe('function')
	})

	it("fieldCasing: 'pascal' attribute inflector calls upperCamelCase", () => {
		const preset = createStonecropPreset({ fieldCasing: 'pascal' })
		const plugin = preset.plugins![0] as any
		const attributeFn = plugin.inflection.replace.attribute

		const calls: string[] = []
		const mockThis = {
			upperCamelCase: (s: string) => {
				calls.push(s)
				return `UPPER(${s})`
			},
			_attributeName: (_details: any) => 'some_column',
		}
		const result = attributeFn.call(mockThis, undefined, undefined, { attributeName: 'some_column' })
		expect(calls).toContain('some_column')
		expect(result).toBe('UPPER(some_column)')
	})
})

describe('makePgService re-export', { tags: ['unit', 'graphql'] }, () => {
	it('is a function', () => {
		expect(typeof makePgService).toBe('function')
	})
})
