import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { extname } from 'node:path'
import {
	addComponent,
	addImportsDir,
	addLayout,
	addPlugin,
	addServerHandler,
	addVitePlugin,
	createResolver,
	defineNuxtModule,
	extendPages,
	useLogger,
} from '@nuxt/kit'
import type { Nuxt, NuxtPage } from '@nuxt/schema' // do not remove this import since it causes a build issue

import { createSymlinkedPackagesPlugin } from './plugins/symlinking'
import type { RouteStrategyFn, ParsedDoctype } from './types'

// Re-export strategy types for consumers
export type { RouteStrategyFn, ParsedDoctype }

const { resolve } = createResolver(import.meta.url)

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
const STONECROP_PACKAGES = [
	'@stonecrop/aform',
	'@stonecrop/atable',
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

		// Add Vite plugin to handle symlinked packages during development
		if (nuxt.options.dev) {
			const symlinkedPackagesPlugin = createSymlinkedPackagesPlugin({
				rootDir: nuxt.options.rootDir,
				packages: STONECROP_PACKAGES,
				logger: (msg: string) => logger.log(msg),
			})
			addVitePlugin(symlinkedPackagesPlugin)
		}

		// add the base Stonecrop layout from the module
		const homepage = resolve('runtime/app/layouts/StonecropHome.vue')
		addLayout(homepage, 'home')

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

			// Pre-bundle the docbuilder's client dependencies so Vite optimizes them at startup
			// rather than discovering them on the first doctype load. Late discovery forces a
			// mid-session re-optimization with two distinct failure modes:
			//   - code-editor: the auto-import transform re-runs over the prebuilt dist and injects
			//     a second `import { h } from 'vue'`, colliding with the dist's own vue import —
			//     "Identifier 'h' has already been declared" (500 at client app init).
			//   - schema: it pulls `zod`/`graphql` transitively; discovering them late bumps the
			//     optimize browserHash and invalidates in-flight chunk imports —
			//     "error loading dynamically imported module: .../graphql.js?v=...".
			// Bare `zod`/`graphql` can't be listed here (unresolvable from the app root); pre-bundling
			// the resolvable parent package pulls them into the startup optimization instead.
			nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps || {}
			nuxt.options.vite.optimizeDeps.include = nuxt.options.vite.optimizeDeps.include || []
			for (const dep of ['@stonecrop/code-editor', '@stonecrop/schema']) {
				if (!nuxt.options.vite.optimizeDeps.include.includes(dep)) {
					nuxt.options.vite.optimizeDeps.include.push(dep)
				}
			}

			// Vite keys its optimize cache on dep version + lockfile, not dist *content*. Rebuilding a
			// workspace package's dist without bumping its version therefore leaves the running dev
			// server on the stale pre-bundle — e.g. an old @stonecrop/schema still rejecting a
			// since-removed field. These deps can't be excluded (they eager-pull zod/graphql; see above),
			// so force a fresh re-optimize each dev start to keep source edits reflected. Cost: a few
			// seconds of re-bundling per restart.
			nuxt.options.vite.optimizeDeps.force = true

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
