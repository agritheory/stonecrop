import DoctypeMeta from './doctype'
import { NotImplementedError } from './exceptions'
import Registry from './registry'
import { useDataStore } from './stores/data'
import type { ImmutableDoctype, Schema } from './types'

/**
 * Stonecrop class
 * @public
 */
export class Stonecrop {
	/**
	 * The root Stonecrop instance
	 */
	static _root: Stonecrop

	/**
	 * The name of the Stonecrop instance
	 * @readonly
	 *
	 * @defaultValue 'Stonecrop'
	 */
	readonly name = 'Stonecrop'

	/**
	 * The registry is an immutable collection of doctypes
	 * @example
	 * ```ts
	 * {
	 * 	'task': {
	 * 		doctype: 'Task',
	 * 		schema: {
	 * 			title: 'string',
	 * 			description: 'string',
	 * 			...
	 * 		}
	 * 	},
	 * 	...
	 * }
	 * ```
	 * @see {@link Registry}
	 * @see {@link DoctypeMeta}
	 */
	readonly registry: Registry

	/**
	 * The Pinia store that manages the mutable records
	 */
	store: ReturnType<typeof useDataStore>

	/**
	 * schema - The Stonecrop schema; the schema is a subset of the registry
	 * @example
	 * ```ts
	 * {
	 * 	doctype: 'Task',
	 * 	schema: {
	 * 		title: 'string',
	 * 		description: 'string',
	 * 		...
	 * 	}
	 * }
	 * ```
	 * @see {@link Registry}
	 * @see {@link DoctypeMeta}
	 * @see {@link DoctypeMeta.schema}
	 */
	schema?: Schema

	/**
	 * The workflow is a subset of the registry
	 */
	workflow?: ImmutableDoctype['workflow']

	/**
	 * The actions are a subset of the registry
	 */
	actions?: ImmutableDoctype['actions']

	/**
	 * @param registry - The immutable registry
	 * @param store - The mutable Pinia store
	 * @param schema - The Stonecrop schema
	 * @param workflow - The Stonecrop workflow
	 * @param actions - The Stonecrop actions
	 * @returns The Stonecrop instance with the given registry, store, schema, workflow, and actions. If a Stonecrop instance has already been created, it returns the existing instance instead of creating a new one.
	 * @example
	 * ```ts
	 * const registry = new Registry()
	 * const store = useDataStore()
	 * const stonecrop = new Stonecrop(registry, store)
	 * ```
	 */
	constructor(
		registry: Registry,
		store: ReturnType<typeof useDataStore>,
		schema?: Schema,
		workflow?: ImmutableDoctype['workflow'],
		actions?: ImmutableDoctype['actions']
	) {
		if (Stonecrop._root) {
			return Stonecrop._root
		}
		Stonecrop._root = this
		this.registry = registry
		this.store = store
		this.schema = schema // new Registry(schema)
		this.workflow = workflow
		this.actions = actions
	}

	/**
	 * Sets up the Stonecrop instance with the given doctype
	 * @param doctype - The doctype to setup
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.setup(doctype)
	 * ```
	 */
	setup(doctype: DoctypeMeta): void {
		void this.getMeta(doctype)
		this.getWorkflow(doctype)
		this.getActions(doctype)
	}

	/**
	 * Gets the meta for the given doctype
	 * @param doctype - The doctype to get meta for
	 * @returns The meta for the given doctype
	 * @throws NotImplementedError
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * const meta = stonecrop.getMeta(doctype)
	 * ```
	 * @see {@link DoctypeMeta}
	 */
	getMeta(doctype: DoctypeMeta): DoctypeMeta | Promise<DoctypeMeta> | never {
		return this.registry.getMeta ? this.registry.getMeta(doctype.doctype) : new NotImplementedError(doctype.doctype)
	}

	/**
	 * Gets the workflow for the given doctype
	 * @param doctype - The doctype to get workflow for
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.getWorkflow(doctype)
	 * ```
	 */
	getWorkflow(doctype: DoctypeMeta): void {
		const doctypeRegistry = this.registry.registry[doctype.slug]
		this.workflow = doctypeRegistry.workflow
	}

	/**
	 * Gets the actions for the given doctype
	 * @param doctype - The doctype to get actions for
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.getActions(doctype)
	 * ```
	 */
	getActions(doctype: DoctypeMeta): void {
		const doctypeRegistry = this.registry.registry[doctype.slug]
		this.actions = doctypeRegistry.actions
	}

	/**
	 * Gets the records for the given doctype
	 * @param doctype - The doctype to get records for
	 * @param filters - The filters to apply to the records
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * await stonecrop.getRecords(doctype)
	 * ```
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * const filters = JSON.stringify({ status: 'Open' })
	 * await stonecrop.getRecords(doctype, { body: filters })
	 * ```
	 */
	async getRecords(doctype: DoctypeMeta, filters?: RequestInit): Promise<void> {
		this.store.$patch({ records: [] })
		const records = await fetch(`/${doctype.slug}`, filters)
		const data: Record<string, any>[] = await records.json()
		this.store.$patch({ records: data })
	}

	/**
	 * Gets the record for the given doctype and id
	 * @param doctype - The doctype to get record for
	 * @param id - The id of the record to get
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * await stonecrop.getRecord(doctype, 'TASK-00001')
	 * ```
	 */
	async getRecord(doctype: DoctypeMeta, id: string): Promise<void> {
		this.store.$patch({ record: {} })
		const record = await fetch(`/${doctype.slug}/${id}`)
		const data: Record<string, any> = await record.json()
		this.store.$patch({ record: data })
	}

	/**
	 * Runs the action for the given doctype and id
	 * @param doctype - The doctype to run action for
	 * @param action - The action to run
	 * @param id - The id(s) of the record(s) to run action on
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.runAction(doctype, 'CREATE')
	 * ```
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.runAction(doctype, 'UPDATE', ['TASK-00001'])
	 * ```
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.runAction(doctype, 'DELETE', ['TASK-00001'])
	 * ```
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.runAction(doctype, 'TRANSITION', ['TASK-00001', 'TASK-00002'])
	 * ```
	 */
	runAction(doctype: DoctypeMeta, action: string, id?: string[]): void {
		const doctypeRegistry = this.registry.registry[doctype.slug]
		const actions = doctypeRegistry.actions?.get(action)

		// trigger the action on the state machine
		if (this.workflow) {
			const { initialState } = this.workflow
			this.workflow.transition(initialState, { type: action })

			// run actions after state machine transition
			// TODO: should this happen with or without the workflow?
			if (actions && actions.length > 0) {
				actions.forEach(action => {
					// eslint-disable-next-line @typescript-eslint/no-implied-eval
					const actionFn = new Function(action)
					actionFn(id)
				})
			}
		}
	}
}
