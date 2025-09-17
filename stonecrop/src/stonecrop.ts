import { reactive } from 'vue'
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
			initialStoreStructure[doctypeSlug] = {
				records: {},
				currentRecord: null,
			}
		})

		// Make the store structure reactive so Vue can track changes
		const reactiveStore = reactive(initialStoreStructure)
		this.hstStore = createHST(reactiveStore, 'StonecropStore')
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
				this.hstStore.set(
					doctype.slug,
					reactive({
						records: {},
						currentRecord: null,
					})
				)
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
		return this.hstStore.getNode(`${slug}.records`)
	}

	/**
	 * Get current record for a doctype
	 * @param doctype - The doctype to get current record for
	 * @returns Current HST node or null
	 */
	currentRecord(doctype: string | DoctypeMeta): HSTNode | null {
		const slug = typeof doctype === 'string' ? doctype : doctype.slug
		this.ensureDoctypeExists(slug)
		const currentRecordId = this.hstStore.get(`${slug}.currentRecord`)
		if (currentRecordId && typeof currentRecordId === 'string') {
			return this.getRecordById(doctype, currentRecordId) || null
		}
		return null
	}

	/**
	 * Set current record for a doctype
	 * @param doctype - The doctype
	 * @param recordId - The record ID to set as current
	 */
	setCurrentRecord(doctype: string | DoctypeMeta, recordId: string): void {
		const slug = typeof doctype === 'string' ? doctype : doctype.slug
		this.ensureDoctypeExists(slug)

		// Just store the record ID, not the record data itself
		this.hstStore.set(`${slug}.currentRecord`, recordId)
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
		this.hstStore.set(`${slug}.records.${recordId}`, recordData)
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
		const recordExists = this.hstStore.has(`${slug}.records.${recordId}`)
		if (!recordExists) {
			return undefined
		}

		// Use getNode to get the properly wrapped HST node with correct parent relationships
		return this.hstStore.getNode(`${slug}.records.${recordId}`)
	}

	/**
	 * Remove a record from the store
	 * @param doctype - The doctype
	 * @param recordId - The record ID
	 */
	removeRecord(doctype: string | DoctypeMeta, recordId: string): void {
		const slug = typeof doctype === 'string' ? doctype : doctype.slug
		this.ensureDoctypeExists(slug)

		// If removing current record, clear it
		const currentRecord = this.currentRecord(slug)
		if (currentRecord && currentRecord.get('id') === recordId) {
			this.hstStore.set(`${slug}.currentRecord`, null)
		}

		// Get current records and remove the specific record
		const records = this.hstStore.get(`${slug}.records`) || {}
		delete records[recordId]
		this.hstStore.set(`${slug}.records`, records)
	}

	/**
	 * Get all record IDs for a doctype
	 * @param doctype - The doctype
	 * @returns Array of record IDs
	 */
	getRecordIds(doctype: string | DoctypeMeta): string[] {
		const slug = typeof doctype === 'string' ? doctype : doctype.slug
		this.ensureDoctypeExists(slug)

		const records = this.hstStore.get(`${slug}.records`)
		return Object.keys(records || {}).filter(key => records[key] !== undefined)
	}

	/**
	 * Clear all records for a doctype
	 * @param doctype - The doctype
	 */
	clearRecords(doctype: string | DoctypeMeta): void {
		const slug = typeof doctype === 'string' ? doctype : doctype.slug
		this.ensureDoctypeExists(slug)

		this.hstStore.set(`${slug}.records`, {})
		this.hstStore.set(`${slug}.currentRecord`, null)
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

		// Store record and set as current
		this.addRecord(doctype, recordId, record)
		this.setCurrentRecord(doctype, recordId)
	}

	/**
	 * Ensure doctype section exists in HST store
	 * @param slug - The doctype slug
	 */
	private ensureDoctypeExists(slug: string): void {
		if (!this.hstStore.has(slug)) {
			this.hstStore.set(slug, {
				records: {},
				currentRecord: null,
			})
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
