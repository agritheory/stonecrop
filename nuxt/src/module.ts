import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { extname } from 'node:path'
import {
	addLayout,
	addPlugin,
	addServerHandler,
	createResolver,
	defineNuxtModule,
	extendPages,
	useLogger,
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema' // do not remove this import since it causes a build issue

const { resolve } = createResolver(import.meta.url)

// Define module options interface
export interface ModuleOptions {
	router?: Record<string, unknown>
	/** Enable the DocBuilder feature with /docbuilder routes */
	docbuilder?: boolean
	/** Path to doctypes folder (defaults to 'doctypes' in srcDir) */
	doctypesDir?: string
}

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
		}
	},

	async setup(_options, nuxt) {
		const logger = useLogger('@stonecrop/nuxt', { level: nuxt.options.dev ? 3 : 0 })

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
				const pagesDir = resolve('runtime/pages')
				const stonecropPage = resolve(pagesDir, 'StonecropPage.vue')

				extendPages(async pages => {
					try {
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

						for (const schema of schemas) {
							try {
								const schemaName = schema.replace('.json', '')
								if (pagePaths.includes(`/${schemaName}`)) {
									logger.warn(`Skipping doctype '${schemaName}': conflicts with existing page`)
									continue
								}

								const schemaPath = resolve(doctypesDir, schema)
								const fileContents = await readFile(schemaPath, 'utf-8')

								let schemaData
								try {
									schemaData = JSON.parse(fileContents)
								} catch (parseError) {
									logger.error(`Failed to parse schema file '${schema}':`, parseError)
									continue
								}

								if (schemaData.schema) {
									pages.unshift({
										name: `stonecrop-${schemaName}`,
										path: `/${schemaName}`,
										file: stonecropPage,
										meta: {
											schema: schemaData.schema,
										},
									})
									logger.log(`Added page for doctype: ${schemaName}`)
								} else {
									logger.warn(`Schema file '${schema}' missing 'schema' property, skipping`)
								}
							} catch (schemaError) {
								logger.error(`Error processing schema '${schema}':`, schemaError)
								// Continue processing other schemas
							}
						}
					} catch (pagesError) {
						// Re-throw critical page setup errors
						logger.error('Failed to setup doctype pages:', pagesError)
						throw new Error(
							`[@stonecrop/nuxt] Failed to setup pages: ${
								pagesError instanceof Error ? pagesError.message : String(pagesError)
							}`
						)
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
		if (_options.docbuilder) {
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
