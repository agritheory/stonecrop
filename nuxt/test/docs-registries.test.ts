/**
 * The documentation site keeps three registries of its own pages: the content tree on disk, the
 * sidebar in `app/layouts/default.vue`, and the search index in `app/utils/search-index.ts`.
 * Nothing made them agree, and they did not: `/guides/hst-patterns` was in the search index and
 * in `content/`, absent from the sidebar, and therefore absent from the static output too,
 * because prerendering was driven by crawling the links the sidebar emits. A direct hit or a
 * search result landed on a CDN 404 while every local check stayed green.
 *
 * Prerendering now enumerates the collection (see `nuxt.config.ts`), which removes the build
 * from that coupling. This asserts the other two both ways: no page missing from a registry, and
 * no registry entry pointing at a page that does not exist.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, it, expect } from 'vitest'

import { searchIndex } from '../documentation/app/utils/search-index'

const documentationRoot = join(__dirname, '..', 'documentation')
const contentRoot = join(documentationRoot, 'content')
const layoutPath = join(documentationRoot, 'app', 'layouts', 'default.vue')

/** `/guides/` and `/guides` address the same page; compare them in one spelling. */
function normalize(route: string): string {
	return route.length > 1 ? route.replace(/\/+$/, '') : '/'
}

function contentRoutes(directory: string = contentRoot): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
		const fullPath = join(directory, entry.name)
		if (entry.isDirectory()) {
			return contentRoutes(fullPath)
		}
		if (!entry.name.endsWith('.md')) {
			return []
		}
		const slug = relative(contentRoot, fullPath).slice(0, -'.md'.length).split(sep).join('/')
		return [normalize(`/${slug.replace(/(^|\/)index$/, '')}`)]
	})
}

/** Comments are stripped first so a route named only in prose cannot satisfy the scan. */
function sidebarRoutes(): string[] {
	const source = readFileSync(layoutPath, 'utf-8')
		.replaceAll(/\/\*[\s\S]*?\*\//g, '')
		.replaceAll(/^[ \t]*\/\/.*$/gm, '')
	return [...source.matchAll(/\bto:\s*'([^']+)'/g)].map(match => normalize(match[1]))
}

describe('documentation registries', { tags: ['unit'] }, () => {
	const pages = [...new Set(contentRoutes())].toSorted()
	const sidebar = [...new Set(sidebarRoutes())].toSorted()
	const search = [...new Set(searchIndex.map(entry => normalize(entry.url)))].toSorted()

	it('finds pages in all three registries', () => {
		// Any of these coming back empty would make every assertion below vacuously true.
		expect(pages.length).toBeGreaterThan(0)
		expect(sidebar.length).toBeGreaterThan(0)
		expect(search.length).toBeGreaterThan(0)
	})

	it('lists every page in the sidebar', () => {
		expect(
			pages.filter(route => !sidebar.includes(route)),
			'These pages exist in content/ but no sidebar link reaches them.'
		).toEqual([])
	})

	it('lists every page in the search index', () => {
		expect(
			pages.filter(route => !search.includes(route)),
			'These pages exist in content/ but cannot be found through search.'
		).toEqual([])
	})

	it('points every sidebar link at a real page', () => {
		expect(
			sidebar.filter(route => !pages.includes(route)),
			'These sidebar links have no page behind them and render as 404s.'
		).toEqual([])
	})

	it('points every search entry at a real page', () => {
		expect(
			search.filter(route => !pages.includes(route)),
			'These search results have no page behind them and render as 404s.'
		).toEqual([])
	})
})
