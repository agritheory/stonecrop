import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { describe, it, expect } from 'vitest'

import { createStonecropPreset, StonecropPreset, makePgService } from '../src/index'

// Looked up by name, never by position: the plugin list is a set, and an index assertion breaks on
// any addition to it without the contract having changed.
const pluginNamed = (preset: GraphileConfig.Preset, name: string) =>
	(preset.plugins ?? []).find(p => p.name === name) as any

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

	it('always includes StonecropNaturalIdPlugin, whatever the options', () => {
		// Not opt-in: without it the schema hands every doctype an `id` that is Relay's node
		// identifier rather than a column, which is a wrong answer rather than a missing feature.
		for (const options of [undefined, { fieldCasing: 'camel' } as const, { fieldCasing: 'pascal' } as const]) {
			expect(pluginNamed(createStonecropPreset(options), 'StonecropNaturalIdPlugin')).toBeDefined()
		}
	})

	it('default (no options) adds nothing but the natural-id plugin', () => {
		expect((createStonecropPreset().plugins ?? []).map(p => p.name)).toEqual(['StonecropNaturalIdPlugin'])
	})

	it("fieldCasing: 'camel' adds nothing but the natural-id plugin", () => {
		expect((createStonecropPreset({ fieldCasing: 'camel' }).plugins ?? []).map(p => p.name)).toEqual([
			'StonecropNaturalIdPlugin',
		])
	})

	it('StonecropNaturalIdPlugin moves the Relay identifier to nodeId', () => {
		const plugin = pluginNamed(createStonecropPreset(), 'StonecropNaturalIdPlugin')
		expect(plugin.inflection.replace.nodeIdFieldName()).toBe('nodeId')
	})

	it('StonecropNaturalIdPlugin restores a renamed id column and leaves others alone', () => {
		const plugin = pluginNamed(createStonecropPreset(), 'StonecropNaturalIdPlugin')
		const rename = plugin.inflection.replace._attributeName
		const codec = { attributes: { id: {}, other_col: {} }, isAnonymous: false }

		// Amber has already turned the `id` column into `row_id` — put it back.
		expect(rename(() => 'row_id', undefined, { codec, attributeName: 'id', skipRowId: false })).toBe('id')
		// A column genuinely named `row_id` keeps its name: the guard is the *source* attribute.
		expect(rename(() => 'row_id', undefined, { codec, attributeName: 'other_col', skipRowId: false })).toBe('row_id')
		// Anything Amber did not rename passes straight through.
		expect(rename(() => 'other_col', undefined, { codec, attributeName: 'other_col', skipRowId: false })).toBe(
			'other_col'
		)
	})

	it("fieldCasing: 'pascal' adds StonecropFieldCasingPlugin", () => {
		const preset = createStonecropPreset({ fieldCasing: 'pascal' })
		expect((preset.plugins ?? []).map(p => p.name)).toContain('StonecropFieldCasingPlugin')
	})

	it("fieldCasing: 'pascal' plugin defines a replace.attribute inflector", () => {
		const preset = createStonecropPreset({ fieldCasing: 'pascal' })
		const plugin = pluginNamed(preset, 'StonecropFieldCasingPlugin')
		expect(typeof plugin.inflection?.replace?.attribute).toBe('function')
	})

	it("fieldCasing: 'pascal' attribute inflector calls upperCamelCase", () => {
		const preset = createStonecropPreset({ fieldCasing: 'pascal' })
		const plugin = pluginNamed(preset, 'StonecropFieldCasingPlugin')
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
