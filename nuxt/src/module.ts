import { existsSync, realpathSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { extname, dirname } from 'node:path'
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
		}
	},

	async setup(_options, nuxt) {
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

		// Handle symlinked packages during development
		// When packages are linked (e.g., via pnpm link), their real paths may be outside
		// Vite's default fs.allow list. We detect this module's real path and add the monorepo root.
		nuxt.hook('vite:extendConfig', config => {
			const allowPaths = new Set<string>()

			// Check if @stonecrop/nuxt itself is symlinked by checking the node_modules path
			const nuxtModulePath = `${nuxt.options.rootDir}/node_modules/@stonecrop/nuxt`

			try {
				if (existsSync(nuxtModulePath)) {
					const realNuxtModulePath = realpathSync(nuxtModulePath)

					if (realNuxtModulePath !== nuxtModulePath) {
						// @stonecrop/nuxt is symlinked - add the monorepo root
						// realPath will be something like /path/to/monorepo/nuxt
						// Go up one level to get the monorepo root
						const monorepoRoot = dirname(realNuxtModulePath)
						allowPaths.add(monorepoRoot)
						logger.log(`@stonecrop/nuxt is symlinked, adding monorepo root: ${monorepoRoot}`)
					}
				}
			} catch (e) {
				logger.log(`Error checking @stonecrop/nuxt symlink: ${e instanceof Error ? e.message : String(e)}`)
			}

			// Also check individual packages in node_modules
			for (const pkg of STONECROP_PACKAGES) {
				const pkgPath = `${nuxt.options.rootDir}/node_modules/${pkg}`
				try {
					if (existsSync(pkgPath)) {
						const realPath = realpathSync(pkgPath)
						if (realPath !== pkgPath) {
							// Package is symlinked, add its root directory
							allowPaths.add(realPath)
							logger.log(`Adding symlinked package to fs.allow: ${realPath}`)
						}
					}
				} catch {
					// Error checking path, skip
				}
			}

			if (allowPaths.size > 0) {
				config.server = config.server || {}
				config.server.fs = config.server.fs || {}
				config.server.fs.allow = config.server.fs.allow || []

				for (const path of allowPaths) {
					if (!config.server.fs.allow.includes(path)) {
						config.server.fs.allow.push(path)
					}
				}
				logger.log(`Vite fs.allow updated with ${allowPaths.size} path(s)`)
			}
		})

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
								const schemaPath = resolve(doctypesDir, schema)
								const fileContents = await readFile(schemaPath, 'utf-8')

								let schemaData
								try {
									schemaData = JSON.parse(fileContents)
								} catch (parseError) {
									logger.error(`Failed to parse schema file '${schema}':`, parseError)
									continue
								}

								// Support both formats: 'schema' array (legacy) or 'fields' array (DoctypeMeta)
								const schemaFields = schemaData.schema || schemaData.fields
								if (!schemaFields) {
									logger.warn(`Schema file '${schema}' missing 'schema' or 'fields' property, skipping`)
									continue
								}

								// Route pattern from doctype:
								// - slug defines the base route (e.g., "user", "user/:id", "kanban/:id/:scope?")
								// - Each doctype is a single route - no auto-generation of list/form pairs
								// Examples:
								//   user-table.json with slug "user" → /user (table view)
								//   user.json with slug "user/:id" → /user/:id (form view)
								//   kanban.json with slug "kanban/:id/:scope?" → /kanban/:id with optional scope
								const routePath = schemaData.slug || schemaName.toLowerCase()

								// Add route for this doctype
								if (!pagePaths.includes(`/${routePath}`)) {
									pages.unshift({
										name: `stonecrop-${schemaName}`,
										path: `/${routePath}`,
										file: stonecropPage,
										meta: {
											schema: schemaFields,
											doctype: schemaData,
										},
									})
									logger.log(`Added route: /${routePath} (${schemaName})`)
								} else {
									logger.warn(`Route /${routePath} already exists, skipping ${schemaName}`)
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
