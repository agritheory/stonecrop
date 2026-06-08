import { z } from 'zod'

/**
 * JSON-safe view configuration for table fields in doctype authoring.
 *
 * This is the authoring-time subset of `@stonecrop/atable`'s `TableConfig`. It covers
 * the view discriminator and structural options that can be expressed in static JSON.
 * `rowActions` (which requires function-typed handlers) stays in the runtime `TableConfig`.
 *
 * @public
 */
export const TableViewConfig = z
	.object({
		/** The table view type */
		view: z.enum(['list', 'uncounted', 'list-expansion', 'tree', 'gantt', 'tree-gantt']).optional(),

		/** Allow the table to use the full width of its container */
		fullWidth: z.boolean().optional(),

		/** Default expansion state for tree views */
		defaultTreeExpansion: z.enum(['root', 'branch', 'leaf']).optional(),

		/** Enable dependency graph connections for Gantt views */
		dependencyGraph: z.boolean().optional(),
	})
	.meta({
		title: 'TableViewConfig',
		description: 'JSON-safe view configuration for table fields in doctype authoring',
	})

/**
 * Table view configuration type inferred from Zod schema
 * @public
 */
export type TableViewConfig = z.infer<typeof TableViewConfig>
