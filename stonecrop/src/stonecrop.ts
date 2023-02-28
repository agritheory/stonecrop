import type { ImmutableDoctype, Schema } from 'types/index'
import Doctype from './doctype'
import Registry from './registry'
import { useDataStore } from './stores/data'

export class Stonecrop {
	static _root: Stonecrop
	readonly name = 'Stonecrop'
	readonly registry: Registry

	schema: Schema
	workflow: ImmutableDoctype['workflow']
	actions: ImmutableDoctype['actions']
	store: ReturnType<typeof useDataStore>

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

	setup(doctype: Doctype) {
		this.getMeta(doctype)
		this.getWorkflow(doctype)
		this.getActions(doctype)
	}

	getMeta(doctype: Doctype) {
		this.schema = { doctype: doctype.doctype, schema: doctype.schema }
	}

	getWorkflow(doctype: Doctype) {
		const doctypeRegistry = this.registry.registry[doctype.slug]
		this.workflow = doctypeRegistry.workflow
	}

	getActions(doctype: Doctype) {
		const doctypeRegistry = this.registry.registry[doctype.slug]
		this.actions = doctypeRegistry.actions
	}

	async getRecords(doctype: Doctype, filters?: RequestInit) {
		this.store.$patch({ records: [] })
		const records = await fetch(`/${doctype.slug}`, filters)
		const data: Record<string, any>[] = await records.json()
		this.store.$patch({ records: data })
	}

	async getRecord(doctype: Doctype, id: string) {
		this.store.$patch({ record: {} })
		const record = await fetch(`/${doctype.slug}/${id}`)
		const data: Record<string, any> = await record.json()
		this.store.$patch({ record: data })
	}

	runAction(doctype: Doctype, action: string, id?: string[]) {
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
