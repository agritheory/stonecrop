import type { SchemaTypes } from '@stonecrop/aform'
import { List, Map } from 'immutable'
import type { Component } from 'vue'
import type { Router } from 'vue-router'
import type { AnyStateNodeConfig, UnknownMachineConfig } from 'xstate'

import type DoctypeMeta from '../doctype'
import Registry from '../registry'
import { Stonecrop } from '../stonecrop'
import type { RouteContext } from './registry'

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
	/**
	 * Injectable implementation for fetching a single record.
	 * When provided, replaces the default REST fetch() call in `Stonecrop.getRecord()`.
	 * Receives the DoctypeMeta and record ID; must return the record data (or null).
	 *
	 * @example
	 * ```ts
	 * app.use(StonecropPlugin, {
	 *   fetchRecord: (doctype, id) => client.getRecord(doctype, id),
	 * })
	 * ```
	 */
	fetchRecord?: (doctype: DoctypeMeta, id: string) => Promise<Record<string, unknown> | null>
	/**
	 * Injectable implementation for fetching a list of records.
	 * When provided, replaces the default REST fetch() call in `Stonecrop.getRecords()`.
	 * Receives the DoctypeMeta; must return an array of record objects, each with an `id` field.
	 *
	 * @example
	 * ```ts
	 * app.use(StonecropPlugin, {
	 *   fetchRecords: (doctype) => client.getRecords(doctype),
	 * })
	 * ```
	 */
	fetchRecords?: (doctype: DoctypeMeta) => Promise<Record<string, unknown>[]>
	/** Automatically run initialization callback after app mounting (default: false) */
	autoInitializeRouter?: boolean
	/** Callback function called after plugin is ready and mounted */
	onRouterInitialized?: (registry: Registry, stonecrop: Stonecrop) => void | Promise<void>
}

// Re-export types
export * from './field-triggers'
export * from './registry'
export * from './operation-log'
