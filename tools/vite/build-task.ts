import { existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { UserConfig } from 'vite-plus'

/**
 * The `build` task every publishable package runs, previously 13 copies of the same block.
 *
 * A task rather than a package.json script so `cache.input` can exclude dist. The steps write into dist
 * and later ones read it, so tracking it as an input self-invalidates the cache on every run.
 *
 * Vite runs first so `emptyOutDir` clears dist. A leading `rm -rf dist` is its own cached sub-task,
 * and a cache hit replays a snapshot instead of deleting, so stale chunks shipped.
 *
 * `declarations` is `vue-tsc` for any package shipping SFCs: plain tsc resolves an SFC through the
 * ambient `*.vue` shim and emits no declaration for it, so every component shipped as
 * `ComponentOptions` — `any` to a consumer, with the rollup importing `.vue` paths absent from the
 * tarball.
 *
 * Scratch output — tsbuildinfo, api-extractor's report and doc model — goes under each package's
 * `node_modules/.temp`, never a `temp/` beside the sources. Compiling an SFC makes TypeScript expand
 * the tsconfig `include`, which lists the package root, and Vite+ fingerprints that listing: a folder
 * the build creates there invalidated `vp build` on the next run, so on a fresh checkout the second
 * build — a release's prepublishOnly — always missed.
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
 * `.nuxt` is deliberately not in `cache.output`. Vite+ reports a removed generated directory as a miss
 * and re-runs the command, so declaring it would only snapshot the tree into the cache to restore
 * something the command rebuilds anyway.
 *
 * Not `dev:prepare`: its `--stub` build makes `dist/runtime` a symlink into `src/runtime`, and each
 * step here is cached on its own, so a build step replayed after a fresh stub wrote its compiled
 * files through the symlink, beside the sources.
 */
export function nuxtModuleBuildTask(configUrl: string): NonNullable<UserConfig['run']>['tasks'] {
	const apps = nuxtApps(configUrl).toSorted()
	const generatedTrees = apps.map(app => `${app}/.nuxt/**`)
	return {
		build: {
			command: [
				'node ../tools/scripts/clean-compiled-beside-sources.mjs',
				'nuxt-module-build prepare',
				...apps.map(app => `nuxi prepare ${app}`),
				'nuxt-module-build build',
			].join(' && '),
			cache: {
				// jiti caches under `node_modules/.cache`, which a checkout lacks, so tracked, every fresh CI
				// run missed `nuxt-module-build prepare` on the folder the last run created. `nuxi prepare`
				// still misses there: Nuxt writes `<app>/node_modules/.cache/nuxt`, which creates the app's
				// `node_modules`, and excluding `<app>/node_modules` did not stop the app folder's miss.
				input: [
					{ auto: true },
					{ pattern: 'tools/vite/**', base: 'workspace' },
					'!dist/**',
					'!.nuxt/**',
					'!node_modules/.cache/**',
					...generatedTrees.map(tree => `!${tree}`),
				],
				output: ['dist/**'],
			},
		},
	}
}

const apiExtractor = 'node ../tools/scripts/run-api-extractor.mjs run --local -c config/api-extractor.json'

/**
 * `build` makes what is published; `reports` makes the API report and `api.md`, which are not. Only
 * the root build runs `reports`, so a release, `prepublishOnly` and a package's test job skip it.
 *
 * api-extractor stays in `build` for a `tsc` package because its rollup is the `types` that
 * package publishes. A `vue-tsc` package publishes vue-tsc's `dist/src` tree and turns the rollup
 * off (tools/config/api-extractor-vue-base.json), so there api-extractor only reports.
 */
export function buildTask(declarations: 'tsc' | 'vue-tsc'): NonNullable<UserConfig['run']>['tasks'] {
	const rollup = declarations === 'tsc'
	return {
		build: {
			command: ['vp build --logLevel warn', `${declarations} -b --force`, ...(rollup ? [apiExtractor] : [])].join(
				' && '
			),
			cache: {
				// `node_modules/.temp` holds the declarations step's tsbuildinfo. A run that creates it
				// records a `node_modules` listing with `.temp` in it, so a fresh checkout, which has
				// none, missed the cache for that step on every CI run.
				input: [{ auto: true }, '!dist/**', '!node_modules/.temp/**'],
				// No `output`: left to automatic tracking, a cache hit restores only the files that
				// sub-task itself wrote. `output: ['dist/**']` gave every sub-task the whole directory,
				// so whenever `vp build` re-ran but the declarations did not change, api-extractor and
				// docs hit the cache and replayed an older bundle over the new one, and the build exited
				// 0. A source edit inside a function did it, and so did a config edit: dropping `vue`
				// from a package's externals shipped the old bundle, and the dist-contract test read that
				// bundle and passed.
			},
		},
		reports: {
			command: [...(rollup ? [] : [apiExtractor]), 'node --run docs'].join(' && '),
			dependsOn: ['build'],
		},
	}
}
