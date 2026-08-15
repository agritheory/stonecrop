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
import { doctypeMap, routeToSlugMap } from '~/composables/useDoctypes'

const route = useRoute()
const routeAdapter = useFullstackRouteAdapter()

watchEffect(() => {
	const pathMatch = route.params.pathMatch as string[] | undefined
	if (!pathMatch?.length) return
	if (resolveRouteView(pathMatch, routeToSlugMap) === 'notFound') {
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
