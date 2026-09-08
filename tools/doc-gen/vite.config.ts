import { defineConfig } from 'vite'

import { docPackages } from '../../tools/scripts/doc-packages.mjs'

/**
 * Aggregation as an ordinary task, so the graph orders it after every package that supplies an
 * `api.md` rather than a `&&` in the root script.
 *
 * Chained onto the root script it ran wherever that script ran, which included the root's own
 * recursive selection: twice per build, the first time against the previous run's files.
 *
 * `dependsOn` is derived from the same list the aggregation reads, so a package added to one is
 * ordered by the other.
 */
export default defineConfig({
	run: {
		tasks: {
			build: {
				command: 'node ../../tools/scripts/docs-aggregate.mjs',
				dependsOn: docPackages.map(pkg => `@stonecrop/${pkg.name}#build`),
				// The two scripts the command actually reads, rather than all of `tools/scripts`:
				// widened back, every edit to an unrelated build or check script re-runs aggregation.
				input: [
					{ pattern: '*/api.md', base: 'workspace' },
					{ pattern: 'tools/scripts/docs-aggregate.mjs', base: 'workspace' },
					{ pattern: 'tools/scripts/doc-packages.mjs', base: 'workspace' },
				],
				output: [{ pattern: 'nuxt/documentation/content/reference/**', base: 'workspace' }],
			},
		},
	},
})
