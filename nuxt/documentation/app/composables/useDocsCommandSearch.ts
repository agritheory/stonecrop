import { searchIndex, type SearchEntry } from '~/utils/search-index'

export type DocsCommand = {
	title: string
	description: string
	action: () => void
}

function matchPages(query: string): SearchEntry[] {
	const words = query.toLowerCase().split(/\s+/).filter(Boolean)
	if (!words.length) return searchIndex.slice(0, 12)
	return searchIndex.filter(page => {
		const haystack = `${page.title} ${page.description}`.toLowerCase()
		return words.every(word => haystack.includes(word))
	})
}

export function useDocsCommandSearch() {
	const search = (query: string): DocsCommand[] =>
		matchPages(query).map(page => ({
			title: page.title,
			description: page.description,
			action: () => {
				void navigateTo(page.url)
			},
		}))

	return {
		search,
		placeholder: 'Search documentation...',
	}
}
