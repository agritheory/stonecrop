import { List } from 'immutable'
import { onBeforeMount, Ref, ref } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import Registry from './registry'
import type { ImmutableDoctype, Schema } from 'types/index'

type StonecropReturn = {
	stonecrop: Ref<Stonecrop>
}

// TODO: pinia for state, later
export function useStonecrop(route: RouteLocationNormalizedLoaded, registry: Registry): StonecropReturn {
	const doctypeSlug = route.params.records?.toString().toLowerCase()
	const recordId = route.params.record?.toString().toLowerCase()

	const doctypeSchema = ref<Schema>({ doctype: doctypeSlug, schema: List() })
	const stateMachine = ref<ImmutableDoctype['events']>()
	const doctypeHooks = ref<ImmutableDoctype['hooks']>()
	const doctypeData = ref<unknown>(null)
	const stonecrop = ref<Stonecrop>(null)

	onBeforeMount(async () => {
		if (doctypeSlug === undefined && recordId === undefined) {
			return
		}

		// register doctype in registry
		const doctype = await registry.doctypeLoader(doctypeSlug)
		registry.addDoctype(doctype)

		// get schema
		doctypeSchema.value = { doctype: doctype.doctype, schema: doctype.schema }

		if (doctypeSlug && recordId === undefined) {
			// get list-view data
			const doctypeRecords = await fetch(`/${doctypeSlug}`)
			const data: Record<string, any>[] = await doctypeRecords.json()
			doctypeData.value = data
		} else if (doctypeSlug && recordId) {
			// get record-view data
			const doctypeRecord = await fetch(`/${doctypeSlug}/${recordId}`)
			const data: Record<string, any> = await doctypeRecord.json()
			doctypeData.value = data
		}

		// setup local state for events and hooks
		const doctypeRegistry = registry.registry[doctype.slug]
		stateMachine.value = doctypeRegistry.events
		doctypeHooks.value = doctypeRegistry.hooks

		// trigger the 'LOAD' action on the state machine
		const { initialState } = stateMachine.value
		stateMachine.value.transition(initialState, { type: 'LOAD' })

		// run 'LOAD' hooks after state machine transition
		const hookEvents: string[] = doctypeHooks.value.get('LOAD')
		if (hookEvents.length > 0) {
			hookEvents.forEach(hook => {
				// eslint-disable-next-line @typescript-eslint/no-implied-eval
				const hookFn = new Function(hook)
				hookFn()
			})
		}

		stonecrop.value = new Stonecrop(doctypeSchema.value, stateMachine.value, doctypeHooks.value, doctypeData.value)
	})

	return { stonecrop }
}

export class Stonecrop {
	static _root: Stonecrop
	name = 'Stonecrop'
	schema: Schema
	events: ImmutableDoctype['events']
	hooks: ImmutableDoctype['hooks']
	data: any

	constructor(schema?: Schema, events?: ImmutableDoctype['events'], hooks?: ImmutableDoctype['hooks'], value?: any) {
		if (Stonecrop._root) {
			return Stonecrop._root
		}
		Stonecrop._root = this
		this.schema = schema // new Registry(schema)
		this.events = events
		this.hooks = hooks
		this.data = value
	}
}
