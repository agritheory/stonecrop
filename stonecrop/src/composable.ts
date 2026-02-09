// src/composable.ts
import { inject, onMounted, Ref, ref, watch, provide, computed, ComputedRef } from 'vue'

import Registry from './registry'
import { Stonecrop } from './stonecrop'
import DoctypeMeta from './doctype'
import type { HSTNode } from './stores/hst'
import { RouteContext } from './types/registry'
import { storeToRefs } from 'pinia'
import type { HSTOperation, OperationLogConfig, OperationLogSnapshot } from './types/operation-log'

/**
 * Operation Log API - nested object containing all operation log functionality
 * @public
 */
export type OperationLogAPI = {
	operations: Ref<HSTOperation[]>
	currentIndex: Ref<number>
	undoRedoState: ComputedRef<{
		canUndo: boolean
		canRedo: boolean
		undoCount: number
		redoCount: number
		currentIndex: number
	}>
	canUndo: ComputedRef<boolean>
	canRedo: ComputedRef<boolean>
	undoCount: ComputedRef<number>
	redoCount: ComputedRef<number>
	undo: (hstStore: HSTNode) => boolean
	redo: (hstStore: HSTNode) => boolean
	startBatch: () => void
	commitBatch: (description?: string) => string | null
	cancelBatch: () => void
	clear: () => void
	getOperationsFor: (doctype: string, recordId?: string) => HSTOperation[]
	getSnapshot: () => OperationLogSnapshot
	markIrreversible: (operationId: string, reason: string) => void
	logAction: (
		doctype: string,
		actionName: string,
		recordIds?: string[],
		result?: 'success' | 'failure' | 'pending',
		error?: string
	) => string
	configure: (options: Partial<OperationLogConfig>) => void
}

/**
 * Base Stonecrop composable return type - includes operation log functionality
 * @public
 */
export type BaseStonecropReturn = {
	stonecrop: Ref<Stonecrop | undefined>
	operationLog: OperationLogAPI
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
	loadNestedData: (parentPath: string, childDoctype: DoctypeMeta, recordId?: string) => Promise<Record<string, any>>
	saveRecursive: (doctype: DoctypeMeta, recordId: string) => Promise<Record<string, any>>
	createNestedContext: (
		basePath: string,
		childDoctype: DoctypeMeta
	) => {
		provideHSTPath: (fieldname: string) => string
		handleHSTChange: (changeData: HSTChangeData) => void
	}
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
export function useStonecrop(): BaseStonecropReturn | HSTStonecropReturn
/**
 * Unified Stonecrop composable with HST integration for a specific doctype and record
 *
 * @param options - Configuration with doctype and optional recordId
 * @returns Stonecrop instance with full HST integration utilities
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

	// Operation log state and methods - will be populated after stonecrop instance is created
	const operations = ref<HSTOperation[]>([])
	const currentIndex = ref(-1)
	const canUndo = computed(() => stonecrop.value?.getOperationLogStore().canUndo ?? false)
	const canRedo = computed(() => stonecrop.value?.getOperationLogStore().canRedo ?? false)
	const undoCount = computed(() => stonecrop.value?.getOperationLogStore().undoCount ?? 0)
	const redoCount = computed(() => stonecrop.value?.getOperationLogStore().redoCount ?? 0)
	const undoRedoState = computed(
		() =>
			stonecrop.value?.getOperationLogStore().undoRedoState ?? {
				canUndo: false,
				canRedo: false,
				undoCount: 0,
				redoCount: 0,
				currentIndex: -1,
			}
	)

	// Operation log methods
	const undo = (hstStore: HSTNode): boolean => {
		return stonecrop.value?.getOperationLogStore().undo(hstStore) ?? false
	}

	const redo = (hstStore: HSTNode): boolean => {
		return stonecrop.value?.getOperationLogStore().redo(hstStore) ?? false
	}

	const startBatch = () => {
		stonecrop.value?.getOperationLogStore().startBatch()
	}

	const commitBatch = (description?: string): string | null => {
		return stonecrop.value?.getOperationLogStore().commitBatch(description) ?? null
	}

	const cancelBatch = () => {
		stonecrop.value?.getOperationLogStore().cancelBatch()
	}

	const clear = () => {
		stonecrop.value?.getOperationLogStore().clear()
	}

	const getOperationsFor = (doctype: string, recordId?: string) => {
		return stonecrop.value?.getOperationLogStore().getOperationsFor(doctype, recordId) ?? []
	}

	const getSnapshot = () => {
		return (
			stonecrop.value?.getOperationLogStore().getSnapshot() ?? {
				operations: [],
				currentIndex: -1,
				totalOperations: 0,
				reversibleOperations: 0,
				irreversibleOperations: 0,
			}
		)
	}

	const markIrreversible = (operationId: string, reason: string) => {
		stonecrop.value?.getOperationLogStore().markIrreversible(operationId, reason)
	}

	const logAction = (
		doctype: string,
		actionName: string,
		recordIds?: string[],
		result: 'success' | 'failure' | 'pending' = 'success',
		error?: string
	): string => {
		return stonecrop.value?.getOperationLogStore().logAction(doctype, actionName, recordIds, result, error) ?? ''
	}

	const configure = (config: Partial<OperationLogConfig>) => {
		stonecrop.value?.getOperationLogStore().configure(config)
	}

	// Initialize Stonecrop instance
	onMounted(async () => {
		if (!registry) {
			return
		}

		stonecrop.value = providedStonecrop || new Stonecrop(registry)

		// Set up reactive refs from operation log store - only if Pinia is available
		try {
			const opLogStore = stonecrop.value.getOperationLogStore()
			const opLogRefs = storeToRefs(opLogStore)
			operations.value = opLogRefs.operations.value
			currentIndex.value = opLogRefs.currentIndex.value

			// Watch for changes in operation log state
			watch(
				() => opLogRefs.operations.value,
				newOps => {
					operations.value = newOps
				}
			)
			watch(
				() => opLogRefs.currentIndex.value,
				newIndex => {
					currentIndex.value = newIndex
				}
			)
		} catch {
			// Pinia not available (e.g., in tests) - operation log features will not be available
			// Silently fail - operation log is optional
		}

		// Handle router-based setup if no specific doctype provided
		if (!options.doctype && registry.router) {
			const route = registry.router.currentRoute.value

			// Parse route path - let the application determine the doctype from the route
			if (!route.path) return // Early return if no path available

			const pathSegments = route.path.split('/').filter(segment => segment.length > 0)
			const recordId = pathSegments[1]?.toLowerCase()

			if (pathSegments.length > 0) {
				// Create route context for getMeta function
				const routeContext: RouteContext = {
					path: route.path,
					segments: pathSegments,
				}

				const doctype = await registry.getMeta?.(routeContext)
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
							} catch {
								formData.value = initializeNewRecord(doctype)
							}
						}
					} else {
						formData.value = initializeNewRecord(doctype)
					}

					if (hstStore.value) {
						setupDeepReactivity(doctype, recordId || 'new', formData, hstStore.value)
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
					} catch {
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
		return `${doctype.slug}.${actualRecordId}.${fieldname}`
	}

	const handleHSTChange = (changeData: HSTChangeData): void => {
		const doctype = options.doctype || routerDoctype.value
		if (!hstStore.value || !stonecrop.value || !doctype) {
			return
		}

		try {
			const pathParts = changeData.path.split('.')
			if (pathParts.length >= 2) {
				const doctypeSlug = pathParts[0]
				const recordId = pathParts[1]

				if (!hstStore.value.has(`${doctypeSlug}.${recordId}`)) {
					stonecrop.value.addRecord(doctype, recordId, { ...formData.value })
				}

				if (pathParts.length > 3) {
					const recordPath = `${doctypeSlug}.${recordId}`
					const nestedParts = pathParts.slice(2)

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
		} catch {
			// Silently handle errors
		}
	}

	// Provide injection tokens if HST will be available
	if (options.doctype || registry?.router) {
		provide('hstPathProvider', provideHSTPath)
		provide('hstChangeHandler', handleHSTChange)
	}

	/**
	 * Load nested doctype data from API or initialize empty structure
	 * @param parentPath - The parent path (e.g., "customer.123.address")
	 * @param childDoctype - The child doctype metadata
	 * @param recordId - Optional record ID to load
	 * @returns Promise resolving to the loaded or initialized data
	 */
	const loadNestedData = async (
		parentPath: string,
		childDoctype: DoctypeMeta,
		recordId?: string
	): Promise<Record<string, any>> => {
		if (!stonecrop.value) {
			return initializeNewRecord(childDoctype)
		}

		// If recordId provided, try to load existing data
		if (recordId) {
			try {
				// Check if data already exists in HST
				const existingData = hstStore.value?.get(parentPath)
				if (existingData && typeof existingData === 'object') {
					return existingData as Record<string, any>
				}

				// TODO: Add API fetch logic here if needed
				// For now, initialize new record
				return initializeNewRecord(childDoctype)
			} catch {
				return initializeNewRecord(childDoctype)
			}
		}

		// Initialize new record
		return initializeNewRecord(childDoctype)
	}

	/**
	 * Recursively save a record with all nested doctype fields
	 * @param doctype - The doctype metadata
	 * @param recordId - The record ID to save
	 * @returns Promise resolving to the complete save payload
	 */
	const saveRecursive = async (doctype: DoctypeMeta, recordId: string): Promise<Record<string, any>> => {
		if (!hstStore.value || !stonecrop.value) {
			throw new Error('HST store not initialized')
		}

		const recordPath = `${doctype.slug}.${recordId}`
		const recordData = hstStore.value.get(recordPath) || {}

		// Build the save payload
		const payload: Record<string, any> = { ...recordData }

		// Find all Doctype fields in the schema
		const schemaArray = doctype.schema
			? Array.isArray(doctype.schema)
				? doctype.schema
				: Array.from(doctype.schema)
			: []
		const doctypeFields = schemaArray.filter(field => 'fieldtype' in field && field.fieldtype === 'Doctype')

		// Recursively collect nested data
		for (const field of doctypeFields) {
			if (!('options' in field) || typeof field.options !== 'string') continue

			const nestedDoctypeSlug = field.options
			const nestedDoctype = registry?.registry[nestedDoctypeSlug]

			if (!nestedDoctype) {
				console.warn(`Nested doctype '${nestedDoctypeSlug}' not found in registry`)
				continue
			}

			const fieldPath = `${recordPath}.${field.fieldname}`

			// Handle array fields (1:many)
			if ('isArray' in field && field.isArray) {
				const nestedArray = hstStore.value.get(fieldPath) || []
				const nestedPayloads: any[] = []

				if (Array.isArray(nestedArray)) {
					for (let i = 0; i < nestedArray.length; i++) {
						const nestedRecordPath = `${fieldPath}[${i}]`
						// Recursively save nested record
						const nestedData = await collectNestedData(nestedDoctype, nestedRecordPath, hstStore.value, registry)
						nestedPayloads.push(nestedData)
					}
				}

				payload[field.fieldname] = nestedPayloads
			} else {
				// Handle single nested object (1:1)
				const nestedData = await collectNestedData(nestedDoctype, fieldPath, hstStore.value, registry)
				payload[field.fieldname] = nestedData
			}
		}

		return payload
	}

	/**
	 * Create a nested context for child forms
	 * @param basePath - The base path for the nested context (e.g., "customer.123.address")
	 * @param childDoctype - The child doctype metadata
	 * @returns Object with scoped provideHSTPath and handleHSTChange
	 */
	const createNestedContext = (basePath: string, childDoctype: DoctypeMeta) => {
		const nestedProvideHSTPath = (fieldname: string): string => {
			return `${basePath}.${fieldname}`
		}

		const nestedHandleHSTChange = (changeData: HSTChangeData): void => {
			// Update the path to be relative to the nested base path
			const nestedPath = changeData.path.startsWith(basePath) ? changeData.path : `${basePath}.${changeData.fieldname}`

			handleHSTChange({
				...changeData,
				path: nestedPath,
			})
		}

		return {
			provideHSTPath: nestedProvideHSTPath,
			handleHSTChange: nestedHandleHSTChange,
		}
	}

	// Create operation log API object
	const operationLog: OperationLogAPI = {
		operations,
		currentIndex,
		undoRedoState,
		canUndo,
		canRedo,
		undoCount,
		redoCount,
		undo,
		redo,
		startBatch,
		commitBatch,
		cancelBatch,
		clear,
		getOperationsFor,
		getSnapshot,
		markIrreversible,
		logAction,
		configure,
	}
	// Always return HST functions if doctype is provided or will be loaded from router
	if (options.doctype) {
		// Explicit doctype - return HST immediately
		return {
			stonecrop,
			operationLog,
			provideHSTPath,
			handleHSTChange,
			hstStore,
			formData,
			loadNestedData,
			saveRecursive,
			createNestedContext,
		} as HSTStonecropReturn
	} else if (!options.doctype && registry?.router) {
		// Router-based - return HST (will be populated after mount)
		return {
			stonecrop,
			operationLog,
			provideHSTPath,
			handleHSTChange,
			hstStore,
			formData,
			loadNestedData,
			saveRecursive,
			createNestedContext,
		} as HSTStonecropReturn
	}

	// No doctype and no router - basic mode
	return {
		stonecrop,
		operationLog,
	} as BaseStonecropReturn
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
			const recordPath = `${doctype.slug}.${recordId}`

			Object.keys(newData).forEach(fieldname => {
				const path = `${recordPath}.${fieldname}`
				try {
					hstStore.set(path, newData[fieldname])
				} catch {
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

/**
 * Recursively collect nested data from HST for save operation
 * @param doctype - The doctype metadata
 * @param basePath - The base path in HST (e.g., "customer.123.address")
 * @param hstStore - The HST store instance
 * @param registry - The registry instance
 * @returns The collected data object
 */
async function collectNestedData(
	doctype: DoctypeMeta,
	basePath: string,
	hstStore: HSTNode,
	registry?: Registry
): Promise<Record<string, any>> {
	const data = hstStore.get(basePath) || {}
	const payload: Record<string, any> = { ...data }

	// Find all Doctype fields in this doctype's schema
	const schemaArray = doctype.schema
		? Array.isArray(doctype.schema)
			? doctype.schema
			: Array.from(doctype.schema)
		: []
	const doctypeFields = schemaArray.filter(field => 'fieldtype' in field && field.fieldtype === 'Doctype')

	// Recursively collect nested data
	for (const field of doctypeFields) {
		if (!('options' in field) || typeof field.options !== 'string') continue

		const nestedDoctypeSlug = field.options
		const nestedDoctype = registry?.registry[nestedDoctypeSlug]

		if (!nestedDoctype) {
			console.warn(`Nested doctype '${nestedDoctypeSlug}' not found in registry`)
			continue
		}

		const fieldPath = `${basePath}.${field.fieldname}`

		// Handle array fields (1:many)
		if ('isArray' in field && field.isArray) {
			const nestedArray = hstStore.get(fieldPath) || []
			const nestedPayloads: any[] = []

			if (Array.isArray(nestedArray)) {
				for (let i = 0; i < nestedArray.length; i++) {
					const nestedRecordPath = `${fieldPath}[${i}]`
					const nestedData = await collectNestedData(nestedDoctype, nestedRecordPath, hstStore, registry)
					nestedPayloads.push(nestedData)
				}
			}

			payload[field.fieldname] = nestedPayloads
		} else {
			// Handle single nested object (1:1)
			const nestedData = await collectNestedData(nestedDoctype, fieldPath, hstStore, registry)
			payload[field.fieldname] = nestedData
		}
	}

	return payload
}
