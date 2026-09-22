import { readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const contentRoot = fileURLToPath(new URL('./content', import.meta.url))

/** Every markdown page path used for prerendering and trailing-slash redirects. */
export function contentRoutes(directory: string = contentRoot): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
		const fullPath = join(directory, entry.name)
		if (entry.isDirectory()) {
			return contentRoutes(fullPath)
		}
		if (!entry.name.endsWith('.md')) {
			return []
		}
		const slug = relative(contentRoot, fullPath).slice(0, -'.md'.length).split(sep).join('/')
		// The trailing slash on a directory index is load-bearing: content pages link to siblings
		// as `./name`, which resolves against the parent when the current URL lacks one, turning
		// every such link into a 404 at prerender time.
		return [`/${slug.replace(/(^|\/)index$/, '$1')}`]
	})
}

/** Section index URLs (`/components/`, `/reference/`, …) that own sibling `./foo` links. */
export function indexSectionPaths(): string[] {
	return contentRoutes().filter(route => route.endsWith('/') && route.length > 1)
}

/** Nitro routeRules redirecting bare index paths to their trailing-slash canonical URL. */
export function indexTrailingSlashRouteRules(): Record<string, { redirect: string }> {
	return Object.fromEntries(indexSectionPaths().map(route => [route.slice(0, -1), { redirect: route }]))
}
