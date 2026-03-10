import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { extname } from 'node:path'
import {
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
	/** Path to doctypes folder relative to srcDir (defaults to 'doctypes', resolving to app/doctypes) */
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
		const layoutsDir = resolve('runtime/layouts')
		const homepage = resolve(layoutsDir, 'StonecropHome.vue')
		addLayout(homepage, 'home')

		// find doctype schemas in the nuxt application and add them as pages
		const appDir = nuxt.options.srcDir
		const doctypesDir = resolve(appDir, options.doctypesDir ?? 'doctypes')

		// Expose the resolved absolute doctypesDir to server-side handlers via runtimeConfig
		// Without this, server API handlers fall back to process.cwd()/doctypes which is wrong
		nuxt.options.runtimeConfig.stonecrop = {
			...((nuxt.options.runtimeConfig.stonecrop as Record<string, unknown>) ?? {}),
			doctypesDir,
		}

		if (existsSync(doctypesDir)) {
			try {
				const dirContents = await readdir(doctypesDir)
				const schemas = dirContents.filter(file => extname(file) === '.json')

				// Parse all doctype JSON files into ParsedDoctype objects
				const doctypes: ParsedDoctype[] = []
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

						const schemaFields = schemaData.schema || schemaData.fields
						if (!schemaFields) {
							logger.warn(`Schema file '${schema}' missing 'schema' or 'fields' property, skipping`)
							continue
						}

						doctypes.push({
							fileName: schema.replace('.json', ''),
							data: schemaData,
							fields: schemaFields,
						})
					} catch (schemaError) {
						logger.error(`Error processing schema '${schema}':`, schemaError)
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

		// Setup DocBuilder if enabled
		if (options.docbuilder) {
			logger.log('DocBuilder enabled, adding routes and handlers')

			const pagesDir = resolve('runtime/pages')
			const docBuilderIndex = resolve(pagesDir, 'DocBuilderIndex.vue')
			const docBuilderDetail = resolve(pagesDir, 'DocBuilderDetail.vue')

			extendPages(pages => {
				// Add docbuilder index page
				pages.push({
					name: 'docbuilder-index',
					path: '/docbuilder',
					file: docBuilderIndex,
				})

				// Add docbuilder detail page
				pages.push({
					name: 'docbuilder-detail',
					path: '/docbuilder/:doctype',
					file: docBuilderDetail,
				})

				logger.log('Added DocBuilder pages at /docbuilder')
			})

			// Add server handlers for docbuilder API
			const handlersDir = resolve('runtime/server/api/docbuilder')
			addServerHandler({
				route: '/api/docbuilder/doctypes',
				handler: resolve(handlersDir, 'doctypes.get'),
			})
			addServerHandler({
				route: '/api/docbuilder/:doctype',
				handler: resolve(handlersDir, '[doctype].get'),
			})
			addServerHandler({
				route: '/api/docbuilder/validate',
				method: 'post',
				handler: resolve(handlersDir, 'validate.post'),
			})
			addServerHandler({
				route: '/api/docbuilder/save',
				method: 'post',
				handler: resolve(handlersDir, 'save.post'),
			})

			logger.log('Added DocBuilder API handlers')
		}

		// Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
		const pluginPath = resolve('./runtime/plugin')
		try {
			addPlugin(pluginPath)
		} catch (pluginError) {
			logger.error('Error adding plugin:', pluginError)
			throw new Error(`[@stonecrop/nuxt] Failed to add plugin at ${pluginPath}`)
		}
	},
})
