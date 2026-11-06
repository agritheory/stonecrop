import { describe, expect, it } from 'vite-plus/test'

import { formatRichTextCell } from '../src/richText'

const doc = (...blocks: { type: string; data: Record<string, unknown> }[]) => ({ time: 1, blocks, version: '2.31.7' })

describe('a block document in a table cell', { tags: ['unit'] }, () => {
	it('shows nothing for a field never edited', () => {
		expect(formatRichTextCell(null)).toBe('')
		expect(formatRichTextCell(undefined)).toBe('')
		expect(formatRichTextCell('plain')).toBe('')
		expect(formatRichTextCell({ blocks: 'nope' })).toBe('')
	})

	it('joins the text of every block, without its inline markup', () => {
		const value = doc(
			{ type: 'header', data: { text: 'Shipping <i>notes</i>', level: 2 } },
			{ type: 'paragraph', data: { text: 'Keep <b>dry</b>&nbsp;&amp; cool<br>please' } },
			{ type: 'delimiter', data: {} },
			{ type: 'quote', data: { text: 'Handle with care', caption: 'Warehouse', alignment: 'left' } }
		)
		expect(formatRichTextCell(value)).toBe('Shipping notes Keep dry & cool please Handle with care Warehouse')
	})

	it('reads nested list items, and the older list of strings', () => {
		const nested = doc({
			type: 'list',
			data: {
				style: 'ordered',
				meta: {},
				items: [
					{ content: 'One', meta: {}, items: [{ content: 'One a', meta: {}, items: [] }] },
					{ content: 'Two', meta: {}, items: [] },
				],
			},
		})
		expect(formatRichTextCell(nested)).toBe('One One a Two')
		expect(formatRichTextCell(doc({ type: 'list', data: { style: 'unordered', items: ['a', 'b'] } }))).toBe('a b')
	})

	it('decodes numeric entities and skips empty blocks', () => {
		const value = doc(
			{ type: 'paragraph', data: { text: '&#169; 2026 &#x2014; ok' } },
			{ type: 'paragraph', data: { text: '' } }
		)
		expect(formatRichTextCell(value)).toBe('© 2026 — ok')
	})
})
