import DoctypeMeta from './doctype'
import Registry from './registry'
import { createHST, type HSTNode } from './stores/hst'
import { useOperationLogStore } from './stores/operation-log'
import type { OperationLogConfig } from './types/operation-log'
import type { RouteContext } from './types/registry'

/**
 * Main Stonecrop class with HST integration and built-in Operation Log
 * @public
 */
export class Stonecrop {
	private hstStore: HSTNode
	private _operationLogStore?: ReturnType<typeof useOperationLogStore>
	private _operationLogConfig?: Partial<OperationLogConfig>

	/** The registry instance containing all doctype definitions */
	readonly registry: Registry

	/**
	 * Creates a new Stonecrop instance with HST integration
	 * @param registry - The Registry instance containing doctype definitions
	 * @param operationLogConfig - Optional configuration for the operation log
	 */
	constructor(registry: Registry, operationLogConfig?: Partial<OperationLogConfig>) {
		this.registry = registry

		// Store config for lazy initialization
		this._operationLogConfig = operationLogConfig

		// Initialize HST store with auto-sync to Registry
		this.initializeHSTStore()
		this.setupRegistrySync()
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

		this.hstStore = createHST(initialStoreStructure, 'StonecropStore')
	}

	/**
	 * Setup automatic sync with Registry when doctypes are added
	 */
	private setupRegistrySync(): void {
		// Extend Registry.addDoctype to auto-create HST store sections
		const originalAddDoctype = this.registry.addDoctype.bind(this.registry)

		this.registry.addDoctype = (doctype: DoctypeMeta) => {
			// Call original method
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
	records(doctype: string | DoctypeMeta): HSTNode {
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
	addRecord(doctype: string | DoctypeMeta, recordId: string, recordData: any): void {
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
	getRecordById(doctype: string | DoctypeMeta, recordId: string): HSTNode | undefined {
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
	removeRecord(doctype: string | DoctypeMeta, recordId: string): void {
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
	getRecordIds(doctype: string | DoctypeMeta): string[] {
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
	clearRecords(doctype: string | DoctypeMeta): void {
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
	setup(doctype: DoctypeMeta): void {
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
	runAction(doctype: DoctypeMeta, action: string, args?: any[]): void {
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
				actions.forEach(actionStr => {
					try {
						// eslint-disable-next-line @typescript-eslint/no-implied-eval
						const actionFn = new Function('args', actionStr)
						actionFn(args)
					} catch (error) {
						actionResult = 'failure'
						actionError = error instanceof Error ? error.message : 'Unknown error'
						throw error
					}
				})
			}
		} catch (error) {
			// Error already set in inner catch
		} finally {
			// Log the action execution to operation log
			opLogStore.logAction(doctype.doctype, action, recordIds, actionResult, actionError)
		}
	}

	/**
	 * Get records from server (maintains compatibility)
	 * @param doctype - The doctype
	 */
	async getRecords(doctype: DoctypeMeta): Promise<void> {
		const response = await fetch(`/${doctype.slug}`)
		const records = await response.json()

		// Store each record in HST
		records.forEach((record: any) => {
			if (record.id) {
				this.addRecord(doctype, record.id, record)
			}
		})
	}

	/**
	 * Get single record from server (maintains compatibility)
	 * @param doctype - The doctype
	 * @param recordId - The record ID
	 */
	async getRecord(doctype: DoctypeMeta, recordId: string): Promise<void> {
		const response = await fetch(`/${doctype.slug}/${recordId}`)
		const record = await response.json()

		// Store record
		this.addRecord(doctype, recordId, record)
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
}
