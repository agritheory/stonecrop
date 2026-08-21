import type { NuxtPage } from '@nuxt/schema'

import type { ParsedDoctype } from './types'

/**
 * The pages to register for a directory of doctypes, and the doctypes that asked for none.
 *
 * A doctype declares its own URL through `route` or has no page at all. Nothing is derived from the
 * slug, because a slug does not say whether a doctype is meant to be visited: most are not. A child
 * table's rows are edited inside their parent and a link target is reached through the record that
 * points at it, so registering one page per file put those at addresses nothing could link to.
 *
 * It also could not tell an entity from its aggregate. Both are peer doctypes with their own slugs,
 * so `task.json` and `tasks.json` registered `/task` and `/tasks` against the same component with
 * indistinguishable meta, and the shell had no way to know which one listed records. `route` is
 * written out in full — `/task` for the collection, `/task/:id` for the record — so the difference
 * is in the path rather than in a rule the shell has to reproduce.
 *
 * `skipped` is returned rather than logged here so the caller owns its own reporting: a doctype
 * silently missing a page reads exactly like one whose page failed to build.
 *
 * @param doctypes - every doctype parsed from the doctypes directory
 * @param componentPath - absolute path to the page component all doctype routes render
 * @returns pages to register, and the filenames of doctypes that declared no usable route
 * @public
 */
export function declaredRoutePages(
	doctypes: readonly ParsedDoctype[],
	componentPath: string
): { pages: NuxtPage[]; skipped: string[] } {
	const pages: NuxtPage[] = []
	const skipped: string[] = []

	for (const { fileName, data, fields } of doctypes) {
		const route = data.route
		// The leading slash is checked rather than repaired. This reads files the load gate never
		// saw — the module parses JSON straight off disk — and a route silently rewritten here would
		// resolve differently from the same string validated anywhere else.
		if (typeof route !== 'string' || !route.startsWith('/')) {
			skipped.push(fileName)
			continue
		}

		pages.push({
			name: `stonecrop-${fileName}`,
			path: route,
			file: componentPath,
			meta: { schema: fields, doctype: data },
		})
	}

	return { pages, skipped }
}
