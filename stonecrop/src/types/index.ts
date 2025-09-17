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

	/**
	 * Function to set global references for router guards
	 * Called automatically after plugin installation
	 */
	setGlobalReferences?: (registry: any, stonecrop: any) => void

	/**
	 * Function to initialize router with preloaded data
	 * Called automatically after plugin installation
	 */
	initializeRouter?: () => Promise<void>

	/**
	 * Whether to automatically call initialization functions after mounting
	 * @defaultValue true
	 */
	autoInitialize?: boolean
}
