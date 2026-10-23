import type EditorJS from '@editorjs/editorjs'
import type { ToolConstructable, ToolSettings } from '@editorjs/editorjs'

/** Editor.js and the block tools this package ships. Paragraph is Editor.js's own default block. */
export type LoadedEditor = {
	EditorJS: typeof EditorJS
	tools: Record<string, ToolConstructable | ToolSettings>
}

let loading: Promise<LoadedEditor> | undefined

/**
 * Editor.js and its tools, imported the first time a field is edited. A form that only shows documents never loads
 * them, and nothing touches the DOM while a page renders on the server.
 */
export function loadEditor(): Promise<LoadedEditor> {
	loading ??= Promise.all([
		import('@editorjs/editorjs'),
		import('@editorjs/header'),
		import('@editorjs/list'),
		import('@editorjs/quote'),
		import('@editorjs/delimiter'),
	])
		.then(([editor, header, list, quote, delimiter]) => ({
			EditorJS: editor.default,
			tools: {
				header: {
					class: header.default,
					inlineToolbar: true,
					config: { levels: [1, 2, 3, 4], defaultLevel: 2 },
				},
				list: { class: list.default, inlineToolbar: true },
				quote: { class: quote.default, inlineToolbar: true },
				delimiter: delimiter.default,
			},
		}))
		.catch((error: unknown) => {
			// A failed import (a dropped connection, say) is tried again by the next field that mounts.
			loading = undefined
			throw error
		})
	return loading
}
