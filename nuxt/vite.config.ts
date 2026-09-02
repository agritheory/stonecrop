import { defineConfig } from 'vite'

import { nuxtModuleBuildTask } from '../common/vite/build-task.ts'

/**
 * Vite+ reads this file for the `run` block only. Nuxt never does: `@nuxt/vite-builder` sets
 * `configFile: false`, and vitest resolves `vitest.config.ts` ahead of this file.
 */
export default defineConfig({
	run: {
		tasks: nuxtModuleBuildTask('node --run dev:prepare && nuxt-module-build build', [
			'playground/.nuxt/**',
			'fullstack/.nuxt/**',
		]),
	},
})
