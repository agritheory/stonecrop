import { describe, expect, it } from 'vitest'

import { orderKeysByReference } from '../src/runtime/server/api/docbuilder/mergeDoctype'

describe('orderKeysByReference', () => {
	it('re-imposes the reference key order on a reshuffled map', () => {
		// The builder emits transitions first, then stateless actions — moving a leading `save` down.
		// Reordering against the on-disk order restores it, so a drag-only save produces no action diff.
		const onDisk = { save: 1, submit: 2, process: 3, cancel: 4 }
		const rebuilt = { submit: 2, process: 3, cancel: 4, save: 1 }
		expect(Object.keys(orderKeysByReference(rebuilt, onDisk)!)).toEqual(['save', 'submit', 'process', 'cancel'])
	})

	it('appends keys absent from the reference in their original order', () => {
		const onDisk = { save: 1, submit: 2 }
		const next = { submit: 2, save: 1, command1: 9, command2: 8 }
		expect(Object.keys(orderKeysByReference(next, onDisk)!)).toEqual(['save', 'submit', 'command1', 'command2'])
	})

	it('drops reference keys no longer present in next (a deleted action)', () => {
		const onDisk = { save: 1, submit: 2, cancel: 3 }
		const next = { submit: 2, save: 1 }
		expect(Object.keys(orderKeysByReference(next, onDisk)!)).toEqual(['save', 'submit'])
	})

	it('preserves values, only reorders keys', () => {
		const result = orderKeysByReference({ b: 'B', a: 'A' }, { a: 'A', b: 'B' })
		expect(result).toEqual({ a: 'A', b: 'B' })
	})

	it('returns next unchanged when there is no reference (new doctype / no prior workflow)', () => {
		const next = { submit: 1, save: 2 }
		expect(orderKeysByReference(next, undefined)).toBe(next)
	})

	it('returns next unchanged when next is undefined', () => {
		expect(orderKeysByReference(undefined, { a: 1 })).toBeUndefined()
	})
})
