import { z } from 'zod'

import { FieldMeta } from './field'

/**
 * Action definition within a workflow
 * @public
 */
export const ActionDefinition = z.object({
	/** Display label for the action */
	label: z.string().min(1),

	/** Handler function name or path */
	handler: z.string().min(1),

	/** Fields that must have values before action can execute */
	requiredFields: z.array(z.string()).optional(),

	/** Workflow states where this action is available */
	allowedStates: z.array(z.string()).optional(),

	/** Whether to show a confirmation dialog */
	confirm: z.boolean().optional(),

	/** Additional arguments for the action */
	args: z.record(z.string(), z.unknown()).optional(),
})

/**
 * Action definition type inferred from Zod schema
 * @public
 */
export type ActionDefinition = z.infer<typeof ActionDefinition>

/**
 * Workflow metadata - states and actions for a doctype
 * @public
 */
export const WorkflowMeta = z.object({
	/** List of workflow states */
	states: z.array(z.string()).optional(),

	/** Actions available in this workflow */
	actions: z.record(z.string(), ActionDefinition).optional(),
})

/**
 * Workflow metadata type inferred from Zod schema
 * @public
 */
export type WorkflowMeta = z.infer<typeof WorkflowMeta>

/**
 * Doctype metadata - complete definition of a doctype
 * @public
 */
export const DoctypeMeta = z.object({
	/** Display name of the doctype */
	name: z.string().min(1),

	/** URL-friendly slug (kebab-case) */
	slug: z.string().min(1).optional(),

	/** Database table name */
	tableName: z.string().optional(),

	/** Field definitions */
	fields: z.array(FieldMeta),

	/** Workflow configuration */
	workflow: WorkflowMeta.optional(),

	/** Parent doctype for inheritance */
	inherits: z.string().optional(),

	/** Doctype to use for list views */
	listDoctype: z.string().optional(),

	/** Parent doctype for child tables */
	parentDoctype: z.string().optional(),
})

/**
 * Doctype metadata type inferred from Zod schema
 * @public
 */
export type DoctypeMeta = z.infer<typeof DoctypeMeta>
