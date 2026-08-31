import type { UserConfig } from 'vitest/config'

/**
 * The `build` task every publishable package runs, previously 13 copies of the same block.
 *
 * A task rather than a package.json script so `input` can exclude dist. The steps write into dist
 * and later ones read it, so tracking it as an input self-invalidates the cache on every run.
 *
 * Vite runs first so `emptyOutDir` clears dist. A leading `rm -rf dist` is its own cached sub-task,
 * and a cache hit replays a snapshot instead of deleting, so stale chunks shipped.
 *
 * `declarations` is `vue-tsc` for any package shipping SFCs: plain tsc resolves an SFC through the
 * ambient `*.vue` shim and emits no declaration for it, so every component shipped as
 * `ComponentOptions` — `any` to a consumer, with the rollup importing `.vue` paths absent from the
 * tarball.
 */
/**
 * The `build` task for the two Nuxt module packages, which have no `dist` rollup and drive
 * `nuxt-module-build` instead.
 *
 * They were the only uncached tasks in a warm build: `nuxt-module-build` and `nuxi prepare` both
 * read and write `dist/` and each app's `.nuxt/`, so automatic tracking saw every run modify its
 * own inputs. `generatedTrees` names the per-app `.nuxt` directories to exclude, which differ
 * between the two packages.
 */
export function nuxtModuleBuildTask(
	command: string,
	generatedTrees: string[]
): NonNullable<UserConfig['run']>['tasks'] {
	return {
		build: {
			command,
			input: [
				{ auto: true },
				{ pattern: 'common/vite/**', base: 'workspace' },
				'!dist/**',
				'!.nuxt/**',
				...generatedTrees.map(tree => `!${tree}`),
			],
			output: ['dist/**'],
		},
	}
}

export function buildTask(declarations: 'tsc' | 'vue-tsc'): NonNullable<UserConfig['run']>['tasks'] {
	return {
		build: {
			command: [
				'vite build --logLevel warn',
				`${declarations} -b --force`,
				'api-extractor run --local -c config/api-extractor.json',
				'node --run docs',
			].join(' && '),
			// This file must be tracked explicitly. `{ auto: true }` records what each sub-task read,
			// and only `vite build` reads the config — so editing this file re-ran vite and then let
			// the other three replay a `dist/**` snapshot over its fresh output. Measured: flipping
			// `minify` here rebuilt, reported a 75% cache hit, exited 0, and shipped the old bundle.
			input: [{ auto: true }, { pattern: 'common/vite/**', base: 'workspace' }, '!dist/**'],
			output: ['dist/**'],
		},
	}
}
