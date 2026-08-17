<template>
	<ClientOnly>
		<Desktop :available-doctypes="availableDoctypes" :route-adapter="routeAdapter" @action="run" />
		<template #fallback>
			<div class="loading">
				<p>Loading...</p>
			</div>
		</template>
	</ClientOnly>
</template>

<script setup lang="ts">
import { Desktop } from '@stonecrop/desktop'

import { useFullstackRouteAdapter } from '~/composables/useFullstackRouteAdapter'
import { doctypeMap, doctypeRoutes } from '~/composables/useDoctypes'

const route = useRoute()
const routeAdapter = useFullstackRouteAdapter()

// The catch-all page matches every URL, so a path no doctype claims arrives here rather than at
// Nuxt's own 404. This is the only place that turns that into an error: the route adapter reads
// the same resolution but cannot report it, since `RouteAdapter` has three views and none of them
// mean "nothing is here".
watchEffect(() => {
	const pathMatch = route.params.pathMatch as string[] | undefined
	if (doctypeRoutes.resolve(pathMatch ?? []).view === 'notFound') {
		showError({ statusCode: 404, statusMessage: 'Not Found' })
	}
})
// Shared action executor (auto-imported from @stonecrop/nuxt): runs an action's
// clientHandler if present, else dispatches to the server handler + writes HST.
// Bound directly to Desktop's @action — no host-specific wrapper needed.
const { run } = useClientAction()

// Reads are not bound here either. The registered StonecropClient is this app's whole data layer:
// Stonecrop fetches through it and keys the result by the doctype's declared identity. A handler
// here would only race that fetch with a second copy of the same rule.
const availableDoctypes = computed(() => Array.from(doctypeMap.keys()))
</script>

<style>
.loading {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 50vh;
	color: #666;
}
</style>
