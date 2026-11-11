import { richTextBlocks, type RichTextBlockParts, type RichTextListItem } from '@stonecrop/utilities'

import type { EditorBlock, EditorDocument } from '../types'

// The inline markup Editor.js writes into a block's text: its bold, italic and link tools, and line breaks.
// Anything else is shown as text, so a stored value can never put its own elements or attributes on the page.
const INLINE_TAGS = new Set(['a', 'b', 'br', 'code', 'em', 'i', 'mark', 's', 'strong', 'u'])
const SAFE_HREF = /^(https?:|mailto:|tel:|\/|#)/i

const escapeText = (text: string) => text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escapeAttr = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** The href an `<a>` tag carries, decoded only as far as needed to read its scheme. */
function hrefOf(attrs: string): string | undefined {
	const match = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attrs)
	const href = (match?.[1] ?? match?.[2] ?? match?.[3])?.replace(/&amp;/g, '&').trim()
	return href && SAFE_HREF.test(href) ? href : undefined
}

/**
 * A block's inline HTML, rebuilt from the tags Editor.js writes. Each allowed tag is written anew without its
 * attributes, a link keeping only an http(s), mailto, tel or relative href; every other `<` and `>` is escaped.
 * Entities already in the text (`&amp;`, `&nbsp;`) are left as they are.
 */
export function sanitizeInline(html: unknown): string {
	if (typeof html !== 'string') return ''
	let out = ''
	let last = 0
	for (const match of html.matchAll(/<(\/?)([a-z][a-z0-9]*)\b([^<>]*)>/gi)) {
		out += escapeText(html.slice(last, match.index))
		last = match.index + match[0].length
		const [, closing, rawName, attrs] = match
		const name = rawName.toLowerCase()
		if (!INLINE_TAGS.has(name)) continue
		if (name === 'br') out += closing ? '' : '<br>'
		else if (closing) out += `</${name}>`
		else if (name === 'a') {
			const href = hrefOf(attrs)
			out += href ? `<a href="${escapeAttr(href)}" target="_blank" rel="nofollow noopener noreferrer">` : '<a>'
		} else out += `<${name}>`
	}
	return out + escapeText(html.slice(last))
}

function renderListItems(items: RichTextListItem[], tag: 'ol' | 'ul', checklist: boolean): string {
	return items
		.map(({ html, checked, items: nested }) => {
			const box = checklist
				? `<span class="a-editor__check" role="img" aria-label="${checked ? 'done' : 'not done'}">${checked ? '☑' : '☐'}</span> `
				: ''
			const sublist = nested.length ? renderList(nested, tag, checklist) : ''
			return `<li${checklist && checked ? ' class="a-editor__checked"' : ''}>${box}${sanitizeInline(html)}${sublist}</li>`
		})
		.join('')
}

function renderList(items: RichTextListItem[], tag: 'ol' | 'ul', checklist: boolean, start?: number): string {
	const startAttr = tag === 'ol' && start !== undefined ? ` start="${start}"` : ''
	const cls = checklist ? ' class="a-editor__checklist"' : ''
	return `<${tag}${cls}${startAttr}>${renderListItems(items, tag, checklist)}</${tag}>`
}

// Which blocks there are, and what each shows, is `richTextBlockParts`'s to say, which the table cell's text reads too.
function renderBlock(block: RichTextBlockParts): string {
	switch (block.kind) {
		case 'paragraph':
			return `<p>${sanitizeInline(block.html)}</p>`
		case 'header':
			return `<h${block.level}>${sanitizeInline(block.html)}</h${block.level}>`
		case 'list':
			return renderList(block.items, block.style === 'ordered' ? 'ol' : 'ul', block.style === 'checklist', block.start)
		case 'quote': {
			const align = block.centered ? ' class="a-editor__quote--center"' : ''
			const caption = sanitizeInline(block.caption)
			return `<blockquote${align}><p>${sanitizeInline(block.html)}</p>${caption ? `<cite>${caption}</cite>` : ''}</blockquote>`
		}
		// The delimiter, the one kind left.
		default:
			return '<hr>'
	}
}

/**
 * An Editor.js document as static HTML, for a field that is not being edited. Every piece of stored text passes
 * through `sanitizeInline`, so the result is safe to bind with `v-html`. Empty for a field never edited.
 * @public
 */
export function renderBlocks(value: EditorDocument | null | undefined): string {
	return richTextBlocks(value).map(renderBlock).join('')
}

/** A value with every string in it, however deep, passed through `sanitizeInline`. */
function sanitizeData(value: unknown): unknown {
	if (typeof value === 'string') return sanitizeInline(value)
	if (Array.isArray(value)) return value.map(sanitizeData)
	if (value !== null && typeof value === 'object') return sanitizeFields(value)
	return value
}

const sanitizeFields = (value: object): Record<string, unknown> =>
	Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, sanitizeData(entry)]))

/**
 * A copy of a document that is safe to hand Editor.js, which puts each block's HTML on the page as it is. Every
 * string in each block's data passes through `sanitizeInline`, whatever tool the block is from, so a stored
 * `<img onerror=…>` reaches the editor as text.
 */
export function sanitizeDocument(value: EditorDocument): EditorDocument {
	const blocks: unknown[] = Array.isArray(value.blocks) ? value.blocks : []
	return {
		...value,
		blocks: blocks
			.filter((block): block is EditorBlock => block !== null && typeof block === 'object')
			.map(block => ({ ...block, data: sanitizeFields(block.data ?? {}) })),
	}
}
