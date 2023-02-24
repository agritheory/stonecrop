import type { ImmutableDoctype, Schema } from 'types/index'
import Doctype from './doctype'
import Registry from './registry'

export class Stonecrop {
	static _root: Stonecrop
	readonly name = 'Stonecrop'
	readonly registry: Registry

	schema: Schema
	workflow: ImmutableDoctype['workflow']
	actions: ImmutableDoctype['actions']
	data: any

	constructor(
		registry: Registry,
		schema?: Schema,
		workflow?: ImmutableDoctype['workflow'],
		actions?: ImmutableDoctype['actions'],
		data?: any
	) {
		if (Stonecrop._root) {
			return Stonecrop._root
		}
		Stonecrop._root = this
		this.registry = registry
		this.schema = schema // new Registry(schema)
		this.workflow = workflow
		this.actions = actions
		this.data = data
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
		const records = await fetch(`/${doctype.slug}`, filters)
		const data: Record<string, any>[] = await records.json()
		this.data = data
	}

	async getRecord(doctype: Doctype, id: string) {
		const record = await fetch(`/${doctype.slug}/${id}`)
		const data: Record<string, any> = await record.json()
		this.data = data
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
