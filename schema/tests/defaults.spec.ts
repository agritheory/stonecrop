import { describe, it, expect } from 'vitest'

import { validateDoctype } from '../src/validation'

describe('doctype defaults', { tags: ['unit'] }, () => {
	const base = {
		name: 'Sample',
		fields: [
			{ fieldname: 'title', component: 'ATextInput' },
			{ fieldname: 'items', component: 'ATable', doctype: 'sample-item' },
		],
	}

	it('accepts a static defaults document', () => {
		const result = validateDoctype({
			...base,
			defaults: { title: 'Draft', items: [{ postingDate: 'now' }] },
		})
		expect(result.success).toBe(true)
	})

	it('rejects a function anywhere in defaults', () => {
		const result = validateDoctype({
			...base,
			defaults: {
				title: 'ok',
				items: [{ bad: () => {} }],
			},
		})
		expect(result.success).toBe(false)
		if (result.success) return
		expect(result.errors.some(e => e.path.includes('defaults'))).toBe(true)
	})

	it('rejects a key that names no field, and says which', () => {
		const result = validateDoctype({ ...base, defaults: { titel: 'Draft' } })
		expect(result.success).toBe(false)
		if (result.success) return
		expect(result.errors).toContainEqual(
			expect.objectContaining({ path: ['defaults', 'titel'], message: expect.stringContaining('"titel"') })
		)
	})

	it("rejects a grouped section's name, since each of its fields takes its own entry", () => {
		const result = validateDoctype({
			...base,
			fields: [
				{
					kind: 'fieldset',
					fieldname: 'address',
					label: 'Address',
					schema: [{ fieldname: 'city', component: 'ATextInput' }],
				},
			],
			defaults: { address: { city: 'Springfield' } },
		})
		expect(result.success).toBe(false)
		if (result.success) return
		expect(result.errors).toContainEqual(
			expect.objectContaining({ path: ['defaults', 'address'], message: expect.stringContaining('city') })
		)
	})

	it('accepts a field inside a grouped section', () => {
		const result = validateDoctype({
			...base,
			fields: [
				{
					kind: 'fieldset',
					fieldname: 'address',
					label: 'Address',
					schema: [{ fieldname: 'city', component: 'ATextInput' }],
				},
			],
			defaults: { city: 'Springfield' },
		})
		expect(result.success).toBe(true)
	})
})
