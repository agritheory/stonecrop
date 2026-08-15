import type { DoctypeConfig } from '@stonecrop/stonecrop'

/** Desktop view derived from URL segments and explicit route keys. */
export type RouteView = 'records' | 'record' | 'notFound'

/**
 * Build a map from explicit doctype route paths to registry slugs.
 * @public
 */
export function buildRouteToSlugMap(
	entries: Iterable<[slug: string, config: Pick<DoctypeConfig, 'route'>]>
): Map<string, string> {
	const routeToSlugMap = new Map<string, string>()
	for (const [slug, config] of entries) {
		if (config.route) {
			routeToSlugMap.set(config.route, slug)
		}
	}
	return routeToSlugMap
}

/**
 * Resolve a registry slug from a route path, falling back to the path without a leading slash.
 * @public
 */
export function resolveSlugFromRouteMap(routePath: string, routeToSlugMap: Map<string, string>): string {
	return routeToSlugMap.get(routePath) ?? routePath.replace(/^\//, '')
}

/**
 * List doctypes use the `-list` filename suffix (e.g. `sales-order-list.json`).
 * @public
 */
export function isListDoctypeSlug(slug: string): boolean {
	return slug.endsWith('-list')
}

/**
 * Resolve the public URL segment for navigation (e.g. `transactional-doctype-list` → `transactional-doctype`).
 * @public
 */
export function resolvePublicUrlSegment(slug: string, routeToSlugMap: Map<string, string>): string {
	for (const [route, mappedSlug] of routeToSlugMap.entries()) {
		if (mappedSlug === slug) {
			return route.replace(/^\//, '')
		}
	}
	if (isListDoctypeSlug(slug)) {
		return slug.replace(/-list$/, '')
	}
	return slug
}

/**
 * Resolve the doctype registry slug from URL path segments.
 * List views use explicit route keys; record views use slug-based resolution only.
 * @public
 */
export function resolveDoctypeSlugFromSegments(segments: string[], routeToSlugMap: Map<string, string>): string {
	const pathSegment = segments[0] ?? ''
	if (!pathSegment) {
		throw new Error('Cannot resolve doctype from route context')
	}

	if (segments.length > 1) {
		return pathSegment
	}

	return resolveSlugFromRouteMap(`/${pathSegment}`, routeToSlugMap)
}

/**
 * Resolve which Desktop view a URL should render.
 * @public
 */
export function resolveRouteView(segments: string[], routeToSlugMap: Map<string, string>): RouteView {
	const pathSegment = segments[0] ?? ''
	if (!pathSegment) {
		throw new Error('Cannot resolve doctype from route context')
	}

	if (segments.length === 1) {
		const mappedSlug = routeToSlugMap.get(`/${pathSegment}`)
		if (mappedSlug) {
			return isListDoctypeSlug(mappedSlug) ? 'records' : 'record'
		}
		return 'records'
	}

	const mappedSlug = routeToSlugMap.get(`/${pathSegment}`)
	if (mappedSlug && !isListDoctypeSlug(mappedSlug)) {
		return 'notFound'
	}

	return 'record'
}

/**
 * Whether a multi-segment URL should 404 (singleton route-only form).
 * @public
 */
export function shouldRejectRecordRoute(segments: string[], routeToSlugMap: Map<string, string>): boolean {
	return resolveRouteView(segments, routeToSlugMap) === 'notFound'
}
