import type { NavigationTarget, RouteAdapter } from '@stonecrop/desktop'
import { computed, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'nuxt/app'

type DocBuilderRouteAdapterOptions = {
	doctype?: ComputedRef<string | undefined>
}

/**
 * Minimal RouteAdapter for DocBuilder pages hosted inside Desktop.
 * @public
 */
export function useDocBuilderRouteAdapter(options: DocBuilderRouteAdapterOptions = {}): RouteAdapter {
	const route = useRoute()
	const router = useRouter()
	const doctype = options.doctype ?? computed(() => route.params.doctype as string | undefined)

	return {
		getCurrentDoctype: () => doctype.value ?? '',
		getCurrentRecordId: () => '',
		getCurrentView: () => 'doctypes',
		navigate: (target: NavigationTarget) => {
			if (target.view === 'doctypes') {
				void router.push('/')
			} else if (target.view === 'records' && target.doctype) {
				void router.push(`/${target.doctype}`)
			} else if (target.view === 'record' && target.doctype && target.recordId) {
				void router.push(`/${target.doctype}/${target.recordId}`)
			}
		},
	}
}
