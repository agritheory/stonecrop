import { describe, expect, it } from 'vitest'

import { getDoctypeSlug, toSlug } from '../src/index'

/**
 * The derivation both registries must share.
 *
 * The cases below are the ones that produced the divergence this helper exists to close, not a
 * survey of string shapes: a doctype addressed by its Name, and a doctype whose authored slug is
 * not what the Name would derive.
 */
describe('getDoctypeSlug', { tags: ['unit'] }, () => {
	it('derives kebab-case from a PascalCase name', () => {
		expect(getDoctypeSlug({ name: 'OrderItem' })).toBe('order-item')
	})

	it('prefers an authored slug over the derived one', () => {
		// The authored doctype is the source of truth — generation verifies a file, never overwrites
		// it. `Doctype.fromObject` dropped this and re-derived, so an authored slug was a silent
		// no-op on the client while the adapter honoured it.
		expect(getDoctypeSlug({ name: 'Planner', slug: 'planner-board' })).toBe('planner-board')
	})

	it('is the same derivation `toSlug` already published, not a second one', () => {
		for (const name of ['User', 'SalesOrder', 'Sales Order', 'sales_order', 'UOMConversion', 'already-kebab']) {
			expect(getDoctypeSlug({ name })).toBe(toSlug(name))
		}
	})

	it('treats an empty authored slug as absent rather than as a key', () => {
		// `''` is not a usable registry key; falling through to the derivation is the only answer
		// that leaves the doctype addressable.
		expect(getDoctypeSlug({ name: 'OrderItem', slug: '' })).toBe('order-item')
	})
})
