import { docsHomeNavGroups, docsNavGroupsForPath, docsNavTitleMap } from '~/utils/docs-nav'

export function useDocsNav() {
	const route = useRoute()

	const navGroups = computed(() => docsNavGroupsForPath(route.path))

	const navTitlesByPath = computed(() => docsNavTitleMap())

	// A section index links to its pages as `./name`, which resolves inside the section only from the
	// slash form. Prerendering follows a `/components` crumb too, and its render of the index, every
	// sibling link pointing at `/name`, replaces the one at `/components/`.
	const indexPaths = new Set(useRuntimeConfig().public.docsIndexPaths)

	const breadcrumbs = computed(() => {
		if (route.path === '/' || route.path === '') return []

		const parts = route.path.split('/').filter(Boolean)
		const crumbs: Array<{ title: string; to: string }> = []
		let currentPath = ''

		for (const segment of parts) {
			currentPath += `/${segment}`
			const normalized = currentPath.replace(/\/$/, '') || '/'
			const title =
				navTitlesByPath.value.get(normalized) ??
				segment
					.split('-')
					.map(word => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ')
			crumbs.push({ title, to: indexPaths.has(`${currentPath}/`) ? `${currentPath}/` : currentPath })
		}

		return crumbs
	})

	return {
		navGroups,
		breadcrumbs,
		homeLinks: docsHomeNavGroups[0]?.links ?? [],
	}
}
