import { existsSync, readdirSync } from 'node:fs'

// What `nuxt-module-build` writes for each source, in the order a name must be matched: a
// component's `Form.vue.d.ts` also ends in `.d.ts`, whose source would be a `Form.vue.ts`.
const COMPILED_FROM = [
	['.vue.d.ts', '.vue'],
	['.d.vue.ts', '.vue'],
	['.d.ts', '.ts'],
	['.js', '.ts'],
]

/**
 * The files under `runtimeDir` that the module build wrote from a source beside them. A declaration
 * or script with no source of its own is hand-written and stays out of the list.
 * @param {string} runtimeDir - A package's `src/runtime`
 * @returns {string[]} Their paths relative to `runtimeDir`, sorted
 */
export function compiledBesideSources(runtimeDir) {
	if (!existsSync(runtimeDir)) return []

	const files = new Set(readdirSync(runtimeDir, { recursive: true }).map(String))
	return [...files]
		.filter(file => {
			const compiled = COMPILED_FROM.find(([suffix]) => file.endsWith(suffix))
			return compiled !== undefined && files.has(file.slice(0, -compiled[0].length) + compiled[1])
		})
		.toSorted()
}
