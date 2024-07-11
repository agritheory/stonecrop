import { List, Map } from 'immutable'
import { Component } from 'vue'
import { Router } from 'vue-router'
import { MachineConfig, StateMachine } from 'xstate'

import AForm from '@stonecrop/aform'

import DoctypeMeta from '@/doctype'

export type ImmutableDoctype = Readonly<{
	// TODO: allow schema to be a function
	schema?: List<AForm.SchemaTypes>
	workflow: StateMachine<unknown, unknown, any>
	actions?: Map<string, string[]>
}>

export type MutableDoctype = {
	// TODO: allow schema to be a function
	schema?: AForm.SchemaTypes[]
	workflow: MachineConfig<unknown, unknown, any>
	actions?: Record<string, string[]>
}

export type Schema = {
	doctype: string
	schema: List<AForm.SchemaTypes>
}

export type InstallOptions = {
	router?: Router
	components?: Record<string, Component>
	getMeta?: (doctype?: string) => DoctypeMeta | Promise<DoctypeMeta>
}
