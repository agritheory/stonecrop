import { describe, expect, it } from 'vite-plus/test'

import { loadEditor } from '../src/utils/load'

describe('loadEditor', { tags: ['unit'] }, () => {
	it('loads Editor.js with the header, list, quote and delimiter tools', async () => {
		const { EditorJS, tools } = await loadEditor()
		expect(typeof EditorJS).toBe('function')
		// Paragraph is Editor.js's own default block, so it is not listed.
		expect(Object.keys(tools).toSorted()).toEqual(['delimiter', 'header', 'list', 'quote'])
	})

	it('imports them once for every field', () => {
		expect(loadEditor()).toBe(loadEditor())
	})
})
