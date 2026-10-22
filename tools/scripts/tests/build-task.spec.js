import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { describe, expect, it } from 'vite-plus/test'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../../..')

const buildTaskOf = async packageDir => {
	const config = await import(pathToFileURL(join(rootDir, packageDir, 'vite.config.ts')).href)
	return config.default.run.tasks.build
}

const buildCommand = async packageDir => (await buildTaskOf(packageDir)).command

const cleanCompiledBesideSources = 'node ../tools/scripts/clean-compiled-beside-sources.mjs'

describe('the Nuxt module build tasks', { tags: ['unit'] }, () => {
	// A `--stub` build makes `dist/runtime` a symlink into `src/runtime`, and a later build step
	// replayed from the cache writes its compiled files through it, beside the sources.
	it.each([
		[
			'nuxt_grafserv',
			`${cleanCompiledBesideSources} && nuxt-module-build prepare && nuxi prepare playground && nuxt-module-build build`,
		],
		[
			'nuxt',
			`${cleanCompiledBesideSources} && nuxt-module-build prepare && nuxi prepare documentation && nuxt-module-build build`,
		],
	])('build %s without a stub, preparing each app first', async (packageDir, command) => {
		expect(await buildCommand(packageDir)).toBe(command)
	})
})

describe('the library build task', { tags: ['unit'] }, () => {
	// Its steps run as separately cached sub-tasks, and an output list applies to each of them. A
	// `dist/**` list made a later step's cache hit restore an old bundle over the one `vp build` had
	// just written, so each step is left to restore only what it wrote.
	it('declares no output list for its sub-tasks', async () => {
		expect((await buildTaskOf('utilities')).cache).not.toHaveProperty('output')
	})
})
