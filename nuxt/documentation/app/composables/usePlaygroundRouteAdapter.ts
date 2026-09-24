import type { NavigationTarget, RouteAdapter } from '@stonecrop/desktop'

import { navigateTo, useRoute } from 'nuxt/app'

const PLAYGROUND_BASE = '/playground'

function getPathSegments(pathMatch: string | string[] | undefined): string[] {
	if (!pathMatch) return []
	if (Array.isArray(pathMatch)) return pathMatch.filter(Boolean)
	return pathMatch.split('/').filter(Boolean)
}

export function usePlaygroundRouteAdapter(): RouteAdapter {
	const route = useRoute()

	const segments = (): string[] => getPathSegments(route.params.pathMatch as string | string[] | undefined)

	const getCurrentDoctype = (): string => segments()[0] ?? ''

	const getCurrentRecordId = (): string => segments()[1] ?? ''

	const getCurrentView = (): 'doctypes' | 'records' | 'record' => {
		const pathSegments = segments()
		if (!pathSegments.length) return 'doctypes'
		if (pathSegments.length > 1) return 'record'
		return 'records'
	}

	const navigate = async (target: NavigationTarget): Promise<void> => {
		if (target.view === 'doctypes') {
			await navigateTo(PLAYGROUND_BASE)
		} else if (target.view === 'records' && target.doctype) {
			await navigateTo(`${PLAYGROUND_BASE}/${target.doctype}`)
		} else if (target.view === 'record' && target.doctype && target.recordId) {
			await navigateTo(`${PLAYGROUND_BASE}/${target.doctype}/${target.recordId}`)
		}
	}

	return {
		getCurrentDoctype,
		getCurrentRecordId,
		getCurrentView,
		navigate,
	}
}
