import { indexSectionPaths } from '../../content-routes'

const indexPaths = new Set(indexSectionPaths())

// Index pages link to siblings as `./name`. Without a trailing slash on the current URL the
// browser resolves those to `/name` instead of `/section/name`. Canonicalize on navigation.
export default defineNuxtRouteMiddleware(to => {
	if (to.path.endsWith('/') || indexPaths.has(to.path)) {
		return
	}

	const canonical = `${to.path}/`
	if (!indexPaths.has(canonical)) {
		return
	}

	return navigateTo({ path: canonical, query: to.query, hash: to.hash }, { redirectCode: 301 })
})
