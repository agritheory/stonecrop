import type { NavigationTarget, RouteAdapter } from '@stonecrop/desktop'
import { navigateTo, useRoute } from 'nuxt/app'

export function useRouteAdapter(): RouteAdapter {
	const route = useRoute()

	const getCurrentDoctype = (): string => {
		const pathMatch = route.params.pathMatch as string[] | undefined
		if (pathMatch && pathMatch.length > 0) return pathMatch[0] ?? ''
		return ''
	}

	const getCurrentRecordId = (): string => {
		const pathMatch = route.params.pathMatch as string[] | undefined
		if (pathMatch && pathMatch.length > 1) return pathMatch[1] ?? ''
		return ''
	}

	const getCurrentView = (): 'doctypes' | 'records' | 'record' => {
		if (!getCurrentDoctype()) return 'doctypes'
		if (getCurrentRecordId()) return 'record'
		return 'records'
	}

	const navigate = async (target: NavigationTarget): Promise<void> => {
		if (target.view === 'doctypes') {
			await navigateTo('/')
		} else if (target.view === 'records' && target.doctype) {
			await navigateTo(`/${target.doctype}`)
		} else if (target.view === 'record' && target.doctype && target.recordId) {
			await navigateTo(`/${target.doctype}/${target.recordId}`)
		}
	}

	return { getCurrentDoctype, getCurrentRecordId, getCurrentView, navigate }
}
