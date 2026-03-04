import type { NuxtPage } from '@nuxt/schema'

// =============================================================================
// Types
// =============================================================================

/**
 * Parsed doctype data read from a JSON file in the doctypes directory.
 * @public
 */
export interface ParsedDoctype {
	/** Original filename without extension (e.g., 'user-table', 'User') */
	fileName: string
	/** Parsed JSON content of the doctype file */
	data: Record<string, unknown>
	/** Schema fields array (from `schema` or `fields` property) */
	fields: Record<string, unknown>[]
}

/**
 * Route strategy function signature.
 *
 * Receives all parsed doctypes from the `doctypes/` directory and returns
 * an array of NuxtPage definitions to register. The user is responsible
 * for providing the `file` property on each page (pointing to their own
 * page component).
 *
 * @example
 * ```typescript
 * const myStrategy: RouteStrategyFn = (doctypes) => {
 *   return doctypes.flatMap(({ fileName, data, fields }) => [
 *     {
 *       name: `${fileName}-list`,
 *       path: `/${data.slug || fileName.toLowerCase()}`,
 *       file: resolve('./pages/MyListPage.vue'),
 *       meta: { schema: fields, doctype: data, viewMode: 'list' },
 *     },
 *     {
 *       name: `${fileName}-detail`,
 *       path: `/${data.slug || fileName.toLowerCase()}/:id`,
 *       file: resolve('./pages/MyDetailPage.vue'),
 *       meta: { schema: fields, doctype: data, viewMode: 'detail' },
 *     },
 *   ])
 * }
 * ```
 *
 * @public
 */
export type RouteStrategyFn = (doctypes: ParsedDoctype[]) => NuxtPage[]
