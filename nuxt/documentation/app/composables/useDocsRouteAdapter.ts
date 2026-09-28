import type { RouteAdapter } from '@stonecrop/desktop'

// Documentation routes are not doctype-driven; Desktop only needs a stub adapter so it does not
// reach for the registry's internal router.
export function useDocsRouteAdapter(): RouteAdapter {
	return {
		getCurrentDoctype: () => '',
		getCurrentRecordId: () => '',
		getCurrentView: () => 'doctypes',
		navigate: async () => {},
	}
}
