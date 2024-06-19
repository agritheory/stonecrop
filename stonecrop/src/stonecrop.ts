import type { ImmutableDoctype, Schema } from './types/index'
import DoctypeMeta from './doctype'
import { NotImplementedError } from './exceptions'
import Registry from './registry'
import { useDataStore } from './stores/data'

export class Stonecrop {
	/**
	 * @property {Stonecrop} _root
	 * @description The root Stonecrop instance
	 */
	static _root: Stonecrop

	/**
	 * @property {string} name
	 * @description The name of the Stonecrop instance
	 * @example
	 * 'Stonecrop'
	 */
	readonly name = 'Stonecrop'

	/**
	 * @property {Registry} registry
	 * @description The registry is an immutable collection of doctypes
	 * @example
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
	 * @see {@link Registry}
	 * @see {@link DoctypeMeta}
	 */
	readonly registry: Registry

	/**
	 * @property {Schema} schema - The Stonecrop schema
	 * @description The schema is a subset of the registry
	 * @example
	 * {
	 * 	doctype: 'Task',
	 * 	schema: {
	 * 		title: 'string',
	 * 		description: 'string',
	 * 		...
	 * 	}
	 * }
	 * @see {@link Registry}
	 * @see {@link DoctypeMeta}
	 * @see {@link DoctypeMeta.schema}
	 */
	schema: Schema

	/**
	 * @property {ImmutableDoctype['workflow']} workflow
	 * @description The workflow is a subset of the registry
	 */
	workflow: ImmutableDoctype['workflow']

	/**
	 * @property {ImmutableDoctype['actions']} actions
	 * @description The actions are a subset of the registry
	 */
	actions: ImmutableDoctype['actions']

	/**
	 * @property {ReturnType<typeof useDataStore>} store
	 * @description The Pinia store that manages the mutable records
	 */
	store: ReturnType<typeof useDataStore>

	/**
	 * @constructor
	 * @param {Registry} registry - The immutable registry
	 * @param {ReturnType<typeof useDataStore>} store - The mutable Pinia store
	 * @param {Schema} [schema] - (optional) The Stonecrop schema
	 * @param {ImmutableDoctype['workflow']} [workflow] - (optional) The Stonecrop workflow
	 * @param {ImmutableDoctype['actions']} [actions] - (optional) The Stonecrop actions
	 * @returns {Stonecrop} The Stonecrop instance
	 * @description The Stonecrop constructor initializes a new Stonecrop instance with the given registry, store, schema, workflow, and actions. If a Stonecrop instance has already been created, it returns the existing instance instead of creating a new one.
	 * @example
	 * const registry = new Registry()
	 * const store = useDataStore()
	 * const stonecrop = new Stonecrop(registry, store, schema, workflow, actions)
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
	 * @method setup
	 * @param {DoctypeMeta} doctype - The doctype to setup
	 * @returns {void}
	 * @description Sets up the Stonecrop instance with the given doctype
	 * @example
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.setup(doctype)
	 */
	setup(doctype: DoctypeMeta): void {
		this.getMeta(doctype)
		this.getWorkflow(doctype)
		this.getActions(doctype)
	}

	/**
	 * @method getMeta
	 * @param {DoctypeMeta} doctype - The doctype to get meta for
	 * @returns {DoctypeMeta}
	 * @see {@link DoctypeMeta}
	 * @throws NotImplementedError
	 * @description Gets the meta for the given doctype
	 * @example
	 * const doctype = await registry.getMeta('Task')
	 * const meta = stonecrop.getMeta(doctype)
	 */
	getMeta(doctype: DoctypeMeta): DoctypeMeta | Promise<DoctypeMeta> | never {
		return this.registry.getMeta ? this.registry.getMeta(doctype.doctype) : new NotImplementedError(doctype.doctype)
	}

	/**
	 * @method getWorkflow
	 * @param {DoctypeMeta} doctype - The doctype to get workflow for
	 * @returns {void}
	 * @description Gets the workflow for the given doctype
	 * @example
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.getWorkflow(doctype)
	 */
	getWorkflow(doctype: DoctypeMeta): void {
		const doctypeRegistry = this.registry.registry[doctype.slug]
		this.workflow = doctypeRegistry.workflow
	}

	/**
	 * @method getActions
	 * @param {DoctypeMeta} doctype - The doctype to get actions for
	 * @returns {void}
	 * @description Gets the actions for the given doctype
	 * @example
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.getActions(doctype)
	 */
	getActions(doctype: DoctypeMeta): void {
		const doctypeRegistry = this.registry.registry[doctype.slug]
		this.actions = doctypeRegistry.actions
	}

	/**
	 * @method getRecords
	 * @param {DoctypeMeta} doctype - The doctype to get records for
	 * @param {RequestInit} [filters] - The filters to apply to the records
	 * @returns {Promise<void>}
	 * @description Gets the records for the given doctype
	 * @example
	 * const doctype = await registry.getMeta('Task')
	 * await stonecrop.getRecords(doctype)
	 * @example
	 * const doctype = await registry.getMeta('Task')
	 * const filters = JSON.stringify({ status: 'Open' })
	 * await stonecrop.getRecords(doctype, { body: filters })
	 */
	async getRecords(doctype: DoctypeMeta, filters?: RequestInit): Promise<void> {
		this.store.$patch({ records: [] })
		const records = await fetch(`/${doctype.slug}`, filters)
		const data: Record<string, any>[] = await records.json()
		this.store.$patch({ records: data })
	}

	/**
	 * @method getRecord
	 * @param {DoctypeMeta} doctype - The doctype to get record for
	 * @param {string} id - The id of the record to get
	 * @returns {Promise<void>}
	 * @description Gets the record for the given doctype and id
	 * @example
	 * const doctype = await registry.getMeta('Task')
	 * await stonecrop.getRecord(doctype, 'TASK-00001')
	 */
	async getRecord(doctype: DoctypeMeta, id: string): Promise<void> {
		this.store.$patch({ record: {} })
		const record = await fetch(`/${doctype.slug}/${id}`)
		const data: Record<string, any> = await record.json()
		this.store.$patch({ record: data })
	}

	/**
	 * @method runAction
	 * @param {DoctypeMeta} doctype - The doctype to run action for
	 * @param {string} action - The action to run
	 * @param {string[]} [id] - The id(s) of the record(s) to run action on
	 * @returns {void}
	 * @description Runs the action for the given doctype and id
	 * @example
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.runAction(doctype, 'CREATE')
	 * @example
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.runAction(doctype, 'UPDATE', ['TASK-00001'])
	 * @example
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.runAction(doctype, 'DELETE', ['TASK-00001'])
	 * @example
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.runAction(doctype, 'TRANSITION', ['TASK-00001', 'TASK-00002'])
	 */
	runAction(doctype: DoctypeMeta, action: string, id?: string[]): void {
		const doctypeRegistry = this.registry.registry[doctype.slug]
		const actions = doctypeRegistry.actions.get(action)

		// trigger the action on the state machine
		const { initialState } = this.workflow
		this.workflow.transition(initialState, { type: action })

		// run actions after state machine transition
		if (actions.length > 0) {
			actions.forEach(action => {
				// eslint-disable-next-line @typescript-eslint/no-implied-eval
				const actionFn = new Function(action)
				actionFn(id)
			})
		}
	}
}
