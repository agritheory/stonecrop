import { describe, it, expect } from 'vitest'

import { linkSearchableText } from '../src/linkSearchableText'

describe('linkSearchableText', { tags: ['unit'] }, () => {
	it('joins id and displayText from middleware-enriched link values', () => {
		expect(linkSearchableText({ id: 'uuid-1', displayText: 'Dover Fruit Market' })).toBe('uuid-1 Dover Fruit Market')
	})

	it('falls back to the bare id when enrichment is absent', () => {
		expect(linkSearchableText('uuid-1')).toBe('uuid-1')
	})
})
