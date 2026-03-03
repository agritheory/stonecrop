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
 * Resolver for page component file paths inside the module's runtime directory.
 * @public
 */
export interface PageResolver {
	/** Resolve a page component path relative to the module's runtime/pages directory */
	(pageName: string): string
}

/**
 * Custom route strategy function signature.
 * Receives all parsed doctypes and a resolver for page component paths,
 * and returns an array of NuxtPage definitions to register.
 * @public
 */
export type RouteStrategyFn = (doctypes: ParsedDoctype[], resolver: PageResolver) => NuxtPage[]

/**
 * Route strategy option for the Stonecrop Nuxt module.
 *
 * - `'single'` — One route per doctype JSON file. The doctype's `slug` (or filename)
 *   controls the route path, including any parameters (e.g., `"user/:id"`).
 *   Uses `StonecropPage.vue` for all doctype routes.
 *
 * - `'resource'` — Two routes per doctype: a list route (`/<slug>`) and a detail
 *   route (`/<slug>/:id`). Uses `StonecropListPage.vue` for list views and
 *   `StonecropDetailPage.vue` for detail views. Doctypes with `parentDoctype`
 *   set are treated as child tables and skipped (they don't get their own routes).
 *
 * - `RouteStrategyFn` — A custom function for full control over route generation.
 *
 * @defaultValue `'single'`
 * @public
 */
export type RouteStrategy = 'single' | 'resource' | RouteStrategyFn

// =============================================================================
// Built-in strategies
// =============================================================================

/**
 * Single-route strategy (status quo).
 * One route per doctype JSON file, pointed at `StonecropPage.vue`.
 * The slug can include route parameters (e.g., `"user/:id"`).
 */
export function singleStrategy(doctypes: ParsedDoctype[], resolver: PageResolver): NuxtPage[] {
	const stonecropPage = resolver('StonecropPage.vue')
	const pages: NuxtPage[] = []

	for (const { fileName, data, fields } of doctypes) {
		const routePath = (data.slug as string) || fileName.toLowerCase()

		pages.push({
			name: `stonecrop-${fileName}`,
			path: `/${routePath}`,
			file: stonecropPage,
			meta: {
				schema: fields,
				doctype: data,
			},
		})
	}

	return pages
}

/**
 * Resource strategy (list + detail pair).
 * For each doctype, generates:
 *   - `GET /<slug>` → StonecropListPage.vue    (viewMode: 'list')
 *   - `GET /<slug>/:id` → StonecropDetailPage.vue (viewMode: 'detail')
 *
 * Doctypes with `parentDoctype` are child tables and are skipped.
 * The `slug` field should be a simple base path (no `:id` — that's appended automatically).
 */
export function resourceStrategy(doctypes: ParsedDoctype[], resolver: PageResolver): NuxtPage[] {
	const listPage = resolver('StonecropListPage.vue')
	const detailPage = resolver('StonecropDetailPage.vue')
	const pages: NuxtPage[] = []

	for (const { fileName, data, fields } of doctypes) {
		// Skip child-table doctypes — they don't get standalone routes
		if (data.parentDoctype) {
			continue
		}

		const slug = (data.slug as string) || fileName.toLowerCase()
		// Strip any trailing :id-style params the user may have left from single mode
		const basePath = slug.replace(/\/:.*$/, '')

		pages.push({
			name: `stonecrop-${fileName}-list`,
			path: `/${basePath}`,
			file: listPage,
			meta: {
				schema: fields,
				doctype: data,
				viewMode: 'list',
			},
		})

		pages.push({
			name: `stonecrop-${fileName}-detail`,
			path: `/${basePath}/:id`,
			file: detailPage,
			meta: {
				schema: fields,
				doctype: data,
				viewMode: 'detail',
			},
		})
	}

	return pages
}

/**
 * Resolve a route strategy name or function to a concrete strategy function.
 */
export function resolveStrategy(strategy: RouteStrategy): RouteStrategyFn {
	if (typeof strategy === 'function') {
		return strategy
	}

	switch (strategy) {
		case 'resource':
			return resourceStrategy
		case 'single':
		default:
			return singleStrategy
	}
}
