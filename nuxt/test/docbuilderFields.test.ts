import { describe, expect, it } from 'vitest'

import { setOrDelete, updateFieldAt, type Field } from '../src/runtime/app/components/docbuilderFields'

/**
 * Hop 3 of the unknown-key preservation chain — the fields-panel cell edit. Previously untested: the
 * logic lived inline in `DocBuilderFieldsPanel.vue`, and this package's tests run in a DOM-less node
 * environment, so the SFC cannot be mounted to reach it.
 *
 * This hop matters most of the four, because the server replaces `fields` wholesale with whatever
 * the client sends (see `mergeSavedDoctype`). A key dropped here is dropped on disk.
 */

/** A field carrying every undisplayed key FAB actually relies on, by measured frequency. */
const richField = (): Field => ({
	kind: 'field',
	fieldname: 'total',
	component: 'ATextInput',
	label: 'Total',
	source: 'introspected',
	filterFunction: 'byOrganization',
	isAsync: true,
	collapsible: false,
	options: ['a', 'b'],
	schema: [{ fieldname: 'nested' }],
})

describe('setOrDelete', () => {
	it('preserves every undisplayed key when a displayed one changes', () => {
		const result = setOrDelete(richField(), 'label', 'Grand Total')

		expect(result.label).toBe('Grand Total')
		expect(result.filterFunction).toBe('byOrganization')
		expect(result.isAsync).toBe(true)
		expect(result.collapsible).toBe(false)
		expect(result.options).toEqual(['a', 'b'])
		expect(result.schema).toEqual([{ fieldname: 'nested' }])
		expect(result.source).toBe('introspected')
	})

	it('deletes the key when the value is undefined, rather than writing undefined', () => {
		// JSON.stringify drops undefined values, so writing one would make "cleared" and "never set"
		// identical on disk but different in memory.
		const result = setOrDelete(richField(), 'label', undefined)

		expect('label' in result).toBe(false)
		expect(result.filterFunction).toBe('byOrganization')
	})

	it('keeps falsy values that are not undefined', () => {
		expect(setOrDelete({ a: 1 }, 'b', false).b).toBe(false)
		expect(setOrDelete({ a: 1 }, 'b', '').b).toBe('')
		expect(setOrDelete({ a: 1 }, 'b', 0).b).toBe(0)
		expect(setOrDelete({ a: 1 }, 'b', null).b).toBeNull()
	})

	it('adds a key that was not present', () => {
		expect(setOrDelete({ fieldname: 'a' }, 'readOnly', true)).toEqual({ fieldname: 'a', readOnly: true })
	})

	it('does not mutate the input field', () => {
		const original = richField()
		setOrDelete(original, 'label', 'changed')
		setOrDelete(original, 'filterFunction', undefined)
		expect(original).toEqual(richField())
	})

	it('deleting an absent key is a no-op, not an error', () => {
		expect(setOrDelete({ fieldname: 'a' }, 'nothere', undefined)).toEqual({ fieldname: 'a' })
	})
})

describe('updateFieldAt', () => {
	it('leaves fields at other indices strictly identical', () => {
		const fields = [richField(), richField(), richField()]

		const result = updateFieldAt(fields, 1, 'label', 'Edited')

		// Identity, not just equality — an untouched row must not even be rebuilt.
		expect(result[0]).toBe(fields[0])
		expect(result[2]).toBe(fields[2])
		expect(result[1]).not.toBe(fields[1])
		expect(result[1]!.label).toBe('Edited')
	})

	it('preserves array order and length', () => {
		const fields = [{ fieldname: 'a' }, { fieldname: 'b' }, { fieldname: 'c' }]
		const result = updateFieldAt(fields, 1, 'label', 'B')
		expect(result.map(f => f.fieldname)).toEqual(['a', 'b', 'c'])
	})

	it('preserves undisplayed keys on the edited row', () => {
		const result = updateFieldAt([richField()], 0, 'component', 'ANumberInput')
		expect(result[0]!.filterFunction).toBe('byOrganization')
		expect(result[0]!.schema).toEqual([{ fieldname: 'nested' }])
	})

	it('is a no-op for an out-of-range index', () => {
		const fields = [{ fieldname: 'a' }]
		expect(updateFieldAt(fields, 5, 'label', 'X')).toEqual(fields)
	})

	it('does not mutate the input array', () => {
		const fields = [richField()]
		updateFieldAt(fields, 0, 'label', 'Edited')
		expect(fields[0]).toEqual(richField())
	})
})
