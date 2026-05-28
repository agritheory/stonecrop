import type { SchemaTypes } from '@stonecrop/aform'
import type { DoctypeField, LinkDeclaration, WorkflowMeta } from '@stonecrop/schema'
import { List, Map } from 'immutable'
import type { AnyStateNodeConfig, UnknownMachineConfig } from 'xstate'

/**
 * Immutable Doctype type for Stonecrop instances
 * @public
 */
export type ImmutableDoctype = {
	readonly schema?: List<SchemaTypes>
	readonly workflow?: UnknownMachineConfig | AnyStateNodeConfig | WorkflowMeta
	readonly actions?: Map<string, string[]>
	readonly links?: Record<string, LinkDeclaration>
}

/**
 * Mutable Doctype type for Stonecrop instances
 * @public
 */
export type MutableDoctype = {
	doctype?: string
	schema?: SchemaTypes[]
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
 * Plain object representation of doctype configuration for serialization/API responses.
 * Compatible with the DoctypeMeta type from \@stonecrop/schema.
 * @public
 */
export type DoctypeConfig = {
	/** Display name of the doctype */
	name: string
	/** URL-friendly slug (kebab-case) */
	slug?: string
	/** Field definitions (including link fields with fieldtype: 'Link') */
	fields?: DoctypeField[]
	/** Relationship links to other doctypes */
	links?: Record<string, LinkDeclaration>
	/** Workflow configuration (XState format or simple WorkflowMeta) */
	workflow?: UnknownMachineConfig | WorkflowMeta
	/** Actions and their field triggers */
	actions?: Record<string, string[]>
	/** Ancestor doctype for inheritance */
	inherits?: string
}
