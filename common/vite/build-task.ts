import { existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

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
 * The Nuxt apps in a module package, derived from the presence of a nuxt.config.ts.
 *
 * Read from the same signal as nuxt/scripts/nuxt-apps.sh, which is what `dev:prepare` and
 * `test:types` walk. A hand-written list beside a derived one goes stale silently the next time
 * an app is added, and the resulting cache miss is invisible: the build simply stops caching.
 */
function nuxtApps(configUrl: string): string[] {
	const packageDir = dirname(fileURLToPath(configUrl))
	const apps = readdirSync(packageDir, { withFileTypes: true })
		.filter(entry => entry.isDirectory() && existsSync(join(packageDir, entry.name, 'nuxt.config.ts')))
		.map(entry => entry.name)

	if (apps.length === 0) {
		throw new Error(`nuxtModuleBuildTask: no app with a nuxt.config.ts under ${packageDir}`)
	}
	return apps
}

/**
 * The `build` task for the two Nuxt module packages, which have no `dist` rollup and drive
 * `nuxt-module-build` instead.
 *
 * They were the only uncached tasks in a warm build: `nuxt-module-build` and `nuxi prepare` both
 * read and write `dist/` and each app's `.nuxt/`, so automatic tracking saw every run modify its
 * own inputs. Excluding each app's `.nuxt` is what makes the task cacheable at all, which is why
 * the app set is derived rather than listed: an app missing from the exclusions never caches, and
 * a build that silently stopped caching looks exactly like one that works.
 *
 * `.nuxt` is deliberately not an `output`. Vite+ reports a removed generated directory as a miss
 * and re-runs the command, so declaring it would only snapshot the tree into the cache to restore
 * something the command rebuilds anyway.
 */
export function nuxtModuleBuildTask(command: string, configUrl: string): NonNullable<UserConfig['run']>['tasks'] {
	const generatedTrees = nuxtApps(configUrl).map(app => `${app}/.nuxt/**`)
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
