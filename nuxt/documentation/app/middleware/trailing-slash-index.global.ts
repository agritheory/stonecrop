// Index pages link to siblings as `./name`. Without a trailing slash on the current URL the
// browser resolves those to `/name` instead of `/section/name`. Canonicalize on navigation.
//
// Client only. Prerendering saves `/components` and `/components/` to the same
// `components/index.html`, so a redirect answered there replaces the index page it points at.
// The index paths arrive through runtime config because neither the browser nor the bundled
// server can read the content folder `indexSectionPaths` scans.
export default defineNuxtRouteMiddleware(to => {
	if (import.meta.server || to.path.endsWith('/')) {
		return
	}

	const canonical = `${to.path}/`
	if (!useRuntimeConfig().public.docsIndexPaths.includes(canonical)) {
		return
	}

	return navigateTo({ path: canonical, query: to.query, hash: to.hash }, { replace: true })
})
