import { describe, expect, it } from 'vitest'

import { mergeSavedDoctype, orderKeysByReference } from '../src/runtime/server/api/docbuilder/mergeDoctype'

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

/**
 * Hop 4 of the unknown-key preservation chain — the server write. Previously untested because the
 * logic lived inside `save.post.ts`, which cannot be imported in a plain vitest run.
 */
describe('mergeSavedDoctype', () => {
	it('preserves top-level keys the builder never sends', () => {
		const onDisk = {
			name: 'Order',
			primaryKey: 'orderNumber',
			links: { customer: { doctype: 'Customer' } },
			source: 'introspected',
			fields: [{ fieldname: 'stale' }],
		}

		const merged = mergeSavedDoctype(onDisk, { fields: [{ fieldname: 'fresh' }] }, 'order')

		expect(merged.primaryKey).toBe('orderNumber')
		expect(merged.links).toEqual({ customer: { doctype: 'Customer' } })
		expect(merged.source).toBe('introspected')
		// ...while `fields` is the submitted array, not the one on disk.
		expect(merged.fields).toEqual([{ fieldname: 'fresh' }])
	})

	it("replaces fields wholesale — field-level keys are hop 3's responsibility, not this one", () => {
		// Stated as an executable fact rather than a comment: if a key is dropped in the browser it
		// is dropped on disk, which is why DocBuilderFieldsPanel's helpers are tested separately.
		const onDisk = { fields: [{ fieldname: 'total', filterFunction: 'byOrg', source: 'introspected' }] }

		const merged = mergeSavedDoctype(onDisk, { fields: [{ fieldname: 'total' }] }, 'order')

		expect(merged.fields).toEqual([{ fieldname: 'total' }])
	})

	it('keeps the existing name and ignores the requested slug', () => {
		const merged = mergeSavedDoctype({ name: 'Sales Order' }, { fields: [] }, 'sales-order')
		expect(merged.name).toBe('Sales Order')
	})

	it('falls back to the requested name only when creating', () => {
		expect(mergeSavedDoctype({}, { fields: [] }, 'order').name).toBe('order')
		// An empty string is not a usable name either — the schema requires a non-empty one.
		expect(mergeSavedDoctype({ name: '' }, { fields: [] }, 'order').name).toBe('order')
	})

	it('omits workflow rather than writing null, which would fail validation', () => {
		const merged = mergeSavedDoctype({ fields: [] }, { fields: [], workflow: null }, 'order')
		expect('workflow' in merged).toBe(false)
	})

	it('preserves an existing workflow when the body sends none', () => {
		const workflow = { initial: 'DRAFT', actions: { save: { selfTransition: true } } }
		const merged = mergeSavedDoctype({ workflow, fields: [] }, { fields: [] }, 'order')
		expect(merged.workflow).toEqual(workflow)
	})

	it('re-imposes on-disk action order on a submitted workflow', () => {
		const onDisk = { workflow: { actions: { save: {}, submit: {}, cancel: {} } }, fields: [] }
		const body = { fields: [], workflow: { actions: { submit: {}, cancel: {}, save: {} } } }

		const merged = mergeSavedDoctype(onDisk, body, 'order')

		expect(Object.keys((merged.workflow as { actions: object }).actions)).toEqual(['save', 'submit', 'cancel'])
	})

	it('keeps unknown keys inside a submitted action', () => {
		// `clientHandler` and `triggers` were each dropped by an earlier hop that enumerated keys.
		const body = {
			fields: [],
			workflow: { actions: { approve: { nextState: 'APPROVED', clientHandler: 'doThing()', handler: 'x:y' } } },
		}

		const merged = mergeSavedDoctype({ fields: [] }, body, 'order')

		expect((merged.workflow as { actions: Record<string, unknown> }).actions.approve).toEqual({
			nextState: 'APPROVED',
			clientHandler: 'doThing()',
			handler: 'x:y',
		})
	})

	it('drops the legacy schema key in favour of fields', () => {
		const merged = mergeSavedDoctype({ schema: [{ fieldname: 'old' }] }, { fields: [] }, 'order')
		expect('schema' in merged).toBe(false)
	})

	it('does not mutate the object read from disk', () => {
		const onDisk = { name: 'Order', fields: [{ fieldname: 'stale' }], schema: [] }
		mergeSavedDoctype(onDisk, { fields: [{ fieldname: 'fresh' }] }, 'order')
		expect(onDisk).toEqual({ name: 'Order', fields: [{ fieldname: 'stale' }], schema: [] })
	})
})
