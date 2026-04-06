import type { DataClient } from '@stonecrop/schema'
import { reactive } from 'vue'

import Doctype from './doctype'
import { getGlobalTriggerEngine } from './field-triggers'
import Registry from './registry'
import { createHST, type HSTNode } from './stores/hst'
import { useOperationLogStore } from './stores/operation-log'
import type { FieldChangeContext } from './types/field-triggers'
import type { OperationLogConfig } from './types/operation-log'
import type { RouteContext } from './types/registry'
import type { StonecropOptions } from './types/stonecrop'

/**
 * Main Stonecrop class with HST integration and built-in Operation Log
 * @public
 */
export class Stonecrop {
	/**
	 * Singleton instance of Stonecrop. Only one Stonecrop instance can exist
	 * per application, ensuring consistent HST state and registry access.
	 * Subsequent constructor calls return this instance instead of creating new ones.
	 * @internal
	 */
	static _root: Stonecrop

	/** The HST store instance for reactive state management */
	private hstStore!: HSTNode
	private _operationLogStore?: ReturnType<typeof useOperationLogStore>
	private _operationLogConfig?: Partial<OperationLogConfig>
	private _client?: DataClient

	/** The registry instance containing all doctype definitions */
	readonly registry!: Registry

	/**
	 * Creates a new Stonecrop instance with HST integration (singleton pattern)
	 * @param registry - The Registry instance containing doctype definitions
	 * @param operationLogConfig - Optional configuration for the operation log
	 * @param options - Options including the data client (can be set later via setClient)
	 */
	constructor(registry: Registry, operationLogConfig?: Partial<OperationLogConfig>, options?: StonecropOptions) {
		if (Stonecrop._root) {
			return Stonecrop._root
		}
		Stonecrop._root = this

		this.registry = registry

		// Store config for lazy initialization
		this._operationLogConfig = operationLogConfig

		// Store data client (can be set later via setClient)
		this._client = options?.client

		// Initialize HST store with auto-sync to Registry
		this.initializeHSTStore()
		this.setupRegistrySync()
	}

	/**
	 * Set the data client for fetching doctype metadata and records.
	 * Use this for deferred configuration in Nuxt/Vue plugin setups.
	 *
	 * @param client - DataClient implementation (e.g., StonecropClient from \@stonecrop/graphql-client)
	 *
	 * @example
	 * ```ts
	 * const { setClient } = useStonecropRegistry()
	 * const client = new StonecropClient({ endpoint: '/graphql' })
	 * setClient(client)
	 * ```
	 */
	setClient(client: DataClient): void {
		this._client = client
	}

	/**
	 * Get the current data client
	 * @returns The DataClient instance or undefined if not set
	 */
	getClient(): DataClient | undefined {
		return this._client
	}

	/**
	 * Get the operation log store (lazy initialization)
	 * @internal
	 */
	getOperationLogStore() {
		if (!this._operationLogStore) {
			this._operationLogStore = useOperationLogStore()
			if (this._operationLogConfig) {
				this._operationLogStore.configure(this._operationLogConfig)
			}
		}
		return this._operationLogStore
	}

	/**
	 * Initialize the HST store structure
	 */
	private initializeHSTStore(): void {
		const initialStoreStructure: Record<string, any> = {}

		// Auto-populate from existing Registry doctypes
		Object.keys(this.registry.registry).forEach(doctypeSlug => {
			initialStoreStructure[doctypeSlug] = {}
		})

		// Wrap the store in Vue's reactive() for automatic change detection
		// This enables Vue computed properties to track HST store changes
		this.hstStore = createHST(reactive(initialStoreStructure), 'StonecropStore')
	}

	/**
	 * Setup automatic sync with Registry when doctypes are added
	 */
	private setupRegistrySync(): void {
		// Extend Registry.addDoctype to auto-create HST store sections
		const originalAddDoctype = this.registry.addDoctype.bind(this.registry)

		this.registry.addDoctype = (doctype: Doctype) => {
			// Call original method
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			originalAddDoctype(doctype)

			// Auto-create HST store section for new doctype
			if (!this.hstStore.has(doctype.slug)) {
				this.hstStore.set(doctype.slug, {})
			}
		}
	}

	/**
	 * Get records hash for a doctype
	 * @param doctype - The doctype to get records for
	 * @returns HST node containing records hash
	 */
	records(doctype: string | Doctype): HSTNode {
		const slug = typeof doctype === 'string' ? doctype : doctype.slug
		this.ensureDoctypeExists(slug)
		return this.hstStore.getNode(slug)
	}

	/**
	 * Add a record to the store
	 * @param doctype - The doctype
	 * @param recordId - The record ID
	 * @param recordData - The record data
	 */
	addRecord(doctype: string | Doctype, recordId: string, recordData: any): void {
		const slug = typeof doctype === 'string' ? doctype : doctype.slug

		this.ensureDoctypeExists(slug)

		// Store raw record data - let HST handle wrapping with proper hierarchy
		this.hstStore.set(`${slug}.${recordId}`, recordData)
	}

	/**
	 * Get a specific record
	 * @param doctype - The doctype
	 * @param recordId - The record ID
	 * @returns HST node for the record or undefined
	 */
	getRecordById(doctype: string | Doctype, recordId: string): HSTNode | undefined {
		const slug = typeof doctype === 'string' ? doctype : doctype.slug
		this.ensureDoctypeExists(slug)

		// First check if the record exists
		const recordExists = this.hstStore.has(`${slug}.${recordId}`)
		if (!recordExists) {
			return undefined
		}

		// Check if the actual value is undefined (i.e., record was removed)
		const recordValue = this.hstStore.get(`${slug}.${recordId}`)
		if (recordValue === undefined) {
			return undefined
		}

		// Use getNode to get the properly wrapped HST node with correct parent relationships
		return this.hstStore.getNode(`${slug}.${recordId}`)
	}

	/**
	 * Remove a record from the store
	 * @param doctype - The doctype
	 * @param recordId - The record ID
	 */
	removeRecord(doctype: string | Doctype, recordId: string): void {
		const slug = typeof doctype === 'string' ? doctype : doctype.slug
		this.ensureDoctypeExists(slug)

		// Remove the specific record directly by setting to undefined
		if (this.hstStore.has(`${slug}.${recordId}`)) {
			this.hstStore.set(`${slug}.${recordId}`, undefined)
		}
	}

	/**
	 * Get all record IDs for a doctype
	 * @param doctype - The doctype
	 * @returns Array of record IDs
	 */
	getRecordIds(doctype: string | Doctype): string[] {
		const slug = typeof doctype === 'string' ? doctype : doctype.slug
		this.ensureDoctypeExists(slug)

		const doctypeNode = this.hstStore.get(slug) as Record<string, any>
		if (!doctypeNode || typeof doctypeNode !== 'object') {
			return []
		}

		return Object.keys(doctypeNode).filter(key => doctypeNode[key] !== undefined)
	}

	/**
	 * Clear all records for a doctype
	 * @param doctype - The doctype
	 */
	clearRecords(doctype: string | Doctype): void {
		const slug = typeof doctype === 'string' ? doctype : doctype.slug
		this.ensureDoctypeExists(slug)

		// Get all record IDs and remove them
		const recordIds = this.getRecordIds(slug)
		recordIds.forEach(recordId => {
			this.hstStore.set(`${slug}.${recordId}`, undefined)
		})
	}

	/**
	 * Setup method for doctype initialization
	 * @param doctype - The doctype to setup
	 */
	setup(doctype: Doctype): void {
		// Ensure doctype exists in store
		this.ensureDoctypeExists(doctype.slug)
	}

	/**
	 * Run action on doctype
	 * Executes the action and logs it to the operation log for audit tracking
	 * @param doctype - The doctype
	 * @param action - The action to run
	 * @param args - Action arguments (typically record IDs)
	 */
	runAction(doctype: Doctype, action: string, args?: string[]): void {
		const registry = this.registry.registry[doctype.slug]
		const actions = registry?.actions?.get(action)
		const recordIds = Array.isArray(args) ? args.filter((arg): arg is string => typeof arg === 'string') : undefined

		// Log action execution start
		const opLogStore = this.getOperationLogStore()
		let actionResult: 'success' | 'failure' | 'pending' = 'success'
		let actionError: string | undefined

		try {
			// Execute action functions
			if (actions && actions.length > 0) {
				const engine = getGlobalTriggerEngine()
				actions.forEach(actionStr => {
					try {
						const actionFn = engine.getAction(actionStr)
						if (!actionFn) throw new Error(`Action "${actionStr}" is not registered in FieldTriggerEngine`)
						const context = {
							path: `${doctype.slug}.${recordIds?.[0] ?? ''}`,
							fieldname: action,
							beforeValue: undefined,
							afterValue: args,
							operation: 'set',
							doctype: doctype.doctype,
							recordId: recordIds?.[0],
							timestamp: new Date(),
						} as FieldChangeContext
						void actionFn(context)
					} catch (error) {
						actionResult = 'failure'
						actionError = error instanceof Error ? error.message : 'Unknown error'
						throw error
					}
				})
			}
		} catch {
			// Error already set in inner catch
		} finally {
			// Log the action execution to operation log
			opLogStore.logAction(doctype.doctype, action, recordIds, actionResult, actionError)
		}
	}

	/**
	 * Get records from server using the configured data client.
	 * @param doctype - The doctype
	 * @throws Error if no data client has been configured
	 */
	async getRecords(doctype: Doctype): Promise<void> {
		if (!this._client) {
			throw new Error(
				'No data client configured. Call setClient() with a DataClient implementation ' +
					'(e.g., StonecropClient from @stonecrop/graphql-client) before fetching records.'
			)
		}

		const records = await this._client.getRecords(doctype)

		// Store each record in HST
		records.forEach(record => {
			if (record.id) {
				this.addRecord(doctype, record.id as string, record)
			}
		})
	}

	/**
	 * Get single record from server using the configured data client.
	 * @param doctype - The doctype
	 * @param recordId - The record ID
	 * @throws Error if no data client has been configured
	 */
	async getRecord(doctype: Doctype, recordId: string): Promise<void> {
		if (!this._client) {
			throw new Error(
				'No data client configured. Call setClient() with a DataClient implementation ' +
					'(e.g., StonecropClient from @stonecrop/graphql-client) before fetching records.'
			)
		}

		const record = await this._client.getRecord(doctype, recordId)

		if (record) {
			this.addRecord(doctype, recordId, record)
		}
	}

	/**
	 * Dispatch an action to the server via the configured data client.
	 * All state changes flow through this single mutation endpoint.
	 *
	 * @param doctype - The doctype
	 * @param action - Action name to execute (e.g., 'SUBMIT', 'APPROVE', 'save')
	 * @param args - Action arguments (typically record ID and/or form data)
	 * @returns Action result with success status, response data, and any error
	 * @throws Error if no data client has been configured
	 */
	async dispatchAction(
		doctype: Doctype,
		action: string,
		args?: unknown[]
	): Promise<{ success: boolean; data: unknown; error: string | null }> {
		if (!this._client) {
			throw new Error(
				'No data client configured. Call setClient() with a DataClient implementation ' +
					'(e.g., StonecropClient from @stonecrop/graphql-client) before dispatching actions.'
			)
		}

		return this._client.runAction(doctype, action, args)
	}

	/**
	 * Ensure doctype section exists in HST store
	 * @param slug - The doctype slug
	 */
	private ensureDoctypeExists(slug: string): void {
		if (!this.hstStore.has(slug)) {
			this.hstStore.set(slug, {})
		}
	}

	/**
	 * Get doctype metadata from the registry
	 * @param context - The route context
	 * @returns The doctype metadata
	 */
	async getMeta(context: RouteContext): Promise<any> {
		if (!this.registry.getMeta) {
			throw new Error('No getMeta function provided to Registry')
		}
		return await this.registry.getMeta(context)
	}

	/**
	 * Get the root HST store node for advanced usage
	 * @returns Root HST node
	 */
	getStore(): HSTNode {
		return this.hstStore
	}

	/**
	 * Determine the current workflow state for a record.
	 *
	 * Reads the record's `status` field from the HST store. If the field is absent or
	 * empty the doctype's declared `workflow.initial` state is used as the fallback,
	 * giving callers a reliable state name without having to duplicate that logic.
	 *
	 * @param doctype - The doctype slug or Doctype instance
	 * @param recordId - The record identifier
	 * @returns The current state name, or an empty string if the doctype has no workflow
	 *
	 * @public
	 */
	getRecordState(doctype: string | Doctype, recordId: string): string {
		const slug = typeof doctype === 'string' ? doctype : doctype.slug
		const meta = this.registry.getDoctype(slug)
		if (!meta?.workflow) return ''

		const record = this.getRecordById(slug, recordId)
		const status = record?.get('status') as string | undefined

		// Handle both XState format and WorkflowMeta format
		const workflow = meta.workflow
		let initialState: string

		if (Array.isArray(workflow.states)) {
			// WorkflowMeta format: states is a string array
			initialState = workflow.states[0] ?? ''
		} else {
			// XState format: states is an object, use initial or first key
			initialState =
				typeof (workflow as { initial?: unknown }).initial === 'string'
					? (workflow as { initial: string }).initial
					: Object.keys(workflow.states ?? {})[0] ?? ''
		}

		return status || initialState
	}

	/**
	 * Collect a record payload with all nested doctype fields from HST
	 * @param doctype - The doctype metadata
	 * @param recordId - The record ID to collect
	 * @returns The complete record payload ready for API submission
	 * @public
	 */
	collectRecordPayload(doctype: Doctype, recordId: string): Record<string, any> {
		const recordPath = `${doctype.slug}.${recordId}`
		const recordData = this.hstStore.get(recordPath) || {}

		const payload: Record<string, any> = { ...recordData }

		// Collect nested data from links
		if (doctype.links) {
			for (const [fieldname, link] of Object.entries(doctype.links)) {
				const fieldPath = `${recordPath}.${fieldname}`
				const isMany = link.cardinality === 'noneOrMany' || link.cardinality === 'atLeastOne'

				if (isMany) {
					const arrayData = this.hstStore.get(fieldPath)
					if (Array.isArray(arrayData)) {
						payload[fieldname] = arrayData
					}
				} else {
					const targetDoctype = this.registry.getDoctype(link.target)
					if (targetDoctype?.links) {
						payload[fieldname] = this.collectNestedData(fieldPath, targetDoctype)
					} else {
						payload[fieldname] = this.hstStore.get(fieldPath) || {}
					}
				}
			}
		}

		return payload
	}

	/**
	 * Scaffold empty child records from defaults for all descendant links.
	 *
	 * Used when opening a new form — no server data, just scaffolded empty rows.
	 * Does not require a data client.
	 *
	 * @param path - HST path where the initialized data should be stored
	 * @param doctype - The doctype to initialize
	 * @param options - Options (includeNested to limit which links are scaffolded)
	 * @public
	 */
	initializeNestedData(path: string, doctype: Doctype, _options?: { includeNested?: boolean | string[] }): void {
		const slug = doctype.slug
		this.ensureDoctypeExists(slug)

		// Resolve schema and initialize with defaults
		const resolvedSchema = this.registry.resolveSchema(doctype)
		const record = this.registry.initializeRecord(resolvedSchema)

		// Ensure the parent path exists in HST before setting child fields
		const existingData = this.hstStore.get(path)
		if (!existingData) {
			this.hstStore.set(path, {}, 'system')
		}

		// Store each field at its own HST path
		for (const [key, value] of Object.entries(record)) {
			this.hstStore.set(`${path}.${key}`, value, 'system')
		}
	}

	/**
	 * Fetch a record and its nested data from the server.
	 *
	 * Calls `_client.getRecord()` with nested sub-selections and stores each scalar field at its own HST path
	 * (`slug.recordId.fieldname`), children at the link-level path (`slug.recordId.linkname`).
	 *
	 * @param path - HST path (e.g., "recipe.r1")
	 * @param doctype - The doctype to fetch
	 * @param recordId - Record ID to fetch
	 * @param options - Query options (includeNested to control which links are fetched)
	 * @throws Error with code `"CLIENT_REQUIRED"` if no data client is configured
	 * @throws Error with code `"RECORD_NOT_FOUND"` if the server returns null
	 * @public
	 */
	async fetchNestedData(
		path: string,
		doctype: Doctype,
		recordId: string,
		options?: { includeNested?: boolean | string[] }
	): Promise<void> {
		if (!this._client) {
			throw createCodedError(
				'No data client configured. Call setClient() with a DataClient implementation ' +
					'(e.g., StonecropClient from @stonecrop/graphql-client) before fetching records.',
				'CLIENT_REQUIRED'
			)
		}

		const record = await this._client.getRecord({ name: doctype.doctype }, recordId, {
			includeNested: options?.includeNested ?? true,
		})

		if (!record) {
			throw createCodedError(`Record not found: ${doctype.doctype} ${recordId}`, 'RECORD_NOT_FOUND')
		}

		// Store each scalar field at its own HST path, children at link-level path
		const slug = doctype.slug
		this.ensureDoctypeExists(slug)

		// Ensure the parent path exists in HST before setting child fields
		const existingData = this.hstStore.get(`${slug}.${recordId}`)
		if (!existingData) {
			this.hstStore.set(`${slug}.${recordId}`, {}, 'system')
		}

		for (const [key, value] of Object.entries(record)) {
			this.hstStore.set(`${slug}.${recordId}.${key}`, value, 'system')
		}
	}

	/**
	 * Recursively collect nested data from HST
	 * @param basePath - The base path in HST (e.g., "customer.123.address")
	 * @param doctype - The doctype whose links drive the recursive traversal
	 * @returns The collected data object
	 */
	private collectNestedData(basePath: string, doctype: Doctype): Record<string, any> {
		const data = this.hstStore.get(basePath) || {}
		const payload: Record<string, any> = { ...data }

		if (!doctype.links) return payload

		for (const [fieldname, link] of Object.entries(doctype.links)) {
			const fieldPath = `${basePath}.${fieldname}`
			const isMany = link.cardinality === 'noneOrMany' || link.cardinality === 'atLeastOne'

			if (isMany) {
				const arrayData = this.hstStore.get(fieldPath)
				if (Array.isArray(arrayData)) {
					payload[fieldname] = arrayData
				}
			} else {
				const targetDoctype = this.registry.getDoctype(link.target)
				if (targetDoctype?.links) {
					payload[fieldname] = this.collectNestedData(fieldPath, targetDoctype)
				} else {
					payload[fieldname] = this.hstStore.get(fieldPath) || {}
				}
			}
		}

		return payload
	}
}

/**
 * Returns the global Stonecrop singleton instance, or `undefined` if no
 * instance has been created yet.
 *
 * Use this when you need the Stonecrop instance outside a Vue component
 * context (e.g., in workflow action handlers, plugin setup code, or
 * non-component utilities). Inside a component, prefer `useStonecrop()`.
 *
 * @public
 */
export function getStonecrop(): Stonecrop | undefined {
	return Stonecrop._root
}

/**
 * Create an Error with a `code` property for programmatic error handling.
 * @internal
 */
interface CodedError extends Error {
	code: string
}

function createCodedError(message: string, code: string): CodedError {
	const error = new Error(message) as CodedError
	error.code = code
	return error
}
