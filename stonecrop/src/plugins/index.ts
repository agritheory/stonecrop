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

		// Get doctype metadata if not already loaded
		if (!registry.registry[targetDoctype]) {
			const doctypeMeta = await registry.getMeta?.(doctype) // Use original doctype for API call
			if (doctypeMeta) {
				registry.addDoctype(doctypeMeta)
			}
		}

		// Load all records for this doctype into HST
		const response = await fetch(`${apiBaseUrl}/${doctype}`) // Use original doctype for API call
		if (response.ok) {
			const records = (await response.json()) as any[]

			// Clear existing records and add new ones using actual doctype
			stonecrop.clearRecords(targetDoctype)

			if (Array.isArray(records)) {
				records.forEach((record: any) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					if (record && typeof record === 'object' && 'id' in record && record.id) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
						stonecrop.addRecord(targetDoctype, String(record.id), record)
					}
				})
			}
		}
	} catch (error) {
		// eslint-disable-next-line no-console
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

		// Get form doctype metadata if not already loaded
		if (!registry.registry[targetDoctype]) {
			// Use a special endpoint for form metadata
			const response = await fetch(`${apiBaseUrl}/${doctype}/${recordId}/meta`)
			if (response.ok) {
				const metaData = await response.json()

				// eslint-disable-next-line no-console
				console.log('[Plugin] setupRecordData - received metadata:', metaData)
				// eslint-disable-next-line no-console
				console.log('[Plugin] setupRecordData - schema type:', typeof metaData.schema, Array.isArray(metaData.schema))

				const config = {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					schema: metaData.schema,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					workflow: metaData.workflow,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					actions: metaData.actions || {},
				}

				// eslint-disable-next-line no-console
				console.log('[Plugin] setupRecordData - config before DoctypeMeta:', config)

				const doctypeMeta = new DoctypeMeta(
					targetDoctype,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					List(config.schema),
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					config.workflow,
					Map(config.actions as Record<string, string[]>)
				)

				if (doctypeMeta) {
					registry.addDoctype(doctypeMeta)
					// eslint-disable-next-line no-console
					console.log('[Plugin] setupRecordData - added doctypeMeta to registry:', {
						doctype: doctypeMeta.doctype,
						slug: doctypeMeta.slug,
						hasSchema: !!doctypeMeta.schema,
						schemaSize: doctypeMeta.schema?.size,
						schemaType: typeof doctypeMeta.schema,
						isImmutableList: doctypeMeta.schema && 'toArray' in doctypeMeta.schema,
					})

					// Test accessing from registry immediately
					const retrievedMeta = registry.registry[doctypeMeta.slug]
					// eslint-disable-next-line no-console
					console.log('[Plugin] setupRecordData - immediately retrieved from registry:', {
						found: !!retrievedMeta,
						hasSchema: !!retrievedMeta?.schema,
						schemaSize: retrievedMeta?.schema?.size,
						sameObject: retrievedMeta === doctypeMeta,
					})
				}
			}
		}

		// Check if record already exists in HST
		const existingRecord = stonecrop.getRecordById(targetDoctype, recordId)

		if (!existingRecord && !recordId.startsWith('new-')) {
			// Fetch individual record if not in store and not a new record
			const response = await fetch(`${apiBaseUrl}/${doctype}/${recordId}`) // Use original doctype for API call
			if (response.ok) {
				const record = await response.json()
				stonecrop.addRecord(targetDoctype, recordId, record)
			}
		}

		// Set as current record (even for new records) using actual doctype
		stonecrop.setCurrentRecord(targetDoctype, recordId)
	} catch (error) {
		// eslint-disable-next-line no-console
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
					const doctype = to.meta.doctype as string
					const actualDoctype = to.meta.actualDoctype as string
					const routeType = to.meta.type as string

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
					// eslint-disable-next-line no-console
					console.error('[Stonecrop] Failed to setup route data:', error)
				}
			})
		}
	},
}

export default plugin
