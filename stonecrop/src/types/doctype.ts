import type { DoctypeField, LinkDeclaration, WorkflowMeta } from '@stonecrop/schema'
import { List, Map } from 'immutable'
import type { AnyStateNodeConfig, UnknownMachineConfig } from 'xstate'

/**
 * Immutable Doctype type for Stonecrop instances. App authors should use
 * `Doctype.fromObject()` rather than constructing this shape manually.
 * @public
 */
export type ImmutableDoctype = {
	readonly schema?: List<DoctypeField>
	readonly workflow?: UnknownMachineConfig | AnyStateNodeConfig | WorkflowMeta
	readonly actions?: Map<string, string[]>
}

/**
 * Plain object representation of doctype configuration for serialization/API responses.
 * Extends DoctypeMeta with Stonecrop-specific properties: actions, slug, inherits.
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
