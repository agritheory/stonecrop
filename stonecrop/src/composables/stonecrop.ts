import { type SchemaTypes } from '@stonecrop/aform'
import { storeToRefs } from 'pinia'
import { inject, onMounted, Ref, ref, watch, provide, computed } from 'vue'

import Doctype from '../doctype'
import Registry from '../registry'
import { Stonecrop } from '../stonecrop'
import type { HSTNode } from '../stores/hst'
import type { BaseStonecropReturn, HSTStonecropReturn, HSTChangeData, OperationLogAPI } from '../types/composable'
import type { HSTOperation, OperationLogConfig } from '../types/operation-log'
import type { RouteContext } from '../types/registry'

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
 * @param options - Configuration with doctype (string slug or Doctype instance) and optional recordId
 * @returns Stonecrop instance with full HST integration utilities
 * @public
 */
export function useStonecrop(options: {
	registry?: Registry
	doctype: Doctype | string
	recordId?: string
}): HSTStonecropReturn
/**
 * @public
 */
export function useStonecrop(options?: {
	registry?: Registry
	doctype?: Doctype | string
	recordId?: string
}): BaseStonecropReturn | HSTStonecropReturn {
	if (!options) options = {}

	const registry = options.registry || inject<Registry>('$registry')
	const providedStonecrop = inject<Stonecrop>('$stonecrop')
	const stonecrop = ref<Stonecrop | undefined>()
	const hstStore = ref<HSTNode>()
	const formData = ref<Record<string, any>>({})

	// Use refs for router-loaded doctype to maintain reactivity
	const routerDoctype = ref<Doctype | undefined>()
	const routerRecordId = ref<string | undefined>()

	// Resolved schema with nested Doctype fields expanded
	const resolvedSchema = ref<SchemaTypes[]>([])

	// Loading state for lazy-loaded doctypes
	const isLoading = ref(false)
	const error = ref<Error | null>(null)
	const resolvedDoctype = ref<Doctype | undefined>()

	// Initialize stonecrop instance synchronously using singleton pattern
	// Use injected instance if available, otherwise fall back to the singleton root
	const stonecropInstance = providedStonecrop || Stonecrop._root
	if (stonecropInstance) {
		stonecrop.value = stonecropInstance
	}

	// If doctype is a Doctype instance (not string), set resolved immediately
	if (options?.doctype && typeof options.doctype !== 'string') {
		resolvedDoctype.value = options.doctype
	}

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
		if (!registry || !stonecrop.value) {
			return
		}

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

					// Resolve schema for router-loaded doctype
					if (registry) {
						const schemaArray = doctype.schema
							? Array.isArray(doctype.schema)
								? doctype.schema
								: Array.from(doctype.schema)
							: []
						resolvedSchema.value = registry.resolveSchema(schemaArray)
					}

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
								formData.value = registry.initializeRecord(resolvedSchema.value)
							}
						}
					} else {
						formData.value = registry.initializeRecord(resolvedSchema.value)
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
			const recordId = options.recordId

			// Resolve doctype - handle string (lazy-load) or Doctype instance
			let doctype: Doctype | undefined

			if (typeof options.doctype === 'string') {
				// String doctype - check registry first, then lazy-load
				const doctypeSlug = options.doctype
				isLoading.value = true
				error.value = null

				try {
					// Check if already in registry
					doctype = registry.getDoctype(doctypeSlug)

					if (!doctype && registry.getMeta) {
						// Lazy-load via getMeta
						const routeContext: RouteContext = {
							path: `/${doctypeSlug}`,
							segments: [doctypeSlug],
						}
						doctype = await registry.getMeta(routeContext)
						if (doctype) {
							registry.addDoctype(doctype)
						}
					}

					if (!doctype) {
						error.value = new Error(`Doctype '${doctypeSlug}' not found in registry and getMeta returned no result`)
					}
				} catch (e) {
					error.value = e instanceof Error ? e : new Error(String(e))
				} finally {
					isLoading.value = false
				}
			} else {
				// Doctype instance provided directly
				doctype = options.doctype
			}

			// Set resolved doctype for consumers
			resolvedDoctype.value = doctype

			if (!doctype) {
				// Error already set above, just return
				return
			}

			// Resolve schema for the doctype
			const schemaArray = doctype.schema
				? Array.isArray(doctype.schema)
					? doctype.schema
					: Array.from(doctype.schema)
				: []
			resolvedSchema.value = registry.resolveSchema(schemaArray)

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
						formData.value = registry.initializeRecord(resolvedSchema.value)
					}
				}
			} else {
				formData.value = registry.initializeRecord(resolvedSchema.value)
			}

			if (hstStore.value) {
				setupDeepReactivity(doctype, recordId || 'new', formData, hstStore.value)
			}
		}
	})

	// HST integration functions - always created but only populated when HST is available
	const provideHSTPath = (fieldname: string, customRecordId?: string): string => {
		const doctype = resolvedDoctype.value || routerDoctype.value
		if (!doctype) return ''

		const actualRecordId = customRecordId || options.recordId || routerRecordId.value || 'new'
		return `${doctype.slug}.${actualRecordId}.${fieldname}`
	}

	const handleHSTChange = (changeData: HSTChangeData): void => {
		const doctype = resolvedDoctype.value || routerDoctype.value
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
	 * Scaffold empty child records from defaults for all descendant links.
	 * Delegates to Stonecrop.initializeNestedData method.
	 * @param path - The HST path where initialized data should be stored
	 * @param doctype - The doctype to initialize
	 * @param options - Options (includeNested to limit which links are scaffolded)
	 */
	const initializeNestedData = (
		path: string,
		doctype: Doctype,
		options?: { includeNested?: boolean | string[] }
	): void => {
		if (!stonecrop.value) {
			throw new Error('Stonecrop instance not available')
		}
		return stonecrop.value.initializeNestedData(path, doctype, options)
	}

	/**
	 * Fetch a record and its nested data from the server.
	 * Delegates to Stonecrop.fetchNestedData method.
	 * @param path - The HST path (e.g., "recipe.r1")
	 * @param doctype - The doctype to fetch
	 * @param recordId - Record ID to fetch
	 * @param options - Query options (includeNested to control which links are fetched)
	 */
	const fetchNestedData = async (
		path: string,
		doctype: Doctype,
		recordId: string,
		options?: { includeNested?: boolean | string[] }
	): Promise<void> => {
		if (!stonecrop.value) {
			throw new Error('Stonecrop instance not available')
		}
		return stonecrop.value.fetchNestedData(path, doctype, recordId, options)
	}

	/**
	 * Collect a record payload with all nested doctype fields from HST
	 * Delegates to Stonecrop.collectRecordPayload method
	 * @param doctype - The doctype metadata
	 * @param recordId - The record ID to collect
	 * @returns The complete record payload ready for API submission
	 */
	const collectRecordPayload = (doctype: Doctype, recordId: string): Record<string, any> => {
		if (!stonecrop.value) {
			throw new Error('Stonecrop instance not available')
		}
		return stonecrop.value.collectRecordPayload(doctype, recordId)
	}

	/**
	 * Create a nested context for child forms
	 * @param basePath - The base path for the nested context (e.g., "customer.123.address")
	 * @param _childDoctype - The child doctype metadata (unused but kept for API consistency)
	 * @returns Object with scoped provideHSTPath and handleHSTChange
	 */
	const createNestedContext = (basePath: string, _childDoctype: Doctype) => {
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
			resolvedSchema,
			initializeNestedData,
			fetchNestedData,
			collectRecordPayload,
			createNestedContext,
			isLoading,
			error,
			resolvedDoctype,
		} satisfies HSTStonecropReturn
	} else if (!options.doctype && registry?.router) {
		// Router-based - return HST (will be populated after mount)
		return {
			stonecrop,
			operationLog,
			provideHSTPath,
			handleHSTChange,
			hstStore,
			formData,
			resolvedSchema,
			initializeNestedData,
			fetchNestedData,
			collectRecordPayload,
			createNestedContext,
			isLoading,
			error,
			resolvedDoctype,
		} satisfies HSTStonecropReturn
	}

	// No doctype and no router - basic mode
	return {
		stonecrop,
		operationLog,
	} as BaseStonecropReturn
}

/**
 * Setup deep reactivity between form data and HST store
 */
function setupDeepReactivity(
	doctype: Doctype,
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
