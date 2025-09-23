import Registry from './registry'
import DoctypeMeta from './doctype'
import { createHST, type HSTNode } from './stores/hst'

/**
 * Main Stonecrop class with HST integration
 * @public
 */
export class Stonecrop {
	private hstStore: HSTNode
	readonly registry: Registry

	constructor(registry: Registry) {
		this.registry = registry

		// Initialize HST store with auto-sync to Registry
		this.initializeHSTStore()
		this.setupRegistrySync()
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

		// Additional setup logic can go here
		// This method maintains compatibility with existing code
	}

	/**
	 * Run action on doctype (maintains compatibility)
	 * @param _doctype - The doctype
	 * @param _action - The action to run
	 * @param _args - Action arguments
	 */
	runAction(_doctype: DoctypeMeta, _action: string, _args?: any[]): void {
		// Existing action logic would go here
		// This maintains compatibility with existing composable usage
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
	 * Get the root HST store node for advanced usage
	 * @returns Root HST node
	 */
	getStore(): HSTNode {
		return this.hstStore
	}
}
