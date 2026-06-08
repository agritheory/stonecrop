import type { NavigationTarget, RouteAdapter } from '@stonecrop/desktop'
import { navigateTo, useRoute } from 'nuxt/app'

export function useCountriesRouteAdapter(): RouteAdapter {
	const route = useRoute()

	const getCurrentDoctype = (): string => (route.params.doctype as string) ?? ''

	const getCurrentRecordId = (): string => (route.params.id as string) ?? ''

	const getCurrentView = (): 'doctypes' | 'records' | 'record' => {
		if (!route.params.doctype) return 'doctypes'
		if (route.params.id) return 'record'
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
