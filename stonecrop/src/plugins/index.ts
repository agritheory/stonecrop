import { App, type Plugin } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { List, Map } from 'immutable'

import DoctypeMeta from '../doctype'
import Registry from '../registry'
import { Stonecrop } from '../stonecrop'
import type { InstallOptions } from '../types'

/**
 * Setup doctype metadata and load all records for the doctype
 */
async function setupDoctypeData(
	registry: Registry,
	stonecrop: Stonecrop,
	doctype: string,
	actualDoctype?: string,
	apiBaseUrl = '/api'
): Promise<void> {
	try {
		const targetDoctype = actualDoctype || doctype
		// For list views, we need the list metadata which uses the '-list' suffix
		const listDoctypeKey = targetDoctype.endsWith('-list') ? targetDoctype : `${targetDoctype}-list`

		// Get list doctype metadata if not already loaded
		if (!registry.registry[listDoctypeKey]) {
			// Use a special endpoint for list metadata
			const response = await fetch(`${apiBaseUrl}/${doctype}/meta`)
			if (response.ok) {
				const metaData = await response.json()

				const config = {
					schema: metaData.schema,
					workflow: metaData.workflow,
					actions: metaData.actions || {},
				}

				const doctypeMeta = new DoctypeMeta(
					listDoctypeKey, // Use the list doctype key here
					List(config.schema),
					config.workflow,
					Map(config.actions as Record<string, string[]>)
				)

				if (doctypeMeta) {
					registry.addDoctype(doctypeMeta)
				}
			}
		}

		// Load all records for this doctype into HST
		const response = await fetch(`${apiBaseUrl}/${doctype}`) // Use original doctype for API call
		if (response.ok) {
			const records = (await response.json()) as any[]

			// Clear existing records and add new ones using base doctype (not list doctype)
			stonecrop.clearRecords(doctype)

			if (Array.isArray(records)) {
				records.forEach((record: any) => {
					if (record && typeof record === 'object' && 'id' in record && record.id) {
						stonecrop.addRecord(doctype, String(record.id), record) // Use base doctype for records
					}
				})
			}
		}
	} catch (error) {
		console.error(`Failed to setup doctype data for ${doctype}:`, error)
	}
}

/**
 * Setup specific record data and set as current
 */
async function setupRecordData(
	registry: Registry,
	stonecrop: Stonecrop,
	doctype: string,
	recordId: string,
	actualDoctype?: string,
	apiBaseUrl = '/api'
): Promise<void> {
	try {
		const targetDoctype = actualDoctype || doctype
		// For form views, we need the form metadata which uses the '-form' suffix
		const formDoctypeKey = targetDoctype.endsWith('-form') ? targetDoctype : `${targetDoctype}-form`
		// For record data storage, we use the base doctype (without '-form' suffix)
		const recordDoctype = doctype // Always use the original doctype for record storage

		// Get form doctype metadata if not already loaded
		if (!registry.registry[formDoctypeKey]) {
			// Use a special endpoint for form metadata
			const response = await fetch(`${apiBaseUrl}/${doctype}/${recordId}/meta`)
			if (response.ok) {
				const metaData = await response.json()

				const config = {
					schema: metaData.schema,
					workflow: metaData.workflow,
					actions: metaData.actions || {},
				}

				const doctypeMeta = new DoctypeMeta(
					formDoctypeKey, // Use the form doctype key here
					List(config.schema),
					config.workflow,
					Map(config.actions as Record<string, string[]>)
				)

				if (doctypeMeta) {
					registry.addDoctype(doctypeMeta)
				}
			}
		}

		// Check if record already exists in HST
		const existingRecord = stonecrop.getRecordById(recordDoctype, recordId)

		if (!existingRecord && !recordId.startsWith('new-')) {
			// Fetch individual record if not in store and not a new record
			const response = await fetch(`${apiBaseUrl}/${doctype}/${recordId}`) // Use original doctype for API call
			if (response.ok) {
				const record = await response.json()
				stonecrop.addRecord(recordDoctype, recordId, record)
			}
		}

		// Set as current record (even for new records) using record doctype
		stonecrop.setCurrentRecord(recordDoctype, recordId)
	} catch (error) {
		console.error(`Failed to setup record data for ${doctype}/${recordId}:`, error)
	}
}

/**
 * Stonecrop Vue plugin
 * @param app - The Vue app instance
 * @param options - The plugin options
 * @example
 * ```ts
 *
 * import { createApp } from 'vue'
 * import { createPinia } from 'pinia'
 * import Stonecrop from '@stonecrop/stonecrop'
 *
 * import App from './App.vue'
 * import router from './router'
 *
 * const app = createApp(App)
 *
 * // Install in correct order
 * app.use(createPinia())
 * app.use(Stonecrop, {
 *  router,
 *  getMeta: async (doctype: string) => {
 *   // fetch doctype meta from API
 *  },
 * })
 * app.mount('#app')
 * ```
 *
 * @public
 */
const plugin: Plugin = {
	install: (app: App, options?: InstallOptions) => {
		// Check for existing router installation
		const existingRouter = app.config.globalProperties.$router
		const providedRouter = options?.router
		const router = existingRouter || providedRouter
		if (!existingRouter && providedRouter) {
			app.use(providedRouter)
		}

		// Create registry with available router
		const registry = new Registry(router, options?.getMeta)
		app.provide('$registry', registry)
		app.config.globalProperties.$registry = registry

		// Create and provide a global Stonecrop instance
		const stonecrop = new Stonecrop(registry)
		app.provide('$stonecrop', stonecrop)
		app.config.globalProperties.$stonecrop = stonecrop

		// Register custom components
		if (options?.components) {
			for (const [tag, component] of Object.entries(options.components)) {
				app.component(tag, component)
			}
		}

		// Setup automatic router guards if enabled (default: true) and router is available
		const autoRouterGuards = options?.autoRouterGuards !== false
		if (autoRouterGuards && router) {
			const apiBaseUrl = options?.apiBaseUrl || '/api'

			router.afterEach(async (to: RouteLocationNormalized) => {
				try {
					// Check if route has stonecrop metadata (set by router beforeEnter guard)
					let doctype = to.meta.doctype as string
					let actualDoctype = to.meta.actualDoctype as string
					let routeType = to.meta.type as string

					// If metadata is missing, try to resolve from the path
					if (!doctype || !routeType) {
						try {
							const response = await fetch(`${apiBaseUrl}/resolve-route?path=${encodeURIComponent(to.path)}`)
							if (response.ok) {
								const routeInfo = await response.json()
								if (routeInfo && !routeInfo.error) {
									doctype = routeInfo.doctype
									actualDoctype = routeInfo.actualDoctype
									routeType = routeInfo.routeType
								}
							}
						} catch (error) {
							console.warn('[Plugin] Failed to resolve route from API:', error)
						}
					}

					if (doctype && routeType) {
						if (routeType === 'list') {
							await setupDoctypeData(registry, stonecrop, doctype, actualDoctype, apiBaseUrl)
						} else if (routeType === 'form') {
							// Get recordId from params or meta
							const recordId =
								(to.params.recordId as string) ||
								(Array.isArray(to.params.pathMatch) && to.params.pathMatch[1]) ||
								(to.meta.recordId as string)

							if (recordId) {
								await setupRecordData(registry, stonecrop, doctype, recordId, actualDoctype, apiBaseUrl)
							}
						}
					}
				} catch (error) {
					console.error('[Stonecrop] Failed to setup route data:', error)
				}
			})
		}
	},
}

export default plugin
