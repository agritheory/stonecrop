import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { describe, expect, it } from 'vitest'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../../..')

const buildCommand = async packageDir => {
	const config = await import(pathToFileURL(join(rootDir, packageDir, 'vite.config.ts')).href)
	return config.default.run.tasks.build.command
}

describe('the Nuxt module build tasks', { tags: ['unit'] }, () => {
	// A `--stub` build makes `dist/runtime` a symlink into `src/runtime`, and a later build step
	// replayed from the cache writes its compiled files through it, beside the sources.
	it.each([
		['nuxt_grafserv', 'nuxt-module-build prepare && nuxi prepare playground && nuxt-module-build build'],
		[
			'nuxt',
			'nuxt-module-build prepare && nuxi prepare documentation && nuxi prepare fullstack && nuxi prepare playground && nuxt-module-build build',
		],
	])('build %s without a stub, preparing each app first', async (packageDir, command) => {
		expect(await buildCommand(packageDir)).toBe(command)
	})
})
