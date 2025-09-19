// src/composable.ts
import { inject, onMounted, Ref, ref, watch, provide } from 'vue'

import Registry from './registry'
import { Stonecrop } from './stonecrop'
import DoctypeMeta from './doctype'
import type { HSTNode } from './stores/hst'

/**
 * Base Stonecrop composable return type
 * @public
 */
export type BaseStonecropReturn = {
	stonecrop: Ref<Stonecrop | undefined>
}

/**
 * HST-enabled Stonecrop composable return type
 * @public
 */
export type HSTStonecropReturn = BaseStonecropReturn & {
	provideHSTPath: (fieldname: string, recordId?: string) => string
	handleHSTChange: (changeData: HSTChangeData) => void
	hstStore: Ref<HSTNode | undefined>
	formData: Ref<Record<string, any>>
}

/**
 * Unified Stonecrop composable return type (legacy - for backward compatibility)
 * @public
 */
export type StonecropReturn = {
	stonecrop: Ref<Stonecrop | undefined>
	provideHSTPath?: (fieldname: string, recordId?: string) => string
	handleHSTChange?: (changeData: HSTChangeData) => void
	hstStore?: Ref<HSTNode | undefined>
	formData?: Ref<Record<string, any>>
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
 * Unified Stonecrop composable - handles both general operations and HST reactive integration
 *
 * @param options - Configuration options for the composable
 * @returns Stonecrop instance and optional HST integration utilities
 * @public
 */
export function useStonecrop(): BaseStonecropReturn
/**
 * @public
 */
export function useStonecrop(options: {
	registry?: Registry
	doctype: DoctypeMeta
	recordId?: string
}): HSTStonecropReturn
/**
 * @public
 */
export function useStonecrop(options?: {
	registry?: Registry
	doctype?: DoctypeMeta
	recordId?: string
}): BaseStonecropReturn | HSTStonecropReturn {
	if (!options) options = {}

	const registry = options.registry || inject<Registry>('$registry')
	const providedStonecrop = inject<Stonecrop>('$stonecrop')
	const stonecrop = ref<Stonecrop>()
	const hstStore = ref<HSTNode>()
	const formData = ref<Record<string, any>>({})

	// Use refs for router-loaded doctype to maintain reactivity
	const routerDoctype = ref<DoctypeMeta | undefined>()
	const routerRecordId = ref<string | undefined>()

	// Initialize Stonecrop instance
	onMounted(async () => {
		if (!registry) {
			return
		}

		stonecrop.value = providedStonecrop || new Stonecrop(registry)

		// Handle router-based setup if no specific doctype provided
		if (!options.doctype && registry.router) {
			const route = registry.router.currentRoute.value
			const doctypeSlug = route.params.records?.toString().toLowerCase()
			const recordId = route.params.record?.toString().toLowerCase()

			if (doctypeSlug || recordId) {
				const doctype = await registry.getMeta?.(doctypeSlug)
				if (doctype) {
					registry.addDoctype(doctype)
					stonecrop.value.setup(doctype)

					// Set reactive refs for router-based doctype
					routerDoctype.value = doctype
					routerRecordId.value = recordId
					hstStore.value = stonecrop.value.getStore()

					if (recordId && recordId !== 'new') {
						const existingRecord = stonecrop.value.getRecordById(doctype, recordId)
						if (existingRecord) {
							formData.value = existingRecord.get('') || {}
						} else {
							try {
								await stonecrop.value.getRecord(doctype, recordId)
								const loadedRecord = stonecrop.value.getRecordById(doctype, recordId)
								if (loadedRecord) {
									formData.value = loadedRecord.get('') || {}
								}
							} catch (error) {
								formData.value = initializeNewRecord(doctype)
							}
						}
					} else {
						formData.value = initializeNewRecord(doctype)
					}

					if (hstStore.value) {
						setupDeepReactivity(doctype, recordId || 'new', formData, hstStore.value)
					}

					// Keep existing behavior for backwards compatibility
					if (doctypeSlug) {
						if (recordId) {
							await stonecrop.value.getRecord(doctype, recordId)
						} else {
							await stonecrop.value.getRecords(doctype)
						}
					}

					stonecrop.value.runAction(doctype, 'load', recordId ? [recordId] : undefined)
				}
			}
		}

		// Handle HST integration if doctype is provided explicitly
		if (options.doctype) {
			hstStore.value = stonecrop.value.getStore()
			const doctype = options.doctype
			const recordId = options.recordId

			if (recordId && recordId !== 'new') {
				const existingRecord = stonecrop.value.getRecordById(doctype, recordId)
				if (existingRecord) {
					formData.value = existingRecord.get('') || {}
				} else {
					try {
						await stonecrop.value.getRecord(doctype, recordId)
						const loadedRecord = stonecrop.value.getRecordById(doctype, recordId)
						if (loadedRecord) {
							formData.value = loadedRecord.get('') || {}
						}
					} catch (error) {
						formData.value = initializeNewRecord(doctype)
					}
				}
			} else {
				formData.value = initializeNewRecord(doctype)
			}

			if (hstStore.value) {
				setupDeepReactivity(doctype, recordId || 'new', formData, hstStore.value)
			}
		}
	})

	// HST integration functions - always created but only populated when HST is available
	const provideHSTPath = (fieldname: string, customRecordId?: string): string => {
		const doctype = options.doctype || routerDoctype.value
		if (!doctype) return ''

		const actualRecordId = customRecordId || options.recordId || routerRecordId.value || 'new'
		return `${doctype.slug}.records.${actualRecordId}.${fieldname}`
	}

	const handleHSTChange = (changeData: HSTChangeData): void => {
		const doctype = options.doctype || routerDoctype.value
		if (!hstStore.value || !stonecrop.value || !doctype) {
			return
		}

		try {
			const pathParts = changeData.path.split('.')
			if (pathParts.length >= 3 && pathParts[1] === 'records') {
				const doctypeSlug = pathParts[0]
				const recordId = pathParts[2]

				if (!hstStore.value.has(`${doctypeSlug}.records.${recordId}`)) {
					stonecrop.value.addRecord(doctype, recordId, { ...formData.value })
				}

				if (pathParts.length > 4) {
					const recordPath = `${doctypeSlug}.records.${recordId}`
					const nestedParts = pathParts.slice(3)

					let currentPath = recordPath
					for (let i = 0; i < nestedParts.length - 1; i++) {
						currentPath += `.${nestedParts[i]}`

						if (!hstStore.value.has(currentPath)) {
							const nextPart = nestedParts[i + 1]
							const isArray = !isNaN(Number(nextPart))
							hstStore.value.set(currentPath, isArray ? [] : {})
						}
					}
				}
			}

			hstStore.value.set(changeData.path, changeData.value)

			const fieldParts = changeData.fieldname.split('.')
			const newFormData = { ...formData.value }

			if (fieldParts.length === 1) {
				newFormData[fieldParts[0]] = changeData.value
			} else {
				updateNestedObject(newFormData, fieldParts, changeData.value)
			}

			formData.value = newFormData
		} catch (error) {
			// Silently handle errors
		}
	}

	// Provide injection tokens if HST will be available
	if (options.doctype || registry?.router) {
		provide('hstPathProvider', provideHSTPath)
		provide('hstChangeHandler', handleHSTChange)
	}

	// Always return HST functions if doctype is provided or will be loaded from router
	if (options.doctype) {
		// Explicit doctype - return HST immediately
		return {
			stonecrop,
			provideHSTPath,
			handleHSTChange,
			hstStore,
			formData,
		} as HSTStonecropReturn
	} else if (!options.doctype && registry?.router) {
		// Router-based - return HST (will be populated after mount)
		return {
			stonecrop,
			provideHSTPath,
			handleHSTChange,
			hstStore,
			formData,
		} as HSTStonecropReturn
	}

	// No doctype and no router - basic mode
	return { stonecrop } as BaseStonecropReturn
}

/**
 * Initialize new record structure based on doctype schema
 */
function initializeNewRecord(doctype: DoctypeMeta): Record<string, any> {
	const initialData: Record<string, any> = {}

	if (!doctype.schema) {
		return initialData
	}

	doctype.schema.forEach(field => {
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
 */
function setupDeepReactivity(
	doctype: DoctypeMeta,
	recordId: string,
	formData: Ref<Record<string, any>>,
	hstStore: HSTNode
): void {
	watch(
		formData,
		newData => {
			const recordPath = `${doctype.slug}.records.${recordId}`

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
}

/**
 * Update nested object with dot-notation path
 */
function updateNestedObject(obj: any, path: string[], value: any): void {
	let current = obj as Record<string, any>

	for (let i = 0; i < path.length - 1; i++) {
		const key = path[i]

		if (!(key in current) || typeof current[key] !== 'object') {
			current[key] = isNaN(Number(path[i + 1])) ? {} : []
		}

		current = current[key] as Record<string, any>
	}

	const finalKey = path[path.length - 1]
	current[finalKey] = value
}
