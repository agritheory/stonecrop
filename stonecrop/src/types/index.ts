import type { DataClient, WorkflowMeta } from '@stonecrop/schema'
import type { SchemaTypes } from '@stonecrop/aform'
import { List, Map } from 'immutable'
import type { Component } from 'vue'
import type { Router } from 'vue-router'
import type { AnyStateNodeConfig, UnknownMachineConfig } from 'xstate'

import type Doctype from '../doctype'
import Registry from '../registry'
import { Stonecrop } from '../stonecrop'
import type { RouteContext } from './registry'

/**
 * Immutable Doctype type for Stonecrop instances
 * @public
 */
export type ImmutableDoctype = {
	readonly schema?: List<SchemaTypes> // TODO: allow schema to be a function
	readonly workflow?: UnknownMachineConfig | AnyStateNodeConfig | WorkflowMeta
	readonly actions?: Map<string, string[]>
}

/**
 * Mutable Doctype type for Stonecrop instances
 * @public
 */
export type MutableDoctype = {
	doctype?: string
	schema?: SchemaTypes[] // TODO: allow schema to be a function
	workflow?: UnknownMachineConfig | AnyStateNodeConfig | WorkflowMeta
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
	getMeta?: (routeContext: RouteContext) => Doctype | Promise<Doctype>
	/**
	 * Data client for fetching doctype metadata and records.
	 * Use \@stonecrop/graphql-client's StonecropClient for GraphQL backends,
	 * or implement DataClient for custom data sources.
	 *
	 * Can be set later via `useStonecropRegistry().setClient()` for deferred configuration.
	 *
	 * @example
	 * ```ts
	 * import { StonecropClient } from '@stonecrop/graphql-client'
	 *
	 * const client = new StonecropClient({ endpoint: '/graphql' })
	 * app.use(StonecropPlugin, { client })
	 * ```
	 */
	client?: DataClient
	/** Automatically run initialization callback after app mounting (default: false) */
	autoInitializeRouter?: boolean
	/** Callback function called after plugin is ready and mounted */
	onRouterInitialized?: (registry: Registry, stonecrop: Stonecrop) => void | Promise<void>
}

// Re-export types
export * from './field-triggers'
export * from './registry'
export * from './operation-log'
