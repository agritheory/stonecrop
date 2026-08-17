import type { DoctypeConfig } from '@stonecrop/stonecrop'

/** Which URL shape a doctype answers, as declared by its `view` key. */
export type DoctypeRouteView = NonNullable<DoctypeConfig['view']>

/**
 * The doctypes bound to one URL path, by the role each answers.
 *
 * A path holds up to two roles because the collection and the record are separately addressable
 * (`/sales-order` and `/sales-order/SO-1`) and a doctype may answer either or both. `singleton`
 * is exclusive: it claims the base path *as* the record, so there is no collection above it and
 * no id below it.
 */
export type RouteBinding = {
	/** slug serving the collection at `/{path}` */
	list?: string
	/** slug serving one record at `/{path}/:id` */
	form?: string
	/** slug serving the single record at `/{path}` */
	singleton?: string
}

/**
 * What a URL resolves to: the Desktop view, the doctype backing it, and the record it addresses.
 *
 * Returned whole rather than as three separate lookups because the three answers come from one
 * binding and must agree. Computing them apart is what let an adapter report a list view for a
 * URL the page was concurrently deciding to 404.
 */
export type RouteResolution = {
	view: 'doctypes' | 'records' | 'record' | 'notFound'
	/** Registry slug of the doctype backing this URL; `''` when nothing does. */
	slug: string
	/** Record id addressed by the URL; `''` for collections and singletons. */
	recordId: string
}

/**
 * Resolved routing table for an app's doctypes.
 * @public
 */
export type DoctypeRoutes = {
	/** Resolve URL path segments to a view, a doctype and a record id. */
	resolve: (segments: string[]) => RouteResolution
	/** The URL path segment a doctype is reached at, for building links. */
	pathFor: (slug: string) => string
}

/** Strip the authored leading slash; the table is keyed by bare first segment. */
function toPathKey(route: string): string {
	return route.replace(/^\//, '')
}

/**
 * Build the routing table from every doctype the app knows about.
 *
 * The table is complete rather than a set of overrides consulted before a slug-based fallback:
 * a doctype with no `route` is entered under its slug answering both roles, which *is* the
 * default behavior, so there is no second code path for it to disagree with. A URL with no
 * binding is then unambiguously a 404 instead of a slug guess that fails later and elsewhere.
 *
 * @public
 */
export function buildDoctypeRoutes(
	entries: Iterable<[slug: string, config: Pick<DoctypeConfig, 'route' | 'view'>]>
): DoctypeRoutes {
	const pathBySlug = new Map<string, string>()
	/** One doctype's claim on one (path, role). `declared` marks a `view` key rather than the default. */
	const claims = new Map<string, { slug: string; role: keyof RouteBinding; path: string; declared: boolean }>()

	const claim = (path: string, role: keyof RouteBinding, slug: string, declared: boolean) => {
		const key = `${path}:${role}`
		const existing = claims.get(key)

		if (!existing || (declared && !existing.declared)) {
			// A declared `view` outranks the default claim a bare doctype makes on its own path, so
			// adding a list projection over an existing doctype leaves that doctype alone. The
			// precedence is stated, not positional: it holds whichever order the two are read in.
			claims.set(key, { slug, role, path, declared })
			return
		}

		if (!declared && existing.declared) return

		// Two equally-ranked claims. Last-wins would leave the loser silently unreachable, and
		// which one loses would depend on filesystem glob order — so the same doctypes could route
		// differently between two machines. Refusing is the only outcome that is stable and visible.
		throw new Error(
			`Doctypes '${existing.slug}' and '${slug}' both serve the ${role} view at '/${path}'. ` +
				`A URL role is served by exactly one doctype — give one of them a different 'route', ` +
				`or a 'view' that claims a different role`
		)
	}

	for (const [slug, config] of entries) {
		const path = config.route ? toPathKey(config.route) : slug
		pathBySlug.set(slug, path)

		if (config.view) {
			claim(path, config.view === 'list' ? 'list' : config.view === 'form' ? 'form' : 'singleton', slug, true)
		} else {
			// No declared view: this doctype answers the whole path, collection and record alike.
			claim(path, 'list', slug, false)
			claim(path, 'form', slug, false)
		}
	}

	// Resolved after the fact, not during: a singleton and its path-sharing siblings can be read in
	// either order, and only the finished set of claims knows which are present.
	const table = new Map<string, RouteBinding>()
	for (const { slug, role, path } of claims.values()) {
		const singleton = claims.get(`${path}:singleton`)

		// A singleton is the only record at its path — nothing sits above it or below it. So any
		// neighbour is a contradiction, however it arrived: yielding quietly to the singleton would
		// drop a doctype off the site with nothing said, which is the failure this key exists to
		// stop being possible.
		if (singleton && role !== 'singleton') {
			throw new Error(
				`Doctype '${singleton.slug}' declares view 'singleton' at '/${path}', which '${slug}' also ` +
					`serves as its ${role} view. A singleton is the only record at its path, so it shares ` +
					`that path with nothing — move one of them to a different 'route'`
			)
		}

		table.set(path, { ...(table.get(path) ?? {}), [role]: slug })
	}

	const resolve = (segments: string[]): RouteResolution => {
		const notFound: RouteResolution = { view: 'notFound', slug: '', recordId: '' }

		if (segments.length === 0) {
			return { view: 'doctypes', slug: '', recordId: '' }
		}

		const binding = table.get(segments[0] ?? '')
		if (!binding) return notFound

		if (segments.length === 1) {
			if (binding.singleton) return { view: 'record', slug: binding.singleton, recordId: '' }
			if (binding.list) return { view: 'records', slug: binding.list, recordId: '' }
			// A `form`-only path: some doctype answers `/{path}/:id` but nothing answers the
			// collection above it. The bare path addresses nothing, and saying so beats rendering
			// a record view against an id that was never in the URL.
			return notFound
		}

		if (segments.length === 2 && binding.form) {
			return { view: 'record', slug: binding.form, recordId: segments[1] ?? '' }
		}

		return notFound
	}

	const pathFor = (slug: string): string => pathBySlug.get(slug) ?? slug

	return { resolve, pathFor }
}
