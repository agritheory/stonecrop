import type { SchemaTypes } from '@stonecrop/aform'
import { List, Map } from 'immutable'
import type { Component } from 'vue'
import type { Router } from 'vue-router'
import type { AnyStateNodeConfig, UnknownMachineConfig } from 'xstate'

import type DoctypeMeta from '../doctype'

/**
 * Immutable Doctype type for Stonecrop instances
 * @public
 */
export type ImmutableDoctype = {
	readonly schema?: List<SchemaTypes> // TODO: allow schema to be a function
	readonly workflow?: UnknownMachineConfig | AnyStateNodeConfig
	readonly actions?: Map<string, string[]>
}

/**
 * Mutable Doctype type for Stonecrop instances
 * @public
 */
export type MutableDoctype = {
	doctype?: string
	schema?: SchemaTypes[] // TODO: allow schema to be a function
	workflow?: UnknownMachineConfig | AnyStateNodeConfig
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
	getData?: (doctype: string, recordId?: string) => Promise<unknown>
	/**
	 * Whether to automatically setup router guards for doctype/record loading
	 * @defaultValue true
	 */
	autoRouterGuards?: boolean
}
