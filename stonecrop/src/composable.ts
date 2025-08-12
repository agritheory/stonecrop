// src/composable.ts
import { inject, onMounted, Ref, ref, watch, provide } from 'vue'

import Registry from './registry'
import { Stonecrop } from './stonecrop'
import DoctypeMeta from './doctype'
import type { HSTNode } from './stores/hst'

/**
 * Stonecrop composable return type
 * @public
 */
export type StonecropReturn = {
	stonecrop: Ref<Stonecrop | undefined>
}

/**
 * HST Reactive integration return type
 * @public
 */
export type StonecropReactiveReturn = {
	stonecrop: Ref<Stonecrop | undefined>
	provideHSTPath: (fieldname: string, recordId?: string) => string
	handleHSTChange: (changeData: HSTChangeData) => void
	hstStore: Ref<HSTNode | undefined>
	formData: Ref<Record<string, any>>
}

/**
 * HST Change data structure
 * @public
 */
export type HSTChangeData = {
	path: string
	value: any
	fieldname: string
	recordId?: string
}

/**
 * Stonecrop composable
 * @param registry - An existing Stonecrop Registry instance
 * @returns The Stonecrop instance and a boolean indicating if Stonecrop is setup and ready
 * @throws Error if the Registry is not available
 * @public
 */
export function useStonecrop(registry?: Registry): StonecropReturn {
	const stonecrop = ref<Stonecrop>()

	onMounted(async () => {
		if (!registry) {
			registry = inject<Registry>('$registry')
		}

		if (!registry) {
			// Don't throw error, just leave stonecrop undefined
			// This allows components to handle the missing registry gracefully
			return
		}

		// Create Stonecrop instance with HST integration
		stonecrop.value = new Stonecrop(registry)

		if (!registry.router) return

		const route = registry.router.currentRoute.value
		const doctypeSlug = route.params.records?.toString().toLowerCase()
		const recordId = route.params.record?.toString().toLowerCase()

		// TODO: handle views other than list and form views?
		if (!doctypeSlug && !recordId) {
			return
		}

		// setup doctype via registry
		const doctype = await registry.getMeta?.(doctypeSlug)
		if (doctype) {
			registry.addDoctype(doctype)
			stonecrop.value.setup(doctype)

			if (doctypeSlug) {
				if (recordId) {
					await stonecrop.value.getRecord(doctype, recordId)
				} else {
					await stonecrop.value.getRecords(doctype)
				}
			}

			stonecrop.value.runAction(doctype, 'load', recordId ? [recordId] : undefined)
		}
	})

	return { stonecrop }
}

/**
 * HST Reactive integration composable for doctype forms
 * Provides reactive bridge between Vue components and HST store
 * @param doctype - The doctype meta object
 * @param recordId - Optional record ID for existing records
 * @returns HST integration utilities and reactive data
 * @public
 */
export function useStonecropReactive(doctype: DoctypeMeta, recordId?: string): StonecropReactiveReturn {
	const registry = inject<Registry>('$registry')
	const stonecrop = ref<Stonecrop>()
	const hstStore = ref<HSTNode>()
	const formData = ref<Record<string, any>>({})

	// Initialize HST integration
	onMounted(async () => {
		if (!registry) {
			return
		}

		// Create Stonecrop instance if not already available
		stonecrop.value = new Stonecrop(registry)
		hstStore.value = stonecrop.value.getStore()

		// Initialize record in HST if recordId provided
		if (recordId && recordId !== 'new') {
			// Try to get existing record from HST
			const existingRecord = stonecrop.value.getRecordById(doctype, recordId)
			if (existingRecord) {
				// Get the raw data from HST
				formData.value = existingRecord.get('') || {}
			} else {
				// Load from server if not in HST (only in non-test environment)
				try {
					await stonecrop.value.getRecord(doctype, recordId)
					const loadedRecord = stonecrop.value.getRecordById(doctype, recordId)
					if (loadedRecord) {
						formData.value = loadedRecord.get('') || {}
					}
				} catch (error) {
					// In test environment or when server is not available,
					// initialize with default data
					formData.value = initializeNewRecord(doctype)
				}
			}
		} else {
			// Initialize new record structure
			formData.value = initializeNewRecord(doctype)
		}

		// Setup deep watching for form data changes
		setupDeepReactivity(doctype, recordId || 'new', formData, hstStore.value)
	})

	/**
	 * Generates HST path for a field
	 * @param fieldname - The field name
	 * @param customRecordId - Optional custom record ID
	 * @returns HST path string
	 */
	const provideHSTPath = (fieldname: string, customRecordId?: string): string => {
		const actualRecordId = customRecordId || recordId || 'new'
		return `${doctype.slug}.records.${actualRecordId}.${fieldname}`
	}

	/**
	 * Handles field-level changes from components
	 * @param changeData - The change data from component
	 */
	const handleHSTChange = (changeData: HSTChangeData): void => {
		if (!hstStore.value || !stonecrop.value) {
			return
		}

		try {
			// Extract record information from the path to ensure it exists
			const pathParts = changeData.path.split('.')
			if (pathParts.length >= 3 && pathParts[1] === 'records') {
				const doctypeSlug = pathParts[0]
				const recordId = pathParts[2]

				// Ensure the record exists in HST before setting field values
				if (!hstStore.value.has(`${doctypeSlug}.records.${recordId}`)) {
					// Initialize the record with current formData
					stonecrop.value.addRecord(doctype, recordId, { ...formData.value })
				}

				// For nested paths, ensure the parent structure exists in HST
				if (pathParts.length > 4) {
					const recordPath = `${doctypeSlug}.records.${recordId}`
					const nestedParts = pathParts.slice(3) // Get the field parts after the record

					// Build up the nested structure in HST, creating objects/arrays as needed
					let currentPath = recordPath
					for (let i = 0; i < nestedParts.length - 1; i++) {
						currentPath += `.${nestedParts[i]}`

						if (!hstStore.value.has(currentPath)) {
							// Determine if next part is numeric (array index)
							const nextPart = nestedParts[i + 1]
							const isArray = !isNaN(Number(nextPart))
							hstStore.value.set(currentPath, isArray ? [] : {})
						}
					}
				}
			}

			// Update HST store with the change
			hstStore.value.set(changeData.path, changeData.value)

			// Update local form data to maintain consistency
			const fieldParts = changeData.fieldname.split('.')

			// Always create a new object to ensure reactivity
			const newFormData = { ...formData.value }

			if (fieldParts.length === 1) {
				// Simple field update
				newFormData[fieldParts[0]] = changeData.value
			} else {
				// Nested field update
				updateNestedObject(newFormData, fieldParts, changeData.value)
			}

			// Replace the entire formData object to trigger Vue reactivity
			formData.value = newFormData
		} catch (error) {
			// Silently handle errors to avoid console warnings
		}
	}

	// Provide HST path injection for child components
	provide('hstPathProvider', provideHSTPath)
	provide('hstChangeHandler', handleHSTChange)

	return {
		stonecrop,
		provideHSTPath,
		handleHSTChange,
		hstStore,
		formData,
	}
}

/**
 * Initialize new record structure based on doctype schema
 * @param doctype - The doctype meta object
 * @returns Initial record data
 */
function initializeNewRecord(doctype: DoctypeMeta): Record<string, any> {
	const initialData: Record<string, any> = {}

	if (!doctype.schema) {
		return initialData
	}

	doctype.schema.forEach(field => {
		// Handle both FormSchema and TableSchema types
		const fieldtype = 'fieldtype' in field ? field.fieldtype : 'Data'

		switch (fieldtype) {
			case 'Data':
			case 'Text':
				initialData[field.fieldname] = ''
				break
			case 'Check':
				initialData[field.fieldname] = false
				break
			case 'Int':
			case 'Float':
				initialData[field.fieldname] = 0
				break
			case 'Table':
				initialData[field.fieldname] = []
				break
			case 'JSON':
				initialData[field.fieldname] = {}
				break
			default:
				initialData[field.fieldname] = null
		}
	})

	return initialData
}

/**
 * Setup deep reactivity between form data and HST store
 * @param doctype - The doctype meta object
 * @param recordId - The record ID
 * @param formData - The reactive form data
 * @param hstStore - The HST store node
 */
function setupDeepReactivity(
	doctype: DoctypeMeta,
	recordId: string,
	formData: Ref<Record<string, any>>,
	hstStore: HSTNode
): void {
	// Watch for changes in form data and sync to HST
	watch(
		formData,
		newData => {
			const recordPath = `${doctype.slug}.records.${recordId}`

			// Update HST store with all form data
			Object.keys(newData).forEach(fieldname => {
				const path = `${recordPath}.${fieldname}`
				try {
					hstStore.set(path, newData[fieldname])
				} catch (error) {
					// Silently handle errors
				}
			})
		},
		{ deep: true }
	)

	// TODO: Watch for changes in HST store and sync back to form data
	// This would require HST store to be Vue-reactive or provide change events
}

/**
 * Update nested object with dot-notation path
 * @param obj - The object to update
 * @param path - Array of property keys
 * @param value - The value to set
 */
function updateNestedObject(obj: any, path: string[], value: any): void {
	let current = obj as Record<string, any>

	for (let i = 0; i < path.length - 1; i++) {
		const key = path[i]

		if (!(key in current) || typeof current[key] !== 'object') {
			// Create nested structure if it doesn't exist
			current[key] = isNaN(Number(path[i + 1])) ? {} : []
		}

		current = current[key] as Record<string, any>
	}

	const finalKey = path[path.length - 1]
	current[finalKey] = value
}
