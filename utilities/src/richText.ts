/**
 * The parts of an Editor.js `OutputData` value that its plain text is read from. Typed loosely, as a
 * record loaded from a JSON column holds whatever was saved, and this package does not depend on Editor.js.
 */
type RichTextBlock = { type?: unknown; data?: Record<string, unknown> | null }

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

/** A block's inline HTML as the text it shows: tags dropped, entities decoded, whitespace collapsed. */
function inlineText(html: unknown): string {
	if (typeof html !== 'string') return ''
	return html
		.replace(/<br\s*\/?>/gi, ' ')
		.replace(/<[^>]*>/g, '')
		.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, name: string) => {
			if (name[0] !== '#') return ENTITIES[name.toLowerCase()] ?? entity
			const code = name[1] === 'x' || name[1] === 'X' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10)
			return Number.isFinite(code) ? String.fromCodePoint(code) : entity
		})
		.replace(/\s+/g, ' ')
		.trim()
}

/** A list's items, nested ones included. Takes the current `{ content, items }` items and the older plain strings. */
function listText(items: unknown): string[] {
	if (!Array.isArray(items)) return []
	const list: unknown[] = items
	const texts: string[] = []
	for (const item of list) {
		if (typeof item === 'string') texts.push(inlineText(item))
		else if (item !== null && typeof item === 'object') {
			const content: unknown = Reflect.get(item, 'content') ?? Reflect.get(item, 'text')
			texts.push(inlineText(content), ...listText(Reflect.get(item, 'items')))
		}
	}
	return texts
}

function blockText(block: RichTextBlock): string[] {
	const data = block.data ?? {}
	switch (block.type) {
		case 'list':
		case 'checklist':
			return listText(data.items)
		case 'quote':
			return [inlineText(data.text), inlineText(data.caption)]
		case 'delimiter':
			return []
		default:
			return [inlineText(data.text)]
	}
}

/**
 * The visible text of an Editor.js document (`{ time, blocks, version }`), its blocks joined by spaces, for a
 * table cell or a text filter. Empty for a field never edited (`null`) or any value that is not such a document.
 * @public
 */
export function formatRichTextCell(value: unknown): string {
	if (value === null || typeof value !== 'object') return ''
	const { blocks } = value as { blocks?: unknown }
	if (!Array.isArray(blocks)) return ''
	const list: unknown[] = blocks
	return list
		.flatMap(block => (block && typeof block === 'object' ? blockText(block as RichTextBlock) : []))
		.filter(Boolean)
		.join(' ')
}
