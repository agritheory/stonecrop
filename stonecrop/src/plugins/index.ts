import { App, type Plugin } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

import DoctypeMeta from '../doctype'
import Registry from '../registry'
import { Stonecrop } from '../stonecrop'
import type { InstallOptions } from '../types'

/**
 * Setup doctype metadata for any view type using the provided getMeta function
 */
async function setupDoctypeMetadata(
	registry: Registry,
	doctype: string,
	actualDoctype?: string,
	recordId?: string
): Promise<void> {
	try {
		const targetDoctype = actualDoctype || doctype

		// Get doctype metadata if not already loaded
		if (!registry.registry[targetDoctype]) {
			// Use the registry's getMeta function (provided during plugin installation)
			if (registry.getMeta) {
				// For record-specific requests, try to get form-specific metadata
				const metaDoctype = recordId ? `${doctype}/${recordId}` : doctype
				const doctypeMeta = await registry.getMeta(metaDoctype)
				if (doctypeMeta) {
					// Update the doctype name to match the target doctype
					const updatedMeta = new DoctypeMeta(
						targetDoctype,
						doctypeMeta.schema,
						doctypeMeta.workflow,
						doctypeMeta.actions
					)
					registry.addDoctype(updatedMeta)
				}
			}
		}
	} catch (error) {
		// Silent error handling - let the application handle error display
	}
}

/**
 * Load data for a doctype using the provided getData function
 */
async function loadRouteData(stonecrop: Stonecrop, doctype: string, recordId?: string): Promise<void> {
	try {
		// Use the registry's getData function (provided during plugin installation)
		if (stonecrop.registry.getData) {
			if (recordId) {
				// Load individual record
				const existingRecord = stonecrop.getRecordById(doctype, recordId)
				if (!existingRecord && !recordId.startsWith('new-')) {
					const record = await stonecrop.registry.getData(doctype, recordId)
					if (record) {
						stonecrop.addRecord(doctype, recordId, record)
					}
				}
				// Set as current record
				stonecrop.setCurrentRecord(doctype, recordId)
			} else {
				// Load collection of records
				const records = await stonecrop.registry.getData(doctype)
				if (Array.isArray(records)) {
					// Clear existing records and add new ones
					stonecrop.clearRecords(doctype)

					records.forEach((record: unknown) => {
						if (record && typeof record === 'object' && 'id' in record && record.id) {
							stonecrop.addRecord(doctype, String((record as { id: string | number }).id), record)
						}
					})
				}
			}
		}
	} catch (error) {
		// Silent error handling - let the application handle error display
	}
}

/**
 * Setup route data by loading metadata and data for the current route
 */
async function setupRouteData(
	registry: Registry,
	stonecrop: Stonecrop,
	routeDoctype: string,
	actualDoctype: string,
	recordId?: string
): Promise<void> {
	try {
		// 1. Setup metadata for the actual doctype (as defined by the route)
		await setupDoctypeMetadata(registry, routeDoctype, actualDoctype, recordId)

		// 2. Load data using the base doctype for storage consistency
		const dataDoctype = routeDoctype // Use route doctype for data storage
		await loadRouteData(stonecrop, dataDoctype, recordId)
	} catch (error) {
		// Silent error handling - let the application handle error display
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
		const registry = new Registry(router, options?.getMeta, options?.getData)
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
			router.afterEach(async (to: RouteLocationNormalized) => {
				try {
					// Only proceed if route has stonecrop metadata (set by router beforeEnter guard)
					const doctype = to.meta.doctype as string
					const actualDoctype = to.meta.actualDoctype as string

					if (doctype && actualDoctype) {
						// Get recordId from params or meta (optional - used for individual records)
						const recordId =
							(to.params.recordId as string) ||
							(Array.isArray(to.params.pathMatch) && to.params.pathMatch[1]) ||
							(to.meta.recordId as string) ||
							undefined

						// Setup route data abstractly - let the application determine view structure
						await setupRouteData(registry, stonecrop, doctype, actualDoctype, recordId)
					}
				} catch (error) {
					// Silent error handling - let the application handle error display
				}
			})
		}
	},
}

export default plugin
