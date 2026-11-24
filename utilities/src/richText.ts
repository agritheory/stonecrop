/**
 * An item of a list block: its inline HTML as stored, whether it is ticked (a checklist's), and the items nested in it.
 * @public
 */
export type RichTextListItem = { html: string; checked: boolean; items: RichTextListItem[] }

/**
 * One block of an Editor.js document, read into the parts that are shown. Every `html` is the block's inline HTML
 * exactly as stored, so whoever puts it on a page sanitizes it first.
 * @public
 */
export type RichTextBlockParts =
	| { kind: 'paragraph'; html: string }
	| { kind: 'header'; html: string; level: number }
	| { kind: 'list'; style: 'ordered' | 'unordered' | 'checklist'; start?: number; items: RichTextListItem[] }
	| { kind: 'quote'; html: string; caption: string; centered: boolean }
	| { kind: 'delimiter' }

const asHtml = (value: unknown): string => (typeof value === 'string' ? value : '')

/** An object's own fields, or none for a value that is not an object. */
const fieldsOf = (value: unknown): Record<string, unknown> =>
	value !== null && typeof value === 'object' ? Object.fromEntries(Object.entries(value)) : {}

/** A list's items, nested ones included. Takes the current `{ content, meta, items }` items, the Checklist tool's
 * `{ text, checked }` and the older plain strings. */
function listItems(items: unknown): RichTextListItem[] {
	if (!Array.isArray(items)) return []
	const list: unknown[] = items
	return list.flatMap((item): RichTextListItem[] => {
		if (typeof item === 'string') return [{ html: item, checked: false, items: [] }]
		if (item === null || typeof item !== 'object') return []
		const meta: unknown = Reflect.get(item, 'meta')
		const checked: unknown =
			(meta !== null && typeof meta === 'object' ? Reflect.get(meta, 'checked') : undefined) ??
			Reflect.get(item, 'checked')
		return [
			{
				html: asHtml(Reflect.get(item, 'content') ?? Reflect.get(item, 'text')),
				checked: Boolean(checked),
				items: listItems(Reflect.get(item, 'items')),
			},
		]
	})
}

/**
 * What a block of an Editor.js document shows, for the editor's static view and the table cell alike, so the two
 * agree on every block. A block from a tool not known here is shown as a paragraph of its `text`, or not at all.
 * @public
 */
export function richTextBlockParts(block: unknown): RichTextBlockParts | undefined {
	if (block === null || typeof block !== 'object') return undefined
	const type: unknown = Reflect.get(block, 'type')
	const data = fieldsOf(Reflect.get(block, 'data'))
	switch (type) {
		case 'header':
			return {
				kind: 'header',
				html: asHtml(data.text),
				level: Math.min(6, Math.max(1, Math.trunc(Number(data.level)) || 2)),
			}
		case 'list': {
			const style = data.style === 'ordered' || data.style === 'checklist' ? data.style : 'unordered'
			const metaStart = fieldsOf(data.meta).start
			const start = typeof metaStart === 'number' && metaStart !== 1 ? Math.trunc(metaStart) : undefined
			return { kind: 'list', style, start, items: listItems(data.items) }
		}
		// The Checklist tool's own block, kept apart from the List tool's checklist style.
		case 'checklist':
			return { kind: 'list', style: 'checklist', items: listItems(data.items) }
		case 'quote':
			return {
				kind: 'quote',
				html: asHtml(data.text),
				caption: asHtml(data.caption),
				centered: data.alignment === 'center',
			}
		case 'delimiter':
			return { kind: 'delimiter' }
		default:
			return typeof data.text === 'string' ? { kind: 'paragraph', html: data.text } : undefined
	}
}

/**
 * The blocks of an Editor.js document (`{ time, blocks, version }`), read by {@link richTextBlockParts}. None for a
 * field never edited (`null`) or any value that is not such a document.
 * @public
 */
export function richTextBlocks(value: unknown): RichTextBlockParts[] {
	if (value === null || typeof value !== 'object') return []
	const blocks: unknown = Reflect.get(value, 'blocks')
	if (!Array.isArray(blocks)) return []
	const list: unknown[] = blocks
	return list.flatMap(block => richTextBlockParts(block) ?? [])
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

/** Inline HTML as the text it shows: tags dropped, entities decoded, whitespace collapsed. */
function inlineText(html: string): string {
	return html
		.replace(/<br\s*\/?>/gi, ' ')
		.replace(/<[^>]*>/g, '')
		.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, name: string) => {
			if (name[0] !== '#') return ENTITIES[name.toLowerCase()] ?? entity
			const code = name[1] === 'x' || name[1] === 'X' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10)
			return Number.isFinite(code) && code <= 0x10ffff ? String.fromCodePoint(code) : entity
		})
		.replace(/\s+/g, ' ')
		.trim()
}

const listText = (items: RichTextListItem[]): string[] =>
	items.flatMap(item => [inlineText(item.html), ...listText(item.items)])

function blockText(block: RichTextBlockParts): string[] {
	switch (block.kind) {
		case 'list':
			return listText(block.items)
		case 'quote':
			return [inlineText(block.html), inlineText(block.caption)]
		case 'delimiter':
			return []
		default:
			return [inlineText(block.html)]
	}
}

/**
 * The visible text of an Editor.js document (`{ time, blocks, version }`), its blocks joined by spaces, for a
 * table cell, a text filter or a sort. Empty for a field never edited (`null`) or any value that is not such a
 * document.
 *
 * The result is plain text, not HTML: entities are decoded, so text typed as `<img …>` comes back as those
 * characters. Show it as text, never with `v-html` or `innerHTML`.
 * @public
 */
export function formatRichTextCell(value: unknown): string {
	return richTextBlocks(value).flatMap(blockText).filter(Boolean).join(' ')
}
