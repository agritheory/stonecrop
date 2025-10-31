import { createActor, createMachine } from 'xstate'

import DoctypeMeta from './doctype'
import { NotImplementedError } from './exceptions'
import Registry from './registry'
import { useDataStore } from './stores/data'

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
	 * @param registry - The immutable registry
	 * @param store - The mutable Pinia store
	 * @returns The Stonecrop instance with the given registry and store. If a Stonecrop instance has already been created, it returns the existing instance instead of creating a new one.
	 * @example
	 * ```ts
	 * const registry = new Registry()
	 * const store = useDataStore()
	 * const stonecrop = new Stonecrop(registry, store)
	 * ```
	 */
	constructor(registry: Registry, store: ReturnType<typeof useDataStore>) {
		if (Stonecrop._root) {
			return Stonecrop._root
		}
		Stonecrop._root = this
		this.registry = registry
		this.store = store
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
		void this.getMeta(doctype.doctype)
	}

	/**
	 * Gets the meta for the given doctype
	 * @param doctype - The doctype to get meta for
	 * @returns The meta for the given doctype
	 * @throws `NotImplementedError` if the `getMeta` function is not implemented for the doctype in the registry
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * const meta = stonecrop.getMeta(doctype)
	 * ```
	 * @see {@link DoctypeMeta}
	 */
	async getMeta(doctype: string): Promise<DoctypeMeta> | never {
		if (!this.registry.getMeta) {
			throw new NotImplementedError(`getMeta function is not implemented for ${doctype} in the registry`)
		}
		return await this.registry.getMeta(doctype)
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
	 * stonecrop.runAction(doctype, 'create')
	 * ```
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.runAction(doctype, 'update', ['TASK-00001'])
	 * ```
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.runAction(doctype, 'delete', ['TASK-00001'])
	 * ```
	 * @example
	 * ```ts
	 * const doctype = await registry.getMeta('Task')
	 * stonecrop.runAction(doctype, 'merge', ['TASK-00001', 'TASK-00002'])
	 * ```
	 */
	runAction(doctype: DoctypeMeta, action: string, id?: string[]): void {
		const registry = this.registry.registry[doctype.slug]
		const actions = registry.actions?.get(action)
		const workflow = registry.workflow

		// trigger the action on the state machine
		if (workflow) {
			const machine = createMachine(workflow)
			const actor = createActor(machine)

			// TODO: this shouldn't spawn an actor at the initial state always; look into persistence
			actor.start()
			actor.send({ type: action, id })

			// run actions after state machine transition
			// TODO: should this happen with or without the workflow?
			if (actions && actions.length > 0) {
				actions.forEach(action => {
					// TODO: Replace Function constructor with a safer action execution mechanism
					// This is currently flagged as a security risk (implied eval)
					// Consider using a registry of pre-defined action functions instead
					// eslint-disable-next-line @typescript-eslint/no-implied-eval
					const actionFn = new Function(action)
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					actionFn(id)
				})
			}
		}
	}
}
