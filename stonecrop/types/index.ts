import { List, Map } from 'immutable'
import { ComponentOptions } from 'vue'
import { Router } from 'vue-router'
import { MachineConfig } from 'xstate'

import { SchemaTypes } from '@agritheory/aform/types'

export type ImmutableRegistry = Readonly<{
	schema: List<SchemaTypes> | (() => List<SchemaTypes> | Promise<List<SchemaTypes>>)
	events: MachineConfig<any, any, any>
	hooks: Map<string, any>
}>

export type MutableRegistry = {
	schema: SchemaTypes[] | (() => SchemaTypes[] | Promise<SchemaTypes[]>)
	events: MachineConfig<any, any, any>
	hooks: Record<string, any>
}

export type Schema = {
	doctype: string
	schema: List<SchemaTypes>
}

export type InstallOptions = {
	components: Record<string, ComponentOptions>
	router: Router
	schemaLoader: (doctype?: string) => Schema | Promise<Schema>
}
