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
import type { Nuxt } from '@nuxt/schema' // do not remove this import since it causes a build issue

import { createSymlinkedPackagesPlugin } from './plugins/symlinking'
import { resolveStrategy, singleStrategy, resourceStrategy } from './strategies'
import type { RouteStrategy, RouteStrategyFn, ParsedDoctype, PageResolver } from './strategies'

// Re-export strategy types and functions for consumers
export type { RouteStrategy, RouteStrategyFn, ParsedDoctype, PageResolver }
export { singleStrategy, resourceStrategy }

const { resolve } = createResolver(import.meta.url)

// Define module options interface
export interface ModuleOptions {
	router?: Record<string, unknown>
	/** Enable the DocBuilder feature with /docbuilder routes */
	docbuilder?: boolean
	/** Path to doctypes folder (defaults to 'doctypes' in srcDir) */
	doctypesDir?: string
	/**
	 * Controls how doctype JSON files are mapped to routes.
	 *
	 * - `'single'` — One route per JSON file. The `slug` field controls the full
	 *   route path including any parameters (e.g., `"user/:id"`).
	 * - `'resource'` — Two routes per doctype: `/<slug>` (list) and `/<slug>/:id` (detail).
	 *   Child doctypes (those with `parentDoctype`) are skipped.
	 * - A custom `RouteStrategyFn` for full control over route generation.
	 *
	 * @defaultValue `'single'`
	 */
	routeStrategy?: RouteStrategy
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
			router: {},
			docbuilder: false,
			doctypesDir: undefined,
			routeStrategy: 'single',
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
		const doctypesDir = resolve(appDir, 'doctypes')

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

				// Resolve the route strategy
				const strategy = resolveStrategy(options.routeStrategy || 'single')
				const pagesDir = resolve('runtime/pages')
				const pageResolver: PageResolver = (pageName: string) => resolve(pagesDir, pageName)

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

					// Generate routes via the selected strategy
					const generatedPages = strategy(doctypes, pageResolver)

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
