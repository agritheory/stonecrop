import { existsSync, realpathSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { dirname, extname } from 'node:path'
import {
	addComponent,
	addImportsDir,
	addLayout,
	addPlugin,
	addServerHandler,
	createResolver,
	defineNuxtModule,
	extendPages,
	resolvePath,
	useLogger,
} from '@nuxt/kit'
import type { Nuxt, NuxtPage } from '@nuxt/schema' // do not remove this import since it causes a build issue

import type { RouteStrategyFn, ParsedDoctype } from './types'

// Re-export strategy types for consumers
export type { RouteStrategyFn, ParsedDoctype }

const { resolve } = createResolver(import.meta.url)

/** Dev HMR re-runs module setup while the layout registry keeps the first `home` entry (NUXT_B4014). */
let homeLayoutRegistered = false

// Define module options interface
export interface ModuleOptions {
	/** Enable the DocBuilder feature with /docbuilder routes */
	docbuilder?: boolean
	/** Path to doctypes folder relative to the project root (defaults to 'doctypes') */
	doctypesDir?: string
	/**
	 * Path to the page component used for default slug-based routing.
	 * When `routeStrategy` is not set, one route per doctype is registered
	 * at `/<slug>` (or `/<fileName>` if no slug) using this component.
	 *
	 * The path is resolved relative to the application's `srcDir`.
	 *
	 * @example `'pages/StonecropPage.vue'`
	 */
	pageComponent?: string
	/**
	 * Custom route strategy function for full control over route generation.
	 * When provided, `pageComponent` is ignored and this function is called
	 * with all parsed doctypes to produce the NuxtPage array.
	 *
	 * @example
	 * ```typescript
	 * routeStrategy: (doctypes) => doctypes.map(({ fileName, data, fields }) => ({
	 *   name: `stonecrop-${fileName}`,
	 *   path: `/${data.slug || fileName.toLowerCase()}`,
	 *   file: resolve('./pages/MyPage.vue'),
	 *   meta: { schema: fields, doctype: data },
	 * }))
	 * ```
	 */
	routeStrategy?: RouteStrategyFn
	/**
	 * Base theme stylesheet loaded into the host app. Provides the `--sc-*` CSS variables,
	 * applies the document font, and normalizes form controls / code to inherit it. Defaults
	 * to Stonecrop's default theme. Set to `false` to load no theme (bring your own), or pass
	 * a different theme's module specifier / path (e.g. `'@stonecrop/themes/dark.css'`).
	 *
	 * The Stonecrop component packages are theme-agnostic — they consume `--sc-*` variables
	 * but never bundle a theme — so the host must supply one; the module does that here.
	 */
	theme?: string | false
}

// Stonecrop packages that need to be transpiled (they import CSS in their dist bundles)
//
// This list must cover every client-side @stonecrop package the app can reach, not just the ones
// that import CSS themselves. Externalization is transitive: once Nitro treats a package as
// external, Rollup never traverses into it, so its *dependencies'* CSS imports are left for Node's
// ESM loader to resolve at runtime — which throws ERR_UNKNOWN_FILE_EXTENSION. `desktop` is the
// case that bit us: it imports no CSS of its own, but desktop -> aform -> atable reaches
// `atable/dist/assets/index.css`, and the DocBuilder pages import desktop.
//
// Deliberately a list and not a `/@stonecrop[+/]/` pattern: the server-side packages
// (`graphql-middleware`, `nuxt-grafserv`, `casl-middleware`) pull in postgraphile/@dataplan/pg and
// must stay external. A blanket pattern would inline them into the Nitro bundle.
export const STONECROP_PACKAGES = [
	'@stonecrop/aform',
	'@stonecrop/atable',
	'@stonecrop/code-editor',
	'@stonecrop/desktop',
	'@stonecrop/stonecrop',
	'@stonecrop/node-editor',
	'@stonecrop/utilities',
	'@stonecrop/themes',
]

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: '@stonecrop/nuxt',
		configKey: 'stonecrop',
	},

	defaults: (_nuxt: Nuxt) => {
		return {
			docbuilder: false,
			doctypesDir: 'doctypes',
			theme: '@stonecrop/themes/default.css',
		}
	},

	async setup(options, nuxt) {
		const logger = useLogger('@stonecrop/nuxt', { level: nuxt.options.dev ? 3 : 0 })

		// Add Stonecrop packages to transpile so Vite handles CSS imports during SSR
		// These packages use vite-plugin-lib-inject-css which adds CSS imports to the JS bundle
		// Node.js ESM loader doesn't understand CSS, so we need Vite to process them
		nuxt.options.build.transpile = nuxt.options.build.transpile || []
		for (const pkg of STONECROP_PACKAGES) {
			if (!nuxt.options.build.transpile.includes(pkg)) {
				nuxt.options.build.transpile.push(pkg)
			}
		}
		logger.log('Added Stonecrop packages to build.transpile for SSR CSS handling')

		// Keep Nuxt's auto-import transform away from the prebuilt dists. Its node_modules guard
		// checks resolved paths, and pnpm symlinks resolve these dists to paths outside
		// node_modules — so both the client and SSR pipelines rewrite them, and an injected
		// import can collide with a minified identifier (e.g. an injected `import { h } from
		// 'vue'` vs utilities.js's local `h`). themes is CSS-only and never transformed.
		nuxt.options.imports = nuxt.options.imports || ({} as typeof nuxt.options.imports)
		nuxt.options.imports.transform = nuxt.options.imports.transform || {}
		nuxt.options.imports.transform.exclude = nuxt.options.imports.transform.exclude || []
		const escapeRE = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		for (const pkg of STONECROP_PACKAGES) {
			if (pkg === '@stonecrop/themes') continue
			try {
				// realpath so the regex matches the symlink-resolved ids Vite hands to the transform
				const distDir = dirname(realpathSync(await resolvePath(pkg)))
				nuxt.options.imports.transform.exclude.push(new RegExp(`^${escapeRE(distDir)}`))
				logger.log(`Excluded prebuilt dist from auto-import transform: ${distDir}`)
			} catch {
				// not installed in this app — nothing to exclude
			}
		}

		// Supply the base theme to the host app: the --sc-* variables, the document font, and
		// the control/code font-inheritance reset. Loaded here rather than bundled into the
		// component packages, so the components stay theme-agnostic and any Nuxt host gets a
		// theme just by using the module. unshift keeps it at the base of the cascade; opt out
		// or swap themes with the `theme` option.
		if (options.theme && !nuxt.options.css.includes(options.theme)) {
			nuxt.options.css.unshift(options.theme)
			logger.log(`Added Stonecrop theme to app CSS: ${options.theme}`)
		}

		// Configure Nitro to bundle Stonecrop packages instead of treating them as external
		// This is critical for handling CSS imports in the distributed packages
		nuxt.hook('nitro:config', config => {
			config.externals = config.externals || {}
			config.externals.inline = config.externals.inline || []

			for (const pkg of STONECROP_PACKAGES) {
				if (!config.externals.inline.includes(pkg)) {
					config.externals.inline.push(pkg)
				}
			}

			logger.log('Added Stonecrop packages to Nitro externals.inline for CSS bundling')
		})

		// Allow Vite to serve symlinked packages during development. Their real paths live outside
		// the app root, and in a Rush repo Vite can't auto-detect the workspace root (no
		// pnpm-workspace.yaml at the monorepo root), so add them to fs.allow explicitly.
		if (nuxt.options.dev) {
			const allowPaths = new Set<string>()
			for (const pkg of ['@stonecrop/nuxt', ...STONECROP_PACKAGES]) {
				const pkgPath = `${nuxt.options.rootDir}/node_modules/${pkg}`
				try {
					const realPath = realpathSync(pkgPath)
					if (realPath !== pkgPath) {
						// for the module itself, allow the whole monorepo root (covers the pnpm store too)
						allowPaths.add(pkg === '@stonecrop/nuxt' ? dirname(realPath) : realPath)
					}
				} catch {
					// not installed — nothing to allow
				}
			}
			if (allowPaths.size > 0) {
				nuxt.options.vite.server = nuxt.options.vite.server || {}
				nuxt.options.vite.server.fs = nuxt.options.vite.server.fs || {}
				nuxt.options.vite.server.fs.allow = [...(nuxt.options.vite.server.fs.allow || []), ...allowPaths]
				logger.log(`Vite fs.allow updated with ${allowPaths.size} symlinked package path(s)`)
			}
		}

		// add the base Stonecrop layout from the module
		const homepage = resolve('runtime/app/layouts/StonecropHome.vue')
		if (!homeLayoutRegistered) {
			addLayout(homepage, 'home')
			homeLayoutRegistered = true
		}

		// find doctype schemas in the nuxt application and add them as pages
		const appDir = nuxt.options.srcDir
		const doctypesDir = resolve(nuxt.options.rootDir, options.doctypesDir ?? 'doctypes')

		// Expose the resolved absolute doctypesDir to server-side handlers via runtimeConfig
		// Without this, server API handlers fall back to process.cwd()/doctypes which is wrong
		nuxt.options.runtimeConfig.stonecrop = {
			...((nuxt.options.runtimeConfig.stonecrop as Record<string, unknown>) ?? {}),
			doctypesDir,
		}

		// Parse doctype definitions when the directory exists; otherwise proceed with none so route
		// generation below still runs: a configured routeStrategy can be self-sufficient (fullstack's
		// is a catch-all that ignores doctypes), so gating route-gen on the doctypes directory would
		// silently drop the strategy and 404 every doctype URL (see test/route-strategy.test.ts).
		const doctypes: ParsedDoctype[] = []
		if (existsSync(doctypesDir)) {
			try {
				const dirContents = await readdir(doctypesDir)
				const schemas = dirContents.filter(file => extname(file) === '.json')

				// Parse all doctype JSON files into ParsedDoctype objects
				for (const schema of schemas) {
					try {
						const schemaPath = resolve(doctypesDir, schema)
						const fileContents = await readFile(schemaPath, 'utf-8')

						let schemaData: { schema?: Record<string, unknown>[]; fields?: Record<string, unknown>[] }
						try {
							schemaData = JSON.parse(fileContents)
						} catch (parseError) {
							logger.error(`Failed to parse schema file '${schema}':`, parseError)
							continue
						}

						if (!schemaData.fields) {
							logger.warn(`Schema file '${schema}' missing 'fields' property, skipping`)
							continue
						}

						doctypes.push({
							fileName: schema.replace('.json', ''),
							data: schemaData,
							fields: schemaData.fields,
						})
					} catch (schemaError) {
						logger.error(`Error processing schema '${schema}':`, schemaError)
					}
				}
			} catch (doctypeError) {
				// Log error but don't break the build if doctypes directory exists but has issues
				logger.error('Error setting up doctype pages:', doctypeError)
				if (nuxt.options.dev) {
					logger.warn('Continuing without doctype pages due to error')
				} else {
					// In production builds, fail fast
					throw doctypeError
				}
			}
		}

		extendPages(pages => {
			const pagePaths = pages.map(page => page.path)

			// Only add the module's home page if there isn't already a root page
			if (!pagePaths.includes('/')) {
				pages.unshift({
					name: 'stonecrop-home',
					path: '/',
					file: homepage,
				})
				logger.log('Added Stonecrop home page at /')
			} else {
				logger.log('Skipping Stonecrop home page: root page already exists')
			}

			// Generate routes: custom strategy takes priority, then slug-based default
			let generatedPages: NuxtPage[] = []

			if (options.routeStrategy) {
				// User-provided strategy has full control
				generatedPages = options.routeStrategy(doctypes)
			} else if (options.pageComponent) {
				// Default slug-based routing with user's page component
				const componentPath = resolve(appDir, options.pageComponent)
				generatedPages = doctypes.map(({ fileName, data, fields }) => {
					const slug = (data.slug as string) || fileName.toLowerCase()
					return {
						name: `stonecrop-${fileName}`,
						path: `/${slug}`,
						file: componentPath,
						meta: { schema: fields, doctype: data },
					}
				})
			} else {
				logger.warn(
					'No routeStrategy or pageComponent configured — ' +
						'doctype routes will not be registered. ' +
						'Set pageComponent to a page path or provide a routeStrategy function.'
				)
			}

			for (const page of generatedPages) {
				if (!pagePaths.includes(page.path)) {
					pages.unshift(page)
					logger.log(`Added route: ${page.path} (${page.name})`)
				} else {
					logger.warn(`Route ${page.path} already exists, skipping ${page.name}`)
				}
			}
		})

		// Setup DocBuilder if enabled — dev-only enforcement (Invariant 1)
		if (options.docbuilder && process.env.NODE_ENV === 'development') {
			logger.log('DocBuilder enabled, adding routes and handlers')

			// VueFlow CSS must be at document level — component @import lands too late for VueFlow's init check
			nuxt.options.css.push('@vue-flow/core/dist/style.css')
			nuxt.options.css.push('@vue-flow/core/dist/theme-default.css')

			// node-editor ships its component styles as a separate dist file (the `./styles` export)
			// and its JS only imports VueFlow's base CSS — so its own styles (custom nodes, edge
			// labels, chart controls, wrapper) are never loaded unless the consumer imports them.
			nuxt.options.css.push('@stonecrop/node-editor/styles')

			// desktop ships its styles separately too; the docbuilder renders desktop's ActionSet and
			// must load them, or the control renders unstyled in non-playground hosts.
			nuxt.options.css.push('@stonecrop/desktop/styles')

			// Pre-bundle the docbuilder's client deps at startup: discovering them on the first
			// doctype load forces a mid-session re-optimization that has broken the client before
			// (auto-import collision in code-editor; browserHash bump invalidating in-flight chunks
			// via schema's zod/graphql). Bare zod/graphql aren't resolvable from the app root, so
			// list the parent packages, which pull them in.
			nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps || {}
			nuxt.options.vite.optimizeDeps.include = nuxt.options.vite.optimizeDeps.include || []
			for (const dep of ['@stonecrop/code-editor', '@stonecrop/schema']) {
				if (!nuxt.options.vite.optimizeDeps.include.includes(dep)) {
					nuxt.options.vite.optimizeDeps.include.push(dep)
				}
			}

			// Vite keys its optimize cache on dep version, not dist content, so rebuilding a
			// workspace package would leave the server on a stale pre-bundle — force a fresh
			// re-optimize each dev start (costs a few seconds per restart).
			nuxt.options.vite.optimizeDeps.force = true

			// A docbuilder Save writes doctype JSON that the client import.meta.glob's, so Vite
			// escalates the write to a full page reload — discarding in-progress edits. The builder
			// owns its state and re-fetches on mount, so suppress HMR for the data dir (returning []
			// = "no modules to update"). Trade-off: external doctype edits need a manual refresh.
			nuxt.options.vite.plugins = nuxt.options.vite.plugins || []
			nuxt.options.vite.plugins.push({
				name: 'stonecrop:docbuilder-suppress-doctype-reload',
				handleHotUpdate(ctx: { file: string }) {
					if (ctx.file.startsWith(doctypesDir)) return []
				},
			})

			// Serve Monaco AMD build via Nitro publicAssets so the code editor works without CDN access.
			// The AMD build (min/vs) has workers pre-bundled — no separate worker interception needed.
			const { createRequire } = await import('node:module')
			const { resolve: nodeResolve } = await import('node:path')
			const req = createRequire(import.meta.url)
			const monacoMinPath = nodeResolve(req.resolve('monaco-editor/package.json'), '../min')
			nuxt.hook('nitro:config', nitroConfig => {
				nitroConfig.publicAssets = nitroConfig.publicAssets ?? []
				nitroConfig.publicAssets.push({
					dir: monacoMinPath,
					baseURL: '/stonecrop-monaco',
					maxAge: 60 * 60 * 24 * 365,
				})
			})

			const docBuilderIndex = resolve('runtime/app/pages/DocBuilderIndex.vue')
			const docBuilderDetail = resolve('runtime/app/pages/DocBuilderDetail.vue')

			extendPages(pages => {
				// Add docbuilder index page
				pages.push({
					name: 'docbuilder-index',
					path: '/docbuilder',
					file: docBuilderIndex,
					meta: { layout: false },
				})

				// Add docbuilder detail page
				pages.push({
					name: 'docbuilder-detail',
					path: '/docbuilder/:doctype',
					file: docBuilderDetail,
					meta: { layout: false },
				})

				logger.log('Added DocBuilder pages at /docbuilder')
			})

			// Server routes are prefixed with /api/_stonecrop/ to avoid collisions with
			// application routes per the Nuxt module best-practices convention.
			const handlersDir = resolve('runtime/server/api/docbuilder')
			addServerHandler({
				route: '/api/_stonecrop/docbuilder/doctypes',
				handler: resolve(handlersDir, 'doctypes.get'),
			})
			addServerHandler({
				route: '/api/_stonecrop/docbuilder/:doctype',
				handler: resolve(handlersDir, '[doctype].get'),
			})
			addServerHandler({
				route: '/api/_stonecrop/docbuilder/validate',
				method: 'post',
				handler: resolve(handlersDir, 'validate.post'),
			})
			addServerHandler({
				route: '/api/_stonecrop/docbuilder/save',
				method: 'post',
				handler: resolve(handlersDir, 'save.post'),
			})

			logger.log('Added DocBuilder API handlers at /api/_stonecrop/docbuilder/')

			addComponent({
				name: 'DocBuilderActionsPanel',
				filePath: resolve('runtime/app/components/DocBuilderActionsPanel.vue'),
			})
		}

		// Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
		const pluginPath = resolve('./runtime/plugin')
		try {
			addPlugin(pluginPath)
		} catch (pluginError) {
			logger.error('Error adding plugin:', pluginError)
			throw new Error(`[@stonecrop/nuxt] Failed to add plugin at ${pluginPath}`, { cause: pluginError })
		}

		// Register all composables in runtime/app/composables/ for auto-import.
		// addImportsDir picks up every file in the directory, so new composables
		// are available automatically without updating module.ts.
		addImportsDir(resolve('runtime/app/composables'))
	},
})
