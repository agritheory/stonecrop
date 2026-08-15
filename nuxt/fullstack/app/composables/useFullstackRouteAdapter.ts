import type { NavigationTarget, RouteAdapter } from '@stonecrop/desktop'

import { navigateTo, useRoute } from 'nuxt/app'

import { routeToSlugMap } from '~/composables/useDoctypes'

function getPathSegments(route: ReturnType<typeof useRoute>): string[] {
	const pathMatch = route.params.pathMatch as string[] | undefined
	if (pathMatch && pathMatch.length > 0) return pathMatch
	return []
}

export function useFullstackRouteAdapter(): RouteAdapter {
	const route = useRoute()

	const segments = (): string[] => getPathSegments(route)

	const getCurrentDoctype = (): string => {
		const pathSegments = segments()
		if (!pathSegments.length) return ''
		try {
			return resolveDoctypeSlugFromSegments(pathSegments, routeToSlugMap)
		} catch {
			return ''
		}
	}

	const getCurrentRecordId = (): string => {
		const id = route.params.id as string | undefined
		if (id) return id

		const pathSegments = segments()
		if (pathSegments.length > 1) return pathSegments[1] ?? ''
		return ''
	}

	const getCurrentView = (): 'doctypes' | 'records' | 'record' => {
		if (route.path === '/' || route.name === 'index') {
			return 'doctypes'
		}

		const pathSegments = segments()
		if (!pathSegments.length) return 'doctypes'

		const view = resolveRouteView(pathSegments, routeToSlugMap)
		if (view === 'notFound') return 'records'
		return view
	}

	const navigate = async (target: NavigationTarget): Promise<void> => {
		if (target.view === 'doctypes') {
			await navigateTo('/')
		} else if (target.view === 'records' && target.doctype) {
			await navigateTo(`/${resolvePublicUrlSegment(target.doctype, routeToSlugMap)}`)
		} else if (target.view === 'record' && target.doctype && target.recordId) {
			await navigateTo(`/${resolvePublicUrlSegment(target.doctype, routeToSlugMap)}/${target.recordId}`)
		}
	}

	return {
		getCurrentDoctype,
		getCurrentRecordId,
		getCurrentView,
		navigate,
	}
}
