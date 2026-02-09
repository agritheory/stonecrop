import { ref, type Ref } from 'vue'

import type { SchemaTypes } from '@stonecrop/aform/types'

/**
 * Registry interface for schema lookup
 * Compatible with Stonecrop Registry but doesn't require it as a dependency
 * @public
 */
export interface SchemaRegistry {
	registry: Record<
		string,
		{
			doctype: string
			slug: string
			schema?: SchemaTypes[] | Iterable<SchemaTypes>
		}
	>
	preloadNestedSchemas?: (doctypeSlug: string) => Promise<void>
}

/**
 * Options for useNestedSchema composable
 * @public
 */
export interface UseNestedSchemaOptions {
	/**
	 * The target doctype slug to load schema for
	 */
	doctype: string

	/**
	 * Registry instance for schema lookup (optional)
	 * If not provided, you must supply schema directly via setSchema
	 */
	registry?: SchemaRegistry

	/**
	 * Direct schema array to use instead of loading from registry
	 */
	schema?: SchemaTypes[]

	/**
	 * Whether this represents an array of nested forms (1:many)
	 * Default: false (single nested form, 1:1)
	 */
	isArray?: boolean

	/**
	 * Initial data for the nested form(s)
	 */
	initialData?: any
}

/**
 * Return type for useNestedSchema composable
 * @public
 */
export interface UseNestedSchemaReturn {
	/**
	 * The loaded/provided nested schema
	 */
	schema: Ref<SchemaTypes[] | undefined>

	/**
	 * Error message if schema loading fails
	 */
	error: Ref<string | undefined>

	/**
	 * Loading state
	 */
	loading: Ref<boolean>

	/**
	 * Initialize empty record data based on schema
	 */
	initializeRecord: () => Record<string, any>

	/**
	 * Initialize array of records
	 */
	initializeArray: (count: number) => Record<string, any>[]

	/**
	 * Manually set schema (useful if not using registry)
	 */
	setSchema: (newSchema: SchemaTypes[]) => void

	/**
	 * Load schema from registry
	 */
	loadSchema: () => Promise<void>

	/**
	 * Get the doctype name (display name)
	 */
	doctypeName: Ref<string>
}

/**
 * Composable for managing nested schema loading and initialization
 *
 * This composable provides utilities for working with nested doctypes in forms
 * without being tightly coupled to Stonecrop or any specific state management solution.
 *
 * @example
 * ```typescript
 * // With Stonecrop registry
 * const { schema, initializeRecord, loadSchema } = useNestedSchema({
 *   doctype: 'address',
 *   registry: stonecrop.registry,
 * })
 * await loadSchema()
 *
 * // With direct schema
 * const { schema, initializeRecord } = useNestedSchema({
 *   doctype: 'address',
 *   schema: addressSchema,
 * })
 *
 * // Initialize data
 * const emptyAddress = initializeRecord()
 * ```
 *
 * @public
 */
export function useNestedSchema(options: UseNestedSchemaOptions): UseNestedSchemaReturn {
	const schema = ref<SchemaTypes[]>()
	const error = ref<string>()
	const loading = ref(false)
	const doctypeName = ref(options.doctype)

	// Initialize with provided schema if available
	if (options.schema) {
		schema.value = options.schema
	}

	// Initialize with provided data if available
	if (options.initialData) {
		// Data is provided externally, composable just manages schema
	}

	/**
	 * Load schema from registry
	 */
	const loadSchema = async (): Promise<void> => {
		if (!options.registry) {
			error.value = 'No registry provided and no schema set directly'
			return
		}

		loading.value = true
		error.value = undefined

		try {
			// Preload nested schemas if registry supports it
			if (options.registry.preloadNestedSchemas) {
				await options.registry.preloadNestedSchemas(options.doctype)
			}

			// Get doctype from registry
			const doctype = options.registry.registry[options.doctype]
			if (!doctype) {
				error.value = `Doctype '${options.doctype}' not found in registry`
				return
			}

			doctypeName.value = doctype.doctype

			// Convert schema to array (handles both arrays and Immutable Lists)
			if (Array.isArray(doctype.schema)) {
				schema.value = doctype.schema
			} else if (doctype.schema && typeof doctype.schema[Symbol.iterator] === 'function') {
				schema.value = Array.from(doctype.schema)
			} else {
				error.value = 'Invalid schema format'
			}
		} catch (err) {
			error.value = `Failed to load schema: ${err instanceof Error ? err.message : String(err)}`
		} finally {
			loading.value = false
		}
	}

	/**
	 * Manually set schema
	 */
	const setSchema = (newSchema: SchemaTypes[]): void => {
		schema.value = newSchema
		error.value = undefined
	}

	/**
	 * Initialize empty record based on schema
	 */
	const initializeRecord = (): Record<string, any> => {
		const initialData: Record<string, any> = {}

		if (!schema.value) {
			return initialData
		}

		schema.value.forEach(field => {
			const fieldtype = 'fieldtype' in field ? field.fieldtype : 'Data'
			const fieldname = field.fieldname

			// Provide sensible defaults based on field type
			switch (fieldtype) {
				case 'Data':
				case 'Text':
					initialData[fieldname] = ''
					break
				case 'Check':
					initialData[fieldname] = false
					break
				case 'Int':
				case 'Float':
				case 'Decimal':
					initialData[fieldname] = 0
					break
				case 'Doctype':
					// Initialize nested Doctype fields based on isArray
					if ('isArray' in field && field.isArray) {
						initialData[fieldname] = []
					} else {
						initialData[fieldname] = {}
					}
					break
				case 'JSON':
					initialData[fieldname] = {}
					break
				case 'Date':
				case 'Time':
				case 'Datetime':
					initialData[fieldname] = null
					break
				default:
					initialData[fieldname] = null
			}

			// Use default value if specified in schema
			if ('default' in field && field.default !== undefined) {
				initialData[fieldname] = field.default
			}
		})

		return initialData
	}

	/**
	 * Initialize array of records
	 */
	const initializeArray = (count: number): Record<string, any>[] => {
		return Array.from({ length: count }, () => initializeRecord())
	}

	// Auto-load if registry is provided
	if (options.registry && !options.schema) {
		void loadSchema()
	}

	return {
		schema,
		error,
		loading,
		doctypeName,
		initializeRecord,
		initializeArray,
		setSchema,
		loadSchema,
	}
}
