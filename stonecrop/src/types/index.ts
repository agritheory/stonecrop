import type { SchemaTypes } from '@stonecrop/aform'
import { List, Map } from 'immutable'
import type { Component } from 'vue'
import type { Router } from 'vue-router'
import type { AnyStateNodeConfig, UnknownMachineConfig } from 'xstate'

import type DoctypeMeta from '../doctype'
import Registry, { type RouteContext } from '../registry'
import { Stonecrop } from '../stonecrop'

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
	getMeta?: (routeContext: RouteContext) => DoctypeMeta | Promise<DoctypeMeta>
	/** Automatically run initialization callback after app mounting (default: false) */
	autoInitializeRouter?: boolean
	/** Callback function called after plugin is ready and mounted */
	onRouterInitialized?: (registry: Registry, stonecrop: Stonecrop) => void | Promise<void>
}

// Re-export field trigger types
export * from './field-triggers'
