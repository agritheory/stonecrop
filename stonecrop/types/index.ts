import { List, Map } from 'immutable'
import { Component } from 'vue'
import { Router } from 'vue-router'
import { MachineConfig, StateMachine } from 'xstate'

import type { SchemaTypes } from '@stonecrop/aform/types'

import DoctypeMeta from '@/doctype'

export type ImmutableDoctype = Readonly<{
	// TODO: allow schema to be a function
	schema?: List<SchemaTypes>
	workflow: StateMachine<unknown, unknown, any>
	actions?: Map<string, string[]>
}>

export type MutableDoctype = {
	// TODO: allow schema to be a function
	schema?: SchemaTypes[]
	workflow: MachineConfig<unknown, unknown, any>
	actions?: Record<string, string[]>
}

export type Schema = {
	doctype: string
	schema: List<SchemaTypes>
}

export type InstallOptions = {
	router?: Router
	components?: Record<string, Component>
	getMeta?: (doctype?: string) => DoctypeMeta | Promise<DoctypeMeta>
}
