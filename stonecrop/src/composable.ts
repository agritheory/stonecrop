import { createGlobalState } from '@vueuse/core'
import type { CreateGlobalStateReturn } from '@vueuse/shared'
import { List } from 'immutable'
import { onBeforeMount, ref } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import Registry from './registry'
import type { ImmutableDoctype, Schema } from 'types/index'

export type StonecropReturn = {
	state: CreateGlobalStateReturn<{ stonecrop: Stonecrop }>
}

// TODO: pinia for state, later
export function useStonecrop(route: RouteLocationNormalizedLoaded, registry: Registry): StonecropReturn {
	const doctypeSlug = route.params.records.toString().toLowerCase()
	const recordId = route.params.record.toString().toLowerCase()

	let doctypeSchema = ref<Schema>({ doctype: doctypeSlug, schema: List() })
	let stateMachine = ref<ImmutableDoctype['events']>()
	let doctypeHooks = ref<ImmutableDoctype['hooks']>()
	let doctypeData = ref<Record<string, any>>({})

	onBeforeMount(async () => {
		// register doctype in registry
		const doctype = await registry.doctypeLoader(doctypeSlug)
		registry.addDoctype(doctype)

		// get schema
		doctypeSchema.value = { doctype: doctype.doctype, schema: doctype.schema }

		// get data
		const doctypeRecord = await fetch(`/${doctypeSlug}/${recordId}`)
		const recordData: Record<string, any> = await doctypeRecord.json()
		doctypeData.value = recordData

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
	})

	const stonecrop = new Stonecrop(doctypeSchema.value, stateMachine.value, doctypeHooks.value, doctypeData.value)
	const state = createGlobalState(() => {
		return { stonecrop }
	})

	return { state }
}

export class Stonecrop {
	static _root: any
	name: string
	schema: Schema
	events: ImmutableDoctype['events']
	hooks: ImmutableDoctype['hooks']
	data: Record<string, any>

	constructor(
		schema?: Schema,
		events?: ImmutableDoctype['events'],
		hooks?: ImmutableDoctype['hooks'],
		value?: Record<string, any>
	) {
		if (Stonecrop._root) {
			return Stonecrop._root
		}
		Stonecrop._root = this
		this.name = 'Stonecrop'
		this.schema = schema // new Registry(schema)
		this.events = events
		this.hooks = hooks
		this.data = value
	}
}
