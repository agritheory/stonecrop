import { describe, expect, it } from 'vite-plus/test'

import { renderBlocks, sanitizeInline } from '../src/utils/render'

const doc = (...blocks: { type: string; data: Record<string, unknown> }[]) => ({ time: 1, blocks, version: '2.31.7' })

describe('renderBlocks', { tags: ['unit'] }, () => {
	it('renders nothing for a field never edited', () => {
		expect(renderBlocks(null)).toBe('')
		expect(renderBlocks(undefined)).toBe('')
	})

	it('renders each block the editor ships', () => {
		const html = renderBlocks(
			doc(
				{ type: 'header', data: { text: 'Title', level: 3 } },
				{ type: 'paragraph', data: { text: 'Some <b>bold</b> text' } },
				{ type: 'delimiter', data: {} },
				{ type: 'quote', data: { text: 'Said', caption: 'Someone', alignment: 'left' } }
			)
		)
		expect(html).toBe(
			'<h3>Title</h3><p>Some <b>bold</b> text</p><hr><blockquote><p>Said</p><cite>Someone</cite></blockquote>'
		)
	})

	it('clamps a header level', () => {
		expect(renderBlocks(doc({ type: 'header', data: { text: 'x', level: 9 } }))).toBe('<h6>x</h6>')
		expect(renderBlocks(doc({ type: 'header', data: { text: 'x' } }))).toBe('<h2>x</h2>')
	})

	it('renders nested, ordered, checklist and older lists', () => {
		const nested = doc({
			type: 'list',
			data: {
				style: 'ordered',
				meta: { start: 3 },
				items: [{ content: 'a', meta: {}, items: [{ content: 'b', meta: {}, items: [] }] }],
			},
		})
		expect(renderBlocks(nested)).toBe('<ol start="3"><li>a<ol><li>b</li></ol></li></ol>')

		const checklist = doc({
			type: 'list',
			data: { style: 'checklist', meta: {}, items: [{ content: 'done', meta: { checked: true }, items: [] }] },
		})
		expect(renderBlocks(checklist)).toContain('class="a-editor__checked"')
		expect(renderBlocks(checklist)).toContain('☑')

		expect(renderBlocks(doc({ type: 'list', data: { style: 'unordered', items: ['x', 'y'] } }))).toBe(
			'<ul><li>x</li><li>y</li></ul>'
		)
	})

	it('shows the text of a block from a tool it does not ship', () => {
		expect(renderBlocks(doc({ type: 'warning', data: { text: 'careful', title: 't' } }))).toBe('<p>careful</p>')
		expect(renderBlocks(doc({ type: 'image', data: { url: 'x.png' } }))).toBe('')
	})
})

describe('sanitizeInline', { tags: ['unit'] }, () => {
	it('keeps the inline markup Editor.js writes, without its attributes', () => {
		expect(sanitizeInline('<b class="x">a</b><i>b</i><br/>c')).toBe('<b>a</b><i>b</i><br>c')
	})

	it('drops any other element', () => {
		expect(sanitizeInline('<script>alert(1)</script>')).toBe('alert(1)')
		expect(sanitizeInline('<img src=x onerror="alert(1)">hi')).toBe('hi')
		expect(sanitizeInline('<b onclick="alert(1)">x</b>')).toBe('<b>x</b>')
	})

	it('keeps only a safe link target', () => {
		expect(sanitizeInline('<a href="https://example.com/?a=1&amp;b=2">x</a>')).toBe(
			'<a href="https://example.com/?a=1&amp;b=2" target="_blank" rel="nofollow noopener noreferrer">x</a>'
		)
		expect(sanitizeInline('<a href="javascript:alert(1)">x</a>')).toBe('<a>x</a>')
		expect(sanitizeInline('<a href="&#106;avascript:alert(1)">x</a>')).toBe('<a>x</a>')
	})

	it('escapes a stray angle bracket and leaves entities as they are', () => {
		expect(sanitizeInline('1 < 2 &amp; 3 > 2')).toBe('1 &lt; 2 &amp; 3 &gt; 2')
		expect(sanitizeInline('<<b>>x</b>')).toBe('&lt;<b>&gt;x</b>')
	})
})
