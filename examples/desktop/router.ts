import { createRouter, createWebHistory } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

import Home from './components/Home.vue'
import View from './components/View.vue'

// Global references that will be set during app initialization
let globalRegistry: any = null
let globalStonecrop: any = null

// Export function to set global references
export function setGlobalReferences(registry: any, stonecrop: any) {
	globalRegistry = registry
	globalStonecrop = stonecrop
}

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
			meta: { title: 'Home' },
		},
		{
			path: '/:doctype',
			name: 'records-list',
			component: View,
			meta: { title: 'Records List' },
			beforeEnter: async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
				await setupDoctypeData(to.params.doctype as string)
				next()
			},
		},
		{
			path: '/:doctype/:recordId',
			name: 'record-form',
			component: View,
			meta: { title: 'Record Details' },
			beforeEnter: async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
				await setupRecordData(to.params.doctype as string, to.params.recordId as string)
				next()
			},
		},
		// Fallback route for backward compatibility
		{
			path: '/:pathMatch(.*)*',
			name: 'catch-all',
			component: View,
		},
	],
})

/**
 * Setup doctype metadata and load all records for the doctype
 */
async function setupDoctypeData(doctype: string): Promise<void> {
	if (!globalRegistry || !globalStonecrop) {
		console.warn('Global Stonecrop references not available during route setup')
		return
	}

	try {
		// Get doctype metadata if not already loaded
		if (!globalRegistry.registry[doctype]) {
			const doctypeMeta = await globalRegistry.getMeta?.(doctype)
			if (doctypeMeta) {
				globalRegistry.addDoctype(doctypeMeta)
			}
		}

		// Load all records for this doctype into HST
		const response = await fetch(`/${doctype}`)
		if (response.ok) {
			const records = await response.json()

			// Clear existing records and add new ones
			globalStonecrop.clearRecords(doctype)

			if (Array.isArray(records)) {
				records.forEach((record: any) => {
					if (record.id) {
						globalStonecrop.addRecord(doctype, record.id, record)
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
async function setupRecordData(doctype: string, recordId: string): Promise<void> {
	if (!globalRegistry || !globalStonecrop) {
		console.warn('Global Stonecrop references not available during route setup')
		return
	}

	try {
		// Ensure doctype is set up first
		await setupDoctypeData(doctype)

		// Check if record already exists in HST
		const existingRecord = globalStonecrop.getRecordById(doctype, recordId)

		if (!existingRecord && !recordId.startsWith('new-')) {
			// Fetch individual record if not in store and not a new record
			const response = await fetch(`/${doctype}/${recordId}`)
			if (response.ok) {
				const record = await response.json()
				globalStonecrop.addRecord(doctype, recordId, record)
			}
		}

		// Set as current record (even for new records)
		globalStonecrop.setCurrentRecord(doctype, recordId)
	} catch (error) {
		console.error(`Failed to setup record data for ${doctype}/${recordId}:`, error)
	}
}

export default router
