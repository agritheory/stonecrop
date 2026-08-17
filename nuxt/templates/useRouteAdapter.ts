import type { NavigationTarget, RouteAdapter } from '@stonecrop/desktop'
import { navigateTo, useRoute } from 'nuxt/app'

import { doctypeRoutes } from '~/composables/useDoctypes'

export function useRouteAdapter(): RouteAdapter {
	const route = useRoute()

	const resolved = () => doctypeRoutes.resolve((route.params.pathMatch as string[] | undefined) ?? [])

	const getCurrentDoctype = (): string => resolved().slug

	const getCurrentRecordId = (): string => resolved().recordId

	// `RouteAdapter` has no fourth view, and it should not: a 404 is the page's business, not the
	// shell's. index.vue reads the same resolution and raises the error. Reporting 'doctypes' here
	// keeps the shell coherent in the meantime — the doctype is '', and a records view of no
	// doctype renders an empty list that looks like an answer.
	const getCurrentView = (): 'doctypes' | 'records' | 'record' => {
		const view = resolved().view
		return view === 'notFound' ? 'doctypes' : view
	}

	const navigate = async (target: NavigationTarget): Promise<void> => {
		if (target.view === 'doctypes') {
			await navigateTo('/')
		} else if (target.view === 'records' && target.doctype) {
			await navigateTo(`/${doctypeRoutes.pathFor(target.doctype)}`)
		} else if (target.view === 'record' && target.doctype && target.recordId) {
			// `target.doctype` is whichever doctype the shell currently has — on a split route that
			// is the list doctype, not the form one. Both are registered at the same path, so the
			// URL is right either way and resolving it back lands on the form doctype.
			await navigateTo(`/${doctypeRoutes.pathFor(target.doctype)}/${target.recordId}`)
		}
	}

	return { getCurrentDoctype, getCurrentRecordId, getCurrentView, navigate }
}
