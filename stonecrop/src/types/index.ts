import type { SchemaTypes } from '@stonecrop/aform'
import { List, Map } from 'immutable'
import type { Component } from 'vue'
import type { Router } from 'vue-router'
import type { MachineConfig, StateMachine } from 'xstate'

import DoctypeMeta from '../doctype'

/**
 * Immutable Doctype type for Stonecrop instances
 * @public
 */
export type ImmutableDoctype = {
	// TODO: allow schema to be a function
	readonly schema?: List<SchemaTypes>
	readonly workflow: StateMachine<unknown, any, any>
	readonly actions?: Map<string, string[]>
}

/**
 * Mutable Doctype type for Stonecrop instances
 * @public
 */
export type MutableDoctype = {
	// TODO: allow schema to be a function
	schema?: SchemaTypes[]
	workflow: MachineConfig<unknown, any, any>
	actions?: Record<string, string[]>
}

/**
 * Schema type for Stonecrop instances
 * @public
 */
export type Schema = {
	doctype: string
	schema: List<SchemaTypes>
}

/**
 * Install options for Stonecrop Vue plugin
 * @public
 */
export type InstallOptions = {
	router?: Router
	components?: Record<string, Component>
	getMeta?: (doctype?: string) => DoctypeMeta | Promise<DoctypeMeta>
}
