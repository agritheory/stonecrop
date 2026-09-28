import { describe, it, expect } from 'vitest'

import { validateDoctype } from '../src/validation'

describe('doctype defaults', { tags: ['unit'] }, () => {
	const base = {
		name: 'Sample',
		fields: [{ fieldname: 'title', component: 'ATextInput' }],
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
				nested: {
					bad: () => {},
				},
			},
		})
		expect(result.success).toBe(false)
		if (result.success) return
		expect(result.errors.some(e => e.path.includes('defaults'))).toBe(true)
	})
})
