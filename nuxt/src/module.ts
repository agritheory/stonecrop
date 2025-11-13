import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { extname } from 'node:path'
import { addLayout, addPlugin, createResolver, defineNuxtModule, extendPages, useLogger } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema' // do not remove this import since it causes a build issue

const { resolve } = createResolver(import.meta.url)

// Define module options interface
export interface ModuleOptions {
	router?: Record<string, unknown>
	docbuilder?: boolean
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
