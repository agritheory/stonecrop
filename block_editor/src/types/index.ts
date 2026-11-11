/**
 * One block of an {@link EditorDocument}: its tool's name and that tool's data.
 * @public
 */
export type EditorBlock = {
	id?: string
	type: string
	data: Record<string, unknown>
	tunes?: Record<string, unknown>
}

/**
 * The value an `AEditor` field holds: the `OutputData` Editor.js's `save()` returns. Declared here rather than
 * re-exported, so the package's types do not reach into Editor.js's own.
 * @public
 */
export type EditorDocument = {
	time?: number
	blocks: EditorBlock[]
	version?: string
}
