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

type ListItemData = {
	content?: unknown
	text?: unknown
	checked?: unknown
	meta?: { checked?: unknown }
	items?: unknown
}

function renderListItems(items: unknown, tag: 'ol' | 'ul', checklist: boolean): string {
	if (!Array.isArray(items)) return ''
	const list: unknown[] = items
	return list
		.map(item => {
			// The older List tool stored each item as a string.
			if (typeof item === 'string') return `<li>${sanitizeInline(item)}</li>`
			if (item === null || typeof item !== 'object') return ''
			const { content, text, checked, meta, items: nested } = item as ListItemData
			const done = Boolean(meta?.checked ?? checked)
			const box = checklist
				? `<span class="a-editor__check" role="img" aria-label="${done ? 'done' : 'not done'}">${done ? '☑' : '☐'}</span> `
				: ''
			const sublist = Array.isArray(nested) && nested.length ? renderList(nested, tag, checklist) : ''
			return `<li${checklist && done ? ' class="a-editor__checked"' : ''}>${box}${sanitizeInline(content ?? text)}${sublist}</li>`
		})
		.join('')
}

function renderList(items: unknown, tag: 'ol' | 'ul', checklist: boolean, start?: unknown): string {
	const startAttr = tag === 'ol' && typeof start === 'number' && start !== 1 ? ` start="${Math.trunc(start)}"` : ''
	const cls = checklist ? ' class="a-editor__checklist"' : ''
	return `<${tag}${cls}${startAttr}>${renderListItems(items, tag, checklist)}</${tag}>`
}

function renderBlock({ type, data }: EditorBlock): string {
	const block = data ?? {}
	switch (type) {
		case 'paragraph':
			return `<p>${sanitizeInline(block.text)}</p>`
		case 'header': {
			const level = Math.min(6, Math.max(1, Math.trunc(Number(block.level)) || 2))
			return `<h${level}>${sanitizeInline(block.text)}</h${level}>`
		}
		case 'list': {
			const style = block.style
			const meta = (block.meta ?? {}) as { start?: unknown }
			return renderList(block.items, style === 'ordered' ? 'ol' : 'ul', style === 'checklist', meta.start)
		}
		case 'quote': {
			const align = block.alignment === 'center' ? ' class="a-editor__quote--center"' : ''
			const caption = sanitizeInline(block.caption)
			return `<blockquote${align}><p>${sanitizeInline(block.text)}</p>${caption ? `<cite>${caption}</cite>` : ''}</blockquote>`
		}
		case 'delimiter':
			return '<hr>'
		default:
			// A block from a tool this package does not ship. Its text, if it has any, is still shown.
			return typeof block.text === 'string' ? `<p>${sanitizeInline(block.text)}</p>` : ''
	}
}

/**
 * An Editor.js document as static HTML, for a field that is not being edited. Every piece of stored text passes
 * through `sanitizeInline`, so the result is safe to bind with `v-html`. Empty for a field never edited.
 * @public
 */
export function renderBlocks(value: EditorDocument | null | undefined): string {
	if (!value || !Array.isArray(value.blocks)) return ''
	return value.blocks
		.filter(block => block && typeof block === 'object')
		.map(renderBlock)
		.join('')
}
