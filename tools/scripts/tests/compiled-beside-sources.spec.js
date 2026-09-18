import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { compiledBesideSources } from '../compiled-beside-sources.mjs'

describe('compiledBesideSources', { tags: ['unit'] }, () => {
	let runtimeDir

	const writeFiles = files => {
		runtimeDir = mkdtempSync(join(tmpdir(), 'runtime-'))
		for (const file of files) {
			mkdirSync(dirname(join(runtimeDir, file)), { recursive: true })
			writeFileSync(join(runtimeDir, file), '')
		}
	}

	afterEach(() => rmSync(runtimeDir, { recursive: true, force: true }))

	it('finds what the module build writes beside each source, at any depth', () => {
		writeFiles([
			'handler.ts',
			'handler.js',
			'handler.d.ts',
			'server/api/record.get.ts',
			'server/api/record.get.js',
			'server/api/record.get.d.ts',
			'components/Form.vue',
			'components/Form.vue.d.ts',
			'components/Form.d.vue.ts',
		])
		expect(compiledBesideSources(runtimeDir)).toEqual([
			'components/Form.d.vue.ts',
			'components/Form.vue.d.ts',
			'handler.d.ts',
			'handler.js',
			'server/api/record.get.d.ts',
			'server/api/record.get.js',
		])
	})

	it('leaves hand-written declarations and scripts that have no source beside them', () => {
		writeFiles(['types.d.ts', 'legacy.js', 'data.json', 'Form.vue', 'plugin.ts'])
		expect(compiledBesideSources(runtimeDir)).toEqual([])
	})

	it('reads a package without a runtime folder as clean', () => {
		writeFiles([])
		expect(compiledBesideSources(join(runtimeDir, 'missing'))).toEqual([])
	})
})
