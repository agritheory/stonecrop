import { List, Map } from 'immutable'
import { ComponentOptions } from 'vue'
import { Router } from 'vue-router'
import { MachineConfig, StateMachine } from 'xstate'

import { SchemaTypes } from '@agritheory/aform/types'

import Doctype from '@/doctype'

export type ImmutableRegistry = Readonly<{
	schema?: List<SchemaTypes> | (() => List<SchemaTypes> | Promise<List<SchemaTypes>>)
	events: StateMachine<unknown, unknown, any>
	hooks?: Map<string, any>
}>

export type MutableRegistry = {
	schema?: SchemaTypes[] | (() => SchemaTypes[] | Promise<SchemaTypes[]>)
	events: MachineConfig<unknown, unknown, any>
	hooks?: Record<string, any>
}

export type Schema = {
	doctype: string
	schema: List<SchemaTypes>
}

export type InstallOptions = {
	components: Record<string, ComponentOptions>
	router: Router
	doctypeLoader: (doctype?: string) => Doctype | Promise<Doctype>
}
