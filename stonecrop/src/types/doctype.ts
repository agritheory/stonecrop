import type { DoctypeField, LinkDeclaration, WorkflowMeta } from '@stonecrop/schema'
import { List } from 'immutable'
import type { AnyStateNodeConfig, UnknownMachineConfig } from 'xstate'

/**
 * Immutable Doctype type for Stonecrop instances. App authors should use
 * `Doctype.fromObject()` rather than constructing this shape manually.
 * @public
 */
export type ImmutableDoctype = {
	readonly schema?: List<DoctypeField>
	readonly workflow?: UnknownMachineConfig | AnyStateNodeConfig | WorkflowMeta
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
	/** URL path this doctype is served at, replacing the `/{slug}` default. One leading-slash segment */
	route?: string
	/** Which URL shape this doctype answers; omitted, it answers both `/{route}` and `/{route}/:id` */
	view?: 'list' | 'form' | 'singleton'
	/** Field definitions (a link field is one carrying `doctype`) */
	fields?: DoctypeField[]
	/** Relationship links to other doctypes */
	links?: Record<string, LinkDeclaration>
	/** Workflow configuration (XState format or simple WorkflowMeta) */
	workflow?: UnknownMachineConfig | WorkflowMeta
	/** Ancestor doctype for inheritance */
	inherits?: string
}
